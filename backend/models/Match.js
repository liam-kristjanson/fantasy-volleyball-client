const dbretriever = require('../dbretriever');
const {ObjectId} = require('mongodb')

module.exports.unlinkAll = async () => {
    const result = await dbretriever.updateMany('players', {}, {$set: {matches: []}});

    return result.acknowledged;
}

module.exports.deleteAll = async () => {
    const result = await dbretriever.deleteMany('matches', {});

    return result;
}

module.exports.create = async (gameTitle, weekNum, season, stats) => {
    const matchDocument = {
        _id: new ObjectId(),
        gameTitle,
        weekNum: parseInt(weekNum),
        season,
        stats,
        playersLinked: false
    };

    const matchInsertResult = await dbretriever.insertOne('matches', matchDocument);

    if (!matchInsertResult.acknowledged) {
        throw new Error("Error inserting match document into database");
    }

    const playerLinkSuccess = await this.linkPlayers(matchDocument);

    if (!playerLinkSuccess) {
        throw new Error("Error linking players to new match");
    }

   return playerLinkSuccess; 
}

module.exports.linkPlayers = async (matchDocument) => {
    //console.log("Linking players with match document", matchDocument)
    let playerUpdatePromises = []

    for (let playerName in matchDocument.stats) {
        //console.log("Pushing player update promise for " + playerName)
        playerUpdatePromises.push(dbretriever.updateOne('players', {playerName}, {$push: {matches: matchDocument._id}}));
    }

    //console.log("Player update promises: ", playerUpdatePromises)

    const playerUpdateResults = await Promise.all(playerUpdatePromises);

    //console.log("Player update results: ", playerUpdateResults)

    let isSuccess = true;
    for (let playerUpdateResult of playerUpdateResults) {
        isSuccess = isSuccess && playerUpdateResult.acknowledged;
    }

    return isSuccess;
}