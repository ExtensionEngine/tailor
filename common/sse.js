'use strict';

const Activity = {
  Create: 'activity:create',
  Update: 'activity:update',
  BulkUpdate: 'activity:bulk_update',
  Delete: 'activity:delete'
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

const UserActivity = {
  Start: 'user_activity:start',
  End: 'user_activity:end',
  EndSession: 'user_activity:end_session'
};

exports.Activity = Activity;
exports.Comment = Comment;
exports.ContentElement = ContentElement;
exports.UserActivity = UserActivity;
