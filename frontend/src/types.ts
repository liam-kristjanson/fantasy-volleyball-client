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
    username: string;
    role: "user" | "admin";
    leagueId: string;
    authToken: string;
}