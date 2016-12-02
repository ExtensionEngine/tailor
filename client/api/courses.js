// TODO: replace with axios
import Promise from 'bluebird';
import { isEmpty } from 'lodash';

import dummyData from './dummyCourseData.json';

export default {
  // TODO: fetch from server once backend is implemented
  get() {
    return new Promise((resolve, reject) => {
      if (dummyData.courses) {
        setTimeout(() => { return resolve(dummyData); }, 2000);
      } else {
        return reject(new Error('Fetch failed, please reload the page'));
      }
    });
  },

  // TODO: post to server once backend is implemented
  create(course) {
    return new Promise((resolve, reject) => {
      if (!isEmpty(course)) {
        setTimeout(() => { return resolve({ course }); }, 1500);
      } else {
        setTimeout(() => { return reject(new Error('Course create failed')); }, 1000);
      }
    });
  }
};
