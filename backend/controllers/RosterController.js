require('dotenv').config();
const dbretriever = require('../dbretriever');

module.exports.getRoster = async (req, res) => {

    try {
        if (!req.query.userId || !req.query.leagueId) {
            return res.status(400).json({error: "userId and leagueId must be specified in querystring"})
        }

        const rosterDocument = await dbretriever.fetchOneDocument('rosters', {leagueId: req.query.leagueId, userId: req.query.userId})
        
        if (!rosterDocument.playerIds) return res.status(400).json({error: "No roster found for the given userId and leagueId"});

        //fetch player documents for each playerId in the roster document
        let playerDocuments = []

        for (let i = 0; i<rosterDocument.playerIds.length; i++) {
            playerDocuments.push(dbretriever.fetchDocumentById('players', rosterDocument.playerIds[i]));
        }

        //add retrieved player information to the roster document and send it to the client
        rosterDocument.players = await Promise.all(playerDocuments);

        return res.status(200).json(rosterDocument);
    } catch (e) {
        console.error(e);
        return res.status(500).json({error: "Internal server error"});
    }
    
}

module.exports.getTeams = async (req, res) => {

    if (!req.query.leagueId) {
        return res.status(400).json({error: 'leagueId must be specified in querystring'})
    }

    const rosters = await dbretriever.fetchDocuments('rosters', {leagueId: req.query.leagueId});

    return res.status(200).json(rosters);
}