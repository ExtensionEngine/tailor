import { getActivityComments } from '@/store/modules/repository/comments/getters';

describe('Tests for modules/repository/comments', () => {
  it('should return a function when calling getActivityComments', () => {
    const returnFunction = getActivityComments({ items: [{ activityId: 22, createdAt: 1 }, { activityId: 22, createdAt: 2 }] });
    expect(returnFunction(22)).toEqual([{ activityId: 22, createdAt: 2 }, { activityId: 22, createdAt: 1 }]);
  });
});
