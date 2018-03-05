const split = require('split2');

const reLine = /\r?\n/;
const write = obj => `${JSON.stringify(obj)}\n`;

module.exports = proc => {
  return {
    pipe(dest) {
      proc.stdout.pipe(mapLines(parseOutput)).pipe(dest);
      proc.stderr.pipe(mapLines(parseLog)).pipe(dest);
    }
  };
};

function mapLines(mapper) {
  return split(reLine, line => write(mapper(line)));
}

function parseOutput(line) {
  return { type: 'output', message: line, raw: line };
}

function parseLog(line) {
  const [, level, ...tokens] = line.split(' ');
  const message = tokens.join(' ');
  return { type: 'log', level, message, raw: line };
}
