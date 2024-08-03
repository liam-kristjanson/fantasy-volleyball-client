module.exports.calculateFantasyPoints = (statsObject) => {
    const POINTS_PER_KILL = 1;
    const POINTS_PER_ERROR = -1;
    const POINTS_PER_ASSIST = 0.2;
    const POINTS_PER_ACE = 1;
    const POINTS_PER_DIG = 1;
    const POINTS_PER_SOLO_BLOCK = 1;
    const POINTS_PER_BLOCK_ASSIST = 1;

    return ((statsObject.kills * POINTS_PER_KILL) + (statsObject.errors * POINTS_PER_ERROR) + (statsObject.assists * POINTS_PER_ASSIST) + (statsObject.aces * POINTS_PER_ACE) + (statsObject.digs * POINTS_PER_DIG) + (statsObject.soloBlocks * POINTS_PER_SOLO_BLOCK) + (statsObject.blockAssists * POINTS_PER_BLOCK_ASSIST))
}