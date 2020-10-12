import { Comment as Events } from '@/../common/sse';
import { feed } from '../feed';
import generateActions from '@/store/helpers/actions';

const { api, get, save, setEndpoint, update } = generateActions();

const plugSSE = ({ commit }) => {
  feed
    .subscribe(Events.Create, item => commit('save', item))
    .subscribe(Events.Update, item => commit('update', item))
    .subscribe(Events.Delete, item => commit('update', item));
};

const fetch = ({ commit }, activityId) => {
  return api.fetch({ activityId })
    .then(items => commit('fetch', items));
};

const remove = ({ commit }, comment) => {
  comment.deletedAt = new Date();
  commit('save', comment);
  return api.remove(comment);
};

export {
  fetch,
  get,
  plugSSE,
  remove,
  save,
  setEndpoint,
  update
};
