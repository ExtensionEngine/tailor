'use strict';

const cuid = require('cuid');

class SSEConnection {
  constructor(req, res) {
    this.id = cuid();
    this.req = req;
    this.res = res;
    this.nextEventId = 0;
    this.initialize(req, res);
  }

  send(event, data) {
    const message = typeof data === 'object' ? JSON.stringify(data) : data;
    this.res.write(`id: ${this.nextEventId++}\n`);
    this.res.write(`event: ${event}\n`);
    this.res.write(`data: ${message}\n\n`);
  }

  close() {
    this.res.end();
  }

  initialize() {
    const { req, res } = this;
    req.socket.setNoDelay(true);
    res.connection.setTimeout(0);
    res.writeHead(200, {
      'Content-Type': 'text/event-stream;charset=UTF-8',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive, Keep-Alive'
    });
    this.send('connection_initialized', { sseId: this.id });
  }
}

function middleware(req, res, next) {
  res.sse = new SSEConnection(req, res);
  next();
}

module.exports = SSEConnection;
module.exports.middleware = middleware;
