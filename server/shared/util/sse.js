const cuid = require('cuid');

class SSE {
  constructor(req, res) {
    this.req = req;
    this.res = res;
    this.nextEventId = 0;
    this.id = cuid();
    SSE.initialize(req, res);
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

  static initialize(req, res) {
    req.socket.setNoDelay(true);
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive'
    });
    res.write(':ok\n\n');
  }
};

function middleware(req, res, next) {
  res.sse = new SSE(req, res);
  next();
}

module.exports = SSE;
module.exports.middleware = middleware;
