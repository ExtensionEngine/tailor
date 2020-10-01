'use strict';

const Connection = {
  Initialized: 'connection_initialized'
};

const UserActivity = {
  Start: 'user_activity:start',
  End: 'user_activity:end',
  EndSession: 'user_activity:end_session'
};

const Comment = {
  Create: 'comment:create',
  Update: 'comment:update',
  Delete: 'comment:delete'
};

const ContentElement = {
  Create: 'content_element:create',
  Update: 'content_element:update',
  Delete: 'content_element:delete'
};

module.exports = {
  Connection,
  UserActivity,
  ContentElement,
  Comment
};
