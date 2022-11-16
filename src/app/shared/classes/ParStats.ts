export class ParStats {
    private par: number;

    private holes: number = 0;
    private scores: number = 0;
    private unders: number = 0;
    private betters: number = 0;
    private onPars: number = 0;

    constructor() {
        
    }

    public getAvgScores(): number {
        if (this.holes > 0) {
            return this.scores / this.holes;
        }
        return 0;
    }

    public getOnParPercent(): number {
        if (this.holes > 0) {
            return this.onPars / this.holes * 100;
        }
        return 0;
    }

    addStatsFromScore(score: number, under: number): void {
        
        this.holes += 1;
        this.scores += score;
        this.unders += under;
        if (under <= 0) {
            this.betters += 1;
        }
        if (score <= this.par) {
            this.onPars++;
        }
    }

    addParStats(parStats: ParStats): void {
        this.holes += parStats.holes;
        this.scores += parStats.scores;
        this.unders += parStats.unders;
        this.betters += parStats.betters;
        this.onPars += parStats.onPars;
    }
}