'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var axios = require('axios');
var httpStatusCodes = require('http-status-codes');
var buildFullPath = require('axios/lib/core/buildFullPath');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var axios__default = /*#__PURE__*/_interopDefaultLegacy(axios);
var buildFullPath__default = /*#__PURE__*/_interopDefaultLegacy(buildFullPath);

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}

function _objectWithoutProperties(source, excluded) {
  if (source == null) return {};

  var target = _objectWithoutPropertiesLoose(source, excluded);

  var key, i;

  if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);

    for (i = 0; i < sourceSymbolKeys.length; i++) {
      key = sourceSymbolKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
      target[key] = source[key];
    }
  }

  return target;
}

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArrayLimit(arr, i) {
  if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

axios.Axios.prototype.submitForm = function (url, fields, options) {
  var action = buildFullPath__default['default'](this.defaults.baseURL, url);
  return Promise.resolve(submitForm(action, fields, options));
};

var config = {
  baseURL: process.env.API_PATH,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
}; // Instance of axios to be used for all API requests.

var client = axios__default['default'].create(config); // Attach additional instance without interceptors

Object.defineProperty(client, 'base', {
  get: function get() {
    if (!this.base_) this.base_ = axios__default['default'].create(config);
    return this.base_;
  }
});

var isAuthError = function isAuthError(err) {
  var _err$response;

  return [httpStatusCodes.FORBIDDEN, httpStatusCodes.UNAUTHORIZED].includes((_err$response = err.response) === null || _err$response === void 0 ? void 0 : _err$response.status);
};

client.interceptors.response.use(function (res) {
  return res;
}, function (err) {
  if (isAuthError(err)) return window.location.reload();
  throw err;
});

function submitForm(action) {
  var fields = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var options = arguments.length > 2 ? arguments[2] : undefined;
  var form = document.createElement('form');
  Object.assign(form, {
    method: 'POST',
    target: 'blank',
    action: action
  }, options);
  Object.entries(fields).forEach(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        name = _ref2[0],
        attrs = _ref2[1];

    var input = document.createElement('input');
    Object.assign(input, {
      name: name
    }, attrs);
    form.appendChild(input);
  });
  document.body.appendChild(form);
  form.submit();
  form.remove();
}

var urls$7 = {
  root: function root(repositoryId) {
    return "/repositories/".concat(repositoryId, "/activities");
  }
};

function getActivities(repositoryId, params) {
  return client.get(urls$7.root(repositoryId), {
    params: params
  }).then(function (res) {
    return res.data.data;
  });
}

function createPreview(repositoryId, activityId) {
  return client.get("".concat(urls$7.root(repositoryId), "/").concat(activityId, "/preview")).then(function (res) {
    return res.data.location;
  });
}

var activity = {
  createPreview: createPreview,
  getActivities: getActivities
};

var urls$6 = {
  base: '/assets'
};

function getUrl(key) {
  var params = {
    key: key
  };
  return client.get(urls$6.base, {
    params: params
  }).then(function (res) {
    return res.data.url;
  });
}

function upload(data) {
  return client.post(urls$6.base, data).then(function (res) {
    return res.data;
  });
}

var asset = {
  getUrl: getUrl,
  upload: upload
};

var urls$5 = {
  login: '/users/login',
  logout: '/users/logout',
  forgotPassword: '/users/forgot-password',
  resetPassword: '/users/reset-password',
  profile: '/users/me',
  changePassword: '/users/me/change-password'
};

function login(credentials) {
  return client.base.post(urls$5.login, credentials);
}

function logout() {
  return client.get(urls$5.logout);
}

function forgotPassword(email) {
  return client.post(urls$5.forgotPassword, {
    email: email
  });
}

function resetPassword(token, password) {
  return client.post(urls$5.resetPassword, {
    token: token,
    password: password
  });
}

function changePassword(currentPassword, newPassword) {
  return client.post(urls$5.changePassword, {
    currentPassword: currentPassword,
    newPassword: newPassword
  });
}

function getUserInfo() {
  return client.base.get(urls$5.profile);
}

function updateUserInfo(userData) {
  return client.patch(urls$5.profile, userData);
}

var auth = {
  login: login,
  logout: logout,
  forgotPassword: forgotPassword,
  resetPassword: resetPassword,
  getUserInfo: getUserInfo,
  updateUserInfo: updateUserInfo,
  changePassword: changePassword
};

function extractData(res) {
  return res.data.data;
}

var urls$4 = {
  repository: function repository(id) {
    return "/repositories/".concat(id);
  },
  root: function root(repositoryId) {
    return "".concat(urls$4.repository(repositoryId), "/content-elements");
  },
  resource: function resource(repositoryId, id) {
    return "".concat(urls$4.root(repositoryId), "/").concat(id);
  }
};

function fetch$4(_ref) {
  var repositoryId = _ref.repositoryId,
      params = _objectWithoutProperties(_ref, ["repositoryId"]);

  return client.get(urls$4.root(repositoryId), {
    params: params
  }).then(extractData);
}

function patch(_ref2, data) {
  var repositoryId = _ref2.repositoryId,
      id = _ref2.id;
  return client.patch(urls$4.resource(repositoryId, id), data);
}

var contentElement = {
  fetch: fetch$4,
  patch: patch
};

var urls$3 = {
  root: function root(repositoryId) {
    return "/repositories/".concat(repositoryId, "/feed");
  },
  subscribe: function subscribe(repositoryId) {
    return "".concat(urls$3.root(repositoryId), "/subscribe");
  }
};

function fetch$3(repositoryId) {
  return client.get(urls$3.root(repositoryId)).then(extractData);
}

function start(context) {
  return client.post(urls$3.root(context.repositoryId), {
    context: context
  });
}

function end(context) {
  return client.delete(urls$3.root(context.repositoryId), {
    data: {
      context: context
    }
  });
}

var feed = {
  urls: urls$3,
  fetch: fetch$3,
  start: start,
  end: end
};

var urls$2 = {
  root: '/repositories',
  import: function _import() {
    return "".concat(urls$2.root, "/import");
  },
  resource: function resource(id) {
    return "".concat(urls$2.root, "/").concat(id);
  },
  publish: function publish(id) {
    return "".concat(urls$2.resource(id), "/publish");
  },
  exportInit: function exportInit(id) {
    return "".concat(urls$2.resource(id), "/export/setup");
  },
  export: function _export(id, jobId) {
    return "".concat(urls$2.resource(id), "/export/").concat(jobId);
  },
  users: function users(id) {
    var userId = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
    return "".concat(urls$2.resource(id), "/users/").concat(userId);
  },
  tags: function tags(id) {
    var tagId = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
    return "".concat(urls$2.resource(id), "/tags/").concat(tagId);
  }
};

function save(repository) {
  return client.post(urls$2.root, repository).then(extractData);
}

function get$1(repositoryId, params) {
  return client.get(urls$2.resource(repositoryId), {
    params: params
  }).then(extractData);
}

function getRepositories(params) {
  return client.get(urls$2.root, {
    params: params
  }).then(extractData);
}

function getUsers(repositoryId, params) {
  return client.get(urls$2.users(repositoryId), {
    params: params
  }).then(extractData);
}

function upsertUser(repositoryId, data) {
  return client.post(urls$2.users(repositoryId), data).then(function (res) {
    return extractData(res).user;
  });
}

function removeUser(repositoryId, userId) {
  return client.delete(urls$2.users(repositoryId, userId)).then(function (res) {
    return res.data;
  });
}

function publishRepositoryMeta(id) {
  return client.post(urls$2.publish(id)).then(function (res) {
    return res.data;
  });
}

function addTag(_ref) {
  var name = _ref.name,
      repositoryId = _ref.repositoryId;
  return client.post(urls$2.tags(repositoryId), {
    repositoryId: repositoryId,
    name: name
  }).then(extractData);
}

function removeTag(_ref2) {
  var repositoryId = _ref2.repositoryId,
      tagId = _ref2.tagId;
  return client.delete(urls$2.tags(repositoryId, tagId)).then(extractData);
}

function initiateExportJob(repositoryId) {
  return client.get(urls$2.exportInit(repositoryId)).then(extractData);
}

function exportRepository(repositoryId, jobId, fields) {
  return client.submitForm(urls$2.export(repositoryId, jobId), fields);
}

function importRepository(data, options) {
  return client.post(urls$2.import(), data, options);
}

var repository = {
  get: get$1,
  getRepositories: getRepositories,
  save: save,
  getUsers: getUsers,
  upsertUser: upsertUser,
  removeUser: removeUser,
  publishRepositoryMeta: publishRepositoryMeta,
  addTag: addTag,
  removeTag: removeTag,
  initiateExportJob: initiateExportJob,
  exportRepository: exportRepository,
  importRepository: importRepository
};

var urls$1 = {
  root: function root(repositoryId) {
    return "/repositories/".concat(repositoryId, "/revisions");
  },
  timeTravel: function timeTravel(repositoryId) {
    return "/repositories/".concat(repositoryId, "/revisions/time-travel");
  },
  resource: function resource(repositoryId, id) {
    return "".concat(urls$1.root(repositoryId), "/").concat(id);
  }
};

function fetch$2(repositoryId, params) {
  return client.get(urls$1.root(repositoryId), {
    params: params
  }).then(extractData);
}

function getStateAtMoment(repositoryId, params) {
  return client.get(urls$1.timeTravel(repositoryId), {
    params: params
  }).then(extractData);
}

function get(repositoryId, id, params) {
  return client.get(urls$1.resource(repositoryId, id), {
    params: params
  }).then(function (res) {
    return res.data;
  });
}

var revision = {
  fetch: fetch$2,
  getStateAtMoment: getStateAtMoment,
  get: get
};

var urls = {
  root: '/tags'
};

function fetch$1(params) {
  return client.get(urls.root, {
    params: params
  }).then(extractData);
}

var tag = {
  fetch: fetch$1
};

function fetch(params) {
  return client.get('/users', {
    params: params
  }).then(extractData);
}

function upsert(data) {
  return client.post('/users', data).then(extractData);
}

function remove(_ref) {
  var id = _ref.id;
  return client.delete("/users/".concat(id));
}

function reinvite(_ref2) {
  var id = _ref2.id;
  return client.post("/users/".concat(id, "/reinvite"));
}

var user = {
  fetch: fetch,
  upsert: upsert,
  remove: remove,
  reinvite: reinvite
};

exports.activity = activity;
exports.asset = asset;
exports.auth = auth;
exports.client = client;
exports.contentElement = contentElement;
exports.extractData = extractData;
exports.feed = feed;
exports.repository = repository;
exports.revision = revision;
exports.tag = tag;
exports.user = user;
