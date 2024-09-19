//a singleton for app settings to reduce database calls, since the settings are frequently referenced, infrequently changed
let cachedAppSettings = undefined;

const dbretriever = require('../dbretriever');

module.exports.get = async () => {
    if (!cachedAppSettings) {
        cachedAppSettings = await dbretriever.fetchOneDocument('app_settings', {});
    }

    return cachedAppSettings;
}

module.exports.refresh = async () => {
    cachedAppSettings = await dbretriever.fetchOneDocument('app_settings', {});
}

module.exports.setWeekNum = async (weekNum) => {
    await dbretriever.updateOne('app_settings', {}, {$set: {currentWeekNum: weekNum}});

    await this.refresh();
}

module.exports.setLineupsLocked = async (lineupsLocked) => {
    await dbretriever.updateOne('app_settings', {}, {$set: {lineupsLocked: lineupsLocked}});

    await this.refresh();
}

module.exports.incrementWeekNum = async () => {
    const CURRENT_SETTINGS = await this.get();

    await this.setWeekNum(CURRENT_SETTINGS.currentWeekNum + 1);
}