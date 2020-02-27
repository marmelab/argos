const listAllContainers = require("./listAllContainers");
const getContainerStats = require("./getContainerStats");

const run = async () => {
    const containers = await listAllContainers();

    await Promise.all(containers.map(getContainerStats));
};

run();
