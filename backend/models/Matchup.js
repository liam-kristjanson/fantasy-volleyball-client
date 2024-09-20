const dbretriever = require('../dbretriever');
const Lineup = require('./Lineup');

module.exports.get = (leagueId, weekNum) => {
    console.log("Fetching matchup document with leagueId ", leagueId, " and weekNum ", weekNum);
    return dbretriever.fetchOneDocument('matchups', {leagueId, weekNum});
}

module.exports.calculateScores = async (matchupDocument) => {

    let matchups = []

    for (let i = 0; i<matchupDocument.matchupIds.length; i++) {
        matchups[i] = {};
        //calculate score for home team
        //console.log("Fetching home lineup for matchup " + (i + 1));
        matchups[i].homeTeam = Lineup.get(matchupDocument.leagueId, matchupDocument.matchupIds[i].homeId, matchupDocument.weekNum)
        .then(fetchedLineup => {
            return Lineup.populate(fetchedLineup);
        })
        .then(populatedLineup => {
            console.log("Populated home lineup: ", populatedLineup)
            return Lineup.calculateScore(populatedLineup);
        });

        //calculate score for away team
        //console.log("Fetching away lineup for matchup " + (i + 1));
        matchups[i].awayTeam = Lineup.get(matchupDocument.leagueId, matchupDocument.matchupIds[i].awayId, matchupDocument.weekNum)
        .then(fetchedLineup => {
            return Lineup.populate(fetchedLineup);
        })
        .then(populatedLineup => {
            return Lineup.calculateScore(populatedLineup);
        });
    }

    //await resolution of promises
    const resolvedMatchups = [];
    for (let i = 0; i<matchups.length; i++) {
        resolvedMatchups[i] = {homeTeam : {playerStats: undefined}, awayTeam : {playerStats: undefined}};
        resolvedMatchups[i].homeTeam = await matchups[i].homeTeam;
        resolvedMatchups[i].awayTeam = await matchups[i].awayTeam;
    }
    matchupDocument.matchupScores = resolvedMatchups;
    return matchupDocument;
}