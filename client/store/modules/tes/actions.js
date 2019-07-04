import { fetch, get, remove, reset, save, setBaseUrl, update } from '../../helpers/actions';
import calculatePosition from 'utils/calculatePosition.js';

const insert = ({ dispatch }, { element, context }) => {
  const position = calculatePosition(context);
  return dispatch('save', { ...element, position });
};

const reorder = ({ state, commit }, { element, context }) => {
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
