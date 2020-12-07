'use strict';

const { Provisioner } = require('./provisioner');
const pulumi = require('@pulumi/pulumi');
const scp2 = require('scp2');
const ssh2 = require('ssh2');

// https://github.com/pulumi/examples/blob/e942d6130c/aws-ts-ec2-provisioners/provisioners/index.ts

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
      scp2.scp(
        src,
        { path: dest, ...connToSsh2(conn) },
        err => {
          if (err) {
            connectionFailCount++;
            if (connectionFailCount > 10) {
              reject(err);
            } else {
              setTimeout(scp, connectionFailCount * 500);
            }
            return;
          }
          resolve();
        }
      );
    }
    scp();
  });
}

function runCommand(conn, cmd) {
  const sshConn = connToSsh2(conn);
  let connectionFailCount = 0;
  return new Promise((resolve, reject) => {
    const connection = new ssh2.Client();
    function connect() {
      connection.on('ready', () => {
        connection.exec(cmd, (err, stream) => {
          if (err) {
            return reject(err);
          }
          let stdout = '';
          let stderr = '';
          stream.on('close', (code, signal) => {
            connection.end();
            if (code) {
              reject(new Error('Command exited with code: ', code));
            } else {
              resolve({ stdout, stderr, code });
            }
          }).on('data', data => {
            stdout += data.toString('utf8');
          }).stderr.on('data', data => {
            stderr += data.toString('utf8');
          });
        });
      }).on('error', err => {
        connectionFailCount++;
        if (connectionFailCount > 10) {
          reject(err);
        } else {
          setTimeout(connect, connectionFailCount * 500);
        }
      }).connect(sshConn);
    }
    connect();
  });
}

// CopyFile is a provisioner step that can copy a file from the machine running Pulumi to the newly created resource.
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

// RemoteExec runs remote commands and/or invokes scripts. If commands and scripts are specified, they are
// run in the following order: command, commands, script, and finally then scripts.
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
    this.result = this.provisioner.result[0];
    this.results = this.provisioner.result;
  }
}

module.exports = { CopyFile, RemoteExec };
