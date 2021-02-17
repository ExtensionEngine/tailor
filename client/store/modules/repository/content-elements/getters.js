import find from 'lodash/find';

export const elements = state => state.items;

export const getElementByUid = state => uid => find(state.items, { uid });
