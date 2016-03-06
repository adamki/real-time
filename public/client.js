var socket = io();

var connectionCount = document.getElementById('connection-count');
var votes = document.getElementById('votes');

socket.on('usersConnected',(count) => {
  connectionCount.innerText = 'Connected Users: ' + count;
});

socket.on('updateVotes',(votes) => {
  console.log(votes)
  votes.innerText = 'votes:' + votes;
});

var votes = document.querySelectorAll('#choices h3');

for (var i = 0; i < votes.length; i++) {
    votes[i].addEventListener('click', function () {
    socket.send('voteCast', {choice: this.innerText, id: window.location.pathname.split('/')[2]  });
  });
}


