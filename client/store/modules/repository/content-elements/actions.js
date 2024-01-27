import { calculatePosition } from '@tailor-cms/utils';
import { ContentElement as Events } from '@/../common/sse';
import feed from '../feed';
import flatMap from 'lodash/flatMap';
import flatten from 'lodash/flatten';
import generateActions from '@/store/helpers/actions';
import map from 'lodash/map';

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

const fetchWithReferences = async ({ commit }, opts = {}) => {
  const elements = await api.fetch(opts);
  const references = flatMap(elements, it => flatten(Object.values(it.refs)));
  if (!references.length) return commit('fetch', elements);
  const refElements = await api.fetch({ ids: map(references, 'containerId') });
  return commit('fetch', { ...elements, ...refElements });
};

const plugSSE = ({ commit }) => {
  feed
    .subscribe(Events.Create, item => commit('save', item))
    .subscribe(Events.Update, item => commit('update', item))
    .subscribe(Events.Delete, item => commit('remove', [item]));
};

const reorder = ({ commit }, { element, context }) => {
  const position = calculatePosition(context);
  commit('reorder', { element, position });
  return api.post(`${element.id}/reorder`, { position: context.newPosition })
    .then(({ data: { data } }) => commit('save', { ...element, ...data }));
};

export {
  add,
  get,
  fetch,
  fetchWithReferences,
  remove,
  reorder,
  reset,
  save,
  setEndpoint,
  plugSSE,
  update
};
