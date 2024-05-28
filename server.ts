#!/usr/bin/env node

/**
 * Module dependencies.
 */

import app from './config/app';
import debug from 'debug';
import http from 'http';

/**
 * Get port from environment and store in Express.
 */
const port = normalizePort(process.env.PORT || '3000');

/**
 * Specifying the Port from where the Express Application will handle the requests.
 */
app.set('port', port);

/**
 * Create HTTP server.
 * Which will listen for HTTP Requests from the Port 3000
 * and execute the Express Applications to handle the requests.
 */
const server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port);

/**
 * Callbacks / Event Handlers.
 */
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val:any) {
  const port = parseInt(val, 10);

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

function onError(error:any) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string'
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
  const addr = server.address();
  const bind = typeof addr === 'string'
    ? 'pipe ' + addr
  // @ts-ignore
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}
