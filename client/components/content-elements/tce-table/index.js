import { addCell, addEmbed } from './edit/utils';
import { createId as cuid } from '@paralleldrive/cuid2';
import Edit from './edit/index.vue';
import times from 'lodash/times';
import Toolbar from './edit/Toolbar.vue';

const initState = () => {
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
  return { tableId, embeds, rows };
};

export default {
  name: 'Table',
  type: 'TABLE',
  version: '1.0',
  initState,
  Edit,
  Toolbar,
  ui: {
    icon: 'mdi-table',
    forceFullWidth: true
  }
};
