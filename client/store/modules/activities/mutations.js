import generateMutations from '../../helpers/mutations';

const { fetch, reset, add, save, remove, update, setBaseUrl } = generateMutations();

const reorder = (state, { activity, position }) => {
  activity.position = position;
};

export { fetch, reset, add, save, remove, reorder, update, setBaseUrl };
