const spawn = require('child_process').spawn;
const split2 = require('split2');

let listenedContainer = [];
let unlisteners = [];

const jsonParse = data => {
    try {
        // when stopping curl process we can end up with incomplete event
        return JSON.parse(data);
    } catch (error) {
        return null;
    }
};

const onStartContainer = (otherContainers, eventListener) => {
    listenedContainer = otherContainers;
    const child = spawn('curl', [
        '-v',
        '--unix-socket',
        '/var/run/docker.sock',
        `http://localhost/events?filters=${encodeURIComponent(
            JSON.stringify({
                type: ['container'],
                event: ['create', 'start'],
            }),
        )}`,
    ]);

    child.stdout.setEncoding('utf-8');

    child.stdout.on('error', console.error);

    child.stdout.pipe(split2()).on('data', data => {
        const event = jsonParse(data);
        if (!event) {
            return;
        }
        const containerName = event.Actor.Attributes.name;

        if (listenedContainer.includes(containerName)) {
            return;
        }

        listenedContainer.push(containerName);
        console.log(`Container ${containerName} started`);
        unlisteners.push(eventListener(containerName));
    });

    return () => {
        unlisteners.map(stop => stop());
        listenedContainer = [];
        unlisteners = [];
        child.stdout.pause();
        child.stdin.destroy();
        child.kill();
    };
};

module.exports = onStartContainer;
