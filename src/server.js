const http = require('http'); // http module
const url = require('url'); // url module
const query = require('querystring');
const htmlHandler = require('./htmlResponses.js');
const jsonHandler = require('./jsonResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

// GET
const urlStructGET = {
  '/': htmlHandler.getIndex,
  '/style.css': htmlHandler.getCSS,
  '/allLogs': jsonHandler.getLog,
  '/getLog': jsonHandler.getLog,
  '/notReal': jsonHandler.notFound,
  '/bundle.js': htmlHandler.getBundle,
  notFound: jsonHandler.notFound,
};

// HEAD
const urlStructHEAD = {
  '/getLogs': jsonHandler.getLogMeta,
  '/notReal': jsonHandler.notFoundMeta,
  notFound: jsonHandler.notFoundMeta,
};

// POST
const handlePost = (request, response, parsedUrl) => {
  // if post is to /addLog (our only POST url)
  if (parsedUrl.pathname === '/addLog') {
    const res = response;

    // uploads come in as a byte stream that we need
    // to reassemble once it's all arrived
    const body = [];

    // if the upload stream errors out, just throw a
    // a bad request and send it back
    request.on('error', (err) => {
      console.dir(err);
      res.statusCode = 400;
      res.end();
    });

    // on 'data' is for each byte of data that comes in
    // from the upload. We will add it to our byte array.
    request.on('data', (chunk) => {
      body.push(chunk);
    });

    // on end of upload stream.
    request.on('end', () => {
      // combine our byte array (using Buffer.concat)
      // and convert it to a string value (in this instance)
      const bodyString = Buffer.concat(body).toString();
      // since we are getting x-www-form-urlencoded data
      // the format will be the same as querystrings
      // Parse the string into an object by field name
      const bodyParams = query.parse(bodyString);
      // console.dir(bodyParams);

      // pass to our addLog function
      jsonHandler.addLog(request, res, bodyParams);
    });
  }
};

const onRequest = (request, response) => {
  // parse the url using the url module
  const parsedUrl = url.parse(request.url);

  // check if the path name (the /name part of the url) matches
  // any in our url object. If so call that function. If not, default to index.
  switch (request.method) {
    case 'GET':
      if (urlStructGET[parsedUrl.pathname]) {
        urlStructGET[parsedUrl.pathname](request, response);
      } else {
        urlStructGET.notFound(request, response);
      }
      break;

    case 'HEAD':
      if (urlStructHEAD[parsedUrl.pathname]) {
        urlStructHEAD[parsedUrl.pathname](request, response);
      } else {
        urlStructHEAD.notFoundMeta(request, response);
      }
      break;

    case 'POST':
      handlePost(request, response, parsedUrl);
      break;

    default:
      jsonHandler.notFound(request, response);
  }
};

// start server
http.createServer(onRequest).listen(port);

console.log(`Listening on 127.0.0.1: ${port}`);
