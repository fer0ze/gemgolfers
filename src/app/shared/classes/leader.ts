import { Player, MemberStatus, enumPlayerCategory, TournamentMemberStatus } from '../models/player.model';
import { Score } from '../../shared/classes/score';
import { TournamentCategory, matchFormat } from '../models/tournament.model';

import { UniqueIdGenerator, General, handicapAllocation, Constants } from '../../shared/classes/general';

export class Leader {
  private position: number;
  private tied: boolean;

  private playerId: String;
  private name: String;
  private picture: String;

  private handicap: number;
  private score: number;
  private type: LeaderType;
  private status: MemberStatus;
  private extraData: String;

  private under: number;
  private points: number;
  private holes: number;
  private completed: boolean;

  private Leaderboard: any;
  private noOfHolesInCourse: number = 18;
  private activeRound: number;
  private totalRounds: number;
  private flightRound: number;
  private selectedCategoryValue: String;
  private roundFlights: any[] = [];

  playerScores: Score[];
  selectedCategory: TournamentCategory;
  memberStatusesQLs: TournamentMemberStatus[] = [];
  allMatchResults = [];

  constructor(Leaderboard: any, activeRound: number, flightRound: number, selectedCategoryValue: String) {
    this.Leaderboard = Leaderboard;
    this.activeRound = activeRound;
    this.flightRound = flightRound;
    this.selectedCategoryValue = selectedCategoryValue;
  }

  public parseSubscriptionResponse(): any {
    let tournamentData: any = this.Leaderboard;

    if (tournamentData == null) {
      return [];
    }

    this.memberStatusesQLs = tournamentData.MemberStatusesQL;
    // this.categories = tournamentData.CategoriesQL;
    // this.pairs = tournamentData.PairsQL;
    // this.ownRoleManager = tournamentData.OwnRoleManagerQL;
    // this.leaderboardAd = tournamentData.LeaderboardAdQL;

    if (this.Leaderboard.noOfRounds > 1) {
      let index: number = 0;

      for (let round = 1; round <= this.Leaderboard.noOfRounds; round++) {
        this.roundFlights[round - 1] = this.Leaderboard.FlightsQL.filter((a) => {
          return a.flightRound == round;
        });

        ////console.log(this.roundFlights[round - 1]);

        if (this.roundFlights[round - 1].length > 0) {
          ////console.log("not null");

          // if(this.Leaderboard.matchFormat == matchFormat.TEXAS_SCRAMBLE)
          //   this.createTexasScrampleLeaders(this.roundFlights[round - 1], round, true) 
          // else if(this.Leaderboard.matchFormat == matchFormat.BEST_THREE && this.Leaderboard.teamMatch)
          //   this.createBestThreeLeaders(this.roundFlights[round - 1], round, true) 
          // else if(this.Leaderboard.matchFormat == matchFormat.COMBINE_ALL && this.Leaderboard.teamMatch)
          //   this.createBestThreeLeaders(this.roundFlights[round - 1], round, true) 
          // else 
          this.createSimpleLeaders(this.roundFlights[round - 1], round);
        }

        index++;
      }
      ////console.log(this.allMatchResults);
      let grossAllArray: any[] = [];

      for (let key in this.allMatchResults)
        grossAllArray.push(this.allMatchResults[key]);

      ////console.log(grossAllArray);
      return grossAllArray;
    }
  }

  private createSimpleLeaders(flightsQLs: any[], round: number) {

    ////console.log("calling me once....");
    this.playerScores = [];

    let handicapAllocation: string = this.getHandicapAllocation();

    for (let flightData of flightsQLs) {

      ////console.log("Flight ID: " + flightData.id);
      let membersQLs: any = flightData.MembersQL;

      for (let membersQL of membersQLs) {

        ////console.log(membersQL);
        let playerId: String = membersQL.playerId;
        //let playerQL:Player = membersQL.PlayerQL;

        //this.players.push(playerQL);

        let player: Player = membersQL.PlayerQL;
        ////console.log(player);
        if (player == null) {
          continue;
        }

        if (this.selectedCategoryValue != null) {
          if (this.Leaderboard.members.length > 0) {
            let memberData = this.Leaderboard.members.find((a) => {
              return a.playerId == playerId;
            });
            if (memberData && memberData.category != player.playerCategory) {
              player.playerCategory = memberData.category;
            }
          }
          if (player.playerCategory !== this.selectedCategoryValue) {
            continue;
          }
        }


        let grossTotal: number = 0;
        let netTotal: number = 0;
        let grossUnderTotal: number = 0;
        let netUnderTotal: number = 0;
        let stableFordPointsTotal: number = 0;
        let handicap: number = 0;
        let scoreHandicap: number = 0;
        let holesPlayed: number = 0;
        let flightIds: String[] = [];
        let cntr: number = 0;

        let scores: any[] = membersQL.ScoresQL;

        if (scores.length <= 0)
          continue;

        for (let score of scores) {
          let objScore: Score = new Score(score.playerId, score.playerHandicap, score.hole.index, score.hole.par, score.grossScore);
          let gross: number = score.grossScore;

          if (gross <= 0) {
            continue;
          }

          grossTotal += gross;
          let currentNet: number = objScore.getNetScore(handicapAllocation);
          scores[cntr]["netScore"] = currentNet;

          grossUnderTotal += objScore.getGrossUnder();
          //netUnderTotal = netUnderTotal + objScore.getNetUnder(handicapAllocation);
          stableFordPointsTotal += objScore.getStablefordPoints(handicapAllocation);
          handicap += objScore.getPlayerHandicap(handicapAllocation);
          scoreHandicap = objScore.getPlayerHandicap(handicapAllocation);
          holesPlayed++;

          if (!flightIds.includes(score.flightId)) {
            flightIds.push(score.flightId);
          }
          cntr++;

          //if(player.id == "-L6192uVBlBFw3grUy9_")
          ////console.log("player: " + player.firstName + " ->" + gross + " -> " + currentNet + " ->" + netTotal + " ->" + score.HoleIPQL.holeNo);
        }

        let playerHole18ScoreGross: any[] = [];
        let playerHole18ScoreNet: any[] = [];

        for (let i = 0; i < 18; i++) {

          let hole = scores.find((a) => {
            return a.hole.holeNo == i + 1;
          });
          ////console.log(hole);

          if (hole) {
            playerHole18ScoreGross[i] = hole.grossScore;
            playerHole18ScoreNet[i] = hole.netScore;
          }
          else {
            playerHole18ScoreGross[i] = 0;
            playerHole18ScoreNet[i] = 0;
          }
        }

        ////console.log(scoreHandicap + " " + player.handicap);
        netTotal = grossTotal - scoreHandicap;
        // //console.log(netTotal);
        netUnderTotal = grossUnderTotal - scoreHandicap;

        let name: string = player.firstName + " " + player.lastName;
        let picture: string = player.picture;
        if (holesPlayed <= 0 || (handicap <= 0 && player.playerCategory != enumPlayerCategory.PROFESSIONALS)) {
          //handicap = player.getHandicap(handicapAllocation); // need to be discuss with zain bhai will it be the same as objScore.getPlayerHandicap
          handicap = player.handicap;
        } else {
          handicap = handicap / holesPlayed;
        }
        // let status: any = this.memberStatusesQLs.find(s => s.playerId === playerId );

        let extraData: string = player.extraData;
        let completed: boolean = holesPlayed > 0 && holesPlayed >= this.noOfHolesInCourse * flightIds.length;

        let LeaderGross: any = {
          position: 0,
          tied: false,
          playerId: playerId,
          name: name,
          picture: picture,
          handicap: handicap,
          score: grossTotal,
          type: LeaderType.GROSS,
          status: 0,
          extraData: extraData,
          under: grossUnderTotal,
          points: stableFordPointsTotal,
          holes: holesPlayed,
          completed: completed,
          holeScores: playerHole18ScoreGross
        }

        let LeaderNet: any = {
          position: 0,
          tied: false,
          playerId: playerId,
          name: name,
          picture: picture,
          handicap: handicap,
          score: netTotal,
          type: LeaderType.NET,
          status: 0,
          extraData: extraData,
          under: netUnderTotal,
          points: stableFordPointsTotal,
          holes: holesPlayed,
          completed: completed,
          holeScores: playerHole18ScoreNet
        }

        this.calculateTotal(LeaderGross, LeaderNet, round);

      }
    }


    //return { gross: this.grossLeaders, net: this.netLeaders };
  }

  private calculateTotal(leaderGross: any, leaderNet: any, round: number) {

    // let status: any = this.memberStatusesQLs.find(s => s.playerId === leaderGross.playerId );

    // if(status && this.activeRound > 1) return false;

    if (leaderGross.playerId in this.allMatchResults) {
      ////console.log("index exist"); 
    }
    else {
      this.allMatchResults[leaderGross.playerId] = [];

      this.allMatchResults[leaderGross.playerId]["position"] = "";

      this.allMatchResults[leaderGross.playerId]["TotalGross" + round] = 0;
      this.allMatchResults[leaderGross.playerId]["TotalNet" + round] = 0;
      this.allMatchResults[leaderGross.playerId]["roundStatus" + round] = leaderGross.status;
      this.allMatchResults[leaderGross.playerId]["TotalGrossUnder" + round] = 0;
      this.allMatchResults[leaderGross.playerId]["AllGrossUnder"] = 0;
      this.allMatchResults[leaderGross.playerId]["AllGrossPoints"] = 0;
      this.allMatchResults[leaderGross.playerId]["AllNetPoints"] = 0;

      this.allMatchResults[leaderGross.playerId]["TotalNetUnder" + round] = 0;
      this.allMatchResults[leaderGross.playerId]["AllNetUnder"] = 0;
      this.allMatchResults[leaderGross.playerId]["points" + round] += 0;
      this.allMatchResults[leaderGross.playerId]["holes" + round] += 0;

      ////console.log("index created"); 
    }

    if (!this.allMatchResults[leaderGross.playerId]["TotalGross" + round])
      this.allMatchResults[leaderGross.playerId]["TotalGross" + round] = 0;

    if (!this.allMatchResults[leaderGross.playerId]["TotalNet" + round])
      this.allMatchResults[leaderGross.playerId]["TotalNet" + round] = 0;

    if (!this.allMatchResults[leaderGross.playerId]["TotalGrossUnder" + round])
      this.allMatchResults[leaderGross.playerId]["TotalGrossUnder" + round] = 0;

    if (!this.allMatchResults[leaderGross.playerId]["TotalNetUnder" + round])
      this.allMatchResults[leaderGross.playerId]["TotalNetUnder" + round] = 0;

    this.allMatchResults[leaderGross.playerId]["position"] = "";
    this.allMatchResults[leaderGross.playerId]["playerId"] = leaderGross.playerId;
    this.allMatchResults[leaderGross.playerId]["name"] = leaderGross.name;
    this.allMatchResults[leaderGross.playerId]["picture"] = leaderGross.picture;
    this.allMatchResults[leaderGross.playerId]["handicap"] = leaderGross.handicap;
    this.allMatchResults[leaderGross.playerId]["TotalGross" + round] += leaderGross.score;
    this.allMatchResults[leaderGross.playerId]["TotalNet" + round] += leaderNet.score;
    this.allMatchResults[leaderGross.playerId]["roundStatus" + round] = leaderGross.status;
    this.allMatchResults[leaderGross.playerId]["extraData"] = leaderGross.extraData;

    this.allMatchResults[leaderGross.playerId]["TotalGrossUnder" + round] += leaderGross.under;
    this.allMatchResults[leaderGross.playerId]["AllGrossUnder"] += leaderGross.under;
    this.allMatchResults[leaderGross.playerId]["AllGrossPoints"] += leaderGross.score;
    this.allMatchResults[leaderGross.playerId]["TotalNetUnder" + round] += leaderNet.under;
    this.allMatchResults[leaderGross.playerId]["AllNetUnder"] += leaderNet.under;
    this.allMatchResults[leaderGross.playerId]["AllNetPoints"] += leaderNet.score;
    this.allMatchResults[leaderGross.playerId]["points" + round] = leaderGross.points;
    this.allMatchResults[leaderGross.playerId]["holes" + round] = leaderGross.holes;
    this.allMatchResults[leaderGross.playerId]["completed" + round] = leaderGross.completed;
    this.allMatchResults[leaderGross.playerId]["completed" + round] = leaderGross.completed;

    this.allMatchResults[leaderGross.playerId]["holeScoresGross" + round] = leaderGross.holeScores;
    this.allMatchResults[leaderGross.playerId]["holeScoresNet" + round] = leaderNet.holeScores;

    this.allMatchResults[leaderGross.playerId]["holeScoreLast9"] = leaderGross.holeScoreLast9;
    this.allMatchResults[leaderGross.playerId]["holeScoreLast6"] = leaderGross.holeScoreLast6;
    this.allMatchResults[leaderGross.playerId]["holeScoreLast3"] = leaderGross.holeScoreLast3;
    this.allMatchResults[leaderGross.playerId]["holeScoreLast1"] = leaderGross.holeScoreLast1;

    this.allMatchResults[leaderGross.playerId]["activeRound"] = this.activeRound;
    this.allMatchResults[leaderGross.playerId]["totalRounds"] = this.totalRounds;

    // (status)? this.allMatchResults[leaderGross.playerId]["status"] = 1 :
    //           this.allMatchResults[leaderGross.playerId]["status"] = 0;

    ////console.log(leaderGross.playerId + " -> " + "TotalGross" + round + " "  + this.allMatchResults[leaderGross.playerId]["TotalGross" + round]);
    return false;

  }

  getHandicapAllocation(): string {
    let hcAllocation: string;

    if (this.Leaderboard.handicapAllocations)
      hcAllocation = this.Leaderboard.handicapAllocations.handicapAllocation;
    else
      hcAllocation = handicapAllocation.AS_IS;

    return hcAllocation;
  }


}

export enum LeaderType {
  GROSS = "GROSS",
  NET = "NET",
  STABLEFORD = "STABLEFORD",
  NEW = "NEW",
}

export enum LeaderTypeValue {
  ALL = 0,
  GROSS = 1,
  NET = 2,
  STABLEFORD = 3,
}