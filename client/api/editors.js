import isEmpty from 'lodash/isEmpty';
import request from './request';
import SSEClient from '../SSEClient';

const baseUrl = (courseId, activityId) => {
  return `courses/${courseId}/activities/${activityId}/editors`;
};

const editorsUrl = (courseId, activityId) => `/${baseUrl(courseId, activityId)}`;

const url = {
  editors: (courseId, activityId) => editorsUrl(courseId, activityId),
  subscribe: (courseId, activityId) => `${editorsUrl(courseId, activityId)}/subscribe`,
  sseSubscribe: (courseId, activityId) => `${baseUrl(courseId, activityId)}/subscribe`,
  unsubscribe: (courseId, activityId) => `${editorsUrl(courseId, activityId)}/unsubscribe`
};

let SSE_CLIENT;

function getEditors(courseId, activityId) {
  return request
    .get(url.editors(courseId, activityId))
    .then(res => res.data.data);
}

function subscribe({ courseId, activityId, editor = {} }, cb) {
  if (SSE_CLIENT) SSE_CLIENT.disconnect();

  SSE_CLIENT = new SSEClient(
    `${request.defaults.baseURL}${url.sseSubscribe(courseId, activityId)}`
  );
  SSE_CLIENT.subscribe('editors_update', cb);

  if (!isEmpty(editor)) {
    return postEditorDataToUrl(editor, url.subscribe(courseId, activityId));
  }
}

function unsubscribe({ courseId, activityId, editor = {} }) {
  if (SSE_CLIENT) SSE_CLIENT.disconnect();

  if (!isEmpty(editor)) {
    return postEditorDataToUrl(editor, url.unsubscribe(courseId, activityId));
  }
}

function postEditorDataToUrl(editor, url) {
  return request.post(url, editor);
}

export default {
  getEditors,
  subscribe,
  unsubscribe
};
