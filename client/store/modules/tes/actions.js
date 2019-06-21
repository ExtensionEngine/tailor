import {
  fetch,
  get,
  remove,
  reset,
  save,
  setBaseUrl,
  update
} from '../../helpers/actions';
import calculatePosition from 'utils/calculatePosition.js';

const insert = ({ element, context }) => {
  const position = calculatePosition(context);
  return context.dispatch('tes/save', { ...element, position });
};

const reorder = ({ state, element, context, commit }) => {
  commit('reorder', { element, position: calculatePosition(context) });
  const data = { position: context.newPosition };
  return state.api.post(`${element.id}/reorder`, data)
    .then(res => {
      let element = res.data.data;
      state.api.setCid(element);
      commit('save', element);
    });
};

export { get, fetch, insert, remove, reorder, reset, save, update, setBaseUrl };
