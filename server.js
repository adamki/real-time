const http    = require('http');
const express = require('express');
const app     = express();

var bodyParser = require('body-parser')

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.post('/polls', (req, res) => {
  console.log(req.body);
  //res.sendFile(__dirname + '/public/index.html');
});

var port = process.env.PORT || 3000;

var server = http.createServer(app)
server.listen( port, () => {
  console.log("Listening on PORT: " + port );
})

const socketIo = require('socket.io');
const io = socketIo(server);


io.on('connection', function (socket) {
  console.log('A user has connected.', io.engine.clientsCount);

  io.sockets.emit('usersConnected', io.engine.clientsCount);

  socket.on('disconnect', function () {
    console.log('A user has disconnected.', io.engine.clientsCount);
    io.sockets.emit('usersConnected', io.engine.clientsCount);
  });
});

module.exports = server;

