#!/usr/bin/env node

/**
 * Module dependencies.
 */

var app = require('./server/express-app');
var debug = require('debug')('http');
var http = require('http');
var socket = require('socket.io');

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || 4026);
app.set('port', port);
  /**
   * Create HTTP server.
   */
var server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */
var server_express = server.listen(port, function() {
  debug('Express server listening on port ' + server.address().port);
});
server.on('error', onError);
server.on('listening', onListening);

var io = socket(server_express);
io.on('connection', (socket) => {
    console.log('made socket connection', socket.id);

    socket.on('geneData', function(data){
      console.log(data);
      setTimeout(function(){
        io.sockets.emit('geneData', data);
       }, 3000);
    })
});


/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}
