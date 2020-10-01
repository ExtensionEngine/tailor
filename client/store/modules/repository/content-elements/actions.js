import calculatePosition from 'utils/calculatePosition.js';
import { ContentElement as Events } from '@/../common/sse';
import generateActions from '@/store/helpers/actions';
import SSEClient from '@/SSEClient';
import urlJoin from 'url-join';

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
const baseUrl = process.env.API_PATH;
const feed = new SSEClient();

const subscribe = ({ rootState, commit }) => {
  const { repositoryId } = rootState.route.params;
  const token = rootState.auth.token;
  const params = { repositoryId, token };
  const url = urlJoin(baseUrl, api.url('/subscribe'));
  feed
    .connect(url, { params })
    .subscribe(Events.Create, item => commit('add', item))
    .subscribe(Events.Update, item => commit('sseUpdate', item))
    .subscribe(Events.Delete, item => commit('customRemove', item));
};

const insert = ({ dispatch }, { element, context }) => {
  return dispatch('save', { ...element, position: calculatePosition(context) });
};

const sseElementAdd = ({ commit }, model) => commit('sseElementAdd', model);

const reorder = ({ commit }, { element, context }) => {
  const position = calculatePosition(context);
  commit('reorder', { element, position });
  return api.post(`${element.id}/reorder`, { position: context.newPosition })
    .then(({ data: { data } }) => commit('save', { ...element, ...data }));
};

export {
  add,
  sseElementAdd,
  get,
  fetch,
  insert,
  remove,
  reorder,
  reset,
  save,
  setEndpoint,
  subscribe,
  update
};
