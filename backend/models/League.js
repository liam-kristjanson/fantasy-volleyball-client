const dbretriever = require('../dbretriever');
const {ObjectId} = require('mongodb')

module.exports.getAllIds = async () => {
    const allLeagues = await dbretriever.fetchDocuments('leagues', {}, {_id: 1});

    let leagueIds = [];

    for (let i = 0; i<allLeagues.length; i++) {
        leagueIds.push(allLeagues[i]._id);
    }

    return leagueIds;
}

module.exports.getUserIds = async (leagueId) => {
    const allUsers = await dbretriever.fetchDocuments('users', {leagueId}, {userId: 1});

    let userIds = [];

    for (let i = 0; i<allUsers.length; i++) {
        userIds.push(allUsers[i]._id.toString());
    }

    return userIds;
}

module.exports.get = async (leagueId) => {
    if (!ObjectId.isValid(leagueId)) return null;

    return dbretriever.fetchDocumentById('leagues', new ObjectId(leagueId));
}