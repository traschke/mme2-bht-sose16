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

var videos = express.Router();

// if you like, you can use this for task 1.b:
var requiredKeys = {title: 'string', src: 'string', length: 'number'};
var optionalKeys = {description: 'string', playcount: 'number', ranking: 'number'};
var internalKeys = {id: 'number', timestamp: 'number'};


// routes **********************
videos.route('/')
    .get(function(req, res, next) {
        var video = store.select('videos');
        res.send(video);
        res.status(200).end()
    })
    .post(function(req,res,next) {
        var id = store.insert('videos', req.body);
        // set code 201 "created" and send the item back
        var video = store.select('videos', id);
        res.status(201).json(video);
    })
    .delete(function (req, res, next) {
        res.status(404).end();
    })
    .put(function (req, res, next) {
        res.status(405).end();
    });


videos.route('/:id')
    .get(function(req, res, next) {
        var video = store.select('videos', req.params.id);
        res.send(video);
        res.status(200).end()
    })
    .post(function(req, res, next) {
        res.status(405).end()
    })
    .delete(function (req, res, next) {
        store.remove('videos', req.params.id);
        res.status(204).end();
    })
    .put(function (req, res, next) {
        var id = store.replace('videos', req.params.id, req.body);
        var video = store.select("videos", id);
        res.send(video);
        res.status(200).end();
    });


module.exports = videos;
