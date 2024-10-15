const dbretriever = require('../dbretriever');
const {ObjectId} = require('mongodb');

let pendingCreations = {}

module.exports.resetAllPointsTotals = async () => {
    const result = await dbretriever.updateMany('players', {}, {$set: {seasonTotalPoints: 0}});

    return result.acknowledged;
}

module.exports.create = async (playerName) => {
    if (!pendingCreations[playerName]) {
        pendingCreations[playerName] = dbretriever.insertOne('players', {
            _id: new ObjectId(),
            playerName,
            prevSeasonPoints: 0,
            matches: [],
            position: "Unknown",
            seasonTotalPoints: 0
        })
    } else {
        console.log("Creation already pending for " + playerName);
    }

    return pendingCreations[playerName];
}