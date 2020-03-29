const spawn = require('child_process').spawn;
const fs = require('fs');
const split2 = require('split2');

const parseStatsStreamTransform = require('./parseStatsStreamTransform');
const toJSONStreamTransform = require('./toJSONStreamTransform');

const getContainerStats = measureName => async containerName => {
    const input = spawn('curl', [
        '-v',
        '--unix-socket',
        '/var/run/docker.sock',
        `http://localhost/containers/${containerName}/stats`,
    ]);
    input.stdout.setEncoding('utf-8');
    return new Promise((resolve, reject) => {
        const fileStream = fs.createWriteStream(`./db/${containerName}.json`);

        process.on('SIGINT', () => fileStream.write(']}'));

        input.stdout
            .on('error', reject)
            .pipe(split2())
            .on('error', reject)
            .pipe(parseStatsStreamTransform(containerName, measureName))
            .on('error', reject)
            .pipe(toJSONStreamTransform(containerName))
            .on('error', reject)
            .pipe(fileStream)
            .on('error', reject)
            .on('end', resolve);
    });
};

module.exports = getContainerStats;
