const getMongo = require('./getMongo');

const getReportCollection = async () => {
    const mongo = await getMongo();

    return mongo.collection('report');
};

const getContainers = async () => {
    const collection = await getReportCollection();

    return collection.distinct('containerName');
};

const getReportForContainer = async containerName => {
    const collection = await getReportCollection();

    return collection
        .aggregate([
            { $match: { containerName } },
            {
                $group: {
                    _id: '$time',
                    measures: {
                        $push: {
                            k: '$measureName',
                            v: {
                                networkReceived: '$networkReceived',
                                networkReceivedArea: '$networkReceivedArea',
                                networkTransmitted: '$networkTransmitted',
                                networkTransmittedArea: '$networkTransmittedArea',
                                cpuPercentage: '$cpuPercentage',
                                cpuPercentageArea: '$cpuPercentageArea',
                                memoryUsage: '$memoryUsage',
                                memoryUsageArea: '$memoryUsageArea',
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
    getReportForContainer,
};
