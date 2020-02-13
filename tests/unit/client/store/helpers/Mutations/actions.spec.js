import { mockCommentModel, mockCommentState } from './__mocks__/mockCommentData';
import generateActions from '@/store/helpers/actions';
const { fetch, get, reset, remove, save, setEndpoint, update } = generateActions();

jest.mock('cuid');

jest.mock('@/store/helpers/resource', () => {
  const mockResolve = () => Promise.resolve({});
  return jest.fn().mockImplementation(() => {
    return {
      getById: mockResolve,
      fetch: mockResolve,
      save: () => Promise.resolve(mockCommentModel()),
      update: () => Promise.resolve(mockCommentModel('newMockCid')),
      remove: () => Promise.resolve(mockCommentModel())
    };
  });
});

// eslint-disable-next-line no-unused-vars
const cuid = require('cuid').mockImplementation(() => 'mockCuid');

describe('helpers/actions tests', () => {
  it('should trigger get action iwth the right mutation', async () => {
    const commit = jest.fn();
    await get({ commit }, {});
    expect(commit).toHaveBeenCalledWith('save', {});
  });
  it('should trigger fetch action with correct mutation name', async () => {
    const commit = jest.fn();
    await fetch({ commit });
    expect(commit).toHaveBeenCalledWith('fetch', {});
  });
  it('should trigger reset action with correct mutation name', async () => {
    const commit = jest.fn();
    await reset({ commit });
    expect(commit).toHaveBeenCalledWith('reset', {});
  });

  it('should trigger save action with correct mutation name and correct payload', async () => {
    jest.spyOn(Date, 'now').mockImplementation(() => 1581440542361);
    const commit = jest.fn();
    const mockedState = mockCommentState();
    let mockedModel = mockCommentModel();

    await save({ state: mockedState, commit }, mockedModel);
    expect(commit).toHaveBeenNthCalledWith(1, 'save', mockedModel);
    expect(commit).toHaveBeenNthCalledWith(2, 'save', mockedModel);

    mockedModel = mockCommentModel();
    delete mockedModel._cid;
    await save({ state: mockedState, commit }, mockedModel);

    expect(commit).toHaveBeenNthCalledWith(3, 'save', { ...mockedModel, _cid: 'mockCuid' });

    // If ther is not cuid present the function will insert a new one
    mockedModel = mockCommentModel();
    mockedState.items = { ck6i4v82h00063h5wvhr7u0uc: { _version: 1581440542361 } };
    await save({ state: mockedState, commit }, mockedModel);
    // mockedModel._synced = true;
    expect(commit).toHaveBeenNthCalledWith(6, 'save', { ...mockedModel, _synced: true });
  });

  it('should update the cid', async () => {
    const commit = jest.fn();
    const mockModel = mockCommentModel();

    await update({ commit }, mockModel);
    expect(commit).toHaveBeenCalledWith('save', { ...mockModel, _cid: 'newMockCid' });
  });

  it('should send the correct commit msg and payload', async () => {
    const commit = jest.fn();
    const mockModel = mockCommentModel();

    await remove({ commit }, mockModel);
    expect(commit).toHaveBeenCalledWith('remove', [mockModel]);
    // below we simulate undefined with false
    const returnValue = await remove({ commit }, { ...mockModel, id: false, _version: false });
    expect(commit).toHaveBeenCalledWith('remove', [mockModel]);
    expect(returnValue).toBe(true);
  });

  it('should set a correct endpoint', async () => {
    const commit = jest.fn();
    const apiUrl = '/go/here';
    const state = { $apiUrl: apiUrl };

    await setEndpoint({ state, commit }, apiUrl);

    expect(commit).not.toHaveBeenCalled();

    await setEndpoint({ state, commit }, 'newUrl');
    expect(commit).toHaveBeenCalledWith('setEndpoint', 'newUrl');
  });
});
