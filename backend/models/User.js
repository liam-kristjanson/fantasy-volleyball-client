const dbretriever = require('../dbretriever')
const Roster = require('./Roster')
const Lineup = require('./Lineup')
const Settings = require('./Settings')
const bcrypt = require('bcrypt')
const {ObjectId} = require('mongodb')

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

module.exports.updatePassword = async (userId, newPassword) => {
    const hashedPassword = await bcrypt.hash(newPassword, parseInt(process.env.SALT_ROUNDS));

    const passwordUpdateResult = await dbretriever.updateOne('users', {_id: new ObjectId(userId)}, {$set: {password: hashedPassword}});

    return passwordUpdateResult.acknowledged && passwordUpdateResult.modifiedCount == 1;
}

//cascading delete of user account and all associated rosters, lineups, etc.
module.exports.delete = async (userId) => {
    const lineupDeletePromise = Lineup.deleteByUserId(userId);
    const rosterDeletePromise = Roster.deleteByUserId(userId);
    const userDeletePromise = dbretriever.deleteDocumentById('users', userId);

    const [lineupDeleteSuccess, rosterDeleteSucess, userDeleteSuccess] = await Promise.all([lineupDeletePromise, rosterDeletePromise, userDeletePromise]);

    return lineupDeleteSuccess && rosterDeleteSucess && userDeleteSuccess;
}

module.exports.updateLeagueId = async (userId, leagueId) => {
    const result = await dbretriever.updateOne('users', {_id: userId}, {$set: {leagueId}});

    return result.acknowledged && result.modifiedCount == 1;
}
