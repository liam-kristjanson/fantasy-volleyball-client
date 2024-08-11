require('dotenv').config();
const { ObjectId } = require('mongodb');
const dbretriever = require('../dbretriever')

module.exports.getLineup = async (req, res) => {

    try {
        if (!req.query.userId || !req.query.leagueId) {
            return res.status(400).json({error: "userId and leagueId must be specified in querystring"});
        }

        const lineupDocument = await dbretriever.fetchOrdered('lineups', {userId: req.query.userId, leagueId: req.query.leagueId}, {weekNum: -1}, 1);

        if (!lineupDocument) {
            return  res.status(404).json({error: "No lineup found for the given userId and leagueId"})
        }

        //fetch the rest of the player details
        const lineup = {}
        const playerPromises = []
        for (let position in lineupDocument.lineupIds) {
            console.log("Searching for player in position " + position + "...");
            let playerPromise = dbretriever.fetchOneDocument('players', {_id: new ObjectId(lineupDocument.lineupIds[position])})
            playerPromises.push(playerPromise);
            playerPromise.then(retrievedPlayer => {
                console.log("Found player for position " + position + " with name: " + retrievedPlayer.playerName)
                lineup[position] = retrievedPlayer
            })
        }

        //wait for all lineup promises to resolve
        await Promise.all(playerPromises);

        lineupDocument.lineup = lineup;

        return res.status(200).json(lineupDocument);
    }
    catch (e) {
        console.error(e);
        return res.status(500).json({error: "500: Internal server error"});
    }
}