<template>
  <div v-if="!hasRows" class="well">
    Use the toolbar to add some rows and columns to the table.
  </div>
  <div v-else class="table">
    <div v-for="row in sortedRows" :key="row.id" class="table-row">
      <table-cell
        v-for="cell in sortCells(row.cells)"
        :key="cell.id"
        :cell="cell"
        :rowId="row.id"
        :embeds="embeds"
        @save="saveCell">
      </table-cell>
    </div>
  </div>
</template>

<script>
import TableCell from './TableCell';
import cloneDeep from 'lodash/cloneDeep';
import cuid from 'cuid';
import EventBus from 'EventBus';
import filter from 'lodash/filter';
import find from 'lodash/find';
import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';
import { mapActions, mapMutations } from 'vuex-module';
import omit from 'lodash/omit';
import size from 'lodash/size';

const teChannel = EventBus.channel('te');

const sortMap = items => {
  return map(items, item => [item, item.position])
    .sort(([, a], [, b]) => a - b);
};

export default {
  name: 'te-table',
  props: ['element'],
  computed: {
    rows() {
      return this.element.data.rows;
    },
    sortedRows() {
      return map(sortMap(this.element.data.rows), ([row]) => row);
    },
    embeds() {
      return this.element.data.embeds;
    },
    hasRows() {
      return !isEmpty(this.rows);
    },
    id() {
      return this.element._cid || this.element.id;
    }
  },
  methods: {
    ...mapActions({ saveElement: 'save' }, 'tes'),
    ...mapMutations(['focusElement'], 'editor'),
    sortCells(cells) {
      return map(sortMap(cells), ([cell]) => cell);
    },
    addRow(element, position, cells) {
      const { rows, embeds } = element.data;
      const rowId = cuid();
      rows[rowId] = { id: rowId, position, cells: {} };

      for (let cell in cells) {
        const embedId = cuid();
        const cellId = cuid();

        embeds[embedId] = {
          id: embedId,
          type: 'HTML-TABLE',
          embedded: true,
          data: { rowId, cellId, width: 12 }
        };
        rows[rowId].cells[cellId] = {
          id: cellId,
          position: cells[cell].position,
          body: { [embedId]: true }
        };
      }

      this.saveElement(element);
    },
    addRowBefore(rowId) {
      if (!rowId) return;
      let element = cloneDeep(this.element);
      const rows = element.data.rows;
      const sortedRows = sortMap(rows);
      const currentPosition = rows[rowId].position;
      const previousRows = filter(sortedRows, ([, pos]) => {
        return pos < currentPosition;
      }).reverse();
      let previousRowPosition = 0;
      if (previousRows.length) {
        [, previousRowPosition] = previousRows[0];
      }
      const newRowPosition = (currentPosition + previousRowPosition) / 2;

      this.addRow(element, newRowPosition, rows[rowId].cells);
    },
    addRowAfter(rowId) {
      if (!rowId) return;
      let element = cloneDeep(this.element);
      const rows = element.data.rows;
      const sortedRows = sortMap(rows);
      const currentPosition = rows[rowId].position;
      const followingRows = filter(sortedRows, ([, pos]) => {
        return pos > currentPosition;
      });
      let followingRowPosition = currentPosition + 1;
      if (followingRows.length) {
        [, followingRowPosition] = followingRows[0];
      }
      const newRowPosition = (currentPosition + followingRowPosition) / 2;

      this.addRow(element, newRowPosition, rows[rowId].cells);
    },
    addColumn(element, position) {
      let { rows, embeds } = element.data;

      for (let rowId in rows) {
        const embedId = cuid();
        const cellId = cuid();

        embeds[embedId] = {
          id: embedId,
          type: 'HTML-TABLE',
          embedded: true,
          data: { rowId, cellId, width: 12 }
        };
        rows[rowId].cells[cellId] = {
          id: cellId,
          position,
          body: { [embedId]: true }
        };
      }

      this.saveElement(element);
    },
    addColBefore(rowId, cellId) {
      if (!rowId || !cellId) return;
      let element = cloneDeep(this.element);
      const cells = element.data.rows[rowId].cells;
      const sortedCells = sortMap(cells);
      const currentPosition = cells[cellId].position;
      const previousCells = filter(sortedCells, ([, pos]) => {
        return pos < currentPosition;
      }).reverse();
      let previousCellPosition = 0;
      if (previousCells.length) {
        [, previousCellPosition] = previousCells[0];
      }
      const newCellPosition = (currentPosition + previousCellPosition) / 2;

      this.addColumn(element, newCellPosition);
    },
    addColAfter(rowId, cellId) {
      if (!rowId || !cellId) return;
      let element = cloneDeep(this.element);
      const cells = element.data.rows[rowId].cells;
      const sortedCells = sortMap(cells);
      const currentPosition = cells[cellId].position;
      const followingCells = filter(sortedCells, ([, pos]) => {
        return pos > currentPosition;
      });
      let followingCellPosition = currentPosition + 1;
      if (followingCells.length) {
        [, followingCellPosition] = followingCells[0];
      }
      const newCellPosition = (currentPosition + followingCellPosition) / 2;

      this.addColumn(element, newCellPosition);
    },
    saveCell({ rowId, cell, element }) {
      let embeds = this.embeds;
      let rows = this.rows;

      if (element) {
        embeds = cloneDeep(this.embeds);
        embeds[element.id] = element;
      }

      if (rowId && cell) {
        rows = cloneDeep(this.rows);
        rows[rowId].cells[cell.id] = cell;
      }

      this.$emit('save', { embeds, rows });
    },
    getItemToFocus(items, position) {
      const sortedItems = sortMap(items);
      const previousItems = sortedItems.filter(([, pos]) => pos < position).reverse();
      const followingItems = sortedItems.filter(([, pos]) => pos > position).reverse();
      let itemToFocus;
      if (previousItems.length) {
        [itemToFocus] = previousItems[0];
      }
      if (!itemToFocus) {
        [itemToFocus] = followingItems[size(followingItems) - 1];
      }
      return itemToFocus;
    },
    removeRow(rowId) {
      if (!rowId || size(this.element.data.rows) < 2) return;
      let element = cloneDeep(this.element);
      let { rows, embeds } = element.data;
      const position = rows[rowId].position;
      for (let cellId in rows[rowId].cells) {
        embeds = omit(embeds, Object.keys(rows[rowId].cells[cellId].body));
      }
      delete rows[rowId];

      const rowToFocus = this.getItemToFocus(rows, position);
      if (rowToFocus) {
        const [cellToFocus] = sortMap(rowToFocus.cells)[0];
        this.focusElement(embeds[Object.keys(cellToFocus.body)[0]]);
      }
      this.$emit('save', { embeds, rows });
    },
    removeColumn(rowId, cellId) {
      if (!rowId || !cellId || size(this.element.data.rows[rowId].cells) < 2) return;
      let element = cloneDeep(this.element);
      let { rows, embeds } = element.data;
      const cells = rows[rowId].cells;
      const currentPosition = cells[cellId].position;
      for (let row in rows) {
        const cellToDelete = find(rows[row].cells, cell => {
          return cell.position === currentPosition;
        });
        embeds = omit(embeds, Object.keys(cellToDelete.body));
        delete rows[row].cells[cellToDelete.id];
      }

      const cellToFocus = this.getItemToFocus(cells, currentPosition);
      if (cellToFocus) this.focusElement(embeds[Object.keys(cellToFocus.body)[0]]);
      this.$emit('save', { embeds, rows });
    }
  },
  mounted() {
    teChannel.on('addRowBefore', rowId => this.addRowBefore(rowId));
    teChannel.on('addRowAfter', rowId => this.addRowAfter(rowId));
    teChannel.on('addColBefore', (rowId, cellId) => this.addColBefore(rowId, cellId));
    teChannel.on('addColAfter', (rowId, cellId) => this.addColAfter(rowId, cellId));
    teChannel.on('removeRow', rowId => this.removeRow(rowId));
    teChannel.on('removeColumn', (rowId, cellId) => this.removeColumn(rowId, cellId));
  },
  components: {
    TableCell
  }
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
