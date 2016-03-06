var socket = io();

var connectionCount = document.getElementById('connection-count');
var $votes =  $("#votes")

socket.on('usersConnected',(count) => {
  console.log(votes);
  connectionCount.innerText = 'Connected Users: ' + count;
});

socket.on('updateVotes',(votes) => {
  $votes.empty();
  console.log(votes);
  Object.keys(votes).forEach((key) => {
    $votes.append(`<h4>${key}: ${votes[key]}</h4>`);
  })
});

var votes = document.querySelectorAll('#choices h3');

for (var i = 0; i < votes.length; i++) {
    votes[i].addEventListener('click', function () {
    socket.send('voteCast', {choice: this.innerText, id: window.location.pathname.split('/')[2]  });
  });
}


