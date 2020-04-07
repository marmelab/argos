const express = require('express');
const getMongoClient = require('./getMongoClient');

const server = express();

server.get('/containers', async (req, res, next) => {
    const mongoClient = await getMongoClient();
    const db = mongoClient.db('db');
    const collection = db.collection('measure');
    const containers = await collection.distinct('containerName');
    res.send(containers);
    res.status = 200;
});

server.listen(3003);
