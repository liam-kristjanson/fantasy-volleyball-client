const {ObjectId} = require('mongodb');
const dbretriever = require('../dbretriever')
const Matchup = require('../models/Matchup');

module.exports.getMatchupScores = async (req, res, next) => {
    try {
        //validation
        console.log("Validating matchup scores request")
        if (!req.query.leagueId || !req.query.weekNum) return res.status(400).json({error: "leagueId and weekNum must be specified in querystring"});
        
        if (isNaN(parseInt(req.query.weekNum))) return res.status(400).json({error: "weekNum must be an integer"});

        console.log("Finding matchup document");
        const matchupDocument = await Matchup.get(req.query.leagueId, parseInt(req.query.weekNum));

        console.log("Found matchup document")
        if (!matchupDocument) return res.status(400).json({error: "No matchup document found for the given leagueId and weekNum"});

        console.log("Calculating matchup scores...")
        matchupScores = await Matchup.calculateScores(matchupDocument);

        return res.status(200).json(matchupScores);

    } catch (err) {
        next(err);
    }
}