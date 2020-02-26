import { sseUpdate } from '@/store/modules/repository/comments/mutations';
import Vue from 'vue';

jest.mock('vue');

describe('Test for modules/repository/comments/mutations', () => {
  beforeEach(() => jest.resetModules());
  it('should set the state of a Vue instance when sseUpdate state is called with a comment present in state', () => {
    const spy = jest.fn();
    Vue.set = spy;

    sseUpdate({}, { id: 68 });
    expect(spy).not.toHaveBeenCalled();
    sseUpdate({ items: [{ id: 68 }] },
      {
        id: 68,
        content: 'someContent',
        createdAt: 'extension',
        updatedAt: 'firm',
        deleatedAt: 'sometime'
      });
    expect(spy).toHaveBeenCalledWith([{ id: 68 }], undefined, { content: 'someContent', createdAt: 'extension', id: 68, updatedAt: 'firm' });
  });
});
