const { ObjectId } = require('mongodb');
const dbretriever = require('../dbretriever')
const { calculateFantasyPoints } = require('../FantasyUtilities');

module.exports.getRankedPlayers = (req, res) => {
    dbretriever.fetchOrdered('players', {}, {seasonTotalPoints: -1})
    .then(retrievedPlayers => {
        res.json(retrievedPlayers)
    })
    .catch(err => {
        res.status(500).json({error: "500: Internal Server Error"});
    });
}

module.exports.getPlayerMatches = async (req, res) => {
    try {
        let matchDocuments;
        let playerDocument;
        let playerName;

        //validation
        if (!req.query.id && !req.query.playerName) {
            return res.status(400).json({error: "id or playerName must be specified in query"});
        }

        if (req.query.id) {
            playerDocument = await dbretriever.fetchOneDocument('players', {_id: new ObjectId(req.query.id)})
        } else if (req.query.playerName) {
            decodedPlayerName = decodeURIComponent(req.query.playerName)
            playerDocument = await dbretriever.fetchOneDocument('players', {playerName: decodedPlayerName})
        }

        if (!playerDocument) {
            return res.status(400).json({error: "Player with given id or name not found"});
        }

        playerName = playerDocument.playerName;
        matchDocuments = await dbretriever.fetchOrdered('matches', {_id: {$in: playerDocument.matches}}, {weekNum: 1});



        const playerMatchDocuments = matchDocuments.map(matchDocument => {
            let playerStatsObject = matchDocument.stats[playerName];

            if (!playerStatsObject) return;

            playerStatsObject.fantasyPoints = calculateFantasyPoints(playerStatsObject);

            return {
                _id: matchDocument._id,
                gameTitle: matchDocument.gameTitle,
                season: matchDocument.season,
                weekNum: matchDocument.weekNum,
                stats: playerStatsObject
            }
        });

        res.send(playerMatchDocuments);
    } catch (e) {
        console.error(e);
        res.status(500).send('500: Internal server error');
    }
}