'use strict';

const { format } = require('util');
const { prettify } = require('sql-log-prettifier');

module.exports = {
  level: 'debug',
  customPrettifiers: {
    query(input) {
      const index = input.indexOf(': ') + 1;
      const sql = input.substring(index);
      return format('\n```sql\n%s\n```', prettify(sql));
    }
  }
};
