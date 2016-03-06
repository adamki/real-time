'use strict';

class Poll {
  constructor(id, admin, data, title, votes){
    this.id    = id,
    this.admin = admin,
    this.title = title,
    this.choices  = data.responses || [],
    this.votes    = [];
  }

  countVotes() {
    let voteCount = {};
    this.votes.forEach(vote => voteCount[vote] ? voteCount[vote]++ : voteCount[vote] = 1);
    return voteCount;
  }
}

module.exports = Poll;
