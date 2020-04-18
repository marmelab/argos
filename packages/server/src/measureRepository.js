const getMongo = require('./getMongo');

const getMeasureCollection = async () => {
    const mongo = await getMongo();

    return mongo.collection('measure');
};

const getContainers = async () => {
    const collection = await getMeasureCollection();

    return collection.distinct('containerName');
};

const getMeasureForContainer = async containerName => {
    const collection = await getMeasureCollection();

    return collection
        .aggregate([
            { $match: { containerName } },
            {
                $project: {
                    measureName: 1,
                    time: { $round: [{ $divide: ['$time', 1000] }] },
                    networkReceived: '$network.currentReceived',
                    networkTransmitted: '$network.currentTransmitted',
                    cpuPercentage: '$cpu.cpuPercentage',
                    memoryUsage: '$memory.usage',
                },
            },
            {
                $group: {
                    _id: '$time',
                    measures: {
                        $push: {
                            k: '$measureName',
                            v: {
                                networkReceived: '$networkReceived',
                                networkTransmitted: '$networkTransmitted',
                                cpuPercentage: '$cpuPercentage',
                                memoryUsage: '$memoryUsage',
                            },
                        },
                    },
                },
            },
            { $sort: { _id: 1 } },
            { $project: { time: '$_id', measures: { $arrayToObject: '$measures' } } },
        ])
        .toArray();
};

module.exports = {
    getContainers,
    getMeasureForContainer,
};
