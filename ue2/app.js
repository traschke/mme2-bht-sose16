/**
 * Created by Timo Raschke 812538 <a href="timo.raschke@gmail.com">Timo Raschke"</a>, Khaled Reguieg 813812, Pauline Schmiechen 813874 on 20.04.2016.
 * This file represents the entrypoint of our application.
 */
var express = require('express');
var app = express();

app.get('/', function (req, res) {
  res.send('<!DOCTYPE html>' +
      '<html lane="en"' +
      '<head><meta charset="utf-8"></head>' +
      '<body><h1>Hello World!</h1></body>' +
      '</html>'
  );
});
app.get('/time', function (req, res) {
 res.writeHead(200, { "Content-Type": "text/plain" });
 var date = new Date();
 var hours = date.getHours();
 var minutes = date.getMinutes();
 res.end(hours + " h : " + minutes + " min");
});

app.use('/static', express.static('public'));

var server = app.listen(3000, function () {
  console.log("helloworld app is ready and listening at http://localhost:3000");
})