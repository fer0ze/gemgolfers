import { ParStats } from './ParStats';
import { Score } from './score';

export class ScoreStats {
    private playedHoles: number = 0;
    private parTotal: number = 0;
    private grossTotal: number = 0;
    private netTotal: number = 0;

    private leftFairways: number = 0;
    private centerFairways: number = 0;
    private rightFairways: number = 0;
    private girs: number = 0;

    private yesSandSaves: number = 0;
    private totalSandSaves: number = 0;
    private yesUpAndDowns: number = 0;
    private totalUpAndDowns: number = 0;

    private puttsTotal: number = 0;
    private puttHoles: number = 0;
    private penaltiesTotal: number = 0;

    private putts1: number = 0;
    private putts2: number = 0;
    private putts3: number = 0;

    private shotsBirdies: number = 0;
    private shotsPars: number = 0;
    private shotsBogeys: number = 0;
    private shotsEagles: number = 0;
    private shotsDoubleBogeys: number = 0;
    private shotsThreeOrHigher: number = 0;

    private chancesForScramble: number = 0;
    private scrambles: number = 0;

    public par3Stats: ParStats = new ParStats();
    public par4Stats: ParStats = new ParStats();
    public par5Stats: ParStats = new ParStats();

    public topBirdiePlayer: any = null;
    public topBirdieValue: number = -1;

    public topParPlayer: any = null;
    public topParValue: number = -1;

    public easiestHole: any = null;
    public difficultHole: any = null;

    public birdyValue: any = -1;
    public bogeyValue: any = -1;

    public topEaglesPlayer: any = null;
    public topEaglesValue: number = -1;

    public birdiesMap = new Map();
    public parssMap = new Map();
    public bogeysMap = new Map();
    public eaglesMap = new Map();
    public holesMap = new Map();

    public getGirsPercent(): number {
        if (this.playedHoles > 0) {
            return this.girs / this.playedHoles * 100;
        }
        return 0;
    }

    public getShotsBirdies(): number {
        return this.shotsBirdies;
    }
    public getShotsPars(): number {
        return this.shotsPars;
    }
    public getShotsBogeys(): number {
        return this.shotsBogeys;
    }
    public getShotsDoubleBogeys(): number {
        return this.shotsDoubleBogeys;
    }

    public getSandSavePercent(): number {
        if (this.totalSandSaves > 0) {
            return this.yesSandSaves / this.totalSandSaves * 100;
        }
        return 0;
    }

    public getUpAndDownPercent(): number {
        if (this.totalUpAndDowns > 0) {
            return this.yesUpAndDowns / this.totalUpAndDowns * 100;
        }
        return 0;
    }

    public getPutts1Percent(): number {
        if (this.puttHoles > 0) {
            return this.putts1 / this.puttHoles * 100;
        }
        return 0;
    }

    public getPutts2Percent(): number {
        if (this.puttHoles > 0) {
            return this.putts2 / this.puttHoles * 100;
        }
        return 0;
    }

    public getPutts3Percent(): number {
        if (this.puttHoles > 0) {
            return this.putts3 / this.puttHoles * 100;
        }
        return 0;
    }

    public getShotsBirdiesPercent(): number {
        if (this.playedHoles > 0) {
            return this.shotsBirdies / this.playedHoles * 100;
        }
        return 0;
    }

    public getShotsParsPercent(): number {
        if (this.playedHoles > 0) {
            return this.shotsPars / this.playedHoles * 100;
        }
        return 0;
    }

    public getShotsBogeysPercent(): number {
        if (this.playedHoles > 0) {
            return this.shotsBogeys / this.playedHoles * 100;
        }
        return 0;
    }

    public getShotsDoubleBogeysPercent(): number {
        if (this.playedHoles > 0) {
            return this.shotsDoubleBogeys / this.playedHoles * 100;
        }
        return 0;
    }

    public getShotsThreeOrHigherPercent(): number {
        if (this.playedHoles > 0) {
            return this.shotsThreeOrHigher / this.playedHoles * 100;
        }
        return 0;
    }

    public getScramblePercent(): number {
        if (this.chancesForScramble > 0) {
            return this.scrambles / this.chancesForScramble * 100;
        }
        return 0;
    }

    addStatsFromScore(score: any): void {


        let objScore: Score = new Score(score.playerId, score.playerHandicap, score.hole.index, score.hole.par, score.grossScore);
        let gross: number = objScore.getGrossScore();
        if (gross <= 0) {
            return;
        }
        this.playedHoles++;
        let grossUnder: number = objScore.getGrossUnder();
        let par: number = gross - grossUnder;
        this.parTotal += par;
        this.grossTotal += gross;
        this.netTotal += objScore.getNetScoreEmpty();
        // Fairway fairway = score.getFairway();
        // switch (fairway) {
        //     case LEFT:
        //         leftFairways += 1;
        //         break;
        //     case CENTER:
        //         centerFairways += 1;
        //         break;
        //     case RIGHT:
        //         rightFairways += 1;
        //         break;
        // }
        // Gir gir = score.getGir();
        // if (gir == Gir.CENTER) {
        //     girs += 1;
        // }
        // Shot sandsave = score.getSandsave();
        // if (sandsave == Shot.YES) {
        //     yesSandSaves += 1;
        //     totalSandSaves += 1;
        // } else if (sandsave == Shot.NO) {
        //     totalSandSaves += 1;
        // }
        // Shot upAndDown = score.getUpAndDown();
        // if (upAndDown == Shot.YES) {
        //     yesUpAndDowns += 1;
        //     totalUpAndDowns += 1;
        // } else if (upAndDown == Shot.NO) {
        //     totalUpAndDowns += 1;
        // }
        // int putts = score.getPutts();
        // if (putts > 0) {
        //     puttsTotal += putts;
        //     puttHoles += 1;
        //     switch (putts) {
        //         case 1:
        //             putts1 += 1;
        //             break;
        //         case 2:
        //             putts2 += 1;
        //             break;
        //         case 3:
        //             putts3 += 1;
        //             break;
        //     }
        // }
        // this.penaltiesTotal += objScore.getPenalties();
        if (grossUnder == -1) {
            this.shotsBirdies += 1;
            this.birdiesMap.set(score.playerId, { name: score.player.firstName + ' ' + score.player.lastName, value: this.shotsBirdies })
        } else if (grossUnder == 0) {
            this.shotsPars += 1;
            this.parssMap.set(score.playerId, { name: score.player.firstName + ' ' + score.player.lastName, value: this.shotsPars })
        } else if (grossUnder == 1) {
            this.shotsBogeys += 1;
            this.bogeysMap.set(score.playerId, { name: score.player.firstName + ' ' + score.player.lastName, value: this.shotsBogeys })
        } else if (grossUnder == -2) {
            this.shotsEagles += 1;
            this.eaglesMap.set(score.playerId, { name: score.player.firstName + ' ' + score.player.lastName, value: this.shotsEagles })
        } else if (grossUnder == 2) {
            this.shotsDoubleBogeys += 1;

        } else if (grossUnder >= 3) {
            this.shotsThreeOrHigher += 1;
        }
        this.holesMap.set(score.holeId, { holeNo: score.hole.holeNo, par: score.hole.par, 'birdies': this.shotsBirdies, 'eagles': this.shotsEagles, 'pars': this.shotsPars, 'bogeys': this.shotsBogeys })

        // if (gir == Gir.LEFT || gir == Gir.RIGHT || gir == Gir.UP || gir == Gir.DOWN || fairway == Fairway.LEFT || fairway == Fairway.RIGHT) {
        //     chancesForScramble += 1;
        //     if (grossUnder <= 0) {
        //         scrambles += 1;
        //     }
        // }
        switch (par) {
            case 3:
                this.par3Stats.addStatsFromScore(gross, grossUnder);
                break;
            case 4:
                this.par4Stats.addStatsFromScore(gross, grossUnder);
                break;
            case 5:
                this.par5Stats.addStatsFromScore(gross, grossUnder);
                break;
        }
    }

    public addScoreStats(scoreStats: ScoreStats): void {
        this.playedHoles += scoreStats.playedHoles;
        this.parTotal += scoreStats.parTotal;
        this.grossTotal += scoreStats.grossTotal;
        this.netTotal += scoreStats.netTotal;

        this.leftFairways += scoreStats.leftFairways;
        this.centerFairways += scoreStats.centerFairways;
        this.rightFairways += scoreStats.rightFairways;
        this.girs += scoreStats.girs;

        this.yesSandSaves += scoreStats.yesSandSaves;
        this.totalSandSaves += scoreStats.totalSandSaves;
        this.yesUpAndDowns += scoreStats.yesUpAndDowns;
        this.totalUpAndDowns += scoreStats.totalUpAndDowns;

        this.puttsTotal += scoreStats.puttsTotal;
        this.puttHoles += scoreStats.puttHoles;
        this.penaltiesTotal += scoreStats.penaltiesTotal;

        this.putts1 += scoreStats.putts1;
        this.putts2 += scoreStats.putts2;
        this.putts3 += scoreStats.putts3;

        this.shotsBirdies += scoreStats.shotsBirdies;
        this.shotsPars += scoreStats.shotsPars;
        this.shotsBogeys += scoreStats.shotsBogeys;
        this.shotsDoubleBogeys += scoreStats.shotsDoubleBogeys;
        this.shotsThreeOrHigher += scoreStats.shotsThreeOrHigher;

        this.chancesForScramble += scoreStats.chancesForScramble;
        this.scrambles += scoreStats.scrambles;

        this.birdiesMap = scoreStats.birdiesMap;
        this.parssMap = scoreStats.parssMap;
        this.bogeysMap = scoreStats.bogeysMap;
        this.holesMap = scoreStats.holesMap;

        this.par3Stats.addParStats(scoreStats.par3Stats);
        this.par4Stats.addParStats(scoreStats.par4Stats);
        this.par5Stats.addParStats(scoreStats.par5Stats);
    }

    setTopBirdies(scoreStats: any) {

        // First time: assign whole map
        if (this.birdiesMap.size === 0) {
            this.birdiesMap = scoreStats.birdiesMap;
        }

        // Now check for highest in this map
        for (let [playerId, value] of scoreStats.birdiesMap) {
            if (value.value > this.topBirdieValue) {
                this.topBirdieValue = value.value;
                this.topBirdiePlayer = value.name;
            }
        }
    }
    setTopEagles(scoreStats: any) {

        // First time: assign whole map
        if (this.eaglesMap.size === 0) {
            this.eaglesMap = scoreStats.eaglesMap;
        }

        // Now check for highest in this map
        for (let [playerId, value] of scoreStats.eaglesMap) {
            if (value.value > this.topEaglesValue) {
                this.topEaglesValue = value.value;
                this.topEaglesPlayer = value.name;
            }
        }
    }
    setTopPars(scoreStats: any) {

        // First time: assign whole map
        if (this.parssMap.size === 0) {
            this.parssMap = scoreStats.parssMap;
        }

        // Now check for highest in this map
        for (let [playerId, value] of scoreStats.parssMap) {
            if (value.value > this.topParValue) {
                this.topParValue = value.value;
                this.topParPlayer = value.name;
            }
        }
    }

    setHoles(holesMap: any) {


        // Now check for highest in this map
        for (let [holeId, value] of holesMap) {
            if (value.birdies > this.birdyValue) {
                this.birdyValue = value.birdies
                this.easiestHole = { holeNo: value.holeNo, par: value.par }
            }
            if (value.bogeys > this.birdyValue) {
                this.bogeyValue = value.bogeys
                this.difficultHole = { holeNo: value.holeNo, par: value.par }
            }
        }
    }
}