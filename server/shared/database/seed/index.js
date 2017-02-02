const Promise = require('bluebird');
// const random = require('lodash/random');
const times = require('lodash/times');

// const assetData = require('./assets.json');
const courseData = require('./courses.json').data;
const userData = require('./users.json').data;
const ACTIVITY_LEVELS = 3;
const ACTIVITIES_PER_LEVEL = 4;
// const ASSET_PER_ACTIVITY = 3;

function initializeModel(Model, records) {
  const result = [];
  records.forEach(it => result.push(Model.create(it)));
  return Promise.all(result);
}

// TODO(marko): Integrate with course and activity fixtures. Remove
// hardcoded course and activity ids.
// function insertAssets(Model) {
//   let assets = [];
//   const { images, video, text } = assetData;
//   times(ASSET_PER_ACTIVITY, position => {
//     position++;
//     let asset = { position, layoutWidth: 12, courseId: 1, activityId: 1 };
//     let data = {};
//     let type = '';
//
//     // Add three different assets per activity.
//     if (position === 1) {
//       type = 'IMAGE';
//       data = { url: images[random(2)] };
//     } else if (position === 2) {
//       type = 'VIDEO';
//       data = { url: video[random(2)] };
//     } else {
//       type = 'TEXT';
//       data = { content: text[random(2)] };
//     };
//
//     asset = Object.assign(asset, { type, data });
//     assets.push(Model.create(asset));
//     // assets.push(Model.create(asset)
//     //   .then(asset => {
//     //     let io = [course.addAsset(asset), activity.addAsset(asset)];
//     //     return Promise.all(io).then(() => asset);
//     //   }));
//   });
//   return Promise.all(assets);
// }

function insertActivities(Model, course, level, parent) {
  let activities = [];
  times(ACTIVITIES_PER_LEVEL, position => {
    position += 1;
    const name = level ? 'Sub' : 'Main';
    const attrs = { name: `${name} activity ${position}`, position };
    activities.push(Model.create(attrs)
      .then(activity => {
        let io = [course.addActivity(activity)];
        if (parent) io.push(parent.addChild(activity));
        return Promise.all(io).then(() => activity);
      })
      .then(item => {
        const nextLevel = level + 1;
        const isLeaf = nextLevel === ACTIVITY_LEVELS;
        return isLeaf ? item : insertActivities(Model, course, nextLevel, item);
      }));
  });
  return Promise.all(activities);
}

function insertAll(db) {
  let users = initializeModel(db.User, userData);
  let courses = initializeModel(db.Course, courseData);

  return Promise.join(users, courses).then(() => {
    let result = [];
    users = users.value();
    courses = courses.value();

    // TODO(marko): Temporary.
    // let assets = insertAssets(db.Asset);
    // result.push(assets);

    courses.forEach(course => {
      result.push(insertActivities(db.Activity, course, 0, null));
      result.push(course.setUsers(users));
    });

    return Promise.all(result);
  });
};

module.exports = db => {
  return db.User.findOne().then(user => {
    return user ? false : insertAll(db);
  });
};
