const { ObjectId } = require('mongodb');
const dbretriever = require('../dbretriever')

module.exports.getRankedPlayers = (req, res) => {
    dbretriever.fetchOrdered('players', {}, {prevSeasonPoints: -1})
    .then(retrievedPlayers => {
        res.json(retrievedPlayers)
    })
    .catch(err => {
        res.status(500).json({error: "500: Internal Server Error"});
    });
}

module.exports.getPlayerMatches = (req, res) => {
    dbretriever.fetchOneDocument('players', {_id: new ObjectId(req.query.id)})
    .then(playerDocument => {
        return dbretriever.fetchDocuments('matches', {_id: {$in: playerDocument.matches}})
    })
    .then(matchDocuments => {
        res.send(matchDocuments);
    })
    .catch(err => {
        res.status(500).json({error: "500: Internal server error"});
    })
}