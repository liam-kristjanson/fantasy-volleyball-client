const dbretriever = require('../dbretriever');
const fantasyUtilities = require('../FantasyUtilities');

module.exports.get = (leagueId, userId, weekNum) => {
    return dbretriever.fetchOneDocument('lineups', {leagueId, userId, weekNum: parseInt(weekNum)}, {matches: 0});
}

module.exports.populate = async (lineupDocument) => {
    let promisedPlayerDocuments = {};

    for (let position in lineupDocument.lineupIds) {
        //lineupId is null in the case of an empty lineup slot
        if (lineupDocument.lineupIds[position]) {
            promisedPlayerDocuments[position] = dbretriever.fetchDocumentById('players', lineupDocument.lineupIds[position]);
        } else {
            promisedPlayerDocuments[position] = {
                playerName: null,
                position: position,
                _id: null,
                prevSeasonPoints: null,
                matchesPlayed: null,
                points: null
            }
        }
    }

    lineupDocument.playerDocuments = {}

    for (let position in promisedPlayerDocuments) {
        lineupDocument.playerDocuments[position] = await promisedPlayerDocuments[position];
    }

    return lineupDocument;
}

module.exports.calculateScore = async (lineupDocument) => {
    const weekMatchDocuments = await dbretriever.fetchDocuments('matches', {weekNum: parseInt(lineupDocument.weekNum)});

    lineupDocument.lineupStats = lineupDocument.playerDocuments;

    for (let position in lineupDocument.lineupStats) {
        fantasyUtilities.getPlayerStatsFromMatches(lineupDocument.lineupStats[position], weekMatchDocuments)
    }

    //lineupDocument.playerStats = fantasyUtilities.getPlayerStatsFromMatches(lineupDocument.playerDocuments, weekMatchDocuments);

    lineupDocument.totalScore = this.calculateTotalScore(lineupDocument.playerDocuments);
    

    return lineupDocument;
}

module.exports.calculateTotalScore = (playerDocuments) => {
    let pointsTotal = 0;

    //console.log("Calculating totals with player stats:", playerStats)

    for (let position in playerDocuments) {
        pointsTotal += playerDocuments[position]?.points ?? 0;
    }

    return pointsTotal;
}