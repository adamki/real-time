'use strict';

const http       = require('http');
const express    = require('express');
const app        = express();
const socketIo   = require('socket.io');
const bodyParser = require('body-parser');
const generateId = require('./lib/generator');
const Poll       = require('./lib/poll');
require('locus');

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}))
app.set('view engine', 'ejs');
app.locals.polls = {}
var votes = {}

var port = process.env.PORT || 3000;
var server = http.createServer(app)

server.listen( port, () => {
  console.log("Listening on PORT: " + port );
})

const io = socketIo(server);

app.get('/', (req, res) => {
  res.render('index');
});

app.get("/polls/:id", (req, res) => {
  var poll = app.locals.polls[req.params.id]
  res.render('userPoll', { poll: poll });
})

app.post('/polls', (req, res) => {
  var id = generateId(10);
  var adminKey = generateId(3);
  var pollData = req.body.poll
  var title = pollData.title

  var newPoll = new Poll(id, adminKey, pollData, title)

  app.locals.polls[newPoll.id] = newPoll

  res.render('pollUrls', { poll: newPoll });
});


io.on('connection', function (socket) {
  console.log('A user has connected.', io.engine.clientsCount);
  io.sockets.emit('usersConnected', io.engine.clientsCount);

  socket.on('message', function (channel, message) {
    let poll = app.locals.polls[message.id];
    if (channel === 'voteCast') {
      console.log(poll);
      poll.votes.push(message.choice)
      io.sockets.emit('updateVotes', poll);
    }
  });

  socket.on('disconnect', function () {
    console.log('A user has disconnected.', io.engine.clientsCount);
    io.sockets.emit('usersConnected', io.engine.clientsCount);
  });
});

