import filter from 'lodash/filter';
import orderBy from 'lodash/orderBy';

export const getActivityComments = state => activityId => {
  const activityComments = filter(state.items, { activityId });
  return orderBy(activityComments, 'createdAt', 'desc');
};
