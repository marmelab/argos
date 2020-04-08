const getMongo = require('./getMongo');

const getMeasureCollection = async () => {
    const mongo = await getMongo();

    return mongo.collection('measure');
};

const getContainers = async () => {
    const collection = await getMeasureCollection();

    return collection.distinct('containerName');
};

module.exports = {
    getContainers,
};
