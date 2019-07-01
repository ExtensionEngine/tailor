import api from '../../../api/activeUsers';
import SSEClient from '../../../SSEClient';

let SSE_CLIENT;
const subscribeUrl = courseId => `/api/v1/courses/${courseId}/active-users/subscribe`;

export const subscribe = ({ state, commit }, courseId) => {
  if (SSE_CLIENT) return;
  SSE_CLIENT = new SSEClient(subscribeUrl(courseId));
  SSE_CLIENT.subscribe('active_user_add', ({ user, context }) => {
    commit('sseAdd', { user, context });
  });
  SSE_CLIENT.subscribe('active_user_remove', ({ user, context }) => {
    commit('sseRemove', { user, context });
  });
};

export const unsubscribe = () => {
  if (!SSE_CLIENT) return;
  SSE_CLIENT.disconnect();
};

export const fetch = ({ state, commit }, courseId) => {
  return api.fetch(courseId)
    .then(({ activeUsers }) => commit('save', activeUsers));
};

export const add = (_, context) => {
  return api.add(context);
};

export const remove = (_, context) => {
  return api.remove(context);
};
