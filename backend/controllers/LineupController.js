require('dotenv').config();
const { ObjectId } = require('mongodb');
const dbretriever = require('../dbretriever');
const fantasyUtilities = require('../FantasyUtilities');

module.exports.getLineup = async (req, res) => {

    //TODO: make the database fetch into a standalone function in FantasyUtilities so that the code can be reused.

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
            //console.log("Searching for player in position " + position + "...");
            let playerPromise = dbretriever.fetchOneDocument('players', {_id: new ObjectId(lineupDocument.lineupIds[position])})
            playerPromises.push(playerPromise);
            playerPromise.then(retrievedPlayer => {
                //console.log("Found player for position " + position + " with name: " + retrievedPlayer.playerName)
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
        //if no weekNum is specified, try to find the lineup for the current week.
        if (!req.query.weekNum) {
            req.query.weekNum = await fantasyUtilities.getAppSettings().currentWeekNum ?? 1;
        }

        if (!req.query.userId || !req.query.leagueId) {
            return res.status(400).json({error: "userId and leagueId must be specified in querystring"})
        }

        if (isNaN(parseInt(req.query.weekNum))) return res.status(400).json({error: "WeekNum must be an integer"});

        const lineupDocument = await dbretriever.fetchOneDocument('lineups', {
            userId: req.query.userId,
            leagueId: req.query.leagueId,
            weekNum: parseInt(req.query.weekNum)
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

        const playerMatchStats = fantasyUtilities.getPlayerStatsFromMatches(playerDocuments, weekMatchDocuments);

        return res.status(200).json(playerMatchStats);
    } catch (e) {
        console.error(e);
        return res.status(500).json({error: "500: Internal server error"});
    }
}

module.exports.lineupWeeks = async (req, res) => {
    try {
        if (!req.query.leagueId || !req.query.userId) {
            return res.status(400).json({error: "leagueId and userId must be specified in querystring"})
        }

        const maxLineupWeek = await dbretriever.fetchOrdered('lineups', {leagueId: req.query.leagueId, userId: req.query.userId}, {weekNum: -1}, 1, {weekNum: 1});

        console.log("Max lineup week: ", maxLineupWeek);

        return res.status(200).json(maxLineupWeek)
    } catch (e) {
        console.error(e);

        return res.status(500).json({error: "500: Internal server error"})
    }
}