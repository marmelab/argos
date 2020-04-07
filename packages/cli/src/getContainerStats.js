const spawn = require('child_process').spawn;
const split2 = require('split2');
const stream = require('stream');

const parseStatsStreamTransform = require('./parseStatsStreamTransform');
const getMongoClient = require('./getMongoClient');

const getContainerStats = measureName => async containerName => {
    const input = spawn('curl', [
        '-v',
        '--unix-socket',
        '/var/run/docker.sock',
        `http://localhost/containers/${containerName}/stats`,
    ]);
    input.stdout.setEncoding('utf-8');
    const mongoClient = await getMongoClient();

    const db = mongoClient.db('db');
    const collection = db.collection('measure');
    return new Promise((resolve, reject) => {
        var strm = new stream.Writable({ objectMode: true, highWaterMark: 16 });
        strm._write = function(obj, enc, cb) {
            collection.insertOne(JSON.parse(obj.toString()), cb);
        };

        strm.destroy = function() {
            this.emit('close');
            mongoClient.close();
        };

        input.stdout
            .on('error', reject)
            .pipe(split2())
            .on('error', reject)
            .pipe(parseStatsStreamTransform(containerName, measureName))
            .on('error', reject)
            .pipe(strm)
            .on('error', reject)
            .on('end', resolve);
    }).catch(error => {
        console.error(`An error occured while measuring ${containerName}`, error);
        mongoClient.close();
    });
};

module.exports = getContainerStats;
