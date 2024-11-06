const dbretriever = require('../dbretriever');

module.exports.get = (userId, leagueId) => {
    return dbretriever.fetchOneDocument('rosters', {userId: userId, leagueId: leagueId});
}

module.exports.populate = async (rosterDocument) => {
    let playerDocuments = [];

    for (let i = 0; i<rosterDocument.playerIds.length; i++) {
        playerDocuments.push(dbretriever.fetchDocumentById('players', rosterDocument.playerIds[i]));
    }

    rosterDocument.players = await Promise.all(playerDocuments);

    return rosterDocument;
}

module.exports.create = async (userId, leagueId, username) => {
    const initialTeamName = username + "'s Team";

    const rosterCreationResult = await dbretriever.insertOne('rosters', {
        userId,
        leagueId,
        teamName: initialTeamName, 
        playerIds: [],
        wins: 0,
        losses: 0
    });

    const rosterCreationSuccess = rosterCreationResult.acknowledged;

    return rosterCreationSuccess
}