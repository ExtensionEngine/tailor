import { fakeItems } from '../../../data/fakeCommentData';
import { reorder } from '@/store/modules/repository/activities/mutations';

describe('Test for module/activities/mutations', () => {
  it('should change the position of an state item', () => {
    const state = { items: fakeItems() };
    reorder(state, { activity: { _cid: 'ck6i0fsmg00003h5wqtirijkm' }, position: 999 });
    expect(state.items.ck6i0fsmg00003h5wqtirijkm.position).toBe(999);
  });
});
