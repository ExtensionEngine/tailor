'use strict';

module.exports = {
  role: require('./role'),
  avatar: {
    compressionRate: process.env.AVATAR_COMPRESSION_RATE,
    mimetype: process.env.AVATAR_MIMETYPE
  }
};
