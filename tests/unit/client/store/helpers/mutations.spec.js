import { add, fetch, remove, reset, save, setEndpoint } from '@/client/store/helpers/mutations.js';
import { mockCommentModel, mockCommentState, mockItems } from '../__mocks__/mockCommentData';

jest.mock('cuid');
// eslint-disable-next-line no-unused-vars
const cuid = require('cuid').mockImplementation(() => 'newCuid');

describe('Helpers - mutation test', () => {
  it('should test fetch mutation sets the vue instance state', () => {
    const state = mockCommentState();
    const items = mockItems();
    fetch(state, items);
    expect(state).toMatchSnapshot();
  });

  it('should reset mutation resets the comments in the vue instance', () => {
    const state = mockCommentState();
    const items = mockItems();
    reset(state, items);
    expect(state).toMatchSnapshot();
    const newState = mockCommentState();
    reset(newState);
    expect(newState.items).toEqual({});
  });

  it('should add a item to the state', () => {
    let state = mockCommentState();
    const model = mockCommentModel();
    add(state, model);
    expect(state).toMatchSnapshot();
    delete model._cid;

    state = mockCommentState();
    add(state, model);
    expect(state).toMatchSnapshot();
  });

  it('should remove a item from the state', () => {
    const state = mockCommentState();
    const model1 = mockCommentModel();
    const model2 = mockCommentModel('hereisAfakeCuild');
    add(state, model1);
    add(state, model2);
    remove(state, [model1]);
    expect(state.items).toHaveProperty('hereisAfakeCuild');
  });

  it('should save item to the state', () => {
    const state = mockCommentState();
    const model = mockCommentModel();
    save(state, model);
    expect(state).toMatchSnapshot();
  });

  it('test setting a end point for the apiUrl the state', () => {
    const state = mockCommentState();
    const url = '/some/ulr';
    setEndpoint(state, url);
    expect(state.$apiUrl).toEqual(url);
  });
});
