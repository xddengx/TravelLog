const fs = require('fs');
// pulls in the file system module
const index = fs.readFileSync(`${__dirname}/../hosted/client.html`);
const css = fs.readFileSync(`${__dirname}/../hosted/client.css`);
const bundle = fs.readFileSync(`${__dirname}/../hosted/bundle.js`);
const image = fs.readFileSync(`${__dirname}/../hosted/logo.png`);
const berlin = fs.readFileSync(`${__dirname}/../hosted/berlin.jpeg`);

const getIndex = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(index);
  response.end();
};

const getBundle = (request, response) =>{
  response.writeHead(200, { 'Content-Type': 'application/javascript' });
  response.write(bundle);
  response.end();
}

const getCSS = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/css' });
  response.write(css);
  response.end();
};

const getImage = (request, response) =>{
  response.writeHead(200, {'Content-Type': 'image/png'});
  response.end(image, 'binary');
}

const getBerlin = (request, response) =>{
  response.writeHead(200, {'Content-Type': 'image/jpeg'});
  response.end(berlin, 'binary');
}

module.exports = {
  getIndex,
  getCSS,
  getBundle,
  getImage,
  getBerlin,
};
