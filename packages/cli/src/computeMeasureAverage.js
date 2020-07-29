const getMongo = require('./getMongo');

const computeMeasureAverage = async measureName => {
    const db = await getMongo();

    const measureCollection = db.collection('measure');

    const reportCollection = db.collection('report');

    const averageMeasures = await measureCollection
        .aggregate([
            { $match: { measureName } },
            {
                $project: {
                    measureName: 1,
                    run: 1,
                    containerName: 1,
                    time: 1,
                    cpu: 1,
                    memory: 1,
                    network: 1,
                },
            },
            {
                $group: {
                    _id: { containerName: '$containerName', run: '$run' },
                    measureName: { $first: '$measureName' },
                    run: { $first: '$run' },
                    initialTime: { $min: '$time' },
                    data: {
                        $push: {
                            cpu: '$cpu',
                            memory: '$memory',
                            network: '$network',
                            time: '$time',
                        },
                    },
                },
            },
            {
                $unwind: '$data',
            },
            {
                $project: {
                    _id: 0,
                    measureName: 1,
                    containerName: '$_id.containerName',
                    run: '$_id.run',
                    time: { $subtract: ['$data.time', '$initialTime'] },
                    cpu: '$data.cpu',
                    memory: '$data.memory',
                    network: '$data.network',
                },
            },
            {
                $group: {
                    _id: { containerName: '$containerName', time: '$time' },
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

    await reportCollection.insertMany(averageMeasures);
};

module.exports = computeMeasureAverage;
