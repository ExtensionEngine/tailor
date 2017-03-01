export function describeActivityRevision(rev) {
  const name = rev.state.name;
  switch (rev.operation) {
    case 'CREATE':
      return name === 'perspective'
        ? `created a new perspective`
        : `created a new activity: "${name}"`;
    case 'REMOVE':
      return `removed the activity "${name}"`;
    default:
      return `changed the activity "${name}"`;
  }
}

export function describeAssetRevision(rev, topic) {
  const type = rev.state.type.toLowerCase();
  switch (rev.operation) {
    case 'CREATE':
      return `created a new ${type} asset ${topic ? `in topic "${topic.name}"` : ''}`;
    case 'REMOVE':
      return `removed an asset ${topic ? `from topic "${topic.name}"` : ''}`;
    default: {
      const article = type === 'image' ? 'an' : 'a';
      return `changed ${article} ${type} asset ${topic ? `in topic "${topic.name}"` : ''}`;
    }
  }
}

export function describeCourseRevision(rev) {
  switch (rev.operation) {
    case 'CREATE':
      return `created the course`;
    case 'REMOVE':
      return `removed the course`;
    case 'UPDATE':
      return `changed the course name/description`;
    default:
      return `changed the course`;
  }
}
