require('dotenv').config();
const dbretriever = require('./dbretriever');

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

module.exports.calculateFantasyPoints = calculateFantasyPoints;
module.exports.getAppSettings = getAppSettings;
module.exports.getPlayerStatsFromMatches = getPlayerStatsFromMatches;