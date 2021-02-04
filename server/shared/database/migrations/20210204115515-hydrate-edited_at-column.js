'use strict';

const head = require('lodash/head');

exports.up = async ({ sequelize }) => {
  const selectSql = `
    SELECT
      id,
      created_at AS "createdAt",
      updated_at AS "updatedAt"
    FROM
      comment
    WHERE
      created_at != updated_at;
  `;
  const comments = head(await sequelize.query(selectSql, { raw: true }));
  Promise.all(comments.map(({ id, updatedAt }) => {
    const updateSql = 'UPDATE comment SET edited_at = :updatedAt WHERE id = :id';
    const replacements = { id, updatedAt };
    return sequelize.query(updateSql, { replacements });
  }));
};

exports.down = () => {};
