'use strict';

const head = require('lodash/head');
const Promise = require('bluebird');

exports.up = async qi => {
  const comments = await getComments(qi);
  if (!comments.length) return;
  return updateColumnValues(comments, qi);
};

exports.down = () => {};

async function getComments({ sequelize }) {
  const sql = `
    SELECT
      id,
      created_at AS "createdAt",
      updated_at AS "updatedAt"
    FROM
      comment
    WHERE
      created_at != updated_at;
  `;
  return head(await sequelize.query(sql, { raw: true }));
}

function updateColumnValues(comments, { sequelize }) {
  return Promise.each(comments, ({ id, updatedAt }) => {
    const sql = 'UPDATE comment SET edited_at = :updatedAt WHERE id = :id';
    const replacements = { id, updatedAt };
    return sequelize.query(sql, { replacements });
  });
}
