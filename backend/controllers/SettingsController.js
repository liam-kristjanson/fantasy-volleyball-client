//a singleton for app settings to reduce the number of database accesses required for this frequently accessed,
//infrequently changed piece of data.
const dbretriever = require('../dbretriever');
const Settings = require('../models/Settings')

let cachedAppSettings = undefined;

module.exports.fetchAppSettings = async (req, res, next) => {
    try {
        const appSettings = await Settings.get();
        return res.status(200).json(appSettings)
    } catch (err) {
        next(err);
    }
}