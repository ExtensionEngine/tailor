import { getDescendants as getDeepChildren, getOutlineChildren } from 'utils/activity';
import calculatePosition from 'utils/calculatePosition';
import { Activity as Events } from '@/../common/sse';
import { feed } from '../feed';
import findIndex from 'lodash/findIndex';
import generateActions from '@/store/helpers/actions';
import InsertLocation from 'utils/InsertLocation';
import request from '@/api/request';

const { api, fetch, get, reset, save, setEndpoint, update } = generateActions();
const { ADD_INTO } = InsertLocation;

const plugSSE = ({ commit }) => {
  feed
    .subscribe(Events.Create, item => commit('save', item))
    .subscribe(Events.Update, item => commit('save', item))
    .subscribe(Events.Delete, item => commit('remove', [item]));
};

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
  const { srcId, srcRepositoryId } = mapping;
  const url = `/repositories/${srcRepositoryId}/activities/${srcId}/clone`;
  return request.post(url, mapping)
    .then(({ data: { data } }) => {
      commit('fetch', api.processEntries(data));
      return data;
    });
};

const calculateInsertPosition = ({ state }, { activity, anchor, action }) => {
  const items = getOutlineChildren(state.items, activity.parentId);
  const newPosition = anchor ? findIndex(items, { id: anchor.id }) : 1;
  const isFirstChild = !anchor ||
    (activity.parentId !== anchor.parentId) ||
    (newPosition === -1);
  const context = { items, newPosition, isFirstChild, action };
  return calculatePosition(context);
};

const calculateCopyPosition = ({ state }, { anchor, action }) => {
  let items = getOutlineChildren(state.items, anchor.parentId);
  if (action === ADD_INTO) {
    items = getOutlineChildren(state.items, anchor.id);
    return calculatePosition({ items, action });
  }
  const newPosition = findIndex(items, { id: anchor.id });
  const context = { items, newPosition, isFirstChild: newPosition === -1, action };
  return calculatePosition(context);
};

export {
  calculateCopyPosition,
  calculateInsertPosition,
  clone,
  get,
  fetch,
  plugSSE,
  publish,
  remove,
  reorder,
  reset,
  save,
  setEndpoint,
  update
};
