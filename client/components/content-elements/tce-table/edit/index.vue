<template>
  <div class="tce-table">
    <div
      v-for="row in table"
      :key="row.id"
      class="table-row">
      <table-cell
        v-for="cell in cells(row)"
        :key="cell.id"
        @save="saveCell"
        :cell="embeds[cell.id]"
        :table="element"
        :disabled="disabled" />
    </div>
  </div>
</template>

<script>
import { addCell, addEmbed, removeCell, removeEmbed } from './utils';
import cloneDeep from 'lodash/cloneDeep';
import cuid from 'cuid';
import find from 'lodash/find';
import first from 'lodash/first';
import forEach from 'lodash/forEach';
import last from 'lodash/last';
import size from 'lodash/size';
import sortBy from 'lodash/sortBy';
import TableCell from './TableCell';

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

export default {
  name: 'tce-table',
  inject: ['$elementBus'],
  props: {
    element: { type: Object, required: true },
    disabled: { type: Boolean, default: false }
  },
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
    cells(row) {
      return sortBy(row.cells, 'position');
    },
    findRow(cellId, rows = this.rows) {
      return find(rows, row => row.cells[cellId]);
    },
    focusElement(cell) {
      this.$emit('focus', {}, { ...cell, type: 'JODIT_HTML' }, this.element);
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
      this.$emit('save', element.data);
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

      this.$emit('save', element.data);
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
  mounted() {
    const { $elementBus: bus } = this;
    bus.on('addRowBefore', id => this.addRow(id, Direction.BEFORE));
    bus.on('addRowAfter', id => this.addRow(id, Direction.AFTER));
    bus.on('addColumnBefore', id => this.addColumn(id, Direction.BEFORE));
    bus.on('addColumnAfter', id => this.addColumn(id, Direction.AFTER));
    bus.on('removeRow', id => this.removeRow(id));
    bus.on('removeColumn', id => this.removeColumn(id));
  },
  components: { TableCell }
};
</script>

<style lang="scss" scoped>
.tce-table {
  display: table;
  border-collapse: collapse;

  .table-row {
    display: table-row;
  }
}
</style>
