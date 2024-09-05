//a singleton for app settings to reduce the number of database accesses required for this frequently accessed,
//infrequently changed piece of data.
const dbretriever = require('../dbretriever');

let cachedAppSettings = undefined;

module.exports.fetchAppSettings = async (req, res, next) => {
    try {
        const appSettings = await getAppSettings();
        return res.status(200).json(appSettings)
    } catch (err) {
        next(err);
    }
}

const getAppSettings = async () => {
    if (!cachedAppSettings) {
        cachedAppSettings = await dbretriever.fetchOneDocument('app_settings', {});
    }

    return cachedAppSettings;
}

module.exports.getAppSettings = getAppSettings;