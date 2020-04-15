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
        .find({ containerName })
        .sort({ time: 1 })
        .toArray();
};

module.exports = {
    getContainers,
    getMeasureForContainer,
};