const Match = require('../models/Match')

module.exports.getMatch = async (req, res) => {
    try {
        if (!req.query.matchId) {
            return res.status(400).json({error: "matchId must be specified in querystring"});
        }

        const matchDocument = await Match.get(req.query.matchId);

        return res.status(200).json(matchDocument);

    } catch (e) {
        console.error(e);
        return res.status(500).json({error: "500: Internal server error"});
    }
}