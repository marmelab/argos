const getMongo = require('./getMongo');

const computeMeasureAverage = async measureName => {
    const db = await getMongo();

    const measureCollection = db.collection('measure');

    const [result] = await measureCollection
        .aggregate([
            { $match: { measureName } },
            {
                $group: {
                    _id: { measureName },
                    maxRun: { $max: '$run' },
                },
            },
        ])
        .toArray();

    return result ? result.maxRun : 0;
};

module.exports = computeMeasureAverage;
