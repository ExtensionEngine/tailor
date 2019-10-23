'use strict';

const { getObjectives } = require('../../config/shared/activities');
const Excel = require('exceljs');
const filter = require('lodash/filter');
const find = require('lodash/find');
const forEach = require('lodash/forEach');
const keyBy = require('lodash/keyBy');
const map = require('lodash/map');

function createContentInventory(repository, activities, tes) {
  tes = filter(tes, it => it.type !== 'BREAK');
  const containers = keyBy(filter(activities, { type: 'PERSPECTIVE' }), 'id');
  const taxonomy = getTaxonomyName(repository);
  const taxons = activities.reduce((acc, it) => {
    acc[it.id] = getTaxon(activities, it.id);
    return acc;
  }, {});

  const workbook = createSpreadsheet(taxonomy);
  const inventory = workbook.getWorksheet('Content Inventory');
  const objectiveTypes = map(getObjectives(repository.schema), 'type');

  forEach(tes, atom => {
    const container = containers[atom.activityId];
    const lo = getLearningObjective(objectiveTypes, activities, atom);
    if (!lo) return;

    let row = [
      `A-${atom.id}`,
      `A-${atom.id} ${atom.type}`,
      atom.type === 'ASSESSMENT' ? 'Assessment' : 'Instruction',
      lo.id,
      lo.name || `Objective ${lo.id}`,
      `${taxonomy}:${taxons[atom.activityId]}|A-${atom.id}`
    ];

    if (container) row = row.concat([container.id, `Perspective ${container.id}`]);
    inventory.addRow(row).commit();
  });

  return workbook;
}

function createSpreadsheet(taxonomy) {
  const workbook = new Excel.Workbook();
  workbook.creator = 'Tailor';
  workbook.created = new Date();

  // Create 'Content Inventory' sheet
  const inventory = workbook.addWorksheet('Content Inventory');
  inventory.addRow(['Knewton Client ID']);
  inventory.addRow(['Partner Inventory ID']);

  inventory.mergeCells('A3:C3');
  inventory.mergeCells('D3:E3');
  inventory.mergeCells('G3:H3');
  inventory.getCell('A3').value = 'Atoms in your product';
  inventory.getCell('D3').value = 'Atom Learning Objective';
  inventory.getCell('F3').value = 'Atom Taxons';
  inventory.getCell('G3').value = 'Containers in your product';

  inventory.addRow(['Identify every Atom in your product.']);
  inventory.addRow([
    'Atom ID',
    'Atom Name',
    'Atom Type',
    'Learning Objective ID',
    'Learning Objective Description',
    taxonomy,
    'Container ID',
    'Container Name'
  ]);
  inventory.addRow(['THIS', 'ROW', 'INTENTIONALLY', 'LEFT']);
  styleInventorySheet(inventory);

  // Create 'LO-LO Map' sheet
  const loMap = workbook.addWorksheet('LO-LO Map');
  loMap.columns = [
    { header: 'Prereq Learning Objective ID', key: 'prereqId', width: 20 },
    { header: 'Prereq Learning Objective Description', key: 'prereqDesc', width: 100 },
    { header: 'Postreq Learning Objective ID', key: 'postreqId', width: 20 },
    { header: 'Postreq Learning Objective Description', key: 'postreqDesc', width: 100 },
    { header: 'Strength', key: 'strength', width: 20 },
    { header: 'Justification', key: 'justification', width: 20 }
  ];

  return workbook;
}

function getLearningObjective(objectiveTypes, activities, atom) {
  const activity = find(activities, { id: atom.activityId });
  if (!activity) return null;
  if (objectiveTypes.includes(activity.type)) return activity;
  if (!activity.parentId) return null;
  const parent = find(activities, { id: activity.parentId });
  return objectiveTypes.includes(parent.type) ? parent : null;
}

function getTaxonomyName({ id, name }) {
  const reducer = (acc, it) => it ? `${acc}${it[0].toUpperCase()}` : acc;
  const acronym = name.split(/\s/).reduce(reducer, '');
  return `${acronym}-${id}`;
}

function getTaxon(items, itemId, result = []) {
  const item = find(items, { id: itemId });
  if (!item) return result.length ? result.join('|') : '';
  result.unshift(`${item.type[0]}-${item.id}`);
  return getTaxon(items, item.parentId, result);
}

function styleInventorySheet(sheet) {
  sheet.views = [{
    state: 'frozen',
    xSplit: 2,
    ySplit: 6,
    activeCell: 'A7'
  }];

  sheet.columns = [
    { width: 30 },
    { width: 30 },
    { width: 15 },
    { width: 20 },
    { width: 70 },
    { width: 50 },
    { width: 50 },
    { width: 50 }
  ];

  sheet.getRow(4).style.font = {
    name: 'Arial',
    size: 8,
    color: { argb: 'FF333333' }
  };

  sheet.getRow(5).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFECECEC' }
  };

  sheet.getRow(6).style.font = {
    name: 'Arial',
    size: 6,
    color: { argb: 'FF333333' }
  };
}

module.exports = {
  createContentInventory
};
