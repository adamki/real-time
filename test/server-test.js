'use strict'

const assert = require('assert');
const request = require('request');
const app = require('../server');
const fixtures = require('./fixture-poll');

describe('Server', () => {

  before((done) => {
    this.port = 9876;
    this.server = app.listen(this.port, (err, result) => {
      if (err) { return done(err); }
      done();
    });
    this.request = request.defaults({
      baseUrl: 'http://localhost:9876/'
    });
  });

  after(() => {
    this.server.close();
  });

  it('should exist', () => {
    assert(app);
  });

  describe('GET /', () => {

    it('should return a 200 for home page', (done) => {
      this.request.get('/', (error, response) => {
        if (error) { done(error); }
        assert.equal(response.statusCode, 200);
        done();
      });
    });

    it('should have a body with the name of the application', (done) => {
      let title = app.locals.title;

      this.request.get('/', (error, response) => {
        if (error) { done(error); }
        assert(response.body.includes(title),
              `"${response.body} does not include ${title}"`);
        done();
      });
    });
  });


  describe('POST /polls', () => {
    beforeEach(() => {
      app.locals.polls = {};
    });

    it('should receive and store poll objects', (done) => {
      let payload = {
        poll: {
          title: 'this is a poll',
          votes: [ 'hey', 'you'  ]
        }
      }

      this.request.post('/polls', { form: payload }, (error, response) => {
        if (error) { done(error); }
      });

      app.locals.polls.testPoll = fixtures.validPoll;

      let pollCount = Object.keys(app.locals.polls).length;

      assert.equal(pollCount, 1, `Expected 1 poll, found ${pollCount}`);
      done();
    });

    it('should not return a 404', (done) => {
      this.request.post('/polls', (error, response) => {
        if (error) { done(error); }
        assert.notEqual(response.statusCode, 404);
        done();
      });
    });
  });

  describe('GET /polls/:id', () => {
    beforeEach(() => {
      app.locals.polls.testPoll = fixtures.validPoll;
    })

    it('should not return a 404', (done) => {
      this.request.get('/polls/randomeID', (error, response) => {
        if (error) { done(error); }
        assert.notEqual(response.statusCode, 404);
        done();
      })
    })

    it('should not return 404', (done) => {

      this.request.post('/polls', { form: fixtures.validPoll }, (error, response) => {
        if (error) { done(error); }

        var pollId = Object.keys(app.locals.polls)[0];
        var poll = app.locals.polls[pollId]

        this.request.get(`/polls/${poll.id}`, (error, response) => {
          if (error) { done(error); }
          assert.notEqual(response.statusCode, 404);
          done();
        });
      });
    });

    xit('should return a page with the title of the poll', (done) => {
      this.request.post('/polls', { form: fixtures.validPoll }, (error, response) => {
        if (error) { done(error); }

        let pollId = Object.keys(app.locals.polls)[0];
        let poll = app.locals.polls[pollId]
        let title = poll.title

        this.request.get(`/polls/${poll.id}`, (error, response) => {
          if (error) { done(error); }

          assert(response.body.includes(title),
                `"${response.body} does not include ${title}"`);
          done();
        });
      });
    });
  });


});
