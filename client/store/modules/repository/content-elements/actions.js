import calculatePosition from 'utils/calculatePosition.js';
import { ContentElement as Events } from '@/../common/sse';
import feed from '../feed';
import generateActions from '@/store/helpers/actions';

const {
  add,
  api,
  fetch,
  get,
  remove,
  reset,
  save,
  setEndpoint,
  update
} = generateActions();

const plugSSE = ({ commit }) => {
  feed
    .subscribe(Events.Create, item => commit('save', item))
    .subscribe(Events.Update, item => commit('update', item))
    .subscribe(Events.Delete, item => commit('remove', [item]));
};

const insert = ({ dispatch }, { element, context }) => {
  return dispatch('save', { ...element, position: calculatePosition(context) });
};

const reorder = ({ commit }, { element, context }) => {
  const position = calculatePosition(context);
  commit('reorder', { element, position });
  return api.post(`${element.id}/reorder`, { position: context.newPosition })
    .then(({ data: { data } }) => commit('save', { ...element, ...data }));
};

export {
  add,
  get,
  fetch,
  insert,
  remove,
  reorder,
  reset,
  save,
  setEndpoint,
  plugSSE,
  update
};
