var socket = io();

var connectionCount = document.getElementById('connection-count');

socket.on('usersConnected',(count) => {
  connectionCount.innerText = 'Connected Users: ' + count;
});
