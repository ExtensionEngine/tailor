function updatePosition({ index, prev, next, first, count, sameLevel, reorder }) {
  let position;
  if (!sameLevel || (index === 0 && reorder) || index === -1) {
    position = first ? first.position * 0.5 : 1;
  } else if (index + 1 === count) {
    position = prev.position + 1;
  } else {
    position = (prev.position + next.position) * 0.5;
  }

  return position;
}

export default function reorder({ item, positionData, index }) {
  item.position = updatePosition(positionData);
  this.commit('save', item);
  return this.api.post(`${item.id}/reorder`, { position: index })
    .then(res => {
      let item = res.data.data;
      this.api.setCid(item);
      this.commit('save', item);
    });
}
