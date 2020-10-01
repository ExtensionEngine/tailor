'use strict';

const Connection = {
  Initialized: 'connection_initialized'
};

const UserActivity = {
  Start: 'user_activity:start',
  End: 'user_activity:end',
  EndSession: 'user_activity:end_session'
};

module.exports = {
  Connection,
  UserActivity
};
