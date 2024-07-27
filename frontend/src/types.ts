export interface PlayerRanking {
    playerName: string;
    prevSeasonPoints: number;
    _id: string;
    position?: string;
}

export interface Match {
    _id: string;
    gameTitle: string;
    season: string;
    weekNum: number;
    stats: object;
}

export interface PlayerMatchStats {
    jerseyNumber: string;
    kills: string;
    errors: string;
    attempts: string;
    assists: string;
    aces: string;
    digs: string;
    soloBlocks: string;
    blockAssists: string;
}

export type ServerMessageType = "success" | "info" | "warning" | "danger"