import calculatePosition from 'utils/calculatePosition';
import generateActions from '../../helpers/actions';
import { getDescendants as getDeepChildren } from 'utils/activity';
import request from '@/api/request';

const { api, fetch, get, reset, save, setEndpoint, update } = generateActions();

const reorder = ({ commit }, { activity, context }) => {
  const position = calculatePosition(context);
  commit('reorder', { activity, position });
  return api.post(`${activity.id}/reorder`, { position: context.newPosition })
    .then(({ data: { data } }) => commit('save', { ...activity, ...data }));
};

const remove = ({ state, commit }, model) => {
  const descendants = getDeepChildren(state.items, model);
  if (!model.id && !model._version) {
    commit('remove', [model]);
    return Promise.resolve(true);
  }
  return api.remove(model)
    .then(() => commit('remove', [model, ...descendants]));
};

const publish = ({ commit }, activity) => {
  return api.get(`${activity.id}/publish`).then(({ data: { data } }) => {
    commit('save', { ...activity, publishedAt: data.publishedAt });
  });
};

const clone = ({ commit }, mapping) => {
  const { srcId, srcCourseId } = mapping;
  const url = `/courses/${srcCourseId}/activities/${srcId}/clone`;
  return request.post(url, mapping)
    .then(({ data: { data } }) => commit('fetch', api.processEntries(data)));
};

export {
  clone,
  get,
  fetch,
  publish,
  remove,
  reorder,
  reset,
  save,
  setEndpoint,
  update
};
