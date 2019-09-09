import calculatePosition from 'utils/calculatePosition';
import findKey from 'lodash/findKey';
import generateActions from '../../helpers/actions';
import { getDescendants as getDeepChildren } from 'utils/activity';
import request from '@/api/request';

const { api, fetch, get, reset, save, setEndpoint } = generateActions();

const reorder = ({ commit }, { activity, context }) => {
  const position = calculatePosition(context);
  commit('reorder', { activity, position });
  return api.post(`${activity.id}/reorder`, { position: context.newPosition })
    .then(({ data: { data } }) => commit('save', { ...activity, ...data }));
};

const update = ({ commit }, { _cid, data }) => {
  return api.update(_cid, { data })
    .then(updated => commit('save', { data, ...updated }));
};

const updateLinks = ({ state, commit }, { originId, data }) => {
  const _cid = findKey(state.items, { id: originId });
  return api.update(_cid, { data })
    .then(updated => commit('saveLinks', { data, ...updated }));
};

const remove = ({ state, commit }, model) => {
  const descendants = getDeepChildren(state.items, model);
  if (!model.id && !model._version) {
    commit('remove', [model]);
    return Promise.resolve(true);
  }
  const descendantsIds = descendants.map(it => it.id);
  return api.remove(model)
    .then(data => commit('remove', {
      ...data,
      ids: [...descendantsIds, ...data.ids]
    }));
};

const removeLink = ({ state, commit }, { model, removeOrigin = false }) => {
  const descendants = getDeepChildren(state.items, model);
  if (!model.id && !model._version) {
    commit('remove', [model]);
    return Promise.resolve(true);
  }
  const descendantsIds = descendants.map(it => it.id);
  const id = removeOrigin ? model.originId : model.id;
  return api.removeLink(id)
    .then(data => commit('remove', {
      ...data,
      ids: [...descendantsIds, ...data.ids]
    }));
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

function link({ commit }, mapping) {
  const { srcId, srcCourseId } = mapping;
  const url = `/courses/${srcCourseId}/activities/${srcId}/link`;
  return request.post(url, mapping)
    .then(({ data: { data } }) => commit('fetch', api.processEntries(data)));
}

export {
  link,
  clone,
  get,
  fetch,
  publish,
  remove,
  removeLink,
  reorder,
  reset,
  save,
  setEndpoint,
  update,
  updateLinks
};
