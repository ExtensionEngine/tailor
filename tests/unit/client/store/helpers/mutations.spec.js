import { add, fetch, remove, reset, save, setEndpoint } from '@/store/helpers/mutations.js';
import { fakeCommentModel, fakeCommentState, fakeItems } from '../data/fakeCommentData';

jest.mock('cuid');
// eslint-disable-next-line no-unused-vars
const cuid = require('cuid').mockImplementation(() => 'newCuid');

describe('Helpers - mutation test', () => {
  it('should test fetch mutation sets the vue instance state', () => {
    const state = fakeCommentState();
    const items = fakeItems();
    fetch(state, items);
    expect(state).toMatchSnapshot();
  });

  it('should reset mutation resets the comments in the vue instance', () => {
    const state = fakeCommentState();
    const items = fakeItems();
    reset(state, items);
    expect(state).toMatchSnapshot();
    const newState = fakeCommentState();
    reset(newState);
    expect(newState.items).toEqual({});
  });

  it('should add a item to the state', () => {
    let state = fakeCommentState();
    const model = fakeCommentModel();
    add(state, model);
    expect(state).toMatchSnapshot();
    delete model._cid;

    state = fakeCommentState();
    add(state, model);
    expect(state).toMatchSnapshot();
  });

  it('should remove a item from the state', () => {
    const state = fakeCommentState();
    const model1 = fakeCommentModel();
    const model2 = fakeCommentModel('hereisAfakeCuild');
    add(state, model1);
    add(state, model2);
    remove(state, [model1]);
    expect(state.items).toHaveProperty('hereisAfakeCuild');
  });

  it('should save item to the state', () => {
    const state = fakeCommentState();
    const model = fakeCommentModel();
    save(state, model);
    expect(state).toMatchSnapshot();
  });

  it('should set a end point for the apiUrl the state', () => {
    const state = fakeCommentState();
    const url = '/some/ulr';
    setEndpoint(state, url);
    expect(state.$apiUrl).toEqual(url);
  });
});
