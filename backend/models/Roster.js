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