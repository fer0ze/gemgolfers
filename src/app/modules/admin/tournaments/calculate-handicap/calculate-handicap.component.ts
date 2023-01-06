import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute   } from '@angular/router';
import { Player, PlayerHanidcap, handicap_change_log } from '../../../../shared/models/player.model';
import { Tournament } from '../../../../shared/models/tournament.model';
import { Hole } from '../../../../shared/models/hole.model';
import { FacadeService } from '../../../../shared/services/facade.service';
import { General, Constants, UniqueIdGenerator } from '../../../../shared/classes/general';
import { TournamentRoundScoresLoader } from '../../../../shared/helper/TournamentRoundScoresLoader';
import { of } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-calculate-handicap',
  templateUrl: './calculate-handicap.component.html',
  styleUrls: ['./calculate-handicap.component.scss']
})
export class CalculateHandicapComponent implements OnInit {

  dataSource: MatTableDataSource<any>;
  displayedColumns = ['id', 'name', 'oldhandicap', 'handicap', 'updated'];

  protected playerList: any[] = [];
  protected roundPlayerScores: any[] = [];
  private playerHandicapList: PlayerHanidcap[] = [];
  private HandicapChangelog: handicap_change_log[] = [];
  private players: Player[] = [];
  isUpdated: boolean = false;
  loggedInuser: Player;

  private scoresQuery: TournamentRoundScoresLoader;

  private tournamentID: string;
  tournamentData: any;
  isLoading: boolean = true;
  activeRound: number = 1;
  noOfRounds: number = 1;
  selected: string = "congo";

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private router: Router, private route: ActivatedRoute, private location: Location, public snackBar: MatSnackBar, public dialog: MatDialog, public facadeService: FacadeService) { }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;

    if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
    }
  }

  async ngOnInit() {
    
    //console.log(this.route.snapshot.paramMap.get("id"));

    this.route.paramMap.subscribe(params => {
      this.tournamentID = params.get("id");
    })
    console.log(this.tournamentID);
    if(this.tournamentID) {
      
      of(this.tournamentData).pipe()
      .subscribe(async data => {
        let dataFullTournament = await this.facadeService.tournamentScoreLoader(this.tournamentID);

        console.log(dataFullTournament);
        
        if(dataFullTournament.TournamentQL) {
          this.tournamentData = dataFullTournament.TournamentQL
          this.isLoading = false;

          this.activeRound = this.tournamentData.activeRound;
          this.noOfRounds = this.tournamentData.noOfRounds;

          for (let i = 1; i <= this.noOfRounds; i++) {      
            this.parseTournamentScores(i);
          }

          this.dataSource = new MatTableDataSource(this.playerList);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }

       console.log(this.tournamentData);
      });
    }
    else {
      this.location.back();
    }
  }

  parseTournamentScores(round: number) {
    let flightsQLs = this.tournamentData.FlightsQL;

    let roundFlights = flightsQLs.filter((a) => {
      return a.flightRound == round;
    });

    if(this.tournamentData.singleRound && roundFlights.length == 0) {
      roundFlights = flightsQLs.filter((a) => {
        return a.flightRound == round - 1;
      });
    }

    let roundList: any = [];
    
    for (let flightsQL of roundFlights) {
      let membersQLs: any = flightsQL.MembersQL;
      for (let membersQL of membersQLs) {
          let playerId: string = membersQL.playerId;
          
          let exist = roundList.find((p) => {
            return p.id == playerId;
          });

          //console.log(exist);
          if(exist) continue;

          let playerQL: Player = membersQL.PlayerQL;
          
          // sum of scores and par of played holes
          let scores: number = 0;
          let par: number = 0;
          let oldHandicap: number = -1;
          let latestHandicap: number = -1;
          let dateUpdate: Date;
          let scoresList: any[] = membersQL.ScoresQL;
          let holesPlayed: number = (scoresList && scoresList.length > 0)? scoresList.length : 0;

          let playerCategoryLowerCased: string = playerQL.playerCategory.toLowerCase();
          if (playerCategoryLowerCased.includes("professional")) {
              // no handicap change for professionals
              continue;
          }
          
          if (scoresList == null || scoresList.length == 0) {
              continue;
          }
          
          if (scoresList != null) {
              for (let score of scoresList) {
                  scores += score.grossScore;
                  par += score.HoleIPQL.par;
              }
          }

          // get existing player handicap object of this player...
          let playerHandicapQL: any = this.tournamentData.PlayerHandicapsQL;
          
          if (playerHandicapQL.length > 0) {
            console.log(playerHandicapQL);

            let currentHandicapList = playerHandicapQL.filter((a) => {
              return a.playerId == playerId;
            });
            
            for(let handicap of currentHandicapList) {
              console.log(handicap);
              dateUpdate = handicap.updatedAt;
              latestHandicap = handicap.handicap;
              oldHandicap = handicap.oldHandicap;
            }

            this.isUpdated = true;
          }
          else this.isUpdated = false;

          console.log(this.isUpdated);

          // set sum of scores and par in player handicap object of this player
          let hanidcapList: any = {
            id: playerId,
            name: playerQL.firstName + " " + playerQL.lastName,
            oldhandicap: (oldHandicap == -1)? playerQL.handicap : oldHandicap,
            handicap: latestHandicap,
            updatedAt: (dateUpdate)? General.parseToDate(dateUpdate.toString()) : '',
            scores: scores,
            par: par,
            player: playerQL,
            holesPlayed: holesPlayed,
            isCompleted: (holesPlayed == 18)? true : false
          }
          // playerHandicap.setScores(scores);
          // playerHandicap.setPar(par);
          
          let found = this.playerList.find((p) => {
            return p.id == playerId;
          });

          if(!found) this.playerList.push(hanidcapList);

          roundList.push(hanidcapList);
      }
    }

    if(roundList.length > 0) this.roundPlayerScores.push(roundList);
    console.log(this.roundPlayerScores);
  }

  calculateHandicap() {
    // let date: Date = new Date();
    // this.isUpdated = true;

    // for (let playerHandicap of this.playerList) {
    //   //console.log(playerHandicap);
    //   let handicap: number = playerHandicap.oldhandicap;
    //   let buffer: number;
    //   let multiplier: number;

    //   if (handicap < 5) {
    //       // Zone 1
    //       buffer = 1;
    //       multiplier = 0.1;
    //   } else if (handicap >= 10) {
    //       // Zone 3
    //       buffer = 3;
    //       multiplier = 0.3;
    //   } else {
    //       // Zone 2
    //       buffer = 2;
    //       multiplier = 0.2;
    //   }
      
    //   let scoreDiff: number = playerHandicap.scores - playerHandicap.par;
    //   //console.log(scoreDiff + "<>" + buffer + "<>" + multiplier);
    //   if (scoreDiff > buffer) {
    //       handicap += multiplier;
    //   } else if (scoreDiff < 0) {
    //       handicap += scoreDiff * multiplier;
    //   }
    //   console.log(handicap);
    //   playerHandicap.handicap = (handicap < 0)? 0 : handicap;
    //   playerHandicap.updatedAt = General.parseToDate(date.toDateString());
      
    //   playerHandicap.player.handicap = Math.round(handicap);
    //   delete playerHandicap.player.membership;
    //   delete playerHandicap.player.__typename;

    //   let handicaps: PlayerHanidcap = {
    //     playerId: playerHandicap.id,
    //     tournamentId: this.tournamentID,
    //     handicap: playerHandicap.handicap,
    //     oldHandicap: playerHandicap.oldhandicap,
    //     updatedAt: playerHandicap.updatedAt
    //   }

    //   this.players.push(playerHandicap.player);

    //   this.playerHandicapList.push(handicaps);
    // }
    
    // this.facadeService.savePlayerHandicaps(this.playerHandicapList, this.players);

    let date: Date = new Date();
    //let players: Hash<String, Player> = scoresQuery().getPlayers();
    let changeLogs: Array<handicap_change_log> = new Array<handicap_change_log>();
    let changeLogRemarks: string = "Handicap Calculation from Web";
    let tournamentId: string = this.tournamentID;

    this.loggedInuser = JSON.parse(localStorage.getItem(Constants.LOGGED_IN_USER));

    let updaterId: string = this.loggedInuser.id;

    // Formula CONGO
    // 1. Get Buffer and Multiplier according to handicap zone
    // Zone 1: Handicap between 0 - 4.4, Buffer = 1, Multiplier = 0.1
    // Zone 2: Handicap between 4.5 - 9.4, Buffer = 2, Multiplier = 0.2
    // Zone 3: Handicap between 9.5 - 18.4, Buffer = 3, Multiplier = 0.3
    // Zone 4: Handicap between 18.5 - 36.4, Buffer = 5, Multiplier = 0.5
    // 2. Find score difference between player total net score and course par
    // ScoreDiff = NetScore - CoursePar
    // 3. If ScoreDiff > Buffer, then
    // NewHandicap = OldHandicap + 0.1
    // 4. Else if ScoreDiff < 0, then
    // NewHandicap = OldHandicap + (ScoreDiff * Multiplier)


    // Zone 1: 0 - 4.4, above buffer 1 (+0.1), below par (-0.1 x scoreDiff)
    // Zone 2: 4.5 - 9.4, above buffer 2 (+0.1), below par (-0.2 x scoreDiff)
    // Zone 3: 9.5 - 18.4, above buffer 3 (+0.1), below par (-0.3 x scoreDiff)
    // Zone 4: 18.5 - 36.4, above buffer 5 (+0.1), below par (-0.5 x scoreDiff)

    let bdIncrement: number = 0.1;
    let bdDecrementZone1: number = 0.1;
    let bdDecrementZone2: number = 0.2;
    let bdDecrementZone3: number = 0.3;
    let bdDecrementZone4: number = 0.5;
    let bdDecrement: number;
    let noOfRounds: number = this.tournamentData.noOfRounds;

    for (let playerHandicapList of this.playerList) {
    let handicap: number = playerHandicapList.oldhandicap;
    let netScore: number = 0;
    for (let i = 1; i <= noOfRounds; i++) {
      let roundPlyerList = this.roundPlayerScores[i - 1];
      let playerHandicap = roundPlyerList.find((a) => {
        return a.id == playerHandicapList.id;
      });
        if (!playerHandicap || !playerHandicap.isCompleted) {
            continue;
        }
        
        let veteran9Holes: boolean = false;
        if (playerHandicap.holesPlayed == 9 && playerHandicap.player.playerCategory.toLowerCase().search("veteran") != -1) veteran9Holes = true;

        let zoneHandicap: number = handicap;
        if (veteran9Holes) {
          zoneHandicap *= 0.5; // use half handicap
          if (playerHandicap.holesPlayed < 9) {
              if (zoneHandicap == 4.5) {
                  zoneHandicap = 4;
              } else if (zoneHandicap == 9.5) {
                  zoneHandicap = 9;
              } else if (zoneHandicap == 18.5) {
                  zoneHandicap = 18;
              }
          }
        }
        let netTotal = playerHandicap.scores - General.precisionRound(handicap, 0);
        let scoreDiff: number = netTotal - playerHandicap.par;
        if (scoreDiff >= 0) {
            let buffer: number;
            if (zoneHandicap < 4.5) {
                // Zone 1
                buffer = 1;
            } else if (zoneHandicap < 9.5) {
                // Zone 2
                buffer = 2;
                if (veteran9Holes) {
                    buffer = 1;  // use half buffer
                }
            } else if (zoneHandicap < 18.5) {
                // Zone 3
                buffer = 3;
                if (veteran9Holes) {
                    buffer = 2; // use half buffer
                }
            } else {
                // Zone 4
                buffer = 5;
                if (veteran9Holes) {
                    buffer = 3; // use half buffer
                }
            }
            if (scoreDiff > buffer) {
              handicap = handicap + bdIncrement;
            }
        } else {
          while (scoreDiff < 0) {
              // must do this in loop as zone could change during the calculation
              if (zoneHandicap < 4.5) {
                  // Zone 1
                  bdDecrement = bdDecrementZone1;
              } else if (zoneHandicap < 9.5) {
                  // Zone 2
                  bdDecrement = bdDecrementZone2;
              } else if (zoneHandicap < 18.5) {
                  // Zone 3
                  bdDecrement = bdDecrementZone3;
              } else {
                  // Zone 4
                  bdDecrement = bdDecrementZone4;
              }
              handicap = handicap - bdDecrement;
              
              zoneHandicap = General.truncateDecimals(handicap, 2);
              scoreDiff += 1;
          }
        }
        playerHandicap.handicap = General.precisionRound(handicap, 1);
        netScore = netScore + netTotal;
      }
      playerHandicapList.handicap = (handicap < 0)? 0 : General.precisionRound(handicap, 1);
      playerHandicapList.updatedAt = General.parseToDate(date.toDateString());
      
      //playerHandicap.player.handicap = Math.round(handicap);
      playerHandicapList.player.handicap = General.precisionRound(handicap, 1);
      delete playerHandicapList.player.membership;
      delete playerHandicapList.player.__typename;

      let handicaps: PlayerHanidcap = {
        playerId: playerHandicapList.id,
        tournamentId: this.tournamentID,
        handicap: playerHandicapList.handicap,
        oldHandicap: playerHandicapList.oldhandicap,
        updatedAt: playerHandicapList.updatedAt,
        score: netScore
      }

      let handicaplog: handicap_change_log = {
        id: UniqueIdGenerator.generate(),
        playerId: playerHandicapList.id,
        tournamentId: this.tournamentID,
        newHandicap: playerHandicapList.handicap,
        oldHandicap: playerHandicapList.oldhandicap,
        dateTime: playerHandicapList.updatedAt,
        whs: false,
        remarks: "",
        updaterId :  this.loggedInuser.id
      }
      
      let clonePlayer = Object.assign({}, playerHandicapList.player);
      delete clonePlayer.handicapQL;
      console.log(clonePlayer);
      this.HandicapChangelog.push(handicaplog);
      this.players.push(clonePlayer);

      this.playerHandicapList.push(handicaps);
    }

    console.log(this.players);
    console.log(this.playerHandicapList);
    this.facadeService.savePlayerHandicaps(this.playerHandicapList, this.players, this.HandicapChangelog);
    this.isUpdated = true;
  }

  switchHandicapSystem(item) {
    this.router.navigate(['/tournaments/handicap-whs/' + this.tournamentID]);
  }

}
