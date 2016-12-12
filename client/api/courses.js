// TODO: replace with axios
import Promise from 'bluebird';
import { isEmpty, find } from 'lodash';

import dummyData from './dummyCourseData.json';

export default {
  // TODO: fetch from server once backend is implemented
  getCourses() {
    return new Promise((resolve, reject) => {
      if (dummyData.courses) {
        setTimeout(() => { return resolve(dummyData); }, 1500);
      } else {
        return reject(new Error('Fetch failed, please reload the page'));
      }
    });
  },

  // TODO: fetch from server once backend is implemented
  getCourse(courseId) {
    return new Promise((resolve, reject) => {
      const course = find(dummyData.courses, c => c.id === parseInt(courseId));

      if (course) {
        setTimeout(() => {
          return resolve({ course });
        }, 1000);
      } else {
        setTimeout(() => {
          return reject(new Error(`No course with id: ${courseId}`));
        }, 1000);
      }
    });
  },

  // TODO: post to server once backend is implemented
  createCourse(course) {
    return new Promise((resolve, reject) => {
      if (!isEmpty(course)) {
        setTimeout(() => { return resolve({ course }); }, 1500);
      } else {
        setTimeout(() => { return reject(new Error('Please enter title and description')); }, 1000);
      }
    });
  }
};
