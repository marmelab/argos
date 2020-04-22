const spawn = require('child_process').spawn;
const split2 = require('split2');
const stream = require('stream');

const parseStatsStreamTransform = require('./parseStatsStreamTransform');
const getMongo = require('./getMongo');

const getContainerStats = (measureName, run) => containerName => {
    const child = spawn('curl', [
        '-v',
        '--unix-socket',
        '/var/run/docker.sock',
        `http://localhost/containers/${containerName}/stats`,
    ]);
    child.stdout.setEncoding('utf-8');
    getMongo().then(db => {
        const collection = db.collection('measure');
        return new Promise((resolve, reject) => {
            var strm = new stream.Writable({ objectMode: true, highWaterMark: 16 });
            strm._write = function(obj, enc, cb) {
                collection.insertOne(JSON.parse(obj.toString()), cb);
            };

            strm.destroy = function() {
                this.emit('close');
            };

            child.stdout
                .on('error', reject)
                .pipe(split2())
                .on('error', reject)
                .pipe(parseStatsStreamTransform(containerName, measureName, run))
                .on('error', reject)
                .pipe(strm)
                .on('error', reject)
                .on('end', resolve);
        }).catch(error => {
            console.error(`An error occured while measuring ${containerName}`, error);
            child.stdin.pause();
            child.kill();
        });
    });

    return () => {
        child.stdout.pause();
        child.stdin.destroy();
        child.kill();
    };
};

module.exports = getContainerStats;
