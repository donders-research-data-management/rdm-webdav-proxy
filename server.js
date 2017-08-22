// include dependencies
var fs = require('fs');
var path = require('path');
var https = require('https');
var express = require('express');
var proxy = require('http-proxy-middleware');
var config = require('config');
var morgan = require('morgan');
var rfs = require('rotating-file-stream');

// get proxy options from config
var opt = config.get('proxy')

var ssl = false;
if ( config.has('ssl.key') && config.has('ssl.cert') ) {
    if ( fs.existsSync(config.get('ssl.key')) && fs.existsSync(config.get('ssl.key')) ) {
        opt['ssl'] = {
            key: fs.readFileSync(config.get('ssl.key'),'utf-8'),
            cert: fs.readFileSync(config.get('ssl.cert'),'utf-8')
        };
        console.log('user secured proxy ...')
        ssl = true;
    }
}

// rotating logging system
var logDirectory = path.join(__dirname, 'log');
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

// create a rotating write stream
var accessLogStream = rfs('access.log', {
  interval: '7d', // rotate weekly
  path: logDirectory
});

// create the proxy to underlying WebDAV server for anonymous user 
var myProxy = proxy(opt);

// Here we assume the availability of /:path on the webdav server is provided/determined by the webdav server
// an use case:
//   - the webdav mount to iRODS /rdm/di/public as the webdav's root directory
//   - when a closed DSC is made public, it is sym-linked to /rdm/di/public/{id} where {id} is dynamically generated
//   - the sym-link has a life time, when its lifetime is over, the sym-link is removed
//   - the user then can connect to http://<this server>:3000/{id} within the {id}'s lifetime
var port = config.has('port') ? config.get('port'):3000;
var app = express();
app.use(morgan(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" - :status :res[content-length] :response-time ms', {stream: accessLogStream}));
app.use('/:path', myProxy);

if ( ssl ) {
    https.createServer( opt['ssl'], app ).listen(port);
} else {
    app.listen(port);
}
