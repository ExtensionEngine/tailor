import {
  activity as activityUtils,
  calculatePosition,
  InsertLocation
} from '@tailor/utils';
import { client } from '@/api';
import { Activity as Events } from '@/../common/sse';
import feed from '../feed';
import findIndex from 'lodash/findIndex';
import generateActions from '@/store/helpers/actions';
import { schema } from '@tailor/config';

const { getDescendants, getOutlineChildren } = activityUtils;
const { api, fetch, get, reset, save, setEndpoint, update } = generateActions();
const { ADD_INTO } = InsertLocation;

const plugSSE = ({ commit }) => {
  feed
    .subscribe(Events.Create, item => commit('save', item))
    .subscribe(Events.Update, item => commit('save', item))
    .subscribe(Events.BulkUpdate, items => commit('save', items))
    .subscribe(Events.Delete, item => commit('remove', [item]));
};

const reorder = ({ commit }, { activity, context }) => {
  const position = calculatePosition(context);
  commit('reorder', { activity, position });
  return api.post(`${activity.id}/reorder`, { position: context.newPosition })
    .then(({ data: { data } }) => commit('save', { ...activity, ...data }));
};

const remove = ({ state, commit }, model) => {
  const descendants = getDescendants(state.items, model);
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
  return client.post(url, mapping)
    .then(({ data: { data } }) => {
      commit('fetch', api.processEntries(data));
      return data;
    });
};

const calculateInsertPosition = ({ state }, { activity, anchor, action }) => {
  const items = getOutlineChildren(state.items, activity.parentId, schema);
  const context = { items, action };
  if (action !== ADD_INTO) {
    context.newPosition = anchor ? findIndex(items, { id: anchor.id }) : 1;
  }
  return calculatePosition(context);
};

const calculateCopyPosition = ({ state }, { anchor, action }) => {
  const id = action === ADD_INTO ? anchor.id : anchor.parentId;
  const items = getOutlineChildren(state.items, id, schema);
  if (action === ADD_INTO) return calculatePosition({ items, action });
  const newPosition = findIndex(items, { id: anchor.id });
  const context = { items, newPosition, action };
  return calculatePosition(context);
};

const saveStatus = ({ commit }, { activity, status }) => {
  return api.post(`${activity.id}/status`, status)
    .then(({ data: { data } }) => {
      commit('save', { ...activity, status: data });
    });
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
  update,
  saveStatus
};
