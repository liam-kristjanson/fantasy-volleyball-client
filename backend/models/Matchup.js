const dbretriever = require('../dbretriever');
const Lineup = require('./Lineup');

module.exports.get = (leagueId, weekNum) => {
    return dbretriever.fetchOneDocument('matchups', {leagueId, weekNum});
}

module.exports.calculateScores = async (matchupDocument) => {

    let matchups = []

    for (let i = 0; i<matchupDocument.matchupIds.length; i++) {
        matchups[i] = {};
        

        console.log("Fetching home lineup for matchup " + (i + 1));
        matchups[i].homeTeam = Lineup.get(matchupDocument.leagueId, matchupDocument.matchupIds[i].homeId, matchupDocument.weekNum)
        .then(fetchedLineup => {
            console.log("Fetched home lineup for matchup " + (i + 1) + " populating...")
            return Lineup.populate(fetchedLineup);
        })
        .then(populatedLineup => {
            console.log("Populated home lineup for matchup " + (i + 1) + " calculating score...")
            return Lineup.calculateScore(populatedLineup);
        })
        .then(calculatedScore => {
            console.log("Calculated score for home lineup in matchup " + (i + 1));
            return calculatedScore;
        });

        // await Lineup.populate(matchups[i].homeTeam);
        // await Lineup.calculateScore(matchups[i].homeTeam);

        console.log("Fetching away lineup for matchup " + (i + 1));
        matchups[i].awayTeam = Lineup.get(matchupDocument.leagueId, matchupDocument.matchupIds[i].awayId, matchupDocument.weekNum)
        .then(fetchedLineup => {
            console.log("Fetched away lineup for matchup " + (i + 1) + " populating...")
            return Lineup.populate(fetchedLineup);
        })
        .then(populatedLineup => {
            console.log("Populated away lineup for matchup " + (i + 1) + " calculating score...")
            return Lineup.calculateScore(populatedLineup);
        })
        .then(calculatedScore => {
            console.log("Calculated score for away lineup in matchup " + (i + 1))
            return calculatedScore
        })
    
        // await Lineup.populate(matchups[i].awayTeam);
        // await Lineup.calculateScore(matchups[i].awayTeam);
    }

    console.log("Unresolved matchups:", matchups);

    console.log("Awaiting matchup resolution...")
    const resolvedMatchups = [];
    for (let i = 0; i<matchups.length; i++) {
        resolvedMatchups[i] = {homeTeam : {playerStats: undefined}, awayTeam : {playerStats: undefined}};

        console.log("Awaiting resolution of home team in matchup " + (i + 1));
        resolvedMatchups[i].homeTeam = await matchups[i].homeTeam;
        console.log("Resolved home team for matchup " + (i + 1));

        console.log("Awaiting resolution of away team in matchup " + (i + 1));
        resolvedMatchups[i].awayTeam = await matchups[i].awayTeam;
        console.log("Resolved away team in matchup " + (i + 1));
    }

    console.log("Resolved matchups: ", resolvedMatchups)
    matchupDocument.matchupScores = resolvedMatchups;

    console.log("Returning resolved matchups...")
    return matchupDocument;
}