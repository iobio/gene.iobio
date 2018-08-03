var express = require('express');
var app = express();
var port = process.env.PORT || 3001;
var path = require('path');


const staticFileMiddleware = express.static(path.join(__dirname, '..', 'client'));
app.use(staticFileMiddleware);

app.get('/#', function(req, res){
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/backward', function(req, res){
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/exhibit*', function(req, res){
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/tutorial*', function(req, res){
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});


app.get('/use-cases*', function(req, res){
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/', function(req, res){
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});



module.exports = app;