//node app.js in Console aufrufen --->  http://localhost:3000/ in Browser
var express = require('express');
var app = express();

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.get('/time', function (req, res) {
 res.writeHead(200, { "Content-Type": "text/plain" });
 var date = new Date();
 var hours = date.getHours();
 var minutes = date.getMinutes();
 res.end(hours + " h : " + minutes + " min");
});

app.get('/text.txt', function (req, res) {
var date1 = new Date();
var time1 = date1.getMilliseconds();
var fs = require('fs');
 res.writeHead(200, { "Content-Type": "text/plain" });
 fs.readFile('text.txt', 'utf8', function(err, contents) {
    res.end(contents);
 });

var date2 = new Date();
var time2 = date2.getMilliseconds();
var time = time2 - time1;
    console.log("Zeit : " + time);
});

app.use('/static', express.static('public'));

app.listen(3000, function () {
  console.log('"Hallo World" app listening on port 3000!');
});