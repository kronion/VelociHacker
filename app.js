/* Express */
var express = require('express');
var app = express();

/* Initialize socket.io */
var server = require('http').Server(app);
var io = require('socket.io')(server);

/* Cookie parser */
var cookie = require('cookie');

/* Middleware */
var compression = require('compression');
var session = require('cookie-session');
// app.set('trust proxy', 1);
app.use(compression());
app.use(session({
  keys: [ 'iTerm2', 'Golang' ]
}));

app.use(function (req, res, next) {
  var n = req.session.views || 0
  req.session.views = ++n
  next();
});

app.use(express.static(__dirname + '/public'));

app.get('/test', function(req, res) {
  console.log(req.session);
  res.send('test');
});

server.listen(8000);

var mostRecent = [];
var i = 0;

/* Socket.io logic */
io.on('connection', function(socket) {

  for (var j = 0; j < mostRecent.length; j++) {
    socket.emit('update', mostRecent[j]);
  }

  socket.on('message', function(data) {
    var cookies = cookie.parse(socket.handshake.headers.cookie);
    data.id = cookies['express:sess'];
    mostRecent[i] = data;
    i = (i+1)%50;
    socket.broadcast.emit('update', data);
    socket.emit('update', data);
  });
});
