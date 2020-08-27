const getMongo = require('./getMongo');

const getMeasureCollection = async () => {
    const mongo = await getMongo();

    return mongo.collection('measure');
};

const getMeasureForContainerAndMeasureNameAndRun = async (containerName, measureName, run) => {
    const collection = await getMeasureCollection();

    return collection
        .find({ containerName: containerName, measureName: measureName, run: parseInt(run, 10) })
        .sort({ time: 1 })
        .toArray();
};

module.exports = {
    getMeasureForContainerAndMeasureNameAndRun,
};
