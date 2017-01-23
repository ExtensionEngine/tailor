'use strict';

const AssetModel = require('../asset.model').Model;
const assets = require('./assetData').data;

function getLeafActivities(activities) {
  function getParent(act) {
    return activities.find(a => a._key === act.parentKey);
  }

  function countParents(act) {
    return act.parentKey === null ? 0 : 1 + countParents(getParent(act));
  }

  return activities.filter(act => countParents(act) > 1);
}

function createAssets(model, courseActivities) {
  const promises = getLeafActivities(courseActivities).map(act => {
    return Promise.all(assets.map(asset => {
      return model.create({
        courseKey: act.courseKey,
        activityKey: act._key,
        type: asset.type,
        content: asset.content,
        url: asset.url,
        layoutWidth: asset.layoutWidth,
        position: asset.position
      });
    }));
  });

  return Promise.all(promises);
}

function insertFixtures(db, allActivities) {
  const model = new AssetModel(db);
  const promises = allActivities.map(courseActivities => {
    return createAssets(model, courseActivities);
  });

  return Promise.all(promises);
}

module.exports = {
  insertFixtures
};
