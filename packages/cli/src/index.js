const fs = require('fs');
const getContainerStats = require('./getContainerStats');
const onStartContainer = require('./onStartContainer');

const run = async () => {
    const measureName = process.env.NAME;
    onStartContainer(getContainerStats(measureName));
};

run();
