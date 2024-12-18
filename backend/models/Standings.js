const dbretriever = require('../dbretriever');
const Settings = require('./Settings')
const League = require('./League')
const Matchup = require('./Matchup')
const {ObjectId} = require('mongodb')

module.exports.get = async (leagueId) => {
    return dbretriever.fetchOrdered('rosters', {leagueId}, {wins: -1}, undefined, {teamName: 1, wins: 1, losses: 1});
}

module.exports.refresh = async () => {
    await this.reset();

    const settings = await Settings.get();
    const leagueIds = await League.getAllIds();

    const matchupPromises = [];

    for (let weekNum = 1; weekNum < settings.currentWeekNum; weekNum++) {
        for (let leagueId of leagueIds) {

            const matchupDocument = await Matchup.get(leagueId.toString(), weekNum)

            if (matchupDocument) {
                const matchupPromise = Matchup.get(leagueId.toString(), weekNum)
                .then(matchupDocument => {
                    console.log("Found matchup document: ", matchupDocument)
                    console.log("Calculating scores...");
                    return Matchup.calculateScores(matchupDocument)
                })
                .then(calculatedMatchupDocument => {
                    console.log("Updating records...")
                    let recordUpdatePromises = []

                    for (let i = 0; i<calculatedMatchupDocument.matchupScores.length; i++) {
                        const homeTeamId = calculatedMatchupDocument.matchupScores[i].homeTeam.rosterId;
                        const awayTeamId = calculatedMatchupDocument.matchupScores[i].awayTeam.rosterId;

                        const homeScore = calculatedMatchupDocument.matchupScores[i].homeTeam.totalScore;
                        const awayScore = calculatedMatchupDocument.matchupScores[i].awayTeam.totalScore;

                        if (awayScore != homeScore) {
                            let winningId, losingId
                            if (awayScore > homeScore) {
                                winningId = awayTeamId;
                                losingId = homeTeamId;
                            } else {
                                winningId = homeTeamId;
                                losingId = awayTeamId;
                            }



                            let winnerUpdatePromise = dbretriever.updateOne('rosters', {_id: new ObjectId(losingId)}, {$inc: {losses: 1}});
                            let loserUpdatePromise = dbretriever.updateOne('rosters', {_id: new ObjectId(winningId)}, {$inc: {wins: 1}});

                            recordUpdatePromises.push(winnerUpdatePromise);
                            recordUpdatePromises.push(loserUpdatePromise);
                        }
                    }

                    return Promise.all(recordUpdatePromises);
                })

                matchupPromises.push(matchupPromise);
            }
        }
    }

    const matchupResolution = await Promise.all(matchupPromises);

    // console.log("All matchup promises fulfilled?");
    // console.log(matchupResolution);

    return matchupResolution;
}

//reset all teams to 0 wins and 0 losses
module.exports.reset = async () => {
    return dbretriever.updateMany('rosters', {}, {$set: {wins: 0, losses: 0}});
}