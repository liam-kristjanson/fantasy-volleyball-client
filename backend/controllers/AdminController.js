const settingsController = require('./SettingsController')
const dbretriever = require('../dbretriever')
const Settings = require('../models/Settings')
const Lineup = require('../models/Lineup');
const Standings = require('../models/Standings');
const League = require('../models/League')
const Schedule = require('../models/Schedule')
const User = require("../models/User");
const Matchup = require('../models/Matchup')
const Match = require('../models/Match')
const Player = require('../models/Player');
const { ObjectId } = require('mongodb');
const bcrypt = require('bcrypt');

module.exports.createNextWeekLineups = async (req, res, next) => {
    try {
        await Lineup.createNextWeekLineups();
        return res.status(200).json({message: "Lineups for week " + (currentWeekNum + 1) + " created successfuly"});
    } catch (err) {
        next(err);
    }
}

module.exports.startNextWeek = async (req, res, next) => {
    try {
        console.log("Starting next week...");

        console.log("Calculating final scores...")
        await Matchup.calculateAllWeekScores();
        console.log("Done calculating scores.")

        console.log("Creating next week lineups...");
        await Lineup.createNextWeekLineups();
        console.log("Done creating lineups");

        console.log("Incrementing currentWeekNum...")
        await Settings.incrementWeekNum();
        console.log("currentWeekNum Incremented");

        console.log("Updating standings...");
        await Standings.refresh();
        console.log("Done refreshing standings")

        console.log("Unlocking lineups...");
        await Settings.setLineupsLocked(false);
        console.log("Lineups unlocked.")

        console.log("Refreshing settings...")
        await Settings.refresh();
        console.log("Settings refreshed");

        console.log("Next week started succesfully");
        return res.status(200).json({message: "Next week started succesfully"});
    } catch (err) {
        next(err);
    }
}

module.exports.resetAll = async (req, res, next) => {
    //resets all leagues to week 1 for a fresh start. use with care.
    try {
        console.log("Deleting matchup results...");
        await Matchup.resetAllScores();
        console.log("Matchup scores reset")

        console.log("Deleting lineups...")
        await Lineup.resetAll();
        console.log("Lineups deleted")

        console.log("Resetting standings...");
        await Standings.reset();
        console.log("Standings reset");

        console.log("Resetting currentWeekNum to 1");
        await Settings.setWeekNum(1);
        console.log("currentWeekNum set to 1");

        console.log("Unlinking player matches...")
        await Match.unlinkAll();
        console.log("Unlinked all player matches");

        console.log("Deleting all matches...");
        await Match.deleteAll();
        console.log("Deleted all matches");

        console.log("Resettings player season points totals...");
        await Player.resetAllPointsTotals();
        console.log("Reset all player points totals")


        return res.status(200).json({message: "All leagues reset successfuly"});
    } catch (err) {
        next(err);
    }
}

module.exports.refreshStandings = async (req, res, next) => {
    try {
        const standingsUpdateResult = await Standings.refresh();

        return res.status(200).json({message: "Standings refreshed successfuly"})
    } catch (err) {
        next(err);
    }
}

module.exports.resetStandings = async (req, res, next) => {
    try {
        const standingsResetResult = await Standings.reset();

        return res.status(200).json({message: "Standings reset successfuly"});
    } catch (err) {
        next(err);
    }
}

module.exports.createSchedule = async (req, res, next) => {
    try {
        if (!req.query.leagueId) {
            return res.status(400).json({error: "leagueId must be specified in querystring."});
        }

        if (!await League.get(req.query.leagueId)) {
            return res.status(400).json({error: "Invalid leagueId"});
        }

        await Schedule.create(req.query.leagueId);

        return res.status(200).json({message: "Schedule successfuly created"});
    } catch (err) {
        next(err);
    }
}

module.exports.getLeagues = async (req, res, next) => {
    try {
        const leagues = await League.getAll();

        return res.status(200).json(leagues);
    } catch (err) {
        next(err);
    }
}

module.exports.getUsers = async (req, res, next) => {
    try {
        let users = []

        if (req.query.leagueId) {
            users = await League.getUsers(req.query.leagueId);
        } else {
            users = await User.getAll();
        }

        return res.status(200).json(users);
    } catch (err) {
        next(err);
    }
}

module.exports.lockLineups = async (req, res, next) => {
    try {
        await Settings.setLineupsLocked(true);

        return res.status(200).json({message: "Lineups locked successfuly"})
    } catch (err) {
        next(err);
    }
}

module.exports.unlockLineups = async (req, res, next) => {
    try {
        await Settings.setLineupsLocked(false);

        return res.status(200).json({message: "Lineups unlocked successfuly"});
    } catch (err) {
        next(err);
    }
}

module.exports.unlinkAllMatches = async (req, res, next) => {
    try {
        const unlinkSuccess = await Match.unlinkAll();
    
        if (unlinkSuccess) {
            return res.status(200).json({message: "All matches unlinked successfuly"});
        } else {
            return res.status(500).json({error: "Failed to unlink matches"});
        }
    } catch (err) {
        next(err);
    }
}

module.exports.uploadMatchData = async (req, res, next) => {
    try {
        if (!req.query.weekNum || !req.query.season || !req.query.gameTitle) {
            return res.status(400).json({error: "weekNum, season, and gameTitle must be specified in querystring"});
        }

        const weekNum = decodeURIComponent(req.query.weekNum);
        const season = decodeURIComponent(req.query.season);
        const gameTitle = decodeURIComponent(req.query.gameTitle);
        const stats = req.body;

        const matchCreationSuccess = await Match.create(gameTitle, weekNum, season, stats);

        if (matchCreationSuccess) {
            return res.status(200).json({message: "Match data uploaded successfuly"});
        } else {
            return res.status(500).json({message: "Failed to upload match data"});
        }
    } catch (err) {
        next(err);
    }
}

module.exports.createLeague = async (req, res, next) => {
    try {
        if (!req.body?.name) {
            return res.status(400).json({error: "name must be specified in request body"});
        }

        const leagueDocument = await League.create(req.body.name);

        if (leagueDocument) {
            return res.status(200).json({message: "Created league successfuly"})
        } else {
            return res.status(500).json({error: "Failed to create league"});
        }
    } catch (err) {
        next(err);
    }
}

module.exports.updatePlayer = async (req, res, next) => {
    if (!req.query.id) {
        return res.status(400).json({error: "id must be specified in querystring."});
    }

    if (!ObjectId.isValid(req.query.id)) {
        return res.status(400).json({error: "Invalid player id"});
    }

    let playerDocument = await Player.get(req.query.id);

    if (!playerDocument) {
        return res.status(404).json({error: "Player with given id not found"});
    }

    const playerUpdateSuccess = await Player.update(req.query.id, req.body);

    if (playerUpdateSuccess) {
        return res.status(200).json({message: "Player updated successfuly"});
    } else {
        return res.status(500).json({error: "Failed to update player"});
    }
}

// module.exports.createLeague = async (req, res, next) => {
//     try {
//         //validate leagueId
//         if (!req.body?.leagueId) {
//             return res.status(400).json({error: "leagueId must be specified in request body"})
//         }

//         if (!ObjectId.isValid(req.body.leagueId)) {
//             return res.status(400).json({error: "Invalid leagueId"});
//         }

//         const matchedLeagueDocument = dbretriever.fetchDocumentById('leagues', req.body.leagueId);

//         if (!matchedLeagueDocument) {
//             return res.status(404).json({error: "League not found with specified leagueId"});
//         }

//         //validate username
//         if (!req.body.username || !req.body.password) {
//             return res.status(400).json({error: "Username and password must be specified in request body."})
//         }

//         //check for duplicate username
//         const matchedUsernameAccount = dbretriever.fetchOneDocument('users', {username: req.body.username}, {_id: 1});

//         if (matchedUsernameAccount) {
//             return res.status(400).json({error: "Username is already taken by another account"});
//         }

//         const userCreationResult = await User.create({
//             _id: new ObjectId(),
//             username: req.body.username,
//             leagueId: req.body.leagueId,
//         })
//     } catch (err) {
//         next(err);
//     }
// }