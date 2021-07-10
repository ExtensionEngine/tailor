import find from 'lodash/find';

export function addCell(row, cell) {
  if (!row.cells) row.cells = {};
  row.cells[cell.id] = cell;
  return cell;
}

export function removeCell(row, predicate = {}) {
  const cell = find(row.cells, predicate);
  if (!cell) return;
  delete row.cells[cell.id];
  return cell;
}

export function addEmbed(embeds, cellId, tableId) {
  const embed = {
    id: cellId,
    type: 'TIPTAP_HTML',
    embedded: true,
    data: { tableId, cellId }
  };
  embeds[cellId] = embed;
  return embed;
}

export function removeEmbed(embeds, predicate = {}) {
  const embed = find(embeds, predicate);
  if (!embed) return;
  delete embeds[embed.id];
  return embed;
}
