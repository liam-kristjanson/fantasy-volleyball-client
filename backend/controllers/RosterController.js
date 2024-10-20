require('dotenv').config();
const dbretriever = require('../dbretriever');
const fantasyUtilities = require("../FantasyUtilities")
const Roster = require("../models/Roster");
const Settings = require("../models/Settings");

module.exports.getRoster = async (req, res) => {

    try {
        if (!req.query.userId || !req.query.leagueId) {
            return res.status(400).json({error: "userId and leagueId must be specified in querystring"})
        }

        const rosterDocument = await Roster.get(req.query.userId, req.query.leagueId);
        
        if (!rosterDocument?.playerIds) return res.status(400).json({error: "No roster found for the given userId and leagueId"});

        const populatedRoster = await Roster.populate(rosterDocument);

        return res.status(200).json(populatedRoster);
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

module.exports.getFreeAgents = async (req, res) => {
    if (!req.query.leagueId) {
        return res.status(400).json({error: "leagueId must be specified in querystring"});
    }

    const freeAgentDocuments = await fantasyUtilities.getFreeAgents(req.query.leagueId);

    return res.status(200).json(freeAgentDocuments);
}

module.exports.signFreeAgent = async (req, res) => {

    if (!req.authData?.leagueId || !req.authData?.userId) {
        return res.status(401).json({error: "Unauthorized"});
    }

    if (!req.query.playerId) {
        return res.status(400).json({error: "playerId must be specified in querystring"});
    }

    const settings = await Settings.get();
    if (settings.lineupsLocked) {
        return res.status(403).json({error: "Free agent signing not allowed while lineups are locked."});
    }

    //if the player is not available, reject the request as forbidden
    if (!await fantasyUtilities.isFreeAgent(req.query.playerId, req.authData.leagueId)) {
        return res.status(403).json({error: "Requested player is not a free agent."});
    }

    //if we successfully validate that the player is available, add him to the roster.
    const currentRoster = await dbretriever.fetchOneDocument('rosters', {leagueId: req.authData.leagueId, userId: req.authData.userId});

    if (!Array.isArray(currentRoster.playerIds)) {
        return res.status(404).json({error: "Unable to fetch your current roster."});
    }

    //update the fetched roster, pushing the requested player id to the array of playerIds.
    currentRoster.playerIds.push(req.query.playerId);

    //write the updated roster to the database
    await dbretriever.updateOne('rosters', {userId: req.authData.userId, leagueId: req.authData.leagueId}, {$set: {playerIds: currentRoster.playerIds}});

    return res.status(200).json({message: "Free agent signed successfuly"});
}

module.exports.dropPlayer = async (req, res) => {
    if (!req.authData?.userId || !req.authData?.leagueId) {
        return (res.status(401).json({error: "Unauthorized"}));
    }

    if (!req.query.playerId) {
        return (res.status(400).json({error: "playerId must be specified in querystring"}));
    }

    const settings = await Settings.get();
    if (settings.lineupsLocked) {
        return (res.status(403).json({error: "Dropping player not allowed while lineups are locked"}));
    }

    //validate that the player exists on the user's current roster.
    if (!await fantasyUtilities.isPlayerRostered(req.query.playerId, req.authData.userId, req.authData.leagueId)) {
        return (res.status(403).json({error: "Player does not exist on your current roster"}));
    }

    //validate that the player is not in the user's current lineup
    if (await fantasyUtilities.isPlayerInCurrentLineup(req.query.playerId, req.authData.userId, req.authData.leagueId)) {
        return (res.status(403).json({error: "Player cannot be dropped while in your current lineup. Remove them from your lienup before dropping them."}))
    }

    //pull (remove) the requested player id from the user's roster
    await dbretriever.updateOne('rosters', {userId: req.authData.userId, leagueId: req.authData.leagueId}, {$pull: {playerIds: req.query.playerId}})

    return (res.status(200).json({message: "Player dropped successfuly"}));
}