// TODO: replace with axios
import Promise from 'bluebird';
import dummyData from './dummyCourseData.json';

// TODO: fetch from server once backend is implemented
export default {
  get() {
    return new Promise((resolve, reject) => {
      if (dummyData.courses) {
        setTimeout(() => { return resolve(dummyData); }, 2000);
      } else {
        return reject(new Error('Fetch failed, please reload the page'));
      }
    });
  }
};
