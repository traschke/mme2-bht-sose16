/** Main app for server to start a small REST API for videos
 *  STATUS: unfinished
 *
 * Note: set your environment variables
 * NODE_ENV=development
 * DEBUG=me2*
 *
 * @author Johannes Konert
 * @licence CC BY-SA 4.0
 *
 */
"use strict";

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var bodyParser = require('body-parser');
var requestLogger = require('morgan');
var debug = require('debug')('me2u5:server');
var morgan = require('morgan');

// own modules
var restAPIchecks = require('./restapi/request-checks.js');
var errorResponseWare = require('./restapi/error-response');

var videos = require('./routes/videos');



// app creation
var app = express();

// Middlewares *************************************************
app.use(favicon(path.join(__dirname, 'public', 'images/faviconbeuth.ico')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(morgan('tiny'));

// logging
app.use(requestLogger('dev'));

// API request checks for API-version and JSON etc.
app.use(restAPIchecks);


// Routes ******************************************************
app.use('/videos', videos);






// (from express-generator boilerplate  standard code)
// Errorhandling and requests without proper URLs ************************
// catch 404 and forward to error handler
app.use(function(req, res, next) {
    debug('Catching unmatched request to answer with 404');
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// register error handlers
errorResponseWare(app);

// Start server ****************************
app.listen(3000, function(err) {
    if (err !== undefined) {
        debug('Error on startup, ',err);
    }
    else {
        debug('Listening on port 3000');
    }
});