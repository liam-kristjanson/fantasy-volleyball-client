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

    return cachedAppSettings
}

module.exports.setWeekNum = async (weekNum) => {
    await dbretriever.updateOne('app_settings', {}, {$set: {currentWeekNum: weekNum}});

    return await this.refresh();
}

module.exports.setLineupsLocked = async (lineupsLocked) => {
    await dbretriever.updateOne('app_settings', {}, {$set: {lineupsLocked: lineupsLocked}});

    return await this.refresh();
}

module.exports.incrementWeekNum = async () => {
    const CURRENT_SETTINGS = await this.get();

    return await this.setWeekNum(CURRENT_SETTINGS.currentWeekNum + 1);
}