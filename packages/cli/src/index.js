const getContainerStats = require('./getContainerStats');
const onStartContainer = require('./onStartContainer');
const { promisify } = require('util');
const exec = promisify(require('child_process').exec);

const run = async () => {
    const measureName = process.env.NAME;
    const command = process.env.COMMAND;

    onStartContainer(getContainerStats(measureName));

    const { stdout, stderr } = await exec(command);

    if (stderr) {
        console.error(stderr);
    }

    console.log(`child process exited`);
};

run();
