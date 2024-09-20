const dbretriever = require('../dbretriever');
const {ObjectId} = require('mongodb')

module.exports.getAllIds = async (req, res, next) => {
    try {
        const allLeagues = await dbretriever.fetchDocuments('leagues', {}, {_id: 1});

        let leagueIds = [];

        for (let i = 0; i<allLeagues.length; i++) {
            leagueIds.push(allLeagues[i]._id);
        }

        return leagueIds;
    } catch (err) {
        next(err)
    }
}

module.exports.get = async (leagueId) => {
    if (!ObjectId.isValid(leagueId)) return null;

    return dbretriever.fetchDocumentById('leagues', new ObjectId(leagueId));
}