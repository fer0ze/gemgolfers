import { ScoreStats } from './ScoreStats';
import { Score } from './score';
import { Flight } from '../models/flight.model';
import { Course } from '../models/course.model';

export class FlightScores {
    private flight: Flight;
    private scores: Score[];
    private course: Course;
    public scoreStats: ScoreStats;

    constructor(_flight: any, _scores: any[], _course: any) {
        this.flight = _flight;
        this.scores = _scores;
        this.course = _course;

        this.createScoreStats();
    }

    public createScoreStats(): void {
        if (this.scores == null) {
            return;
        }
        this.scoreStats = new ScoreStats();
        for (let score of this.scores) {
            this.scoreStats.addStatsFromScore(score);
        }
    }
}