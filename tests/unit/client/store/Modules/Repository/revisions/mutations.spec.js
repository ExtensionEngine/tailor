import * as mutations from '@/store/modules/repository/revisions/mutations';

describe('Test for store/modules/repository/revisions/mutations', () => {
  it('set the right pagination when setPagination is called with state and changes', () => {
    const state = { $internals: { pagination: { 1: 1, 2: 2, 3: 3 } } };
    const change = { 2: 21, 3: 31, 6: 61 };
    mutations.setPagination(state, change);
    expect(state).toEqual({ $internals: { pagination: { 1: 1, 2: 21, 3: 31, 6: 61 } } });
  });
});
