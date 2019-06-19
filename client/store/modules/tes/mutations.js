import generateMutations from '../../helpers/mutations';

const { fetch, reset, add, save, remove, update, setBaseUrl } = generateMutations('/tes');

const reorder = ({ element, position }) => {
  element.position = position;
};

export { fetch, reset, add, save, remove, reorder, update, setBaseUrl };
