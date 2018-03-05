const dargs = require('dargs');
const getStream = require('get-stream');
const spawn = require('cross-spawn');

module.exports = { run };

function run(program, command, args, options) {
  if (arguments.length <= 3) {
    options = args;
    args = [];
  }
  args = args || [];
  options = options || {};
  const opts = {
    cwd: options.cwd,
    env: options.env || process.env,
    stdio: ['ignore', 'pipe', 'pipe']
  };
  const flags = dargs(options, { excludes: Object.keys(opts) });
  const proc = spawn(program, [command, ...flags, ...args], opts);
  proc.promise = () => toPromise(proc);
  return proc;
}

async function toPromise(proc) {
  const [stderr, stdout] = await Promise.all([
    getStream(proc.stderr),
    getStream(proc.stdout)
  ]);
  return getExitCode(proc)
    .then(code => {
      if (code === 0) return { stderr, stdout };
      const err = new Error(`exit code: ${code}`);
      return Promise.reject(err);
    })
    .catch(err => {
      Object.assign(err, { stderr, stdout });
      return Promise.reject(err);
    });
}

function getExitCode(proc) {
  return new Promise((resolve, reject) => {
    proc.on('error', reject);
    proc.on('exit', resolve);
  });
}
