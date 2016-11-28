'use strict';
const app = require('./app');

const serverPort = process.env.SERVER_PORT;
app.listen(serverPort, err => {
  if (err) {
    console.log(err);
    process.exit(1);
    return;
  }

  console.log(`Server listening on port ${serverPort}`);
});
