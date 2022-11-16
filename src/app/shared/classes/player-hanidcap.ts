export class PlayerHandicap {
    private playerId: string;
    private name: string;

    private handicap: number;
    private oldHandicap: number;

    private updatedAt: Date;

    private scores: number;
    private par: number;

    constructor(playerId: string, name: string, handicap: number, oldHandicap: number, updatedAt: Date) {
        this.playerId = playerId;
        this.name = name;
        this.handicap = handicap;
        this.oldHandicap = oldHandicap;
        this.updatedAt = updatedAt;
    }

    public getPlayerId(): string {
        if (this.playerId == null) {
            this.playerId = "";
        }
        return this.playerId;
    }

    public getName(): string {
        if (this.name == null) {
            this.name = "";
        }
        return this.name;
    }

    public getHandicap(): number {
        return this.handicap;
    }

    public setHandicap(handicap: number) {
        this.handicap = handicap;
    }

    public getHandicapString(): string {
        if (this.handicap < 0) {
            return "-";
        }
        return this.handicap.toString();
    }

    public getOldHandicap(): number {
        return this.oldHandicap;
    }
    
    public getUpdatedAt(): Date {
        return this.updatedAt;
    }

    public setUpdatedAt(updatedAt: Date) {
        this.updatedAt = updatedAt;
    }

    public getScores(): number {
        return this.scores;
    }

    public setScores(scores: number) {
        this.scores = scores;
    }

    public getPar(): number {
        return this.par;
    }

    public setPar(par: number) {
        this.par = par;
    }
}