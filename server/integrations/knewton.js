const Excel = require('exceljs');
const filter = require('lodash/filter');
const find = require('lodash/find');
const forEach = require('lodash/forEach');
const keyBy = require('lodash/keyBy');
const last = require('lodash/last');
const { OUTLINE_LEVELS } = require('../../config/shared/activities');

function createContentInventory(course, activities, tes) {
  const containers = keyBy(filter(activities, { type: 'PERSPECTIVE' }), 'id');
  const taxonomy = getTaxonomyName(course);
  const taxons = activities.reduce((acc, it) => {
    acc[it.id] = getTaxon(activities, it.id);
    return acc;
  }, {});

  let workbook = createSpreadsheet();
  let inventory = workbook.getWorksheet('Content Inventory');

  forEach(tes, atom => {
    const container = containers[atom.activityId];
    const lo = getLearningObjective(activities, atom);
    if (!lo) return;

    let row = {
      id: `A-${atom.id}`,
      name: `A-${atom.id} ${atom.type}`,
      type: atom.type === 'ASSESSMENT' ? 'Assessment' : 'Instruction',
      objectiveId: lo.id,
      objectiveDesc: lo.name || `Objective ${lo.id}`,
      structure: `${taxonomy}:${taxons[atom.activityId]}|A-${atom.id}`
    };

    if (container) {
      Object.assign(row, {
        containerId: container.id,
        containerName: `Perspective ${container.id}`
      });
    }

    inventory.addRow(row).commit();
  });

  return workbook;
}

function createSpreadsheet() {
  let workbook = new Excel.Workbook();
  workbook.creator = 'Tailor';
  workbook.created = new Date();

  let inventory = workbook.addWorksheet('Content Inventory');
  inventory.columns = [
    { header: 'Atom ID', key: 'id', width: 8 },
    { header: 'Atom Name', key: 'name', width: 30 },
    { header: 'Atom Type', key: 'type', width: 15 },
    { header: 'Learning Objective ID', key: 'objectiveId', width: 30 },
    { header: 'Learning Objective Description', key: 'objectiveDesc', width: 50 },
    { header: 'Structure', key: 'structure', width: 50 },
    { header: 'Container ID', key: 'containerId', width: 50 },
    { header: 'Container Name', key: 'containerName', width: 50 }
  ];

  return workbook;
}

function getLearningObjective(activities, atom) {
  let parent = find(activities, { id: atom.activityId });
  let loLevel = last(OUTLINE_LEVELS);
  if (parent.type === loLevel.type) return parent;
  if (parent.type === 'PERSPECTIVE') return find(activities, { id: parent.parentId });
}

function getTaxonomyName({ id, name }) {
  let acronym = name.split(/\s/).reduce((r, it) => `${r}${it[0].toUpperCase()}`, '');
  return `${acronym}-${id}`;
}

function getTaxon(items, itemId, result = []) {
  let item = find(items, { id: itemId });
  if (!item) return result.length ? result.join('|') : '';
  result.unshift(`${item.type[0]}-${item.id}`);
  return getTaxon(items, item.parentId, result);
}

module.exports = {
  createContentInventory
};
