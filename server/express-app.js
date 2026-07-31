var express = require('express');
var app = express();
var path = require('path');
var fs = require('fs');

var clientDir = path.join(__dirname, '..', 'client');
var indexPath = path.join(clientDir, 'index.html');
var config = {};

try {
  config = JSON.parse(fs.readFileSync(path.join(clientDir, 'config.json'), 'utf8'));
}
catch (e) {}

var appPath = config.gene && config.gene.path || '/';
var mountPath = appPath === '/' ? '/' : appPath.replace(/\/+$/, '');

function sendIndex(req, res) {
  res.sendFile(indexPath);
}

function addAppRoutes(prefix) {
  app.get(prefix + '/', sendIndex);
  app.get(prefix + '/#', sendIndex);
  app.get(prefix + '/backward', sendIndex);
  app.get(prefix + '/exhibit*', sendIndex);
  app.get(prefix + '/tutorial*', sendIndex);
  app.get(prefix + '/use-cases*', sendIndex);
}

if (mountPath === '/') {
  app.use(express.static(clientDir));
  addAppRoutes('');
}
else {
  app.get(mountPath, function(req, res) {
    var queryIndex = req.originalUrl.indexOf('?');
    var query = queryIndex === -1 ? '' : req.originalUrl.slice(queryIndex);
    res.redirect(301, mountPath + '/' + query);
  });

  app.use(mountPath, express.static(clientDir));
  addAppRoutes(mountPath);

  app.get('/', function(req, res) {
    res.redirect(302, mountPath + '/');
  });
}


module.exports = app;
