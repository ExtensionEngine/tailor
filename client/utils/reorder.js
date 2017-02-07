export default function ({ index, siblings, sameLevel, reorder }) {
  const next = siblings[index + 1];
  const count = siblings.length;
  let position, first, prev;

  if (reorder) {
    first = siblings[1];
    prev = siblings[index - 1];
  } else {
    first = siblings[0];
    prev = siblings[index];
  }

  if (!sameLevel || (index === 0 && reorder) || index === -1) {
    position = first ? first.position * 0.5 : 1;
  } else if (index + 1 === count) {
    position = prev.position + 1;
  } else {
    position = (prev.position + next.position) * 0.5;
  }

  return position;
};
