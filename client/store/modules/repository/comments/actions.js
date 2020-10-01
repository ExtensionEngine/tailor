import { Comment as Events } from '@/../common/sse';
import generateActions from '@/store/helpers/actions';
import SSEClient from '@/SSEClient';
import urlJoin from 'url-join';

const { api, get, save, setEndpoint, update } = generateActions();
const baseUrl = process.env.API_PATH;
const feed = new SSEClient();

const fetch = ({ commit }, activityId) => {
  return api.fetch({ activityId })
    .then(items => commit('fetch', items));
};

const subscribe = ({ rootState, commit }) => {
  const { repositoryId } = rootState.route.params;
  // const token = localStorage.getItem('JWT_TOKEN');
  const token = rootState.auth.token;
  const params = { repositoryId, token };
  const url = urlJoin(baseUrl, api.url('/subscribe'));
  feed
    .connect(url, { params })
    .subscribe(Events.Create, item => commit('add', item))
    .subscribe(Events.Update, item => commit('sseUpdate', item))
    .subscribe(Events.Delete, item => commit('sseUpdate', item));
};

const unsubscribe = () => feed.disconnect();

const remove = ({ commit }, comment) => {
  comment.deletedAt = new Date();
  commit('save', comment);
  return api.remove(comment);
};

export {
  fetch,
  get,
  remove,
  save,
  subscribe,
  setEndpoint,
  unsubscribe,
  update
};
