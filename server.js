'use strict';
require('locus');

const http       = require('http');
const express    = require('express');
const app        = express();
const socketIo   = require('socket.io');
const bodyParser = require('body-parser');
const generateId = require('./lib/generator');
const Poll       = require('./lib/poll');

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}))
app.set('view engine', 'ejs');

app.locals.polls = {}
let votes = {}
let port = process.env.PORT || 3000;
let server = http.createServer(app)

server.listen( port, () => {
  console.log("Listening on PORT: " + port );
})

const io = socketIo(server);

app.get('/', (req, res) => {
  res.render('index');
});

app.get("/polls/:id", (req, res) => {
  let poll = app.locals.polls[req.params.id]
  res.render('userPoll', { poll: poll });
})

app.get("/polls/:admin/:id", (req, res) => {
  let poll = app.locals.polls[req.params.id]
  res.render('adminPoll', { poll: poll });
})

app.post('/polls', (req, res) => {
  let id = generateId(10);
  let adminKey = generateId(3);
  let pollData = req.body.poll
  let title = pollData.title
  let newPoll = new Poll(id, adminKey, pollData,  title, votes)

  app.locals.polls[newPoll.id] = newPoll

  res.render('pollUrls', { poll: newPoll });
});






io.on('connection', function (socket) {
  io.sockets.emit('usersConnected', io.engine.clientsCount);

  socket.on('message', function (channel, message) {
    let poll = app.locals.polls[message.id];
    if (channel === 'voteCast') {
      poll.votes.push(message.choice)
      io.sockets.emit('updateVotes', poll.countVotes());
    }

    if (channel === 'endPoll' ) {
      let poll = app.locals.polls[message.pollId]
      poll.active = false
      io.sockets.emit('pollClosed')
    }
  });

  socket.on('disconnect', function () {
    console.log('A user has disconnected.', io.engine.clientsCount);
    io.sockets.emit('usersConnected', io.engine.clientsCount);
  });
});

