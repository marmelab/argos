const getMongo = require('./getMongo');

const computeMeasureAverage = async measureName => {
    const db = await getMongo();

    const collection = db.collection('measure');

    await collection
        .aggregate([
            { $match: { measureName } },
            {
                $project: {
                    measureName: 1,
                    run: 1,
                    containerName: 1,
                    date: 1,
                    time: { $round: [{ $divide: ['$time', 1000] }] },
                    cpu: 1,
                    memory: 1,
                    network: 1,
                },
            },
            {
                $group: {
                    _id: { containerName: '$containerName', time: '$time' },
                    measureName: { $first: '$measureName' },
                    cpuAvailableCpu: { $avg: '$cpu.availableCpu' },
                    cpuUsage: { $avg: '$cpu.cpuUsage' },
                    cpuPercentage: { $avg: '$cpu.cpuPercentage' },
                    memoryUsage: { $avg: '$memory.usage' },
                    memoryMaxUsage: { $avg: '$memory.maxUsage' },
                    memoryLimit: { $avg: '$memory.limit' },
                    networkTotalReceived: { $avg: '$network.totalReceived' },
                    networkCurrentReceived: { $avg: '$network.currentReceived' },
                    networkTotalTransmitted: { $avg: '$network.totalTransmitted' },
                    networkCurrentTransmitted: { $avg: '$network.currentTransmitted' },
                },
            },
            {
                $project: {
                    _id: 0,
                    measureName: 1,
                    run: 'average',
                    containerName: '$_id.containerName',
                    time: '$_id.time',
                    cpu: {
                        availableCpu: '$cpuAvailableCpu',
                        cpuUsage: '$cpuUsage',
                        cpuPercentage: '$cpuPercentage',
                    },
                    memory: {
                        usage: '$memoryUsage',
                        maxUsage: '$memoryMaxUsage',
                        limit: '$memoryLimit',
                    },
                    network: {
                        totalReceived: '$networkTotalReceived',
                        currentReceived: '$networkCurrentReceived',
                        totalTransmitted: '$networkTotalTransmitted',
                        currentTransmitted: '$networkCurrentTransmitted',
                    },
                },
            },
            { $merge: 'measure' },
        ])
        .toArray();
};

module.exports = computeMeasureAverage;
