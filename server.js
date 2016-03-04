const http      = require('http');
const express   = require('express');
const app       = express();

const generateId = require('./lib/generator');
const Poll       = require('./lib/poll');
const socketIo  = require('socket.io');
var bodyParser  = require('body-parser');

var pry = require('pryjs');

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}))

app.set('view engine', 'ejs');
app.locals.polls = {}


var port = process.env.PORT || 3000;

var server = http.createServer(app)
server.listen( port, () => {
  console.log("Listening on PORT: " + port );
})

const io = socketIo(server);

app.get('/', (req, res) => {
  res.render('index');
});

app.post('/polls', (req, res) => {
  var id = generateId(10);
  var adminKey = generateId(3);
  var pollData = req.body.poll
  var title = pollData.title
  var votes = {}

  pollData.responses.forEach(function(response) {
    votes[response] = 0
  })

  var newPoll = new Poll(id, adminKey, title, votes)

  app.locals.polls[newPoll.id] = newPoll

  res.render('pollUrls', { poll: newPoll });
});


io.on('connection', function (socket) {
  console.log('A user has connected.', io.engine.clientsCount);

  io.sockets.emit('usersConnected', io.engine.clientsCount);

  socket.on('disconnect', function () {
    console.log('A user has disconnected.', io.engine.clientsCount);
    io.sockets.emit('usersConnected', io.engine.clientsCount);
  });
});

module.exports = server;

