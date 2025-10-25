const dbretriever = require('../dbretriever');
const fantasyUtilities = require('../FantasyUtilities');
const settingsController = require('../controllers/SettingsController')
const Settings = require('./Settings')

const EMPTY_LINEUP = {
    S: null,
    OH1: null,
    OH2: null,
    OH3: null,
    M1: null,
    M2: null,
    L: null
}

module.exports.get = (leagueId, userId, weekNum) => {
    console.log("Fetching lineup with leagueId " + leagueId + " userId " + userId + " weekNum " + weekNum);

    return dbretriever.fetchOneDocument('lineups', {leagueId, userId, weekNum: parseInt(weekNum)}, {matches: 0});
}

module.exports.populate = async (lineupDocument) => {
    let promisedPlayerDocuments = {};
    const rosterPromise = dbretriever.fetchOneDocument('rosters', {userId: lineupDocument.userId, leagueId: lineupDocument.leagueId});


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

    const roster = await rosterPromise;
    lineupDocument.teamName = roster.teamName;
    lineupDocument.rosterId = roster._id;

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

module.exports.createNextWeekLineups = async () => {
    const settings = await Settings.get();

    const currentWeekNum = settings.currentWeekNum;

    const currentLineups = await dbretriever.fetchDocuments('lineups', {weekNum: currentWeekNum});

    let newLineupPromises = [];

    for (let i = 0; i<currentLineups.length; i++) {
        const newLineup = {
            userId: currentLineups[i].userId,
            leagueId: currentLineups[i].leagueId,
            season: currentLineups[i].season,
            weekNum: currentLineups[i].weekNum + 1,
            lineupIds: currentLineups[i].lineupIds
        }

        newLineupPromises.push(dbretriever.insertOne('lineups', newLineup));
    }

    const lineupInsertionResults = await Promise.all(newLineupPromises)

    let lineupsCreatedSuccessfuly = true;
    
    for (let i = 0; i<lineupInsertionResults.length; i++) {
        lineupsCreatedSuccessfuly = lineupInsertionResults[i].acknowledged && lineupsCreatedSuccessfuly;
    }

    if (!lineupsCreatedSuccessfuly) throw new Error('At least one new lineup failed to be created');
}

module.exports.resetAll = async () => {
    return await dbretriever.deleteMany('lineups', {weekNum: {$gt: 1}});
}

module.exports.createInitialLineups = async (userId, leagueId, season, currentWeekNum) => {
    const lineupPromises = []

    for (let weekNum = 1; weekNum <= currentWeekNum; weekNum++) {
        lineupPromises.push(dbretriever.insertOne('lineups', {userId, leagueId, season, weekNum, lineupIds: EMPTY_LINEUP}));
    }

    const lineupCreationResults = await Promise.all(lineupPromises);

    let lineupCreationSuccess = true;

    for (let lineupCreationResult of lineupCreationResults) {
        lineupCreationSuccess = lineupCreationSuccess && lineupCreationResult.acknowledged;
    }

    return lineupCreationSuccess;
}

module.exports.deleteByUserId = async (userId) => {
    const result = await dbretriever.deleteMany('lineups', {userId});

    return result.acknowledged;
}