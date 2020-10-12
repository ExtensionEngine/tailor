'use strict';

const Activity = {
  Create: 'activity:create',
  Update: 'activity:update',
  Delete: 'activity:delete'
};

const Comment = {
  Create: 'comment:create',
  Update: 'comment:update',
  Delete: 'comment:delete'
};

const Connection = {
  Initialized: 'connection_initialized'
};

const ContentElement = {
  Create: 'content_element:create',
  Update: 'content_element:update',
  Delete: 'content_element:delete'
};

const Task = {
  Create: 'task:create',
  Update: 'task:update',
  Delete: 'task:delete'
};

const UserActivity = {
  Start: 'user_activity:start',
  End: 'user_activity:end',
  EndSession: 'user_activity:end_session'
};

module.exports = {
  Activity,
  Comment,
  Connection,
  ContentElement,
  Task,
  UserActivity
};
