'use strict';

const { subDays } = require('date-fns');
const {
  getUsersThatLoggedIn,
  getRevisionsSinceDate,
  filterRecentlyAddedRepositories
} = require('./helpers');
const { schedule } = require('../scheduler');

async function getRevisions() {
  const users = await getUsersThatLoggedIn();
  users.map(async user => {
    const repos = await filterRecentlyAddedRepositories(user);
    const revisions = await Promise.all(repos.map(async repo => {
      return (repo.repositoryUser.dataValues.createdAt < subDays(new Date(), 10, new Date()))
        ? getRevisionsSinceDate(subDays(new Date(), 7), repo)
        : getRevisionsSinceDate(repo.repositoryUser.dataValues.createdAt, repo);
    }));
    console.log(revisions);
  });
}

function initiateDigest() {
  schedule(process.env.DIGEST_OPTIONS, getRevisions);
}

module.exports = {
  initiateDigest
};
