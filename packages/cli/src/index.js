const fs = require('fs');
const listAllContainers = require('./listAllContainers');
const getContainerStats = require('./getContainerStats');

const run = async () => {
    const measureName = process.env.NAME;
    const containers = await listAllContainers();

    fs.writeFileSync('./db/containers.json', `{"containers":${JSON.stringify(containers)}}`);

    await Promise.all(containers.map(getContainerStats(measureName)));
};

run();
