
const mockApiHelper = apiMethod => jest.mock('@/store/helpers/actions', () => () => ({ api: apiMethod }));

describe('Test for repository/comments/actions', () => {
  beforeEach(() => jest.resetModules());

  it('should fetch and commit with a "fetch" message', async () => {
    mockApiHelper({ fetch: () => Promise.resolve({ items: [1, 2, 3] }) });
    const { fetch } = require('@/store/modules/repository/comments/actions');

    const commit = jest.fn();
    await fetch({ commit }, 1);
    expect(commit).toHaveBeenCalledWith('fetch', { items: [1, 2, 3] });
  });
  it('should remove localy and let real data update be pushed from server', async () => {
    const mockedRemove = jest.fn();

    const mockDate = new Date(1466424490000);
    jest.spyOn(global, 'Date').mockImplementation(() => mockDate);

    mockApiHelper({ remove: mockedRemove });

    const { remove } = require('@/store/modules/repository/comments/actions');

    await remove({}, { });
    expect(mockedRemove).toHaveBeenCalledWith({ deletedAt: mockDate });
  });
});
