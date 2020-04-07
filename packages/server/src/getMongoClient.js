const MongoClient = require('mongodb').MongoClient;

const mongoHost = process.env.MONGO_HOST;
const mongoPort = process.env.MONGO_PORT;
const mongoUser = process.env.MONGO_USER;
const mongoPassword = process.env.MONGO_PASSWORD;

const defaultUrl = `mongodb://${mongoUser}:${mongoPassword}@${mongoHost}:${mongoPort}`;

const getMongoClient = async (mongoUrl = defaultUrl) => {
    const client = new MongoClient(mongoUrl, { useUnifiedTopology: true });
    return new Promise((resolve, reject) => {
        client.connect(function(err) {
            if (err) {
                reject(err);
                return;
            }
            resolve(client);
        });
    });
};

module.exports = getMongoClient;
