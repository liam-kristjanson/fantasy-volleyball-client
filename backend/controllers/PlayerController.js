const dbretriever = require('../dbretriever')

module.exports.getRankedPlayers = (req, res) => {
    dbretriever.fetchOrdered('players', {}, {prevSeasonPoints: -1})
    .then(retrievedPlayers => {
        res.json(retrievedPlayers)
    });
}