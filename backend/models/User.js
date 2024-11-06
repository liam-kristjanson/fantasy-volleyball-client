const dbretriever = require('../dbretriever')
const Roster = require('./Roster')
const Lineup = require('./Lineup')
const Settings = require('./Settings')
const bcrypt = require('bcrypt')

module.exports.get = async (userId) => {
    return dbretriever.fetchDocumentById('users', userId);
}

module.exports.getAll = async () => {
    return dbretriever.fetchDocuments('users', {}, {password: 0});
}

module.exports.create = async (userDocument) => {
    const appSettings = await Settings.get();

    //create password hash
    const hashedpassword = await bcrypt.hash(userDocument.password, parseInt(process.env.SALT_ROUNDS))
    
    //insert new account into database
    const createUserDocumentResult = await dbretriever.insertOne('users', {username: userDocument.username, password: hashedpassword, role: "user", leagueId: userDocument.leagueId});

    if (!createUserDocumentResult.acknowledged) {
        return false;
    }

    const newUserId = createUserDocumentResult.insertedId.toString();

    const rosterPromise = Roster.create(newUserId, userDocument.leagueId, userDocument.username);
    const lineupPromise = Lineup.createInitialLineups(newUserId, userDocument.leagueId, appSettings.currentSeason, appSettings.currentWeekNum);

    let [rosterCreationSuccess, lineupCreationSuccess] = await Promise.all([rosterPromise, lineupPromise]);

    const userCreationSuccess = rosterCreationSuccess && lineupCreationSuccess;

    return userCreationSuccess;
}
