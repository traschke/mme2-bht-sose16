/** This module defines the routes for videos using the store.js as db memory
 *
 * @author Johannes Konert
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
var store = require('../blackbox/store');
// maybe middleware
var filter = require('../filter/filter');

var videos = express.Router();

// if you like, you can use this for task 1.b:
var requiredKeys = {title: 'string', src: 'string', length: 'number'};
var optionalKeys = {description: 'string', playcount: 'number', ranking: 'number'};
var internalKeys = {id: 'number', timestamp: 'number'};


// routes **********************
videos.route('/')
    .get(function (req, res, next) {
        var videos = store.select('videos');
        var video = store.select('videos', req.params.id);
        if (typeof video !== 'undefined') {
            var filterOptions = req.query.filter.split(",");
            if (typeof filterOptions === 'undefined') {
                res.locals.items = video;
            } else {
                var newVideos = video.map(function (video) {
                    try {
                        var newVideo = filter(filterOptions, video);
                        return newVideo;
                    } catch (e) {
                        return next(e);
                    }
                });
                res.locals.items = newVideos;
            }
        }
        next();
    })
    .post(function (req, res, next) {
        var err = undefined;
        Object.keys(optionalKeys).forEach(function (key) {
            if (!req.body.hasOwnProperty(key)) {
                if (optionalKeys[key] === 'string') {
                    req.body[key] = '';
                } else {
                    req.body[key] = 0;
                }
            }
        });
        var numerics = {};
        numerics.length = requiredKeys.length;
        numerics.playcount = optionalKeys.playcount;
        numerics.ranking = optionalKeys.ranking;
        Object.keys(numerics).forEach(function (key) {
            if (req.body[key] < 0) {
                err = new Error('{"error": { "message": "Numeric should not be negative.", "code": 400 } }');
                err.status = 400;
                next(err);
                return;
            }
        });
        if (!err) {
            req.body.timestamp = Date.now();
            var id = store.insert('videos', req.body);
            // set code 201 "created" and send the item back
            var video = store.select('videos', id);
            res.status(201).json(video);
            res.end();
        }
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
        var video = store.select('videos', req.params.id);
        if (typeof video !== 'undefined') {
            var filterOptions = req.query.filter.split(",");
            if (typeof filterOptions === 'undefined') {
                res.locals.items = video;
            } else {
                try {
                    var newVideo = filter(filterOptions, video);
                    res.locals.items = newVideo;
                } catch (e) {
                    return next(e);
                }
            }
        }
        next();
    })


    .post(function (req, res, next) {
        var err = new Error('{"error": { "message": "This is the wrong URL you are sending your POST to.", "code": 400 } }');
        err.status = 405;
        next(err);
    })
    .delete(function (req, res, next) {
        var video = store.select('videos', req.params.id);

        if (video !== undefined) {
            store.remove('videos', req.params.id);
            res.set('Content-Type', 'application/json').status(204).end();
        } else {
            var err = new Error('{"error": { "message": "Resource does not exist.", "code": 400 } }');
            err.status = 404;
            next(err);
        }

    })
    .put(function (req, res, next) {
        store.replace('videos', req.params.id, req.body);
        res.locals.items = store.select("videos", req.params.id);
        next();
    });

// this middleware function can be used, if you like (or remove it)
videos.use(function (req, res, next) {
    // if anything to send has been added to res.locals.items
    if (res.locals.items) {
        // then we send it as json and remove it
        res.json(res.locals.items);
        delete res.locals.items;
    } else {
        // otherwise we set status to no-content
        res.set('Content-Type', 'application/json');
        if (!res.status) {
            res.status(204) // no content;
        }
        res.end();
    }
});

module.exports = videos;
