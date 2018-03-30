<template>
  <div class="table">
    <div class="table-row"
      v-for="row in table"
      :key="row.id">
      <table-cell
        v-for="cell in cells(row)"
        :key="cell.id"
        :element="embeds[cell.id]"
        :disabled="disabled"
        @save="saveCell">
      </table-cell>
    </div>
  </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep';
import cuid from 'cuid';
import EventBus from 'EventBus';
import find from 'lodash/find';
import first from 'lodash/first';
import forEach from 'lodash/forEach';
import last from 'lodash/last';
import { mapActions, mapMutations } from 'vuex-module';
import size from 'lodash/size';
import sortBy from 'lodash/sortBy';
import TableCell from './TableCell';
import times from 'lodash/times';

const teChannel = EventBus.channel('te');

const MIN_ROWS = 1;
const MIN_COLUMNS = 1;
const Direction = { BEFORE: -1, AFTER: 1 };

const between = (position1, position2) => (position1 + position2) / 2;
const limit = (anchor, direction) => anchor.position + direction;

function sibling(arr, item, direction = Direction.BEFORE) {
  if (direction === Direction.BEFORE) {
    return last(arr.filter(it => it.position < item.position));
  }
  return first(arr.filter(it => it.position > item.position));
}

function calculateInsertPosition(collection, anchor, direction) {
  const sorted = sortBy(collection, 'position');
  const adjacent = sibling(sorted, anchor, direction);
  return between(
    anchor.position,
    (adjacent && adjacent.position) || limit(anchor, direction)
  );
}

function getFocusedItem(collection, current) {
  const sorted = sortBy(collection, 'position');
  return sibling(sorted, current, Direction.BEFORE) ||
         sibling(sorted, current, Direction.AFTER);
}

function addCell(row, cell = {}) {
  if (!row.cells) row.cells = {};
  row.cells[cell.id] = cell;
  return cell;
}

function removeCell(row, predicate = {}) {
  const cell = find(row.cells, predicate);
  if (!cell) return;
  delete row.cells[cell.id];
  return cell;
}

function addEmbed(embeds, cellId, tableId) {
  const embed = {
    id: cellId,
    type: 'TABLE-CELL',
    embedded: true,
    data: { tableId, cellId }
  };
  embeds[cellId] = embed;
  return embed;
}

function removeEmbed(embeds, predicate = {}) {
  const embed = find(embeds, predicate);
  if (!embed) return;
  delete embeds[embed.id];
  return embed;
}

export default {
  name: 'te-table',
  props: ['element', 'disabled'],
  computed: {
    table() {
      return sortBy(this.rows, 'position');
    },
    rows() {
      return this.element.data.rows;
    },
    embeds() {
      return this.element.data.embeds;
    }
  },
  methods: {
    ...mapActions({ saveElement: 'save' }, 'tes'),
    ...mapMutations(['focusElement'], 'editor'),
    cells(row) {
      return sortBy(row.cells, 'position');
    },
    findRow(cellId, rows = this.rows) {
      return find(rows, row => row.cells[cellId]);
    },
    addRow(cellId, direction = Direction.AFTER) {
      const row = this.findRow(cellId);
      if (!row) return;

      const element = cloneDeep(this.element);
      const { tableId, rows, embeds } = element.data;
      const position = calculateInsertPosition(rows, row, direction);
      const newRow = { id: cuid(), position, cells: {} };
      forEach(row.cells, ({ position }) => {
        const cellId = cuid();
        addCell(newRow, { id: cellId, position });
        addEmbed(embeds, cellId, tableId);
      });
      rows[newRow.id] = newRow;
      this.saveElement(element);
    },
    addColumn(cellId, direction = Direction.AFTER) {
      const row = this.findRow(cellId);
      if (!row) return;
      const cell = row.cells[cellId];
      if (!cell) return;

      const element = cloneDeep(this.element);
      const { tableId, rows, embeds } = element.data;

      const position = calculateInsertPosition(row.cells, cell, direction);
      forEach(rows, row => {
        const cellId = cuid();
        addCell(row, { id: cellId, position });
        addEmbed(embeds, cellId, tableId);
      });

      this.saveElement(element);
    },
    removeRow(cellId) {
      const row = this.findRow(cellId);
      if (!row || size(this.rows) <= MIN_ROWS) return;

      const element = cloneDeep(this.element);
      const { rows, embeds } = element.data;
      forEach(row.cells, cell => removeEmbed(embeds, { id: cell.id }));
      delete rows[row.id];

      const focusedRow = getFocusedItem(rows, row);
      if (focusedRow) {
        const cell = first(this.cells(focusedRow));
        if (cell) this.focusElement(embeds[cell.id]);
      }

      this.$emit('save', { embeds, rows });
    },
    removeColumn(cellId) {
      const row = this.findRow(cellId);
      if (!row || size(row.cells) <= MIN_COLUMNS) return;
      const cell = row.cells[cellId];
      if (!cell) return;

      const element = cloneDeep(this.element);
      const { rows, embeds } = element.data;

      forEach(rows, row => {
        const deletedCell = removeCell(row, { position: cell.position });
        if (deletedCell) removeEmbed(embeds, { id: deletedCell.id });
      });

      const focusedCell = getFocusedItem(row.cells, cell);
      if (focusedCell) this.focusElement(embeds[focusedCell.id]);
      this.$emit('save', { embeds, rows });
    },
    saveCell(element) {
      let { embeds } = this.element.data;
      if (element) {
        embeds = cloneDeep(this.embeds);
        embeds[element.id] = element;
      }

      this.$emit('save', { embeds });
    }
  },
  created() {
    if (this.element.data.rows) return;
    const tableId = cuid();
    const embeds = {};
    const rows = {};
    times(2, position => {
      const rowId = cuid();
      const row = { id: rowId, position, cells: {} };
      rows[rowId] = row;

      times(3, position => {
        const cellId = cuid();
        addCell(row, { id: cellId, position });
        addEmbed(embeds, cellId, tableId);
      });
    });

    this.$emit('save', { tableId, embeds, rows });
  },
  mounted() {
    const { tableId } = this.element.data;
    teChannel.on(`${tableId}/addRowBefore`, id => this.addRow(id, Direction.BEFORE));
    teChannel.on(`${tableId}/addRowAfter`, id => this.addRow(id, Direction.AFTER));
    teChannel.on(`${tableId}/addColumnBefore`, id => this.addColumn(id, Direction.BEFORE));
    teChannel.on(`${tableId}/addColumnAfter`, id => this.addColumn(id, Direction.AFTER));
    teChannel.on(`${tableId}/removeRow`, id => this.removeRow(id));
    teChannel.on(`${tableId}/removeColumn`, id => this.removeColumn(id));
  },
  components: { TableCell }
};
</script>

<style lang="scss" scoped>
.table {
  display: table;
  border-collapse: collapse;

  .table-row {
    display: table-row;
  }
}
</style>
