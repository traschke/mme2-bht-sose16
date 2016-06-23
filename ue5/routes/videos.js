/** This module defines the routes for videos using a mongoose model
 *
 * @author Johannes Konert, Pauline Schmiechen, Timo Raschke
 * @licence CC BY-SA 4.0
 *
 * @module routes/videos
 * @type {Router}
 */

// remember: in modules you have 3 variables given by CommonJS
// 1.) require() function
// 2.) module.exports
// 3.) exports (which is module.exports)

// modules
var express = require('express');
var logger = require('debug')('me2u4:videos');

// TODO add here your require for your own model file

var videos = express.Router();
var videoModel = require('./../models/video');


// routes **********************
videos.route('/')
    .get(function (req, res, next) {
        if(req.query.filter) {
            var arrayFilter = req.query.filter.replace(",", " ");

            var queryFilter = videoModel.find({}, arrayFilter);
            queryFilter.exec(function (err, items) {
                res.json(items);
            });
        }
        else{
            videoModel.find({},function (err, videos) {
                if(err)
                    next(err);
                else{
                    res.json(videos);
                }
            });
        }
    })
    .post(function (req, res, next) {
        var video = new videoModel(req.body);
        video.save(function (err) {
            if (!err) {
                res.status(201).json(video);
            } else {
                err.status = 400;
                err.message += '. Malformed JSON input.';
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

videos.route('/:id')
    .get(function (req, res, next) {
        videoModel.findOne({
            '_id': req.params.id
        }, function (err, video) {
            if (!err) {
                if (video) {
                    res.json(video);
                } else {
                    var error = new Error('{"error": { "message": "No video with id ' + req.params.id + ' found.", "code": 404 } }');
                    error.status = 404;
                    next(error);
                }
            } else {
                err.status = 400;
                err.message += ' in fields: ' + Object.getOwnPropertyNames(err.errors);
                next(error);
            }
        })
    })
    .post(function (req, res, next) {
        var err = new Error('{"error": { "message": "This is the wrong URL you are sending your POST to.", "code": 400 } }');
        err.status = 405;
        next(err);
    })
    .delete(function (req, res, next) {
        videoModel.findOne(
            {
                '_id': req.params.id
            },
            function (err, video) {
                if (!err) {
                    if (video) {
                        video.remove();
                        res.json(video);
                    } else {
                        var error = new Error('{"error": { "message": "No video with id ' + req.params.id + ' found.", "code": 404 } }');
                        error.status = 404;
                        next(error);
                    }
                } else {
                    err.status = 400;
                    err.message += ' in fields: ' + Object.getOwnPropertyNames(err.errors);
                    next(error);
                }
            }
        )
    })
    .patch(function (req, res, next) {
        videoModel.findByIdAndUpdate(req.params.id, req.body, function (err) {
            videoModel.findById(req.params.id, function (err, video) {
                var now = new Date();
                video.updatedAt = now;
            });
            if (err)
                next(err);
            res.json({message: 'Video updated!'});
        });
    })
    .put(function (req, res, next) {
        if (req.params.id == req.body._id) {
            videoModel.findById(req.params.id, function (err, video) {
                if (!err) {
                    if (video) {
                        //var newvideo = new videoModel(req.body);
                        // do your updates here
                        video.title = req.body.title;
                        video.src = req.body.src;
                        video.description = req.body.description;
                        video.length = req.body.length;
                        var now = new Date();
                        video.updatedAt = now;
                        video.save(function (err, item) {
                            if (err)
                                next(err);
                            else
                                res.json(item);
                        });
                    } else {
                        var error = new Error('{"error": { "message": "No video with id ' + req.params.id + ' found.", "code": 404 } }');
                        error.status = 404;
                        next(error);
                    }
                } else {
                    next(err);
                }
            });
        } else {
            var error = new Error('{"error": { "message": "ID in body does not match id in query.", "code": 404 } }');
            error.status = 404;
            next(error);
        }
    });

// this middleware function can be used, if you like or remove it
videos.use(function(req, res, next){
    // if anything to send has been added to res.locals.items
    if (res.locals.items) {
        // then we send it as json and remove it
        res.json(res.locals.items);
        delete res.locals.items;
    } else {
        // otherwise we set status to no-content
        res.set('Content-Type', 'application/json');
        res.status(204).end(); // no content;
    }
});

module.exports = videos;
