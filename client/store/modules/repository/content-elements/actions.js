import calculatePosition from 'utils/calculatePosition.js';
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
  update
};
