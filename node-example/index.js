var sumoLogger = require('../src/sumoLogger.js');
var express = require('express');
var app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.use(express.static('public'));

app.get('/', function (req, res) {
  res.send('Hello World!');
  logSumo.log('Hello World page loaded');
});

app.post('/updateConfig', function (req, res) {
  logSumo.updateConfig({
    endpoint: req.body.endpoint,
    interval: req.body.interval
  });
  res.send(true);
});

app.post('/sendLog', function (req, res) {
  var msg = req.body.msg;
  var opts = {};
  if (req.body.url) {
    opts.url = req.body.url;
  }
  logSumo.log(msg, opts);
  res.send(true);
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
});