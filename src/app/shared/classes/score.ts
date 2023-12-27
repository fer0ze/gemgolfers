import {
  HandicapAllocation,
  TexasScrampleTeamSize,
} from "../models/tournament.model";

export class Score {
  private playerId: string;

  private playerHandicap: number;
  private holeIndex: number;
  private holePar: number;

  private grossScore: number;
  private updatedAt: string;
  private updaterName: string;

  constructor(
    playerId: string,
    playerHandicap: number,
    holeIndex: number,
    holePar: number,
    grossScore: number
  ) {
    this.playerId = playerId;
    this.playerHandicap = playerHandicap;
    this.holeIndex = holeIndex;
    this.grossScore = grossScore;
    this.holePar = holePar;
  }

  public getVersusScore(
    backMarkerHandicap: number,
    handicapAllocation: string
  ): number {
    let handicap: number = this.getVersusHandicap(
      backMarkerHandicap,
      handicapAllocation
    );
    //console.log(this.playerId + " " + handicap + " " + backMarkerHandicap + " " + handicapAllocation + " " + this.holeIndex + " " + this.grossScore);
    return this.holeIndex <= handicap ? this.grossScore - 1 : this.grossScore;
  }

  private getVersusHandicap(
    backMarkerHandicap: number,
    handicapAllocation: string
  ): number {
    let handicap: number = this.playerHandicap - backMarkerHandicap;
    let multiplier: number = 1.0;

    switch (handicapAllocation) {
      case HandicapAllocation.AS_IS:
        return handicap;
      case HandicapAllocation.THREE_FOURTH:
        multiplier = 0.75;
        break;
      case HandicapAllocation.HALF:
        multiplier = 0.5;
        break;
      case HandicapAllocation.ONE_FOURTH:
        multiplier = 0.25;
        break;
      case HandicapAllocation.ONE_TENTH:
        multiplier = 0.1;
        break;
    }
    return Math.round(handicap * multiplier);
  }

  public getNetScoreEmpty(): number {
    if (this.grossScore <= 0) {
      return 0;
    }
    let timesGreater: number = this.playerHandicap / 18;
    let mod: number = this.playerHandicap % 18;
    if (mod >= this.holeIndex) {
      timesGreater += 1;
    }
    return this.grossScore - timesGreater;
  }

  public getNetScore(handicapAllocation: string): number {
    if (this.grossScore <= 0) {
      return 0;
    }

    let versusHandicap: number = this.getVersusHandicap(0, handicapAllocation);
    let timesGreater: number = Math.trunc(versusHandicap / 18);
    let mod: number = Math.trunc(versusHandicap % 18);

    if (mod >= this.holeIndex) {
      timesGreater += 1;
    }

    return this.grossScore - timesGreater;
  }

  public getTexasScrambleNetScore(
    team: number,
    combinedHandicap: number
  ): number {
    if (this.grossScore <= 0) {
      return 0;
    }

    let versusHandicap: number = this.getPlayerTSHandicap(
      team,
      combinedHandicap
    );
    let timesGreater: number = Math.trunc(versusHandicap / 18);
    let mod: number = Math.trunc(versusHandicap % 18);

    if (mod >= this.holeIndex) {
      timesGreater += 1;
    }

    return this.grossScore - timesGreater;
  }
  public getScrambleNetScore(
    team,
    combinedHandicap,
  ) {
    if (this.grossScore <= 0) {
      return 0;
    }
    let timesGreater = Math.trunc(combinedHandicap / 18);
    let mod = Math.trunc(combinedHandicap % 18);

    if (mod >= this.holeIndex) {
      timesGreater += 1;
    }

    return this.grossScore - timesGreater;
  }
  public getGrossScore(): number {
    return this.grossScore;
  }

  public getGrossUnder(): number {
    return this.grossScore > 0 ? this.grossScore - this.holePar : 0;
  }

  public getNetUnder(handicapAllocation: string): number {
    return this.grossScore > 0
      ? this.getNetScore(handicapAllocation) - this.holePar
      : 0;
  }

  public getStablefordPoints(handicapAllocation: string): number {
    return this.grossScore > 0
      ? Math.max(2 + this.holePar - this.getNetScore(handicapAllocation), 0)
      : 0;
  }

  public getPlayerHandicap(handicapAllocation: string): number {
    let multiplier: number = 1.0;
    switch (handicapAllocation) {
      case HandicapAllocation.AS_IS:
        return Math.round(this.playerHandicap);
      case HandicapAllocation.THREE_FOURTH:
        multiplier = 0.75;
        break;
      case HandicapAllocation.HALF:
        multiplier = 0.5;
        break;
      case HandicapAllocation.ONE_FOURTH:
        multiplier = 0.25;
        break;
      case HandicapAllocation.ONE_TENTH:
        multiplier = 0.1;
        break;
    }
    return Math.round(this.playerHandicap * multiplier);
  }

  //Handicap Allowance: Team of four = 1/10th of combined handicaps, Team of three = 1/8th of combined handicaps
  public getPlayerTSHandicap(team: number, combinedHandicap: number): number {
    let handicap: number = 0;
    switch (team) {
      case TexasScrampleTeamSize.FOURH:
        handicap = combinedHandicap / 10;
        break;
      case TexasScrampleTeamSize.THREE:
        handicap = combinedHandicap / 8;
        break;
      case TexasScrampleTeamSize.TWO:
        handicap = combinedHandicap / 6;
        break;
    }

    return Math.round(handicap);
  }
  public getPlayerTSHandicaps(
    handicapAlc: string,
    team: number,
    combinedHandicap: number
  ): any {
    let handicap: number = 0;
    switch (team) {
      case TexasScrampleTeamSize.FOURH:
        handicap = combinedHandicap / 10;
        break;
      case TexasScrampleTeamSize.THREE:
        handicap = combinedHandicap / 8;
        break;
      case TexasScrampleTeamSize.TWO:
        handicap = combinedHandicap / 6;
        break;
    }
    switch (handicapAlc) {
      case HandicapAllocation.AS_IS:
        return Math.round(handicap);
      case HandicapAllocation.THREE_FOURTH:
        return Math.round(handicap).toFixed(2);
        break;
      case HandicapAllocation.HALF:
        return Math.round(handicap).toFixed(2);
        break;
      case HandicapAllocation.ONE_FOURTH:
        return Math.round(handicap).toFixed(2);
        break;
      case HandicapAllocation.ONE_TENTH:
        return Math.round(handicap)
        break;
      case HandicapAllocation.ONE_TENTH_DEC:
        return handicap.toFixed(1)
        break;
    }
  }
  public toFixed(num, fixed) {
    var re = new RegExp('^-?\\d+(?:\.\\d{0,' + (fixed || -1) + '})?');
    return num.toString().match(re)[0];
  }
}
