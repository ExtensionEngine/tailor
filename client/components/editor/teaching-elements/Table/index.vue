<template>
  <div v-if="!hasRows" class="well">
    Use the toolbar to add some rows and columns to the table.
  </div>
  <div v-else class="table">
    <div v-for="row in rows" :key="row.id" class="table-row">
      <table-cell
        v-for="cell in row.cells"
        :key="cell.id"
        :cell="cell"
        :rowId="row.id"
        :embeds="embeds"
        :activeCell="activeCell"
        @save="saveCell"
        @activateCell="activateCell">
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
import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';
import { mapActions } from 'vuex-module';
import size from 'lodash/size';

const teChannel = EventBus.channel('te');

const sortMap = items => {
  return map(items, item => [item, item.position])
    .sort(([, a], [, b]) => a - b);
};

export default {
  name: 'te-table',
  props: ['element'],
  data() {
    const rows = this.element.data.rows;
    const hasRows = !isEmpty(rows);
    let firstCell = null;
    if (hasRows) {
      const [firstRow] = sortMap(rows)[0];
      [firstCell] = sortMap(firstRow.cells)[0];
    }
    return {
      activeCell: firstCell.id
    };
  },
  computed: {
    rows() {
      return this.element.data.rows;
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
    addRow(element, position, numberOfCells) {
      const rows = element.rows;
      const embeds = element.embeds;
      const rowId = cuid();
      rows[rowId] = { id: rowId, position, cells: {} };

      for (let j = 1; j <= numberOfCells; j++) {
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
          position: j,
          body: { [embedId]: true }
        };
      }

      this.saveElement(element);
    },
    addRowBefore(rowId) {
      let element = cloneDeep(this.element);
      const rows = element.data.rows;
      const sortedRows = sortMap(rows);
      const currentPosition = rows[rowId].position;
      const previousRows = filter(sortedRows, ([, pos]) => pos > currentPosition);
      let previousRow;
      let previousRowPosition = 0;
      let numberOfCells = 1;
      if (previousRows.length) {
        [previousRow, previousRowPosition] = previousRows[0];
        numberOfCells = size(previousRow.cells);
      }

      const newRowPosition = (currentPosition + previousRowPosition) / 2;
      this.addRow(element, newRowPosition, numberOfCells);
    },
    addRowAfter() {
      // TODO(marko): Implement
    },
    addColBefore() {
      // TODO(marko): Implement
    },
    addColAfter() {
      // TODO(marko): Implement
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
    removeRow() {
      // TODO(marko): Implement
    },
    removeColumn() {
      // TODO(marko): Implement
    },
    activateCell(cellId) {
      this.activeCell = cellId;
    }
  },
  mounted() {
    teChannel.on(`${this.id}/addRowBefore`, rowId => this.addRowBefore(rowId));
    teChannel.on(`${this.id}/addRowAfter`, () => this.addRowAfter());
    teChannel.on(`${this.id}/addColBefore`, () => this.addColBefore());
    teChannel.on(`${this.id}/addColAfter`, () => this.addColAfter());
    teChannel.on(`${this.id}/removeRow`, () => this.removeRow());
    teChannel.on(`${this.id}/removeColumn`, () => this.removeColumn());
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
