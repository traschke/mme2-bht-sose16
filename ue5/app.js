/** Main app for server to start a small REST API for videos
 *  STATUS: unfinished
 *
 * Note: set your environment variables
 * NODE_ENV=development
 * DEBUG=me2*
 *
 * @author Johannes Konert, Pauline Schmiechen
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
var mongoose = require('mongoose');

// own modules
var restAPIchecks = require('./restapi/request-checks.js');
var errorResponseWare = require('./restapi/error-response');

var videos = require('./routes/videos');
//mogo db anbindung
var db = mongoose.connect('mongodb://localhost:27017/me2');
var videoModel = require('./models/video');


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
//app.use('/videos', videos);

app.route('/videos')
    .get(function(req, res, next){
        var filter =  {};
        for ( var k in req.query ) {
            filter[k] = req.query[k];   // probably want to check in the loop
        }
        var queryFilter = videoModel.find({ }).select(filter);
        queryFilter.exec(function(err, items) {
                res.json(items);
            });
    })
    .post(function(req, res, next) {
        var video = new videoModel(req.body);
        video.save(function(err) {
            if (!err) { res.status(201).json(video)
            }else {
                next(err);
            }
        });
    })
    .delete(function (req, res, next) {
        res.status(404).end();
    })
    .put(function (req, res, next) {
        var err = new Error('{"error": { "message": "Wrong Content-Type.", "code": 405 } }');
        err.status = 405;
        next(err);
    });

app.route('/videos/:id')
    .get(function(req, res, next){
        videoModel.findOne({
        '_id' : req.params.id
        }, function (err, items) {
            res.json(items);
        })
    })
    .post(function (req, res, next) {
        var err = new Error('{"error": { "message": "This is the wrong URL you are sending your POST to.", "code": 400 } }');
        err.status = 405;
        next(err);
    })
    .delete(function(req, res, next){
        videoModel.findOne({
            '_id' : req.params.id
        }, function (err, item) {
           item.remove();
            res.json(item);
        })
    })
    .patch(function (req, res, next) {
        videoModel.findByIdAndUpdate(req.params.id, req.body, function (err){
            videoModel.findById(req.params.id, function(err, video) {
                var now = new Date();
                video.updatedAt = now;
            });
            if(err)
                next(err);
            res.json({ message: 'Video updated!' });
        });
    })
    .put(function (req, res, next) {
        videoModel.findById(req.params.id, function(err, video) {
            if (!video)
               next(err);
            else {
                // do your updates here
                video.title = req.body.title;
                video.src = req.body.src;
                video.description = req.body.description;
                video.length = req.body.length;
                var now = new Date();
                video.updatedAt = now;
                video.save(function(err, item) {
                    if (err)
                        next(err);
                    else
                        res.json(item);
                });
            }
        });
    });




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
