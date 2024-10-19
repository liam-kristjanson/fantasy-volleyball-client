export interface PlayerRanking {
    playerName: string;
    prevSeasonPoints: number;
    _id: string;
    position?: string;
    seasonTotalPoints: number;
}

export interface PlayerMatch {
    _id: string;
    gameTitle: string;
    season: string;
    weekNum: number;
    stats: PlayerMatchStats;
}

export interface PlayerMatchStats {
    jerseyNumber: number;
    kills: number;
    errors: number;
    attempts: number;
    assists: number;
    aces: number;
    digs: number;
    soloBlocks: number;
    blockAssists: number;
    fantasyPoints?: number;
}

export type ServerMessageType = "success" | "info" | "warning" | "danger"

export interface User {
    userId: string;
    username: string;
    role: "user" | "admin";
    leagueId: string;
    authToken: string;
    _id?: string; 
}

export interface Player {
    matches: string[],
    playerName: string,
    position: string,
    prevSeasonPoints: number,
    _id: string,
    seasonTotalPoints: number;
    team?: string;
    isActive?: boolean;
}

export interface Roster {
    _id: string,
    leagueId: string,
    userId: string,
    playerIds: string[],
    players: Player[]
}

export interface Lineup {
    S: Player | null,
    OH1: Player | null,
    OH2: Player | null,
    OH3: Player | null,
    M1: Player | null,
    M2: Player | null,
    L: Player | null
}

export interface LineupDocument {
    _id: string,
    leagueId: string,
    userId: string,
    lineupIds: string,
    weekNum: number,
    lineup: Lineup
}

export interface PlayerWeekStats extends Player {
    points: number;
    matchesPlayed: number;
}

export interface TeamWeekStatsObject {
    teamName: string;
    lineupStats: LineupWeekStats;
    totalScore: number;
}

export interface LineupWeekStats {
    S: PlayerWeekStats;
    OH1: PlayerWeekStats;
    OH2: PlayerWeekStats;
    OH3: PlayerWeekStats;
    M1: PlayerWeekStats;
    M2: PlayerWeekStats;
    L: PlayerWeekStats;
}

export interface MatchupsObject {
    leagueId: string;
    weekNum: number;
    matchupScores: MatchupScore[]
}

export interface MatchupScore {
    homeTeam: TeamWeekStatsObject;
    awayTeam: TeamWeekStatsObject;
}

export interface Team {
    userId: string;
    leagueId: string;
    teamName: string;
}

export type Position = "S" | "OH1" | "OH2" | "OH3" | "M1" | "M2" | "L";

export interface AppSettings {
    lineupsLocked: boolean;
    currentWeekNum: number;
    currentSeason: string;
}

export interface SettingsContextState {
    settings: AppSettings;
    updateSettings : () => void;
}

export interface StandingsEntry {
    _id: string;
    teamName: string;
    wins: number;
    losses: number;
}

export interface LeagueDocument {
    _id: string;
    name: string;
    adminId: string;
}
