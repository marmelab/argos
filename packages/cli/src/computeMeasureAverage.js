const getMongo = require('./getMongo');

const computeMeasureAverage = async measureName => {
    const db = await getMongo();

    const measureCollection = db.collection('measure');

    const reportCollection = db.collection('report');

    const temp = await measureCollection
        .aggregate([
            { $match: { measureName } },
            {
                $lookup: {
                    from: 'measure',
                    localField: 'time',
                    foreignField: 'time',
                    /*let: { containerName2: '$containerName', measureName2: '$measureName', run2: '$run' },
                    pipeline: [
                        { $match: { containerName: '$$containerName2', measureName: '$$measureName2', run: '$$run2' } },
                        { $project: { _id: 0, initialTime: '$time' } },
                    ],*/
                    as: 'initialTime',
                },
            },
        ])
        .toArray();

    console.log('temp', temp);

    /* const temp2 = await measureCollection
        .aggregate([
            { $match: { measureName } },
            {
                $lookup: {
                    from: 'measure',
                    localField: 'run',
                    foreignField: 'run',
                    let: { containerName2: '$containerName', measureName2: '$measureName', run2: '$run' },
                    pipeline: [
                        { $match: { containerName: '$$containerName2', measureName: '$$measureName2', run: '$$run2' } },
                        { $project: { _id: 0, initialTime: '$time' } },
                    ],
                    as: 'initialTime',
                },
            },
        ])
        .toArray();

    console.log('temp', temp2); */

    const averageMeasures = await measureCollection
        .aggregate([
            { $match: { measureName } },
            {
                $lookup: {
                    from: 'measure',
                    pipeline: [
                        { $match: { containerName: '$containerName', measureName: '$measureName', run: '$run' } },
                        { $project: { _id: 0, initialTime: '$time' } },
                    ],
                    as: 'initialTime',
                },
            },
            {
                $project: {
                    measureName: 1,
                    run: 1,
                    containerName: 1,
                    time: { $subtract: ['$time', 2] },
                    initialTime: '$initialTime',
                    cpu: 1,
                    memory: 1,
                    network: 1,
                },
            },
            {
                $group: {
                    _id: { containerName: '$containerName', time: '$time', initialTime: '$initialTime' },
                    measureName: { $first: '$measureName' },

                    avgCpuPercentage: { $avg: '$cpu.cpuPercentage' },
                    minCpuPercentage: { $min: '$cpu.cpuPercentage' },
                    maxCpuPercentage: { $max: '$cpu.cpuPercentage' },

                    avgMemoryUsage: { $avg: '$memory.usage' },
                    minMemoryUsage: { $min: '$memory.usage' },
                    maxMemoryUsage: { $max: '$memory.usage' },

                    avgNetworkCurrentReceived: { $avg: '$network.currentReceived' },
                    minNetworkCurrentReceived: { $min: '$network.currentReceived' },
                    maxNetworkCurrentReceived: { $max: '$network.currentReceived' },

                    avgNetworkCurrentTransmitted: { $avg: '$network.currentTransmitted' },
                    minNetworkCurrentTransmitted: { $min: '$network.currentTransmitted' },
                    maxNetworkCurrentTransmitted: { $max: '$network.currentTransmitted' },
                },
            },
            {
                $project: {
                    _id: 0,
                    measureName: 1,
                    containerName: '$_id.containerName',
                    time: '$_id.time',
                    initialTime: '$_id.initialTime',
                    cpuPercentage: '$avgCpuPercentage',
                    cpuPercentageArea: ['$minCpuPercentage', '$maxCpuPercentage'],
                    memoryUsage: '$avgMemoryUsage',
                    memoryUsageArea: ['$minMemoryUsage', '$maxMemoryUsage'],
                    networkReceived: '$avgNetworkCurrentReceived',
                    networkReceivedArea: ['$minNetworkCurrentReceived', '$maxNetworkCurrentReceived'],
                    networkTransmitted: '$avgNetworkCurrentTransmitted',
                    networkTransmittedArea: ['$minNetworkCurrentTransmitted', '$maxNetworkCurrentTransmitted'],
                },
            },
        ])
        .toArray();

    //console.log('averageMeasures', averageMeasures);

    await reportCollection.insertMany(averageMeasures);
};

module.exports = computeMeasureAverage;
