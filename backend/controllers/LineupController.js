require('dotenv').config();
const { ObjectId } = require('mongodb');
const dbretriever = require('../dbretriever');
const fantasyUtilities = require('../FantasyUtilities');
const settingsController = require('./SettingsController');
const Lineup = require('../models/Lineup');
const Settings = require('../models/Settings')

module.exports.getLineup = async (req, res) => {

    //TODO: make the database fetch into a standalone function in FantasyUtilities so that the code can be reused.

    try {
        if (!req.query.userId || !req.query.leagueId) {
            return res.status(400).json({error: "userId and leagueId must be specified in querystring"});
        }

        let weekNum = req.query.weekNum

        if (!weekNum) {
            const APP_SETTINGS = await dbretriever.fetchOneDocument('app_settings');
            weekNum = APP_SETTINGS.currentWeekNum;
        }

        const lineupDocument = await dbretriever.fetchOneDocument('lineups', {userId: req.query.userId, leagueId: req.query.leagueId, weekNum: weekNum});

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
            req.query.weekNum = await Settings.get().currentWeekNum ?? 1;
        }

        if (!req.query.userId || !req.query.leagueId) {
            return res.status(400).json({error: "userId and leagueId must be specified in querystring"})
        }

        if (isNaN(parseInt(req.query.weekNum))) return res.status(400).json({error: "WeekNum must be an integer"});

        let lineupDocument = await Lineup.get(req.query.leagueId, req.query.userId, req.query.weekNum);

        if (!lineupDocument) {
            return res.status(400).json({error: "No lineup found for the specified userId, leagueId, and weekNum"})
        }

        //populate the lineup and calculate each player's score
        lineupDocument = await Lineup.populate(lineupDocument);
        lineupDocument = await Lineup.calculateScore(lineupDocument);

        return res.status(200).json(lineupDocument);
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

module.exports.lineupSwap = async (req, res, next) => {

    try {
        //input and authentication validation
        if (!req.authData?.userId || !req.authData?.leagueId) {
            return res.status(401).json({error: "Unauthorized"});
        }

        if (!req.query.playerId || !req.query.lineupSlot) {
            return res.status(400).json({error: "playerId and lineupSlot must be specified in querystring"});
        }

        //validate position
        if (!["S", "OH1", "OH2", "OH3", "M1", "M2", "L"].includes(req.query.lineupSlot)) {
            return (res.status(400).json({error: "Invalid lineup slot requested"}));
        }

        //validate requested player id
        if (!ObjectId.isValid(req.query.playerId)) {
            return (res.status(400).json({error: "Invalid player id"}))
        }

        //fetch player document for further validation
        const playerDocument = await dbretriever.fetchOneDocument('players', {_id: new ObjectId(req.query.playerId)});

        //validate that requested player exists
        if (!playerDocument) {
            return res.status(404).json({error: "No player found with the requested id"});
        }

        //validate that the user has the requested player on their roster
        if (!await fantasyUtilities.isPlayerRostered(req.query.playerId, req.authData.userId, req.authData.leagueId)) {
            console.log('player is not rostered')
            return res.status(403).json({error: "The requested player is not currently on your roster"});
        }

        if (await fantasyUtilities.isPlayerInCurrentLineup(req.query.playerId, req.authData.userId, req.authData.leagueId)) {
            return res.status(403).json({error: "The requested player is already active in your lineup"});
        }


        if (!fantasyUtilities.isValidPosition(req.query.lineupSlot, playerDocument.position)) {
            return res.status(403).json({error: "The player does not play the correct position to be assigned to the requested lineup slot."})
        }

        const appSettings = await dbretriever.fetchOneDocument('app_settings', {});

        //update the lineup for the current week using computed property name
        const lineupSlotFieldName = "lineupIds." + req.query.lineupSlot;
        await dbretriever.updateOne('lineups', {userId: req.authData.userId, leagueId: req.authData.leagueId, weekNum: appSettings.currentWeekNum}, {$set: {[lineupSlotFieldName] : req.query.playerId}});

        return (res.status(200).json({message: "Lineup has been changed successfully"}));

    } catch (e) {
        next(e);
    }
}

module.exports.getBench = async (req, res, next) => {
    if (!req.query.userId || !req.query.leagueId) {
        return res.status(400).json({error: "userId and leagueId must be specified in querystring"});
    }

    const currentBench = await fantasyUtilities.getBench(req.query.userId, req.query.leagueId);

    return res.status(200).json(currentBench);
}