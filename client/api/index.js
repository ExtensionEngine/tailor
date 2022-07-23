import activity from './activity';
import contentElement from './contentElement';
import repository from './repository';

export const exposedApi = {
  fetchRepositories: repository.getRepositories,
  fetchActivities: activity.getActivities,
  fetchContentElements: contentElement.fetch
};

export { default as activity } from './activity';
export { default as asset } from './asset';
export { default as auth } from './auth';
export { default as contentElement } from './contentElement';
export { default as feed } from './feed';
export { default as repository } from './repository';
export { default as revision } from './revision';
export { default as tag } from './tag';
export { default as user } from './user';
export { default as client } from './request';
export { extractData } from './helpers';
