import api from '@/api/feed';
import SSEClient from '@/SSEClient';
import urlJoin from 'url-join';

const baseUrl = process.env.API_PATH;
const feed = new SSEClient();
let subscribedRepositoryId = null;

function connect(repositoryId, token) {
  if (feed.isConnected) {
    if (repositoryId === subscribedRepositoryId) return feed;
    feed.disconnect();
  }
  subscribedRepositoryId = repositoryId;
  const url = urlJoin(baseUrl, api.urls.subscribe(repositoryId));
  feed.connect(url, { params: { token } });
  return feed;
}

export {
  feed,
  connect
};
