const { Activity } = require('../shared/database');
const Promise = require('bluebird');

Activity.findAll()
  .then(activities => {
    return Promise.each(activities, it => {
      it.data = it.data || {};
      if (it.name) it.data.name = it.name;
      it.changed('data', true);
      return it.save();
    });
  })
  .then(() => {
    console.log('Activities processed');
    process.exit(0);
  })
  .catch(err => {
    console.error(err.message);
    process.exit(1);
  });
