require('dotenv').config();
const dbretriever = require('./dbretriever');
const { ObjectId } = require('mongodb');

const calculateFantasyPoints = (statsObject) => {
    const POINTS_PER_KILL = 1;
    const POINTS_PER_ERROR = -1;
    const POINTS_PER_ASSIST = 0.2;
    const POINTS_PER_ACE = 1;
    const POINTS_PER_DIG = 1;
    const POINTS_PER_SOLO_BLOCK = 1;
    const POINTS_PER_BLOCK_ASSIST = 1;

    return ((statsObject.kills * POINTS_PER_KILL) + (statsObject.errors * POINTS_PER_ERROR) + (statsObject.assists * POINTS_PER_ASSIST) + (statsObject.aces * POINTS_PER_ACE) + (statsObject.digs * POINTS_PER_DIG) + (statsObject.soloBlocks * POINTS_PER_SOLO_BLOCK) + (statsObject.blockAssists * POINTS_PER_BLOCK_ASSIST))
}

const getAppSettings = () => {
    return dbretriever.fetchOneDocument('app_settings', {});
}

const getPlayerStatsFromMatches = (players, matches) => {
    for (let playerIdx = 0; playerIdx<players.length; playerIdx++) {
        const playerName = players[playerIdx].playerName;
        players[playerIdx].points = 0;
        players[playerIdx].matchesPlayed = 0;

        for (let matchIdx = 0; matchIdx<matches.length; matchIdx++) {
            if (matches[matchIdx].stats[playerName]) {
                players[playerIdx].points += calculateFantasyPoints(matches[matchIdx].stats[playerName]);
                players[playerIdx].matchesPlayed++;
            }
        }
    }

    return players;
}

const getFreeAgents = async (leagueId) => {
    const rosters = await dbretriever.fetchDocuments('rosters', {leagueId: leagueId}, {playerIds: 1});

    let rosteredPlayerIds = [];

    //use the fetched rosters to populate an array of all rostered player ids
    for (let rosterIdx = 0; rosterIdx<rosters.length; rosterIdx++) {
        let rosterIds = rosters[rosterIdx].playerIds;
        for (let playerIdx=0; playerIdx<rosterIds.length; playerIdx++) {
            rosteredPlayerIds.push(new ObjectId(rosterIds[playerIdx]));
        }
    }

    const freeAgentDocuments = await dbretriever.fetchOrdered('players', {_id: {$nin: rosteredPlayerIds}}, {prevSeasonPoints: -1}, undefined, {matches: 0});

    return freeAgentDocuments;
}

const isFreeAgent = async (playerId, leagueId) => {
    const leagueRosters = await dbretriever.fetchDocuments('rosters', {leagueId: leagueId}, {playerIds: 1});

    for (let rosterIdx=0; rosterIdx<leagueRosters.length; rosterIdx++) {
        if (leagueRosters[rosterIdx].playerIds.includes(playerId)) return false;
    }

    return true;
}

const isPlayerRostered = async (playerId, userId, leagueId) => {
    const roster = await dbretriever.fetchOneDocument('rosters', {leagueId: leagueId, userId: userId});

    return Array.isArray(roster?.playerIds) && roster?.playerIds.includes(playerId);
}

const isPlayerInCurrentLineup = async(playerId, userId, leagueId) => {
    const appSettings = await dbretriever.fetchOneDocument('app_settings', {});

    const currentLineup = await dbretriever.fetchOneDocument('lineups', {userId: userId, leagueId: leagueId, weekNum:appSettings.currentWeekNum});

    for (let position in currentLineup.lineupIds) {
        if (currentLineup.lineupIds[position] == playerId) return true;
    }

    return false;
}

const isValidPosition = (lineupSlot, playerPosition) => {
    switch (lineupSlot) {
        case "S":
            return playerPosition.includes("S");

        case "OH1":
        case "OH2":
        case "OH3":
            return playerPosition.includes("OH");

        case "M1":
        case "M2":
            return playerPosition.includes("M");
        
        case "L":
            return playerPosition.includes("L");
    }

    return false;
}

module.exports.isValidPosition = isValidPosition;
module.exports.isFreeAgent = isFreeAgent;
module.exports.calculateFantasyPoints = calculateFantasyPoints;
module.exports.getAppSettings = getAppSettings;
module.exports.getPlayerStatsFromMatches = getPlayerStatsFromMatches;
module.exports.getFreeAgents = getFreeAgents
module.exports.isPlayerRostered = isPlayerRostered;
module.exports.isPlayerInCurrentLineup = isPlayerInCurrentLineup;