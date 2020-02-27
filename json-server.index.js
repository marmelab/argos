const path = require('path')
const fs = require('fs')
const _ = require('lodash')
const jsonServer = require('json-server')

const server = jsonServer.create()
const port = 3002

let endpoints = []
let obj = {}
let files = fs.readdirSync(path.resolve(__dirname, './db/'))

console.log('\n');

const isJson = (str) => {
  try {
      JSON.parse(str);
  } catch (e) {
      return false;
  }
  return true;
}

files.forEach((file) => {
  if (file.indexOf('.json') > -1) {
    jsonObject = JSON.parse(fs.readFileSync('./db/' + file));

    if( isJson(fs.readFileSync('./db/' + file))) {
      Object.keys(jsonObject).forEach(function(idx) {
           endpoints.push(idx);
      });
      console.log('🗒    JSON file loaded : ' + file);
      _.extend(obj, require(path.resolve(__dirname, './db/', file)));
    }
  }
})

const objOrdered = {};
Object.keys(obj).sort().forEach(function(key) {
  objOrdered[key] = obj[key];
});

const router = jsonServer.router(objOrdered)

server.use(jsonServer.defaults())
server.use(router)

server.listen(port, () => {
  console.log('\n⛴    JSON Server is running at http://localhost:' + port );
  endpoints.sort();
  for (var i = 0; i < endpoints.length; i++) {
    console.info('🥁    Endpoint : http://localhost:' + port + '/' + endpoints[i]);
  }
})
