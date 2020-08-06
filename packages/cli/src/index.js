const getContainerStats = require('./getContainerStats');
const onStartContainer = require('./onStartContainer');
const exec = require('./exec');
const computeMeasureAverage = require('./computeMeasureAverage');
const getLastRun = require('./getLastRun');

const run = async () => {
    const measureName = process.env.NAME;
    const setupCommand = process.env.SETUP_COMMAND;
    const command = process.env.COMMAND;
    const runQuantity = parseInt(process.env.RUN_QUANTITY || 5, 10);
    const otherContainers = process.env.OTHER_CONTAINERS ? process.env.OTHER_CONTAINERS.split(',') : [];

    const lastRun = await getLastRun(measureName);

    if (lastRun) {
        console.log(`${lastRun} previous runs detected for measure ${measureName}, adding run to the existing ones.`);
    }

    if (setupCommand) {
        await exec(setupCommand).catch(console.warn);
    }

    for (var i = lastRun + 1; i <= lastRun + runQuantity; i++) {
        console.info(`run ${i}:`);

        const measuresStoppers = otherContainers.map(getContainerStats(measureName, i));
        const stopListening = onStartContainer(otherContainers, getContainerStats(measureName, i));
        await exec(command).catch(console.warn);
        stopListening();
        measuresStoppers.map(stop => stop());
    }

    await computeMeasureAverage(measureName);

    console.log(`DONE for ${measureName}`);
    process.exit(0);
};

run().catch(console.error);
