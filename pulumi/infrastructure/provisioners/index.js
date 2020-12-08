'use strict';

const Provisioner = require('./provisioner');
const pulumi = require('@pulumi/pulumi');
const scp2 = require('scp2');
const ssh2 = require('ssh2');

const MAX_CONNECTION_FAIL_COUNT = 10;

function connToSsh2(conn) {
  return {
    host: conn.host,
    port: conn.port,
    username: conn.username,
    password: conn.password,
    privateKey: conn.privateKey,
    passphrase: conn.privateKeyPassphrase
  };
}

function copyFile(conn, src, dest) {
  let connectionFailCount = 0;
  return new Promise((resolve, reject) => {
    function scp() {
      scp2.scp(src, { path: dest, ...connToSsh2(conn) }, err => {
        if (!err) return resolve();
        connectionFailCount++;
        if (connectionFailCount > MAX_CONNECTION_FAIL_COUNT) return reject(err);
        setTimeout(scp, connectionFailCount * 500);
      });
    }
    scp();
  });
}

function runCommand(conn, cmd) {
  return createSshConnection(conn)
    .then(connection => executeCommand(connection, cmd));
}

function createSshConnection(conn) {
  let connectionFailCount = 0;
  const sshConn = connToSsh2(conn);
  const connection = new ssh2.Client();
  function connect() {
    return new Promise((resolve, reject) => {
      connection
        .on('ready', () => resolve(connection))
        .on('error', err => {
          connectionFailCount++;
          if (connectionFailCount > MAX_CONNECTION_FAIL_COUNT) return reject(err);
          setTimeout(connect, connectionFailCount * 500);
        })
        .connect(sshConn);
    });
  }
  return connect();
}

function executeCommand(connection, cmd) {
  return new Promise((resolve, reject) => {
    connection.exec(cmd, (err, stream) => {
      if (err) return reject(err);
      let stdout = '';
      let stderr = '';
      stream
        .on('data', data => { stdout += data.toString('utf8'); })
        .on('close', code => {
          connection.end();
          if (code) return reject(new Error(`Command exited with code: ${code}`));
          return resolve({ stdout, stderr, code });
        })
        .stderr.on('data', data => { stderr += data.toString('utf8'); });
    });
  });
}

class CopyFile extends pulumi.ComponentResource {
  constructor(name, args, opts = null) {
    super('pulumi:provisioners:CopyFile', name, args, opts);
    this.provisioner = new Provisioner(`${name}-provisioner`, {
      dep: args.conn,
      changeToken: args.changeToken,
      onCreate: conn => copyFile(conn, args.src, args.dest)
    }, { parent: this });
  }
}

class RemoteExec extends pulumi.ComponentResource {
  constructor(name, args, opts = null) {
    super('pulumi:provisioners:RemoteExec', name, args, opts);
    if (args.command !== undefined && args.commands !== undefined) {
      throw new Error('Exactly one of \'command\' or \'commands\' should be provided.');
    }
    this.provisioner = new Provisioner(`${name}-provisioner`, {
      dep: args.conn,
      onCreate: async conn => {
        const commands = args.commands || [args.command];
        const results = [];
        for (const cmd of commands) {
          const result = await runCommand(conn, cmd);
          results.push(result);
        }
        return results;
      },
      changeToken: args.changeToken
    }, { parent: this });
    this.results = this.provisioner.result;
  }
}

module.exports = { CopyFile, RemoteExec };
