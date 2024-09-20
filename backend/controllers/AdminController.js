const settingsController = require('./SettingsController')
const dbretriever = require('../dbretriever')
const Settings = require('../models/Settings')
const Lineup = require('../models/Lineup');
const Stanidngs = require('../models/Standings');

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