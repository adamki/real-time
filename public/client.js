'use strict'

var socket = io();

var connectionCount = document.getElementById('connection-count');
var $votes =  $("#votes")
let $choices = $('#choices')
var $endPoll =  $("#endPoll")
let pollId = window.location.pathname.split('/')[3]

socket.on('usersConnected',(count) => {
  console.log(votes);
  connectionCount.innerText = 'Connected Users: ' + count;
});

socket.on('updateVotes', (votes) => {
  $votes.empty();
  Object.keys(votes).forEach((key) => {
    $votes.append(`<h4>${key}: ${votes[key]}</h4>`);
  })
});

socket.on('pollClosed', () => {
  $choices.empty();
  $choices.append(
    "<h1> Sorry! This poll has been closed. </h1>"
  )
})

$endPoll.on('click', function() {
  socket.send('endPoll', {pollId: pollId})
})

var votes = document.querySelectorAll('#choices h3');

for (var i = 0; i < votes.length; i++) {
    votes[i].addEventListener('click', function () {
    socket.send('voteCast', {choice: this.innerText, id: window.location.pathname.split('/')[2]  });
  });
}


