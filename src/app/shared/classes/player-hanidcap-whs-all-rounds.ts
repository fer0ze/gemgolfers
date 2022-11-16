export class PlayerHandicapWhsAllRounds {
    private playerId: string;
    private name: string;

    private oldHandicap: number;
    private handicapIndex: number;
    private handicapDifferential: number;

    private updatedAt?: Date;
    
    private scores: number[] =[];
    private adjustedScores: number[] = [];

    constructor(playerId: string, name: string, oldHandicap: number, noOfRounds: number) {
        this.playerId = playerId;
        this.name = name;
        this.oldHandicap = oldHandicap;

        for (var i = 0; i < noOfRounds; i++) {
            this.scores[i] = 0;
            this.adjustedScores[i] = 0;
        }
        
        this.handicapIndex = -1;
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

    public getOldHandicap(): number {
        return this.oldHandicap;
    }

    public getHandicapDifferential(): number {
        return this.handicapDifferential;
    }

    public setHandicapDifferential(handicapDifferential: number) {
        this.handicapDifferential = handicapDifferential;
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

    public getHandicapIndexString(): string {
        if (this.handicapIndex < 0) {
            return "-";
        }
        return this.handicapIndex.toString();
    }

    public setHandicapIndex(handicapIndex: number) {
        this.handicapIndex = handicapIndex;
    }

    public getUpdatedAt(): Date {
        return this.updatedAt;
    }

    public setUpdatedAt(updatedAt?: Date) {
        this.updatedAt = updatedAt;
    }

    public getScore(round: number): number {
        if (this.scores.length < round) {
            return 0;
        }
        return this.scores[round - 1];
    }

    public setScore(score: number, round: number) {
        if (this.scores.length < round) {
            return;
        }
        this.scores[round - 1] = score;
    }

    public getAdjustedScores(round: number): number {
        if (this.adjustedScores.length < round) {
            return 0;
        }
        return this.adjustedScores[round - 1];
    }

    public setAdjustedScores(adjustedScores: number, round: number) {
        //console.log(adjustedScores);
        //console.log(this.adjustedScores);
        if (this.adjustedScores.length < round) {
            return;
        }
        this.adjustedScores[round - 1] = this.truncateDecimals(adjustedScores, 2);
    }

    public getScoreString(round: number): string {
        let score: number = this.getScore(round);
        if (score <= 0) {
            return "-";
        }
        return score + " (" + this.truncateDecimals(this.getAdjustedScores(round), 2) + ")";
    }

    private truncateDecimals (num, fixed) {
        var re = new RegExp('^-?\\d+(?:\.\\d{0,' + (fixed || -1) + '})?');
        return num.toString().match(re)[0];
    }
    
}