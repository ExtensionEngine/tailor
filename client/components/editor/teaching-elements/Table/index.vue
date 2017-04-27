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
import EventBus from 'EventBus';
import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';
import { mapActions } from 'vuex-module';

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
    }
  },
  methods: {
    ...mapActions({ saveElement: 'save' }, 'tes'),
    addRow() {
      // TODO(marko): Implement
    },
    addColumn() {
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
    teChannel.on(`${this.element._cid}/addRow`, () => this.addRow());
    teChannel.on(`${this.element._cid}/addColumn`, () => this.addColumn());
    teChannel.on(`${this.element._cid}/removeRow`, () => this.removeRow());
    teChannel.on(`${this.element._cid}/removeColumn`, () => this.removeColumn());
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
