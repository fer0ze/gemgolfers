import { Score } from '../classes/score';
import { FlightScores } from 'app/shared/classes/FlightScores';
import { Flight } from 'app/shared/models/flight.model';
import { Course } from 'app/shared/models/course.model';
import { ScoreStats } from 'app/shared/classes/ScoreStats';

export class AppStats {
    private data: any;
    private playerFlightScores: FlightScores[] = [];
    private courses: any;

    constructor(data: any, courses: any) {
        this.data = data;
        this.courses = courses;
    }

    public getApplicationStats() {
        for (let flightQL of this.data) {
            let memberQLs: any = flightQL.MembersQL;

            //this.barChartDataGross = [];
            //this.barChartDataNet = [];

            for (let memberQL of memberQLs) {
                let scoresQLs: any = memberQL.ScoresQL;
                if (scoresQLs.length == 0) {
                    // Do not add flights without score
                    continue;
                }
                ////console.log(scoresQLs);

                let scores: any[] = [];

                for (let scoreQL of scoresQLs) {
                    //ScoreQL scoreQL = scoresQL.getFragments().getScoreQL();
                    if (scoreQL.grossScore <= 0) {
                        continue;
                    }

                    //let score: Score;
                    //let detailQL: any = scoreQL.detailQL;
                    //if (detailQL != null) {
                    //score = QLModelMapper.scoreQlToModel(scoreQL, detailQL.getFragments().getScoreDetailQL());
                    //} else {
                    //score = QLModelMapper.scoreQlToModel(scoreQL);
                    //}
                    //scores.add(score);
                    scores.push(scoreQL);
                }

                if (scores.length == 0) {
                    // Do not add flights without score
                    continue;
                }

                let flight: Flight = flightQL;

                let course: Course = this.courses;

                this.playerFlightScores.push(
                    new FlightScores(flight, scores, course)
                );
            }
        }

        // console.log(this.playerFlightScores);
        let finalScoreStats: ScoreStats = new ScoreStats();
        for (let stats of this.playerFlightScores) {
            finalScoreStats.addScoreStats(stats.scoreStats);
            finalScoreStats.setTopBirdies(stats.scoreStats);
            finalScoreStats.setTopPars(stats.scoreStats);
            finalScoreStats.setTopEagles(stats.scoreStats);

            // console.log(finalScoreStats.birdiesMap);

        }

        finalScoreStats.setHoles(finalScoreStats.holesMap);

        return finalScoreStats;
    }
}
