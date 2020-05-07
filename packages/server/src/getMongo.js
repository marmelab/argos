const MongoClient = require('mongodb').MongoClient;

const mongoHost = process.env.MONGO_HOST;
const mongoPort = process.env.MONGO_PORT;
const mongoUser = encodeURIComponent(process.env.MONGO_USER);
const mongoPassword = encodeURIComponent(process.env.MONGO_PASSWORD);

const defaultUrl = `mongodb://${mongoUser}:${mongoPassword}@${mongoHost}:${mongoPort}`;

let db;

const getMongo = async (mongoUrl = defaultUrl) => {
    if (db) {
        return db;
    }
    return new Promise((resolve, reject) => {
        const client = new MongoClient(mongoUrl, { useUnifiedTopology: true });
        client.connect((err) => {
            if (err) {
                reject(err);
                return;
            }
            process.on('SIGTERM', () => {
                client.close();
            });
            db = client.db('db');
            resolve(db);
        });
    });
};

module.exports = getMongo;
