const settingsController = require('./SettingsController')
const dbretriever = require('../dbretriever')
const Settings = require('../models/Settings')
const Lineup = require('../models/Lineup');
const Stanidngs = require('../models/Standings');
const League = require('../models/League')
const Schedule = require('../models/Schedule')
const User = require("../models/User");
const { ObjectId } = require('mongodb');

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

        console.log("Creating next week lineups...");
        await Lineup.createNextWeekLineups();
        console.log("Done creating lineups");

        console.log("Incrementing currentWeekNum...")
        await Settings.incrementWeekNum();
        console.log("currentWeekNum Incremented");
        

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

module.exports.refreshStandings = async (req, res, next) => {
    try {
        const standingsUpdateResult = await Stanidngs.refresh();

        return res.status(200).json({message: "Standings refreshed successfuly"})
    } catch (err) {
        next(err);
    }
}

module.exports.resetStandings = async (req, res, next) => {
    try {
        const standingsResetResult = await Stanidngs.reset();

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