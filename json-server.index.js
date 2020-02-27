const path = require('path');
const fs = require('fs');
const _ = require('lodash');
const jsonServer = require('json-server');

const server = jsonServer.create();
const port = 3002;

const dbPath = './db/';

let endpoints = [];
let obj = {};
let files = fs.readdirSync(path.resolve(__dirname, dbPath));

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
    jsonObject = JSON.parse(fs.readFileSync(dbPath + file));

    if (isJson(fs.readFileSync(dbPath + file))) {
      Object.keys(jsonObject).forEach((idx) =>
           endpoints.push(idx)
      );
      console.log(`🗒    JSON file loaded : ${file}`);
      _.extend(obj, require(path.resolve(__dirname, dbPath, file)));
    }
  }
})

const objOrdered = {};
Object.keys(obj).sort().forEach((key) =>
    objOrdered[key] = obj[key]
);

const router = jsonServer.router(objOrdered);

server.use(jsonServer.defaults());
server.use(router);

server.listen(port, () => {
  console.log(`\n⛴    JSON Server is running at http://localhost:${port}`);
  endpoints.sort();
  for (let i = 0; i < endpoints.length; i++) {
    console.info(`🥁    Endpoint: http://localhost:${port}/${endpoints[i]}`);
  }
});
