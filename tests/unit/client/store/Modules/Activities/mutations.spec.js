import { mockItems } from '../../__mocks__/mockCommentData';
import { reorder } from '@/client/store/modules/activities/mutations';
// const reorder = (state, { activity, position }) => {
//   state.items[activity._cid].position = position;
// };

describe('Test for module/activities/mutations', () => {
  it('should change the position of an state item', () => {
    const state = { items: mockItems() };
    reorder(state, { activity: { _cid: 'ck6i0fsmg00003h5wqtirijkm' }, position: 999 });
    expect(state.items.ck6i0fsmg00003h5wqtirijkm.position).toBe(999);
  });
});
