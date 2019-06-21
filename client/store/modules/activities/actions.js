import {
  fetch,
  get,
  reset,
  save,
  setBaseUrl,
  update
} from '../../helpers/actions';
import calculatePosition from 'utils/calculatePosition';
import { getDescendants as getDeepChildren } from 'utils/activity';
import request from '../../../api/request';

const reorder = ({ state, commit }, { activity, context }) => {
  commit('reorder', { activity, position: calculatePosition(context) });
  const data = { position: context.newPosition };
  return state.api.post(`${activity.id}/reorder`, data)
    .then(res => {
      let activity = res.data.data;
      state.api.setCid(activity);
      commit('save', activity);
    });
};

const remove = ({ state, commit }, model) => {
  const descendants = getDeepChildren(state.items, model);
  if (!model.id && !model._version) {
    commit('remove', [model]);
    return Promise.resolve(true);
  }
  return state.api.remove(model)
    .then(() => commit('remove', [model, ...descendants]));
};

const clone = ({ commit }, mapping) => {
  const { srcId, srcCourseId } = mapping;
  const url = `/courses/${srcCourseId}/activities/${srcId}/clone`;
  return request.post(url, mapping)
    .then(({ data: { data } }) => commit('fetch', data));
};

const publish = ({ commit }, activity) => {
  const { id, courseId } = activity;
  const url = `/courses/${courseId}/activities/${id}/publish`;
  return request.get(url).then(({ data: { data } }) => {
    commit('save', { ...activity, publishedAt: data.publishedAt });
  });
};

export { clone, get, fetch, publish, remove, reorder, reset, save, update, setBaseUrl };
