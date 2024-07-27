require('dotenv').config();

const {MongoClient, ObjectId} = require('mongodb');
const uri = 'mongodb+srv://' + 
process.env.DATABASE_USER +
':' +
process.env.DATABASE_PASSWORD +
process.env.MONGO_CONNECTION_STRING;

console.log("Connecting with uri " + uri);

const client = new MongoClient(uri);
const database = client.db('cw-fantasy-volleyball');
const matchesCollection = database.collection('matches')
const playersCollection = database.collection('players');

const BATCH_SIZE = 40;
let matchRecordsUpdated = 0;
let playerMatchesAdded = 0;

function addPlayerGames(retrievedMatches) {
    const allPromises = []
    
    console.log("Retrieving matches...");
    

    console.log("Retrieved " + retrievedMatches.length + " matches");

    for (let i = 0; i<retrievedMatches.length; i++) {
        for (let playerName in retrievedMatches[i].stats) {
            //console.log("Attempting to update record for " + playerName);
            const playersCollectionUpdatePromise = playersCollection.updateOne({playerName: playerName}, {$push: {matches: retrievedMatches[i]._id}})
            allPromises.push(playersCollectionUpdatePromise);
            playersCollectionUpdatePromise.then(() => {
                console.log("Added match " + retrievedMatches[i].gameTitle + " to " + playerName);
                playerMatchesAdded++;
            })
        }

        const matchesCollectionUpdatePromise = matchesCollection.updateOne({_id: new ObjectId(retrievedMatches[i]._id)}, {$set: {playersLinked: true}})
        allPromises.push(matchesCollectionUpdatePromise);
        matchesCollectionUpdatePromise.then((result) => {
            console.log("Set playersLinked to true for match " + retrievedMatches[i].gameTitle);
            matchRecordsUpdated++;
        }) 
    }

    return allPromises;
}

async function retrieveMatchesWithoutLinkedPlayers() {
    const matchesCursor = matchesCollection.find({playersLinked: null});
    const retrievedMatches = []

    while (await matchesCursor.hasNext() && retrievedMatches.length < BATCH_SIZE) {
        retrievedMatches.push(await matchesCursor.next())
    }

    return retrievedMatches
}

retrieveMatchesWithoutLinkedPlayers()
.then(matches => {
    return Promise.all(addPlayerGames(matches))
})
.then(() => {
    console.log("Finished updating references for " + matchRecordsUpdated + " matches. Added " + playerMatchesAdded + " PlayerMatches.")
    process.exit(0);
})