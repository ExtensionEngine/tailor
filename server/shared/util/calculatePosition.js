import findIndex from 'lodash/findIndex';

export default function (id, index, siblings) {
  let newpos;

  if (!index) {
    newpos = siblings[0].position / 2;
  } else if (index + 1 === siblings.length) {
    newpos = siblings[index].position + 1;
  } else {
    const currentIndex = findIndex(siblings, it => it.id === id);
    const direction = currentIndex > index ? -1 : 1;
    const prevPos = siblings[index].position;
    const nextPos = siblings[index + direction].position;
    newpos = (nextPos + prevPos) / 2;
  }

  return newpos;
}
