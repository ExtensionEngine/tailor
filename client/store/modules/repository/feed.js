import api from '@/api/feed';
import SSEClient from '@/SSEClient';
import urlJoin from 'url-join';

const authScheme = process.env.AUTH_JWT_SCHEME;
const baseUrl = '/api';
const feed = new SSEClient();
let subscribedRepositoryId = null;

function connect(repositoryId, token) {
  if (feed.isConnected) {
    if (repositoryId === subscribedRepositoryId) return feed;
    feed.disconnect();
  }
  subscribedRepositoryId = repositoryId;
  const url = urlJoin(baseUrl, api.urls.subscribe(repositoryId));
  const headers = { Authorization: `${authScheme} ${token}` };
  const searchParams = { token };
  return feed.connect(url, { headers, searchParams });
}

export {
  feed,
  connect
};
