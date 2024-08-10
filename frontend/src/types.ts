export interface PlayerRanking {
    playerName: string;
    prevSeasonPoints: number;
    _id: string;
    position?: string;
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
}

export interface Player {
    matches: string[],
    playerName: string,
    position: string,
    prevSeasonPoints: number,
    _id: string,
}

export interface Roster {
    _id: string,
    leagueId: string,
    userId: string,
    playerIds: string[],
    players: Player[]
}
