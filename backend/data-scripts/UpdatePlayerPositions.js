require('dotenv').config();

const {MongoClient} = require('mongodb');
const readline = require('readline-sync');

const uri = 'mongodb+srv://' + 
process.env.DATABASE_USER +
':' +
process.env.DATABASE_PASSWORD +
process.env.MONGO_CONNECTION_STRING;

const client = new MongoClient(uri)
let database = client.db('cw-fantasy-volleyball');
let playersCollection = database.collection('players');

const BATCH_SIZE = 10;

//fetch a list of players with null positions for populating.
async function retrieveDocuments() {    
    let cursor = playersCollection.find({position: null});
    let retrievedDocs = [];
    while (await cursor.hasNext() && retrievedDocs.length < BATCH_SIZE) {
        let retrievedDoc = await cursor.next();
        retrievedDocs.push(retrievedDoc);
    }
    return retrievedDocs;
}

function logAllDocs(docs) {
    for (let i = 0; i<docs.length; i++) {
        console.log(docs[i]);
    }
}

function getPositionsFromStdin(playerDocs) {
    let playerNamesPositions = [];
    for (let i = 0; i<playerDocs.length; i++) {
        let inputPosition = readline.question('Enter position for ' + playerDocs[i].playerName + ': ');
        let playerPositionObject = {playerName: playerDocs[i].playerName, position: inputPosition};
        playerNamesPositions.push(playerPositionObject);
    }
    return playerNamesPositions;
}

async function uploadPlayerPositions(playerPositionDocs) {
    for (let i = 0; i<playerPositionDocs.length; i++) {
        let playerName = playerPositionDocs[i].playerName;
        let position = playerPositionDocs[i].position;

        let result = await playersCollection.updateOne({playerName: playerName}, {$set: {position: position}});
        console.log('Updated document for player ' + playerName);
    }
}

// rl.question(">>What is your name?\n>", answer => {
//     console.log("Hello " + answer);
//     rl.close;
// });

retrieveDocuments().then(playerDocs => {
    let playerPositionDocs = getPositionsFromStdin(playerDocs);
    uploadPlayerPositions(playerPositionDocs).then(() => {
        console.log('finished');
    });
});