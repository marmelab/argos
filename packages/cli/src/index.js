const getContainerStats = require('./getContainerStats');
const onStartContainer = require('./onStartContainer');
const exec = require('./exec');
const computeMeasureAverage = require('./computeMeasureAverage');

const run = async () => {
    const measureName = process.env.NAME;
    const command = process.env.COMMAND;
    const runQuantity = process.env.RUN_QUANTITY;

    for (var i = 1; i <= runQuantity; i++) {
        console.info(`run ${i}:`);
        const stopListening = onStartContainer(getContainerStats(measureName, i));
        await exec(command).catch(console.warn);
        stopListening();
    }

    await computeMeasureAverage(measureName);

    console.log(`DONE`);
};

run().catch(console.error);
