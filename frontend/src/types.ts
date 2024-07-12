export interface PlayerRanking {
    playerName: string;
    prevSeasonPoints: number;
    _id: string;
    position?: string;
}

export type ServerMessageType = "success" | "info" | "warning" | "danger"