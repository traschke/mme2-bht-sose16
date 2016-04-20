//node app.js in Console aufrufen --->  http://localhost:3000/ in Browser
var express = require('express');
var app = express();

app.get('/', function (req, res) {
  res.send('Hello World!');
});
app.use('/static', express.static('public'));

app.listen(3000, function () {
  console.log('"Hallo World" app listening on port 3000!');
});