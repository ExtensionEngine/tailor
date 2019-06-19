import calculatePosition from 'utils/calculatePosition.js';
import generateActions from '../../helpers/actions';

const { api, get, fetch, reset, save, remove, update, setBaseUrl } = generateActions('/tes');

const insert = ({ element, context }) => {
  const position = calculatePosition(context);
  return context.dispatch('tes/save', { ...element, position });
};

const reorder = ({ element, context, commit }) => {
  commit('reorder', { element, position: calculatePosition(context) });
  const data = { position: context.newPosition };
  return api.post(`${element.id}/reorder`, data)
    .then(res => {
      let element = res.data.data;
      api.setCid(element);
      commit('save', element);
    });
};

export { get, fetch, insert, remove, reorder, reset, save, update, setBaseUrl };
