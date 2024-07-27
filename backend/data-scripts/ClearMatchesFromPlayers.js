require('dotenv').config();

const {MongoClient} = require('mongodb');
const uri = 'mongodb+srv://' + 
process.env.DATABASE_USER +
':' +
process.env.DATABASE_PASSWORD +
process.env.MONGO_CONNECTION_STRING;

console.log(uri);

const client = new MongoClient(uri);
const database = client.db('cw-fantasy-volleyball');
const matchesCollection = database.collection('matches')
const playersCollection = database.collection('players');

const BATCH_SIZE = 10;

async function clearMatchesFromPlayers() {
    const result = await playersCollection.updateMany({matches: {$exists: true, $ne: []}}, {$set: {matches: []}})
    return result;
}

clearMatchesFromPlayers()
.then(result => {
    console.log("Updated " + result.modifiedCount + " records");
    process.exit(0);
})