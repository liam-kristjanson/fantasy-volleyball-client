const settingsController = require('./SettingsController')
const dbretriever = require('../dbretriever')
const Settings = require('../models/Settings')
const Lineup = require('../models/Lineup');
const Standings = require('../models/Standings');
const League = require('../models/League')
const Schedule = require('../models/Schedule')
const User = require("../models/User");
const Matchup = require('../models/Matchup')

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