require('dotenv').config();
const { ObjectId } = require('mongodb');
const dbretriever = require('../dbretriever')
const fantasyUtilities = require('../FantasyUtilities')

module.exports.getLineup = async (req, res) => {

    //TODO: make the database fetch into a standalone function so that the code can be reused.

    try {
        if (!req.query.userId || !req.query.leagueId) {
            return res.status(400).json({error: "userId and leagueId must be specified in querystring"});
        }

        const lineupDocument = await dbretriever.fetchOrdered('lineups', {userId: req.query.userId, leagueId: req.query.leagueId}, {weekNum: -1}, 1);

        if (!lineupDocument) {
            return  res.status(404).json({error: "No lineup found for the given userId and leagueId"})
        }

        //fetch the rest of the player details
        const lineup = {}
        const playerPromises = []
        for (let position in lineupDocument.lineupIds) {
            console.log("Searching for player in position " + position + "...");
            let playerPromise = dbretriever.fetchOneDocument('players', {_id: new ObjectId(lineupDocument.lineupIds[position])})
            playerPromises.push(playerPromise);
            playerPromise.then(retrievedPlayer => {
                console.log("Found player for position " + position + " with name: " + retrievedPlayer.playerName)
                lineup[position] = retrievedPlayer
            })
        }

        //wait for all lineup promises to resolve
        await Promise.all(playerPromises);

        lineupDocument.lineup = lineup;

        return res.status(200).json(lineupDocument);
    }
    catch (e) {
        console.error(e);
        return res.status(500).json({error: "500: Internal server error"});
    }
}

module.exports.getLineupScore = async (req, res) => {
    try {
        if (!req.query.userId || !req.query.leagueId || !req.query.weekNum) {
            return res.status(400).json({error: "userId, leagueId, and weekNum must be specified in querystring"})
        }

        const lineupDocument = await dbretriever.fetchOneDocument('lineups', {
            userId: req.query.userId,
            leagueId: req.query.leagueId,
            weekNum: req.query.weekNum
        });

        if (!lineupDocument) {
            return res.status(400).json({error: "No lineup found for the specified userId, leagueId, and weekNum"})
        }

        let promisedPlayerDocuments = [];

        for (let position in lineupDocument.lineupIds) {
            promisedPlayerDocuments.push(dbretriever.fetchDocumentById('players', lineupDocument.lineupIds[position]));
        }

        weekMatchDocuments = await dbretriever.fetchDocuments('matches', {weekNum: parseInt(req.query.weekNum)});
        playerDocuments = await Promise.all(promisedPlayerDocuments);

        const playerMatchStats = getPlayerStatsFromMatches(playerDocuments, weekMatchDocuments);

        return res.status(200).json(playerMatchStats);
    } catch (e) {
        console.error(e);
        return res.status(500).json({error: "500: Internal server error"});
    }
}

function getPlayerStatsFromMatches(players, matches) {
    for (let playerIdx = 0; playerIdx<players.length; playerIdx++) {
        const playerName = players[playerIdx].playerName;
        players[playerIdx].points = 0;
        players[playerIdx].matchesPlayed = 0;

        for (let matchIdx = 0; matchIdx<matches.length; matchIdx++) {
            if (matches[matchIdx].stats[playerName]) {
                players[playerIdx].points += fantasyUtilities.calculateFantasyPoints(matches[matchIdx].stats[playerName]);
                players[playerIdx].matchesPlayed++;
            }
        }
    }

    return players;
}