export class Score {
    playerId: string;
    flightId: string;
    holeId: string;
    playerHandicap: number;
    grossScore: number;
    updatedAt: Date;
    updaterId: string;
    updaterName: string;
    detailId: string;
}
export interface ScoreDetail {
    id: string;
    putts: number;
    penalties: number;
    fairway: string;
    gir: string;
    sandSave: string;
    upAndDown: string;
    penalty: string;
    firClub: string;
    girClub: string;
    girDistance: string;
    sandSavePoint: string;
    upAndDownPoint: string;
    upAndDownDistance: string;
    girShot: string;
}