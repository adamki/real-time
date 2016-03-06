'use strict';

class Poll {
  constructor(id, admin, data, title, votes){
    this.id           = id,
    this.admin        = admin,
    this.title        = title,
    this.votes        = [],
    this.choices      = data.responses || [],
    this.expiresAt    = data.expiresAt,
    this.expiresOn    = data.expiresOn,
    this.active       = true
  }

  countVotes() {
    let voteCount = {};
    this.votes.forEach(vote => voteCount[vote] ? voteCount[vote]++ : voteCount[vote] = 1);
    return voteCount;
  }
}

module.exports = Poll;
