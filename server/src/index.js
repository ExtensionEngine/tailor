'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const router = require('./router');

const server = express();
server.use(cors());
server.use(bodyParser.json());
server.use('/v1', router);

server.use((req, res, next) => {
  res.status(404).json()
})

server.use((err, req, res, next) => {
  // TODO(matej): setup proper logging.
  console.log(err);
  res.status(500).json({ error: err });
});

const serverPort = process.env.SERVER_PORT;
server.listen(serverPort, err => {
  if (err) {
    console.log(err);
    process.exit(1);
    return;
  }

  console.log(`Server listening on port ${serverPort}`);
});

module.exports = {
  server,
};
