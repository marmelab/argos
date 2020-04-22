const path = require('path');
const fs = require('fs');
const _ = require('lodash');
const jsonServer = require('json-server');

const server = jsonServer.create();
const port = 3002;

const dbPath = './db/';

let files = fs.readdirSync(path.resolve(__dirname, dbPath)).filter(name => name.match(/.json$/));

console.log('\n');

const obj = files.reduce((acc, fileName) => {
    jsonObject = fs.readFileSync(dbPath + fileName);
    const key = fileName.replace('.json', '');

    return { ...acc, [key]: JSON.parse(`[${jsonObject}]`) };
}, {});

obj.containers = JSON.parse(fs.readFileSync(dbPath + 'containers.json'));

const endpoints = Object.keys(obj);

const router = jsonServer.router(obj);

server.use(jsonServer.defaults());
server.use(router);

server.listen(port, () => {
    console.log(`\n⛴    JSON Server is running at http://localhost:${port}`);
    endpoints.sort();
    for (let i = 0; i < endpoints.length; i++) {
        console.info(`🥁    Endpoint: http://localhost:${port}/${endpoints[i]}`);
    }
});
