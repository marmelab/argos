const spawn = require('child_process').spawn;
const split2 = require('split2');

const onStartContainer = eventListener => {
    input = spawn('curl', [
        '-v',
        '--unix-socket',
        '/var/run/docker.sock',
        `http://localhost/events?filters=${encodeURIComponent(JSON.stringify({ event: ['start'] }))}`,
    ]);

    input.stdout.setEncoding('utf-8');

    input.stdout.pipe(split2()).on('data', data => {
        const event = JSON.parse(data);
        const containerName = event.Actor.Attributes.name;
        console.log(`Container ${containerName} started`);
        eventListener(containerName);
    });
};

module.exports = onStartContainer;
