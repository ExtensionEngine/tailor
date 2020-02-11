import { createLocalVue } from '@vue/test-utils';
import { routes } from '@/router';
import VueRouter from 'vue-router';
import Vuex from 'vuex';

export const localVue = () => {
  const tempLocalVue = createLocalVue();
  tempLocalVue.filter('currency', value => {
    return value.toLocaleString() + ' HRK';
  });
  tempLocalVue.use(VueRouter);
  tempLocalVue.use(Vuex);
  return tempLocalVue;
};

export const setRouter = () => new VueRouter({ routes });

export const stringSearcher = (wrapper, arrayStrings) => {
  let allMatched = true;
  arrayStrings.forEach(str => {
    if (!wrapper.text().match(str)) allMatched = false;
  });
  return allMatched;
};
