const {ObjectId} = require('mongodb');
const Standings = require('../models/Standings');
const League = require('../models/League')

module.exports.getStandings = async (req, res, next) => {
    if (!req.query.leagueId) {
        return res.status(400).json({error: "leagueId must be specified in Querystring"})
    }

    if (!await League.get(req.query.leagueId)) {
        return res.status(400).json({error: "Invalid leagueId"});
    }

    const standings = await Standings.get(req.query.leagueId);

    if (!standings) {
        return res.status(404).json({error: "Standings not found"});
    }

    return res.status(200).json(standings);
}
