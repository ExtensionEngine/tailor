// import { clone, publish, remove, reorder } from '@/store/modules/repository/activities/actions';
import { fakeItems } from '../../../data/fakeCommentData';
import request from '@/api/request';

const mockApiHelper = apiMethod => jest.mock('@/store/helpers/actions', () => () => ({ api: apiMethod }));

jest.mock('utils/calculatePosition', () => jest.fn().mockImplementation(() => 1));

describe('Tests for repository/activities/actions', () => {
  let post;

  beforeEach(() => {
    post = jest.spyOn(request, 'post');
  });
  afterEach(() => jest.resetModules());

  it('should call the commit method with right payload when I call clone method with commit and mapping ', async () => {
    mockApiHelper({ processEntries: () => 1 });
    const { clone } = require('@/store/modules/repository/activities/actions');
    post.mockImplementation(() => Promise.resolve({ data: { data: 12 } }));

    const commit = jest.fn();
    const mapping = {
      srcId: 1,
      srcRepositoryId: 22
    };
    await clone({ commit }, mapping);
    expect(post).toHaveBeenCalledWith('/repositories/22/activities/1/clone', { srcId: 1, srcRepositoryId: 22 });
    expect(commit).toHaveBeenCalledWith('fetch', 1);
  });

  it('should run a commit with payload when I call publish action', async () => {
    mockApiHelper({ get: () => Promise.resolve({ data: { data: { publishedAt: 1 } } }) });
    const { publish } = require('@/store/modules/repository/activities/actions');

    const commit = jest.fn();
    const activity = { activities: 1 };
    await publish({ commit }, activity);

    expect(commit).toHaveBeenCalledWith('save', { publishedAt: 1, activities: 1 });
  });
  it('should remove that model when I call remove action with a model', async () => {
    mockApiHelper({ remove: model => Promise.resolve({ data: { data: model } }) });
    const { remove } = require('@/store/modules/repository/activities/actions');

    const commit = jest.fn();
    const state = { items: fakeItems() };
    const model = { fakeModel: 1 };

    const result = await remove({ commit, state }, model);

    expect(commit).toHaveBeenCalledWith('remove', [{ fakeModel: 1 }]);
    expect(result).toBe(true);

    commit.mockClear();
    const newModel = { id: 63, _version: 1 };
    const newResult = await remove({ commit, state }, newModel);

    expect(commit).toHaveBeenCalledWith('remove', [newModel, {
      _cid: 'ck6i0fsmg00013h5w7hmh3r3a',
      createdAt: '2020-02-05T21:02:07.902Z',
      data: {},
      deletedAt: null,
      detached: false,
      id: 69,
      parentId: 63,
      position: 1,
      publishedAt: null,
      refs: {},
      repositoryId: 1,
      type: 'INTRO',
      uid: '9de9f40f-1a40-46fd-9ac6-3773cfea1e82',
      updatedAt: '2020-02-05T21:02:07.902Z'
    },
    {
      _cid: 'ck6i0fsmg00023h5wqbtdj1e1',
      createdAt: '2020-02-06T13:27:21.611Z',
      data: {
        name: 'prvi'
      },
      deletedAt: null,
      detached: false,
      id: 80,
      parentId: 63,
      position: 1,
      publishedAt: null,
      refs: {},
      repositoryId: 1,
      type: 'DEFAULT_SCHEMA/OBJECTIVE',
      uid: '25f656bb-990f-4ec1-978b-c5ff868ad11c',
      updatedAt: '2020-02-06T13:27:21.611Z'
    }
    ]);
    expect(newResult).toBe(undefined);
  });

  it('should run two commits with payload when I call reorder with activity and context', async () => {
    mockApiHelper({ post: () => Promise.resolve({ data: { data: { fake: '' } } }) });
    const { reorder } = require('@/store/modules/repository/activities/actions');

    const commit = jest.fn();
    const context = { items: fakeItems() };
    const activity = { fakeModel: 1 };

    await reorder({ commit }, { context, activity });

    expect(commit).toHaveBeenNthCalledWith(1, 'reorder', { activity: { fakeModel: 1 }, position: 1 });
    expect(commit).toHaveBeenNthCalledWith(2, 'save', { fake: '', fakeModel: 1 });
  });
});
