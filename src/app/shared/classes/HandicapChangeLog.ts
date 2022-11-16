
export class HandicapChangeLog {
    private id: string;
    private playerId: string;
    private oldHandicap: number;
    private newHandicap: number;
    private whs: boolean;
    private remarks: string;
    private tournamentId: string;
    private updaterId: string;

    constructor(id: string, playerId: string, oldHandicap: number, newHandicap: number, whs: boolean, remarks: string, tournamentId: string, updaterId: string) {
        this.id = id;
        this.playerId = playerId;
        this.oldHandicap = oldHandicap;
        this.newHandicap = newHandicap;
        this.whs = whs;
        this.remarks = remarks;
        this.tournamentId = tournamentId;
        this.updaterId = updaterId;
    }

    public getPlayerId(): string {
        if (this.playerId == null) {
            this.playerId = "";
        }
        return this.playerId;
    }

    public getOldHandicap(): number {
        return this.oldHandicap;
    }

    public setOldHandicap(oldHandicap: number) {
        this.oldHandicap = oldHandicap;
    }

    public getOldHandicapString(): string {
        if (this.oldHandicap < 0) {
            return "-";
        }
        return this.oldHandicap.toString();
    }

    public getNewHandicap(): number {
        return this.newHandicap;
    }

    public setNewHandicap(newHandicap: number) {
        this.newHandicap = newHandicap;
    }

    public getWhs(): boolean {
        return this.whs;
    }

    public setWhs(whs: boolean) {
        this.whs = whs;
    }

    public getRemarks(): string {
        if (this.remarks == null) {
            this.remarks = "";
        }
        return this.remarks;
    }

    public setRemarks(newHandicap: number) {
        this.newHandicap = newHandicap;
    }
}