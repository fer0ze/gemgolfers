import { CourseRating } from 'app/shared/classes/course-rating';

export class PlayerHandicapWhs {
    private playerId: string;
    private name: string;

    private oldHandicap: number;
    private handicapDifferential: number;

    private updatedAt?: Date;
    private playedAt: Date;

    private scores: number;
    private adjustedScores: number;

    private front9: boolean;
    private back9: boolean;
    
    private amongLowest: boolean;

    private handicapIndex?: number;
    private courseRating: CourseRating;

    constructor(playerId: string, name: string, oldHandicap: number, handicapDifferential: number, updatedAt: Date, playedAt: Date, scores: number, adjustedScores: number, front9: boolean, back9: boolean, handicapIndex?: number) {
        this.playerId = playerId;
        this.name = name;
        this.oldHandicap = oldHandicap;
        this.handicapDifferential = handicapDifferential;
        this.updatedAt = updatedAt;
        this.playedAt = playedAt;
        this.scores = scores;
        this.adjustedScores = adjustedScores;
        this.handicapIndex = handicapIndex;
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

    public getOldHandicapString(): string {
        if (this.oldHandicap < 0) {
            return "-";
        }
        return this.roundNumber(this.oldHandicap, 1).toString();
    }

    public getHandicapDifferential(): number {
        return this.handicapDifferential;
    }

    public setHandicapDifferential(handicapDifferential: number) {
        this.handicapDifferential = handicapDifferential;
    }

    public getHandicapString(): string {
        if (this.updatedAt == null) {
            return "-";
        }
        return this.handicapDifferential.toString();
    }

    public getUpdatedAt(): Date {
        return this.updatedAt;
    }

    public setUpdatedAt(updatedAt: Date) {
        this.updatedAt = updatedAt;
    }

    public getPlayedAt(): Date {
        return this.playedAt;
    }

    public getScores(): number {
        return this.scores;
    }

    public setScores(scores: number) {
        this.scores = scores;
    }

    public addScores(scores: number) {
        this.scores += scores;
    }

    public getAdjustedScores(): number {
        return this.adjustedScores;
    }

    public setAdjustedScores(adjustedScores: number) {
        this.adjustedScores = adjustedScores;
    }

    public addAdjustedScores(adjustedScores: number) {
        this.adjustedScores += adjustedScores;
    }

    public isAmongLowest(): boolean {
        return this.amongLowest;
    }

    public setAmongLowest(amongLowest: boolean) {
        this.amongLowest = amongLowest;
    }

    public setHandicapIndex(handicapIndex: number) {
        this.handicapIndex = handicapIndex;
    }
    
    public getHandicapIndex() : number {
        return this.handicapIndex;
    }

    public getHandicapIndexString() : string {
        if (this.handicapIndex == null) {
            return "-";
        }
        return this.roundNumber(this.handicapIndex, 1).toString();
    }

    public isFront9() : boolean {
        return this.front9;
    }

    public isBack9() : boolean {
        return this.back9;
    }
    
    public getCourseId() : string {
        return this.courseRating != null ? this.courseRating.getCourseId() : "";
    }
    
    public getCourseRating() : CourseRating {
        return this.courseRating;
    }

    public setCourseRating(courseRating?: CourseRating) {
        this.courseRating = courseRating;
    }
    
    private roundNumber(value, precision) {
        var multiplier = Math.pow(10, precision || 0);
        return Math.round(value * multiplier) / multiplier;
    }
}