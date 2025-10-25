const dbretriever = require('../dbretriever');
const Lineup = require('./Lineup');
const {ObjectId} = require('mongodb')
const League = require('./League')
const Settings = require('./Settings')

module.exports.get = (leagueId, weekNum) => {
    console.log("Fetching matchup document with leagueId ", leagueId, " and weekNum ", weekNum);
    return dbretriever.fetchOneDocument('matchups', {leagueId, weekNum});
}

module.exports.calculateAllWeekScores = async () => {
    const currentSettings = await Settings.get();
    const weekNum = currentSettings.currentWeekNum;

    console.log("Calculating all scores for week " + weekNum);
    const leagueIds = await League.getAllIds();

    for (let leagueId of leagueIds) {
        console.log("Calculating scores for leagueId " + leagueId);
        
        let matchupDocument = await this.get(leagueId.toString(), weekNum);

        if (matchupDocument) {
            matchupDocument = await this.calculateScores(matchupDocument);
            console.log("Calculated scores for leagueId " + leagueId + " and weekNum " + weekNum);
            let result = await this.writeResults(matchupDocument);
        }
    }
}

module.exports.calculateScores = async (matchupDocument) => {

    let matchups = []

    for (let i = 0; i<matchupDocument.matchupIds.length; i++) {
        matchups[i] = {};
        //calculate score for home team
        console.log("Fetching home lineup for matchup " + (i + 1));
        matchups[i].homeTeam = Lineup.get(matchupDocument.leagueId, matchupDocument.matchupIds[i].homeId, matchupDocument.weekNum)
        .then(fetchedLineup => {
            return Lineup.populate(fetchedLineup);
        })
        .then(populatedLineup => {
            console.log("Populated home lineup: ", populatedLineup)
            return Lineup.calculateScore(populatedLineup);
        });

        //calculate score for away team
        console.log("Fetching away lineup for matchup " + (i + 1));
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

module.exports.writeResults = async (matchupDocument) => {
    //write final scores to database
    console.log("Writing final scores to database...")
    const result = await dbretriever.updateOne('matchups', {_id: new ObjectId(matchupDocument._id)}, {$set: {matchupScores: matchupDocument.matchupScores}});
    console.log("Updated " + result.modifiedCount + " document(s)");

    return result;
}

module.exports.resetAllScores = async () => {
    const result = await dbretriever.updateMany('matchups', {}, {$unset: {matchupScores: ""}});

    return result;
}