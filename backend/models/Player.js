const dbretriever = require('../dbretriever');
const {ObjectId} = require('mongodb');

let pendingCreations = {}

module.exports.get = async (playerId) => {
    return dbretriever.fetchDocumentById('players', playerId);
}

module.exports.update = async (playerId, updateObj) => {
    //only allow specified fields to be set by the updateObj
    const filteredUpdateObj = {
        playerName: updateObj.playerName,
        team: updateObj.team,
        position: updateObj.position,
        isActive: updateObj.isActive
    }

    const playerUpdateResult = await dbretriever.updateOne('players', {_id: new ObjectId(playerId)}, {$set: filteredUpdateObj});

    return playerUpdateResult.matchedCount === 1;
}

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