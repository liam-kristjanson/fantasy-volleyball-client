require('dotenv').config();

const {MongoClient} = require('mongodb');
const fs = require('fs');
const path = require('path');

const directoryPath = path.resolve('C:/Users/crazy/Documents/CWVB-Stats-2023-2024/Week14');
const weekNum = 14;
const season = "2023-2024";
const databaseName = 'cw-fantasy-volleyball'
const collectionName = 'matches';

const uri = 'mongodb+srv://' + process.env.DATABASE_USER + ':' + process.env.DATABASE_PASSWORD + process.env.MONGO_CONNECTION_STRING;
const client = new MongoClient(uri);

function gatherData(directory) {
    let gatheredDocs = [];

    let filenames = fs.readdirSync(directory);

    for (let i = 0; i<filenames.length; i++) {
        let rawFileData = fs.readFileSync(path.resolve(directoryPath, filenames[i]));
        let statsObj = JSON.parse(rawFileData);
        let gameObj = {};
        gameObj.gameTitle = filenames[i];
        gameObj.weekNum = weekNum;
        gameObj.stats = statsObj;
        gameObj.season = season;
        gatheredDocs.push(gameObj);
    }

    return gatheredDocs;
}

async function uploadData(data, collectionName) {
    try {
        const database = client.db(databaseName);
        const collection = database.collection(collectionName);

        const result = await collection.insertMany(data);
        
        console.log('Inserted ' + result.insertedCount + ' records');
    } finally {
        await client.close();
    }
}

let gatheredDocs = gatherData(directoryPath);
uploadData(gatheredDocs, collectionName).catch(console.dir);
