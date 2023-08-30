import { Component, OnInit, Inject, ViewChild, ElementRef, Input,Output, EventEmitter} from '@angular/core';
import { Router,ActivatedRoute} from '@angular/router'
import { MatPaginator } from '@angular/material/paginator';
import {  MatSort } from '@angular/material/sort';
import {  MatTableDataSource } from '@angular/material/table';
import {  MatDialog } from '@angular/material/dialog';
import {   MatSnackBar } from '@angular/material/snack-bar';
import { Player,TournamentMemberStatus} from '../../../../shared/models/player.model';
import { Hole } from '../../../../shared/models/hole.model';
import { FormArray, FormBuilder, Validators, FormGroup} from "@angular/forms";
import { FacadeService } from '../../../../shared/services/facade.service';
import { Constants, handicapAllocation, UniqueIdGenerator } from '../../../../shared/classes/general';
import { TournamentRounds,Tournament  } from '../../../../shared/models/tournament.model';
import { Score, ScoreDetail } from '../../../../shared/models/score.model';
import { DatePipe } from '@angular/common';
import { General } from '../../../../shared/classes/general';
import { of } from 'rxjs';
import { HostListener } from '@angular/core';
import {MatDatepickerInputEvent} from '@angular/material/datepicker';

import { ComponentCanDeactivate } from '../../../../shared/services/component-can-deactivate';
import { LocalStorageService } from 'app/shared/services/localStorage';


@Component({
  selector: 'app-add-player-daily-score',
  templateUrl: './add-player-daily-score.component.html',
  styleUrls: ['./add-player-daily-score.component.scss']
})
export class AddPlayerDailyScoreComponent implements OnInit, ComponentCanDeactivate {
    canDeactivate() : boolean {
     return !this.isDirty;
    }
    memberStatusesQLs: TournamentMemberStatus[] = [];
    Leaderboard: any;
    private noOfHolesInCourse: number = 18;
    activeRound: number;
    totalRounds: number;
    flightRound: number;
    fPlayer : any [] = [];
    isLoading: boolean = false;
    showResult: boolean = true;
    tRounds: TournamentRounds[] = [];
    roundFlights:any[] = [];
    matchFormat: string;
    teamMatch: boolean;
    selectedSubTournament: string;
    subTournamentDetail: any[] = [];
    loggedInUser: Player;
    players: Player;
    Players: Player[] = [];
    activePlayers: Player[] = [];
    playerScores: Score[];
    categories: any[] = [];
    allMatchResults: any[] = [];
    allLeadersGross: any[] = [];
    allLeadersCutOffGross: any[] = [];
    allLeadersCutOffNet: any[] = [];
    allLeadersNet: any[] = [];
    grossLeaders: any[] = [];
    netLeaders: any[] = [];
    grossAllLeaders: any[] = [];
    netAllLeaders: any[] = [];
    findex = 0;
    selectedCategory: any;
    selectedCategoryValue: string = '';
    upperCategoryLimit: boolean = false;
    showPairs: boolean;
    fDate : string;
    allRoundGrossScore: boolean = true;
    allRoundNetScore: boolean;
    allRoundCutOff: boolean = false;
    allRoundCutOffNet: boolean = false;
    cuttOffScore: number = 0;
    leaderGrossQL: any;
    leaderNetQL: any;
    selectedMembers: Player[][] = [];
    runningFlights: number = 0;
    isClubAdmin: boolean = false;
    isGross: boolean;
    isNet: boolean;
    lastActiveTab = 1;
    fName : any;
    fArray : any[] = [];
    cutOffList: any; 
    singleFlight : any[] = [];
  
    noItemsInList = false;
    dailyRounds: any = [];
  
    loggedInuser: Player;
    scheduleForm: FormGroup;
    refresh: boolean = false;
    minDate: Date;
    maxDate: Date;
    startingHole: string;
    startTime: string;
    RoundDate: string;
    currentDate: string;
    roundSlots: string[] = [];
    file: File;
    arrayBuffer: any;
    playersData: any;
    newFilteredArray : any[] = [];
    duplicatePlayers: any[] = [];
    matchPlayData: any[] = [];
    ddSelectedFlight: string = "0";
    currentRoundFlights: any[] = [];
    customDate : any;
    customDate2 : any;
    customValue : boolean;
    showtable :  boolean = true;
    calculateHandicap : boolean = false;
    allRoundData;
    public starterForm: FormGroup;
    routeDate : any;
    public player: Player[] = [];
    selectedRowIndex : string;
    //scoreHeader: any[] = [];
    tournamentID: string;
    filterPlayer: string = "";
    coursesList: any[] = [];
    selectedCourse: string = "";
    courseHoleSet: number = 0;
  
    flightPlayers: any[] = [];
    filters: FormGroup;
    contactList: FormArray;
    dailyDate : any;
    isDirty = false;
  
    dataSource: MatTableDataSource<any>;
    displayedColumns = ['id','dates', 'noOfFlights','membersCount','details'];
    
  
    public response: any;
          scoreHeader: any[] = [];
          courseData: any[] = [];
          allScores: any[] = [];
          playerName: string;
          Dvalue : Date;
        
          //scoreHeader: any[] = [];
  
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild('fileInput') fileInputVariable: ElementRef;
    @Output() dateChange: EventEmitter<MatDatepickerInputEvent<any>> = new EventEmitter();
    @HostListener('window:beforeunload', ['$event'])
    onWindowClose(event: any): void {
      event.preventDefault();
      event.returnValue = false;
 
   }

  constructor(private _localStorage: LocalStorageService, private datePipe: DatePipe,private location: Router, private fb: FormBuilder, public snackBar: MatSnackBar, private facadeService: FacadeService,private router: Router, private route: ActivatedRoute, private _formBuilder: FormBuilder, public dialog: MatDialog) { }

  ngOnInit() {

  
        this.showtable = false;
        this.showResult = false;
        this.isLoading = true;
        

        this.filters = this._formBuilder.group({
          name: [null, Validators.compose([Validators.required])],
        });
  
           this.scheduleForm = this.fb.group({
            startDate: ['', [Validators.required]],
            endDate: ['', [Validators.required]]
          });

  
            //console.log(this.scheduleForm)
  
         this.loggedInUser = this._localStorage.get(Constants.LOGGED_IN_USER);
          
          this.dailyRounds = [];   
  
          this.route.paramMap.subscribe(params => {
            this.routeDate = params.get("id");
          });

          console.log(this.routeDate);
  
          var currentDate = new Date();
          if(this.routeDate)
            currentDate = General.parseToDate(this.routeDate);
          else 
            currentDate.setDate(currentDate.getDate());
          
            of(this.dailyRounds).pipe()
            .subscribe(async data => {
              this.getDailyRounds(currentDate);
            }, error => this.isLoading = false);

      }
 

         async getDailyRounds(roundDate: Date) {

          this.flightPlayers = [];
          this.findex = 0;
          this.showtable = false;
          this.showResult = false;
          this.isLoading = true;
          this.matchPlayData = [];
          console.log(this.loggedInUser)
       
          console.log(this.loggedInuser.adminClubId + " - " + roundDate);   
   
          let dataPlayers = await this.facadeService.getDailyRounds(this.loggedInuser.adminClubId, this.datePipe.transform(roundDate.toString(),"yyyy-MM-dd"), this.datePipe.transform(roundDate.toString(),"yyyy-MM-dd"));
          console.log(dataPlayers);
     
            
          if(dataPlayers.TournamentsQL.length) {
            this.matchPlayData = dataPlayers.TournamentsQL;
            this.parseSubscriptionResponse(roundDate);

          }      
    }

      async getPlayerInformationByMembershipNumber(filterValue: string) {
        console.log(filterValue)
        //let membershipNumber : string = (<HTMLInputElement>document.getElementById("membershipNumber")).value; 
        filterValue = filterValue.trim(); // Remove whitespace
        //filterValue = filterValue.toLowerCase(); // Dat
        let membershipNumber : string = filterValue; 
    
        
        if(membershipNumber) {
          this.player = <Player[]>await this.facadeService.getPlayerByMembershipNumber(membershipNumber);
          console.log(this.player)
      
          if(this.player.length > 0) {
            this.response = {
                player: this.player[0]
            }
            this.selectPlayer(this.player[0]);
    
            this.setDataSource(this.player);
          }
          else {
            
          }
        }
        else{
          this.setDataSource(this.Players);
        }
      }

      setDataSource(dataSource) {
        this.dataSource = new MatTableDataSource(dataSource);
      
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
      
      selectPlayer(player) {
            
        this.response = {
          player: player
        }
      
        this.selectedRowIndex = player.id;
      }
  
      private parseSubscription(date): boolean {
      
        if (this.matchPlayData == null) {
          return false;
        }
    
        let tournamentData: any = this.matchPlayData;
        console.log(tournamentData);
  
        console.log(date);
        let newDate = General.parseToDate(date);
        console.log(this.datePipe.transform(newDate.toString(),"yyyy-MM-dd"));
        let flightDate = this.datePipe.transform(newDate.toString(),"yyyy-MM-dd");
  
        
  
        for(let flight of tournamentData) {
         if(flight.FlightsQL.length > 0 && flight.FlightsQL[0].date == flightDate){
           let roundData : any = flight;
  
            if(flight.noOfRounds > 0)
            {
              console.log(flight);
              console.log(this.filterPlayer);
              if(this.filterPlayer)
              {
                var filteredArray: any[] = flight.FlightsQL
                .filter(element => element.MembersQL
                  .some(MembersQL => (MembersQL.PlayerQL.firstName.toLowerCase().includes(this.filterPlayer.toLowerCase()) || MembersQL.PlayerQL.lastName.toLowerCase().includes(this.filterPlayer.toLowerCase()) || MembersQL.PlayerQL.membershipNumber == this.filterPlayer))
                )
                .map(element => {
                  let n = Object.assign({}, element, {'MembersQL': element.MembersQL.filter(
                    subElement => ((subElement.PlayerQL.firstName.toLowerCase().includes(this.filterPlayer.toLowerCase())) || subElement.PlayerQL.lastName.toLowerCase().includes(this.filterPlayer.toLowerCase()) || subElement.PlayerQL.membershipNumber == this.filterPlayer))
                })
                  return n;
                })
                console.log(filteredArray)
                console.log(flight.FlightsQL)
      
              }
  
              //console.log(this.roundFlights);
              if(filteredArray.length > 0) {
                //this.newFilteredArray.push(filteredArray[0]);
                roundData.FlightsQL = filteredArray;
                //console.log(this.newFilteredArray);
                this.setupMatchplay( roundData, 2, true);
              }
              else{
                //console.log(flight);
                //this.fPlayer.push(flight.FlightsQL);
                this.setupMatchplay(flight.FlightsQL, 2, true);
              }
                
            }
        }
  
        else{
          console.log("Unamatched")
        }
      }
    }
  
      private async setupMatchplay(flightsQLs : any, round: number, flag: boolean) {
  
        console.log(flightsQLs)
  
        let findex = 0;
        for(let flightData of flightsQLs.FlightsQL) {
  
          let flightHeader = await this.setupMatchplayHeader(flightsQLs.courseId, flightsQLs.courseHoleSets, flightsQLs.courseHoleSetsInverted);
          
          let singleFlights = this.setupSingleFlight(flightsQLs, flightHeader);
          console.log(singleFlights);
    
          this.singleFlight = singleFlights;
          // this.singleFlight[findex]["header"] = flightHeader;
          // this.singleFlight[findex]["flightId"] = flightData.id;
          
          // findex++;
        }
        //console.log(this.flightPlayers);
      }
  
  
      setupSingleFlight(flightData, flightHeader) {
  
        console.log(flightData);
          //console.log("Flight ID: " + flightData.id);
          for (let flights of flightData.FlightsQL) {
          let membersQLs: any = flights.MembersQL;
          let singleFlights: any[] = [];
          let findex = 0;
    
          //console.log(par9);
          //console.log(par18);
          //console.log(flightData);
          let courseHoleSetTitle;
          if(flightData.CourseQL && flightData.CourseQL.CourseHoleSetsQL) {
            courseHoleSetTitle = flightData.CourseQL.CourseHoleSetsQL.find((a) => {
              return a.holeSets == flightData.courseHoleSets && a.inverted == flightData.courseHoleSetsInverted;
            });
          }
          for (let membersQL of membersQLs) {
            let player:Player = membersQL.PlayerQL;
            let playerScore:any[] = membersQL.ScoresQL;
    
            let playerId: String = player.id;
    
            if (player == null) {
              continue;
            }
    
            let playerHole9Score: any = [];
            let playerHole18Score: any[] = [];
            let gross9Total = 0;
            let gross18Total = 0;
            let holePlayed: number = 0;
    
            for(let i=0; i<9; i++){
              
              // let courseHole = flightHeader.courseHoles9.filter(el => {
              //   return el.holeNo == (i + 1);
              // });
    
              //console.log(courseHole);
              let currentHole = (flightHeader.courseHoles9[i])? flightHeader.courseHoles9[i] : [];
              // if(playerScore.length > 0){
              let hole = playerScore.find((a) => {
                return a.holeId == ((currentHole)? currentHole.id : "");
              });
              console.log(hole);
    
              if(hole) {
                playerHole9Score[i] = hole.grossScore;
                gross9Total += hole.grossScore;
                holePlayed++;
              }
              else
                playerHole9Score[i] = "";
            // }
          }
    
            for(let i=0; i<9; i++){
  
              if(flightHeader.courseHoles18.length > 0) {
              
              // let courseHole = flightHeader.courseHoles18.filter(el => {
              //   return el.holeNo == ((i + 9) + 1);
              // });
    
              //console.log(((i + 9) + 1));
              //console.log(courseHole);
              let currentHole = (flightHeader.courseHoles18[i])? flightHeader.courseHoles18[i] : [];
              
              // if(playerScore.length > 0){
              let hole = playerScore.find((a) => {
                //console.log(a.holeId + "<---->" + courseHole[0].id);
                //console.log((courseHole.length > 0)? courseHole[0].id : "");
                return a.holeId == ((currentHole)? currentHole.id : "");
              });
            
    
              console.log(hole);
    
              if(hole) {
                playerHole18Score[i] = hole.grossScore;
                gross18Total += hole.grossScore;
                holePlayed++;
              }
              else
              playerHole18Score[i] = "";
            }
          // }
        }
            let grossTotal: number = gross9Total + gross18Total;
    
            //console.log(playerHole9Score);
            //console.log(playerHole18Score);
    
            let LeaderGross: any = {
              flightId: flightData.id,
              courseId: flightData.courseId,
              playerId: player.id, 
              name: player.firstName + " " + player.lastName, 
              picture: player.picture, 
              handicap: player.handicap, 
              Hole9Scores: playerHole9Score,
              Hole18Scores: playerHole18Score,
              gross9Total: gross9Total,
              gross18Total: gross18Total,
              grossTotal: grossTotal,
              holesPlayed: holePlayed,
              
            }
            
            singleFlights.push(LeaderGross);
            console.log(singleFlights);

            //this.singleFlight.push(singleFlights);
            singleFlights[findex]["header"] = flightHeader;
            singleFlights[findex]["flightId"] = flightData.id;  
            singleFlights[findex]["courseHoleSetTitle"] = courseHoleSetTitle.displayName;

            // singleFlights[findex]["header"] = flightHeader;
            // singleFlights[findex]["flightId"] = flightData.id;  

            findex++;
    
          }
        
  
          return singleFlights;
        
      }
    }
  
  
  
    redirectToDetails = (id: string) => {
        this.location.navigate(['/players/view/' + id]);
    }
  
    redirectToUpdate = (id: string) => {
        this.location.navigate(['/players/update/' + id]);
    }
  
  
      getHandicapAllocation(): string {
        let hcAllocation: string;
        
        if(this.Leaderboard.handicapAllocations)
          hcAllocation = this.Leaderboard.handicapAllocations.handicapAllocation;
        else 
          hcAllocation = handicapAllocation.AS_IS;
    
        return hcAllocation;
      }
      
  
      onDatePick(){

        console.log(this.scheduleForm.value.startDate);
        if(this.scheduleForm.value.startDate){
          let startDate = this.scheduleForm.value.startDate;
          console.log(startDate)
          of(this.matchPlayData).pipe()
          .subscribe(async data => {
            await this.getDailyRounds(startDate);
          }, error => this.isLoading = false);
          }
          else{}
          
      }

  
    
  
      public getLastHolesTotal(noOfHoles: number, holeScores: any[]): number {
        let total: number = 0;
        
        for (let i = holeScores.length - 1; i >= 0 && noOfHoles > 0; i--) {
          total += holeScores[i];
          noOfHoles--;
        }
    
        return total;
      }
  

      private parseSubscriptionResponse(date): boolean {
      
      console.log(date);

      let newDate = this.datePipe.transform(date.toString(),"yyyy-MM-dd");
      console.log(newDate);
      
      this.fDate =  (newDate.toString()).substring(0,16);
      console.log(this.fDate);
  
      this.showtable = false;
      this.isLoading = true;
      this.flightPlayers = [];
      this.singleFlight = [];
      this.findex = 0;
      
        if (this.matchPlayData == null) {
          return false;
        }
    
        let tournamentData: any = this.matchPlayData;
        console.log(tournamentData)
    
        for(let flight of tournamentData) {
          if(flight.FlightsQL.length > 0 && flight.FlightsQL[0].date == newDate){
          this.setupMatchplayData(flight.CourseQL, flight.FlightsQL, 1, true,flight.id);
  
          this.allRoundData = this.singleFlight;
       
          console.log(this.flightPlayers);
        }
        else{
          console.log("Unamatched")
        }
      }
        
    }
        
          private async setupMatchplayHeader(courseId: string, holeSets: number, courseHoleSetsInverted: boolean) {
            let dataLeaderboard = await this.facadeService.getCourseInformation(courseId);
            this.isLoading = false;
            if(dataLeaderboard.course.length <= 0) return ;
            
            let flightHeader: any[] = [];
            this.isLoading = false;
            this.courseHoleSet = holeSets;
        
            //if(this.courseHoleSet == 3) this.courseHoleSet = 12;
        
            let courseHoles9: Hole[] = [];
            let courseHoles18: Hole[] = [];
            let courseHoles27: Hole[] = [];
            let courseHoles36: Hole[] = [];
        
            let yardage9: number[] = [];
            let yardage18: number[] = [];
            let yardage27: number[] = [];
            let yardage36: number[] = [];
        
            let yardage9Total: number = 0;
            let yardage18Total: number = 0;
            let yardage27Total: number = 0;
            let yardage36Total: number = 0;
            
            let par9: number = 0;
            let par18: number = 0;
            let par27: number = 0;
            let par36: number = 0;
            
        
            let courseQLs: any = dataLeaderboard.course[0];
            let holesQLs: any = courseQLs.HolesQL;
        
            var isPresent = this.coursesList.some(function(el){ return el.id === courseQLs.id});
            
            if(!isPresent) {
              let courseInfo: any = {
                id: courseQLs.id,
                name: courseQLs.name
              }
              this.coursesList.push(courseInfo);
            }
        
            //console.log(this.coursesList);
            
            holesQLs = holesQLs.sort(this.Comparator);
            console.log(holesQLs);
            this.removeExtraHoleSets(holeSets, holesQLs, courseHoleSetsInverted);
            //console.log(holesQLs);
            for (let holeQL of holesQLs) {
              //let teeDistance = JSON.parse(holeQL.teeDistances);
              let teeDistance = holeQL.teeDistances;
  
              if(holeQL.holeNo < 10) {
                //holeQL.yardage9 = yardage9;
                //courseHoles9.push(holeQL);
                //console.log(courseHoleSetsInverted);
                
                  yardage9Total += parseInt(teeDistance.blue);
                  par9 +=  holeQL.par;
                  yardage9.push(parseInt(teeDistance.blue));
  
                  courseHoles9.push(holeQL);
                
              }
              else if(holeQL.holeNo > 9 && holeQL.holeNo < 19) {
                
                //courseHoles18.push(holeQL);
                
                  yardage18.push(parseInt(teeDistance.blue));
                  yardage18Total += parseInt(teeDistance.blue);
                  par18 +=  holeQL.par;
  
                  courseHoles18.push(holeQL);
                
              }
        

              else { }
        
            }
        
            let parTotal: number = Number(par9) + Number(par18) + Number(par27) + Number(par36);
            let yardageTotal: number = Number(yardage9Total) + Number(yardage18Total) + Number(yardage27Total) + Number(yardage36Total);
        
            let scoreHeader: any = {
              courseHoles9: courseHoles9,
              courseHoles18: courseHoles18,
              courseHoles27: courseHoles27,
              courseHoles36: courseHoles36,
              yardage9: yardage9, 
              yardage18: yardage18,
              yardage27: yardage27,
              yardage36: yardage36,
              yardage9Total: yardage9Total,
              yardage18Total: yardage18Total,
              yardage27Total: yardage27Total,
              yardage36Total: yardage36Total,
              par9: par9, 
              par18: par18,
              par27: par27,
              par36: par36,
              parTotal: parTotal,
              yardageTotal: yardageTotal
            }
            //console.log(scoreHeader);
              flightHeader.push(scoreHeader);
              return scoreHeader;
              //console.log(this.scoreHeader);
          }
  
          filterPlayerFlight(flag: boolean) {

            console.log(this.filters);
      
            if(flag)
              this.filterPlayer = this.filters.get("name").value;
            else {
              this.filterPlayer = "";
              this.filters.reset();
  
              this.singleFlight = this.allRoundData;
              return false;
            }
  
            console.log(this.singleFlight)
       
            this.singleFlight = [];
            this.parseSubscription(this.fDate);
          }
        

          public removeExtraHoleSets(courseHoleSets: number, holes, isCourseHoleSetsInverted: boolean) {
            if (courseHoleSets == 0) {
                return;
            }
            let holes1to9: boolean = this.hasHoleSet1to9(courseHoleSets);
            let holes10to18: boolean = this.hasHoleSet10to18(courseHoleSets);
            let holes19to27: boolean = this.hasHoleSet19to27(courseHoleSets);
            let holes28to36: boolean = this.hasHoleSet28to36(courseHoleSets);

            for (let i = 0; i < holes.length; i++) {
                //int holeNo = holes.get(i).getHoleNo();
                let holeNo: number = holes[i].holeNo;
                //console.log("holeNo: " + holeNo);
                if (holeNo >= 1 && holeNo <= 9) {
                    if (!holes1to9) {
                      holes.splice(i, 1); //holes.remove(i);
                      i--;
                    }
                } else if (holeNo >= 10 && holeNo <= 18) {
                    if (!holes10to18) {
                      holes.splice(i, 1);
                      i--;
                    } else if (!holes1to9) {
                      //holes.get(i).setHoleNo(holeNo - 9);
                      holes[i].holeNo = (holeNo - 9);
                    }
                } else if (holeNo >= 19 && holeNo <= 27) {
                    if (!holes19to27) {
                      holes.splice(i, 1);
                      i--;
                    } else {
                        let setsToRemove: number = (holes1to9 ? 0 : 1) + (holes10to18 ? 0 : 1);
                        if (setsToRemove > 0) {
                          //holes.get(i).setHoleNo(holeNo - 9 * setsToRemove);
                          holes[i].holeNo = (holeNo - 9 * setsToRemove);
                        }
                    }
                } else if (holeNo >= 28 && holeNo <= 36) {
                    if (!holes28to36) {
                      holes.splice(i, 1);
                      i--;
                    } else {
                        let setsToRemove: number = (holes1to9 ? 0 : 1) + (holes10to18 ? 0 : 1) + (holes19to27 ? 0 : 1);
                        if (setsToRemove > 0) {
                          //holes.get(i).setHoleNo(holeNo - 9 * setsToRemove);
                          holes[i].holeNo = (holeNo - 9 * setsToRemove);
                        }
                    }
                }
            }
            //console.log(holes);
            let holesCount = holes.length;
            if (holesCount == 9) {
                //Collections.sort(holes, (hole1, hole2) -> hole1.getIndex() - hole2.getIndex());
                holes = holes.sort(this.ComparatorHoles);
                for (let i:number = 0; i < holesCount; i++) {
                    holes[i].index = (i + 1);
                }
                holes.sort(this.Comparator);
             } else if (holesCount == 18 && isCourseHoleSetsInverted) {
                let holesToMove: number = 9;
                while (holesToMove > 0) {
                    //holes.add(0, holes.remove(holesCount - 1));
                    let removedHole = holes.splice((holesCount - 1), 1);
                    holes.unshift(removedHole[0]);
                    holesToMove -= 1;
                }
  
                for(let h of holes) {
                  if(h.holeNo < 10) h.holeNo = h.holeNo + 9;
                  else h.holeNo = h.holeNo - 9;
                }
            }
            //console.log(holes);
        }
        
          private async setupMatchplayData(courseInfo: any, flightsQLs: any[], round: number, flag: boolean, tournamentId : string) {
             
        
            //let findex = 0;
            console.log(flightsQLs);
         
        
            for(let flightData of flightsQLs) {
              //console.log(flightData);
              //console.log("Flight ID: " + flightData.id);
              let membersQLs: any = flightData.MembersQL;
              //let singleFlight: any[] = [];
              let flightHeader = await this.setupMatchplayHeader(flightData.courseId, flightData.courseHoleSets, flightData.courseHoleSetsInverted);
              console.log(flightHeader);
  
              let courseHoleSetTitle;
              if(courseInfo && courseInfo.CourseHoleSetsQL) {
                courseHoleSetTitle = courseInfo.CourseHoleSetsQL.find((a) => {
                  return a.holeSets == flightData.courseHoleSets && a.inverted == flightData.courseHoleSetsInverted;
                });
              }
              console.log(courseHoleSetTitle);
              for (let membersQL of membersQLs)
               
              {
                console.log(membersQL);
                let player:Player = membersQL.PlayerQL;
                let playerScore:any[] = membersQL.ScoresQL;
                //console.log(playerScore);
                let playerId: String = player.id;
        
                if (player == null) {
                  continue;
                }
        
                let playerHole9Score: any = [];
                let playerHole18Score: any[] = [];
                let gross9Total = 0;
                let gross18Total = 0;
                let holePlayed: number = 0;
        
                for(let i=0; i<9; i++){
  
                  let currentHole = (flightHeader.courseHoles9[i])? flightHeader.courseHoles9[i] : [];
  
                  if(currentHole) {
  
                    let hole = playerScore.find((a) => {
                      return a.holeId == ((currentHole)? currentHole.id : "");
                    });
                    //console.log(hole);
          
                    if(hole) {
                      playerHole9Score[i] = hole.grossScore;
                      gross9Total += hole.grossScore;
                      holePlayed++;
                    }
                    else
                      playerHole9Score[i] = "";
                  }
                }
        
                for(let i=0; i<9; i++){
  
                  if(flightHeader.courseHoles18.length > 0) {

                    let currentHole = (flightHeader.courseHoles18[i])? flightHeader.courseHoles18[i] : [];
                    
                    if(currentHole) {
                      let hole = playerScore.find((a) => {
                        return a.holeId == ((currentHole)? currentHole.id : "");
                      });
    
                      //console.log(hole);
            
                      if(hole) {
                        playerHole18Score[i] = hole.grossScore;
                        gross18Total += hole.grossScore;
                        holePlayed++;
                      }
                      else
                        playerHole18Score[i] = "";
                    }
                  }
                }
  
        
                let grossTotal: number = gross9Total + gross18Total;
        
        
                let LeaderGross: any = {
                  flightId: flightData.id,
                  tournamentId: flightData.tournamentId,
                  courseId: flightData.courseId,
                  playerId: player.id, 
                  name: player.firstName + " " + player.lastName, 
                  picture: player.picture, 
                  handicap: player.handicap, 
                  Hole9Scores: playerHole9Score,
                  Hole18Scores: playerHole18Score,
                  gross9Total: gross9Total,
                  gross18Total: gross18Total,
                  grossTotal: grossTotal,
                  holesPlayed: holePlayed

                }
                
                this.singleFlight.push(LeaderGross);
                this.singleFlight[this.findex]["header"] = flightHeader;
                this.singleFlight[this.findex]["flightId"] = flightData.id;
                this.singleFlight[this.findex]["tournamentId"] = tournamentId;
                this.singleFlight[this.findex]["flightTime"] = flightData.time;
                this.singleFlight[this.findex]["courseHoleSetTitle"] = (courseHoleSetTitle)? courseHoleSetTitle.displayName : "";

                this.findex++;
        
              }
      
              console.log(this.singleFlight);
              
            }
  
            this.singleFlight = this.singleFlight.sort(this.flightComparator);
            console.log(this.singleFlight);
            this.isLoading = false;
            this.showResult = true;
          }
  
          async saveFlightScore(flightId: string) {
        
            let selectedFlight: any = this.singleFlight.find((a) => {
              return a.flightId == flightId;
            });
        
            //console.log(selectedFlight);
        
            let today: Date = new Date();
            var dd = String(today.getDate()).padStart(2, '0');
            var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
            var yyyy = today.getFullYear();
        
            let todayDate: Date = General.parseToDate( mm + '/' + dd + '/' + yyyy);
            let playerScores: Score[] = [];
            
           this.loggedInUser = this._localStorage.get(Constants.LOGGED_IN_USER);
        
            let courseQLs = null;
            let courseHoleQLs = null;
            if(selectedFlight)
              courseQLs = await this.facadeService.getCourseInformation(selectedFlight.courseId);
        
            if(courseQLs && courseQLs.course && courseQLs.course.length > 0)
              courseHoleQLs = courseQLs.course[0].HolesQL
              
                let totalPlayed = 0;
                let playerScoresIds: string[] = [];
                let playerEmptyScoresIds: string[] = [];
                let player1DigitIds: string[] = [];
                let player2DigitIds: string[] = [];
        
                for(let hole of courseHoleQLs)
                {
                  let holeObj = (<HTMLInputElement>document.getElementById(hole.id + "&" + selectedFlight.playerId));
                  if(holeObj) {
                  
                  let grossScore = parseFloat((<HTMLInputElement>document.getElementById(hole.id + "&" + selectedFlight.playerId)).value);
                  
                  //console.log(grossScore);
                  if(grossScore) {
                    let playerScore: Score = {
                      playerId: selectedFlight.playerId,
                      flightId: selectedFlight.flightId,
                      holeId: hole.id,
                      playerHandicap: this.precisionRound(selectedFlight.handicap, 0),
                      grossScore: grossScore,
                      updatedAt: General.parseToDate(todayDate.toDateString()),
                      updaterId: this.loggedInuser.id,
                      updaterName: this.loggedInuser.firstName + " " + this.loggedInuser.lastName,
                      detailId: null
                    }
                    playerScores.push(playerScore);
                    playerScoresIds.push(hole.id + "&" + selectedFlight.playerId);
        
                    if(grossScore > 9)
                      player2DigitIds.push(hole.id + "&" + selectedFlight.playerId);
                    else
                      player1DigitIds.push(hole.id + "&" + selectedFlight.playerId);
        
                    totalPlayed++;
                  }
                  else
                    playerEmptyScoresIds.push(hole.id + "&" + selectedFlight.playerId);
        
                }
                
                }
                console.log(playerScores);
                
                if(totalPlayed > 0) {
                  for(let id of playerEmptyScoresIds)
                    document.getElementById(id).classList.add('empty');
                  
                  for(let id of playerScoresIds)
                    document.getElementById(id).classList.remove('empty');
        
                  for(let id of player2DigitIds)
                    document.getElementById(id).classList.add('warn');
                  
                  for(let id of player1DigitIds)
                    document.getElementById(id).classList.remove('warn');
                }
            
        
            let result = <any>await this.facadeService.SaveScoresMutation(playerScores);
        
            if(result) {
              this.snackBar.open("Score has been submitted.", "x", {
                duration: 5000,
              });
  
              if(selectedFlight.length > 0) {
                let todayString : Date = new Date();
                let timeupdated: any = await this.facadeService.setScoreUpdateTime(selectedFlight[0].tournamentId, todayString.toLocaleDateString() + "T" + todayString.toLocaleTimeString());
  
                if(timeupdated) return;
              }
            }
          }
        
          async savePlayerScore(flightId: string, playerId: string) {
        
            let selectedFlight: any = this.singleFlight.find((a) => {
              return a.flightId == flightId &&  a.playerId == playerId ;
            });
        
            let today: Date = new Date();
            var dd = String(today.getDate()).padStart(2, '0');
            var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
            var yyyy = today.getFullYear();
        
            let todayDate: Date = General.parseToDate( mm + '/' + dd + '/' + yyyy);
        
            let playerScores: Score[] = [];
        
           this.loggedInUser = this._localStorage.get(Constants.LOGGED_IN_USER);
        
            let courseQLs = null;
            let courseHoleQLs = null;
            if(selectedFlight)
              courseQLs = await this.facadeService.getCourseInformation(selectedFlight.courseId);
        
            if(courseQLs && courseQLs.course && courseQLs.course.length > 0)
              courseHoleQLs = courseQLs.course[0].HolesQL
            

                for(let hole of courseHoleQLs)
                {
                  let holeObj = (<HTMLInputElement>document.getElementById(hole.id + "&" + selectedFlight.playerId));
                  console.log(holeObj);
                  if(holeObj) {
                  
                  let grossScore = (holeObj)? parseFloat((<HTMLInputElement>document.getElementById(hole.id + "&" + selectedFlight.playerId)).value) : 0;
                  
                  if(!grossScore)
                    document.getElementById(hole.id + "&" + selectedFlight.playerId).classList.add('empty');
                  else
                    document.getElementById(hole.id + "&" + selectedFlight.playerId).classList.remove('empty');
        
                  if(grossScore && grossScore > 9)
                    document.getElementById(hole.id + "&" + selectedFlight.playerId).classList.add('warn');
                  else
                    document.getElementById(hole.id + "&" + selectedFlight.playerId).classList.remove('warn');
        
                  //console.log(grossScore);
                  if(grossScore) {
                    
                    let playerScore: Score = {
                      playerId: selectedFlight.playerId,
                      flightId: selectedFlight.flightId,
                      holeId: hole.id,
                      playerHandicap: this.precisionRound(selectedFlight.handicap, 0),
                      grossScore: grossScore,
                      updatedAt: General.parseToDate(todayDate.toDateString()),
                      updaterId: this.loggedInuser.id,
                      updaterName: this.loggedInuser.firstName + " " + this.loggedInuser.lastName,
                      detailId: null
                    }
                    playerScores.push(playerScore);
                  }
                }
                
                }
              
            
            console.log(playerScores);
            //console.log(playerScores.length);
            
            let result: any;
        
            if(playerScores.length > 0) {
              result = <any>await this.facadeService.SaveScoresMutation(playerScores);
            }
        
            if(result) {
              this.snackBar.open("Score has been submitted.", "x", {
                duration: 5000,
              });
  
              if(selectedFlight.length > 0) {
                let todayString : Date = new Date();
                let timeupdated: any = await this.facadeService.setScoreUpdateTime(selectedFlight[0].tournamentId, todayString.toLocaleDateString() + "T" + todayString.toLocaleTimeString());
  
                if(timeupdated) return;
              }

              this.isDirty = false;
            }
          }
        
          onGross9Change(grossValue: string, playerId: string, header: any): void {  
        
            let total9: number = 0;
        
            for(let hole of header.courseHoles9) {
              
              if((<HTMLInputElement>document.getElementById(hole.id + "&" + playerId)))
                total9 += ((<HTMLInputElement>document.getElementById(hole.id + "&" + playerId)).value != '')? parseFloat((<HTMLInputElement>document.getElementById(hole.id + "&" + playerId)).value) : 0;
            }
              
            var gross9total = (<HTMLInputElement>document.getElementById("gross9total_" + playerId));
            var gross18total = (<HTMLInputElement>document.getElementById("gross18total_" + playerId));
            var grosstotal = (<HTMLInputElement>document.getElementById("grosstotal_" + playerId));
        
            //let total9 = ((Number(hole1))? Number(hole1) : 0) + ((Number(hole2))? Number(hole2) : 0) + ((Number(hole3))? Number(hole3) : 0) + ((Number(hole4))? Number(hole4) : 0) + ((Number(hole5))? Number(hole5) : 0) + ((Number(hole6))? Number(hole6) : 0) + ((Number(hole7))? Number(hole7) : 0) + ((Number(hole8))? Number(hole8) : 0) + ((Number(hole9))? Number(hole9) : 0);
            gross9total.value = total9.toString();
        
            let total: number = ((Number(gross9total.value))? Number(gross9total.value) : 0) + ((Number(gross18total.value))? Number(gross18total.value) : 0)
            grosstotal.value = total.toString();
            console.log(total);
          }
        
          Comparator(a, b) {
            if (a["holeNo"] < b["holeNo"]) return -1;
            if (a["holeNo"] > b["holeNo"]) return 1;
            return 0;
          }
  
          flightComparator(a, b) {
            if (a["flightTime"] < b["flightTime"]) return -1;
            if (a["flightTime"] > b["flightTime"]) return 1;
            return 0;
          }
  
          ComparatorDate(a, b) {
            if (a["date"] < b["date"]) return -1;
            if (a["date"] > b["date"]) return 1;
            return 0;
          }
  
          ComparatorHoles(hole1, hole2) {
            return hole1.index - hole2.index;
          }
        
          onGross18Change(grossValue: string, playerId: string, header: any): void {  
        
            let total18: number = 0;
        
            for(let hole of header.courseHoles18) {
              
              if((<HTMLInputElement>document.getElementById(hole.id + "&" + playerId)))
              total18 += ((<HTMLInputElement>document.getElementById(hole.id + "&" + playerId)).value != '')? parseFloat((<HTMLInputElement>document.getElementById(hole.id + "&" + playerId)).value) : 0;
            }

            var gross9total = (<HTMLInputElement>document.getElementById("gross9total_" + playerId));
            var gross18total = (<HTMLInputElement>document.getElementById("gross18total_" + playerId));
            var grosstotal = (<HTMLInputElement>document.getElementById("grosstotal_" + playerId));
        
            //let total18 = ((Number(hole1))? Number(hole1) : 0) + ((Number(hole2))? Number(hole2) : 0) + ((Number(hole3))? Number(hole3) : 0) + ((Number(hole4))? Number(hole4) : 0) + ((Number(hole5))? Number(hole5) : 0) + ((Number(hole6))? Number(hole6) : 0) + ((Number(hole7))? Number(hole7) : 0) + ((Number(hole8))? Number(hole8) : 0) + ((Number(hole9))? Number(hole9) : 0);
            gross18total.value = total18.toString();
            
            let total: number = ((Number(gross9total.value))? Number(gross9total.value) : 0) + ((Number(gross18total.value))? Number(gross18total.value) : 0)
            grosstotal.value = total.toString();
          }
        
          numberOnly(event): boolean {
            const charCode = (event.which) ? event.which : event.keyCode;
            if (charCode > 31 && (charCode < 48 || charCode > 57)) {
              return false;
            }
            return true;
        
          }
  
          hideResult() {
            if(this.routeDate){
  
              this.router.navigate(['/daily-rounds']);
  
            }
            else
            {
            this.showtable = true;
            this.showResult = false;
            }
            
          }
        
          redirectToScores() {
            this.router.navigate(['/matchplay/' + this.tournamentID]);
          }
        
          redirectToflightManagement() {
            this.router.navigate(['/tournaments/manage/' + this.tournamentID]);
          }
          redirectToDetail() {
            this.router.navigate(['/tournaments/view/' + this.tournamentID]);
          }
        
          redirectToAttendance() {
            this.router.navigate(['/tournaments/attendance/' + this.tournamentID]);
          }
        
          precisionRound(number: number, precision: number)
          {
            if (precision < 0)
            {
              let factor = Math.pow(10, precision);
              return Math.round(number * factor) / factor;
            }
            else
              return +(Math.round(Number(number + "e+" + precision)) +
                "e-" + precision);
          }
  
      public hasHoleSet1to9(courseHoleSets) : boolean {
        //console.log(Constants.Holes1to9);
        return courseHoleSets > 0 && (courseHoleSets & Constants.Holes1to9) != 0;
      }
  
      public hasHoleSet10to18(courseHoleSets) : boolean {
        //console.log(Constants.Holes10to18);
        return courseHoleSets > 0 && (courseHoleSets & Constants.Holes10to18) != 0;
      }
  
      public hasHoleSet19to27(courseHoleSets) : boolean {
        //console.log(Constants.Holes19to27);
        return courseHoleSets > 0 && (courseHoleSets & Constants.Holes19to27) != 0;
      }
  
      public hasHoleSet28to36(courseHoleSets) : boolean {
        //console.log(Constants.Holes28to36);
        return courseHoleSets > 0 && (courseHoleSets & Constants.Holes28to36) != 0;
      }
    
    redirectCalculation(id) {
      this.router.navigate(['/tournaments/handicap-whs/' + id]);
    }
  
  
  
    keytab(e){
      var code = e.keyCode || e.which;
  
      if (code === 13) {
        e.preventDefault();
        let control: HTMLInputElement = <HTMLInputElement>e.srcElement;
  
        while (control) { 
          let nextControl = <HTMLInputElement>control.nextElementSibling;
          
          if (nextControl) {
            control = nextControl;
  
            while (nextControl) {
              control = nextControl;
              
              nextControl = <HTMLInputElement>nextControl.firstElementChild;
              
              if(nextControl && (nextControl.type == "text" || nextControl.type == "button")  && !nextControl.disabled)
                break;
            }
            
            if (nextControl) {
              control = nextControl;
              break;
            }
          } else {
            control = <HTMLInputElement>control.parentElement;
          }         
        }
  
        if (control && control.focus) {
          control.focus();
        }
      }
    }


    async addDailyPlayer() {

      // const dialogRef = this.dialog.open(DialogAddDailyRoundPlayerComponent, {
      //   data: {date: this.routeDate },
      //   width: '650px',
      // });
  
      // dialogRef.afterClosed().subscribe(async result => {
      //   console.log(result);
      //   if(result) {
      //         console.log(result);

      //         let updatedFlight = await this.facadeService.singleRoundFlightsQuery(result.flights[0].id);
      //         console.log(updatedFlight)
  

      //         let courseHoleSetTitle;
      //         if(updatedFlight.FlightsQL[0].CourseQL && updatedFlight.FlightsQL[0].CourseQL.CourseHoleSetsQL) {
      //           courseHoleSetTitle = updatedFlight.FlightsQL[0].CourseQL.CourseHoleSetsQL.find((a) => {
      //             return a.holeSets == updatedFlight.FlightsQL[0].courseHoleSets && a.inverted == updatedFlight.FlightsQL[0].courseHoleSetsInverted;
      //           });
      //         }
      //         console.log(courseHoleSetTitle);
  
      //           let flightHeader = await this.setupMatchplayHeader(updatedFlight.FlightsQL[0].courseId, updatedFlight.FlightsQL[0].courseHoleSets, updatedFlight.FlightsQL[0].courseHoleSetsInverted);
      //           console.log(flightHeader)
      //           let singleFlights = this.setupSingleFlight(updatedFlight.FlightsQL[0], flightHeader);
      //           console.log(singleFlights);

      //             this.singleFlight.unshift(singleFlights[0]);
      //             this.singleFlight[0]["tournamentId"] = result.id;
      //             this.singleFlight[0]["courseHoleSetTitle"] = courseHoleSetTitle.displayName;
                
      //           console.log(this.singleFlight)
      //   }
                
      //       });
            
    }
  
  
   async changeCourseHoleset(flightId: string, tournamentID: string, playerId: string) {
      console.log(this.singleFlight);
      console.log(playerId);
      let flight ;
      //let flightData = this.matchPlayData.find(a => a.FlightsQL.some(f => f.id == flightId));
      let updatedData = await this.facadeService.singleRoundFlightsQuery(flightId);
      console.log(updatedData);
  
      if(!updatedData) return;
      else {
        if(updatedData.FlightsQL.length > 0)
          flight = updatedData.FlightsQL[0];
      }
  
  
      // console.log(flightId);
      // const dialogRef = this.dialog.open(DialogChangeCourseHoleSetComponent, {
      //   data: { course: flight.courseId, currentHoleSet: flight.courseHoleSets, courseHoleSetsInverted: flight.courseHoleSetsInverted, time : flight.time, startingHole : flight.startingHole, tee : flight.tee, tournament : tournamentID, members : flight.MembersQL},
      //   width: '650px',
      // });
  
      // dialogRef.afterClosed().subscribe(async result => {
      //   console.log(result);
      //   if(result) {
      //         //console.log(result);
      //         console.log(this.singleFlight);
      //         let splited = result.holeSets.split("_", 2)
      //         console.log(splited);
      //         let holeSetsSelection: number = Number(splited[0]);
      //         let holeSetsInverted: boolean = (splited[1] == "true");
      //         let tee = result.roundTee;
      //         let time = result.startingTime;
      //         //let hole = result.startingHole;
      //         let flightMember;
      //         let deleteMember = result.deleteMembers;
      //         let fMember: any = [];
      //         if(result.members){
      //         for (let members in result.members){
      //         flightMember =  {
      //            flightId: (result.members[members].flightId)?result.members[members].flightId : flightId,
      //            playerId:  (result.members[members].playerId)?result.members[members].playerId : result.members[members].id,
      //            attendance:  (result.members[members].attendance)?result.members[members].attendance : false,
      //            playingTee : (result.playingTee.length && result.playingTee[members] )? result.playingTee[members].value : result.roundTee,
      //            guest : (result.members[members].guest)?result.members[members].guest : null
  
      //         }
  
      //         fMember.push(flightMember)
  
      //       }
      //     }
  
  
      //         console.log(fMember)
  
      //         let flightScores: Array<Score> = null;
      //         let oldHoles: Array<Hole> = null;
              
      //         let newFlight: boolean = false;
      //         let courseHoleSets: number = flight.courseHoleSets;
      //         let courseHoleSetsInverted: boolean = flight.courseHoleSetsInverted;
      //         let newScores: Array<Score> = new Array<Score>();
              
      //         console.log(flight);
  
      //         if (!newFlight && flightId) {
      //             if (courseHoleSets != holeSetsSelection || courseHoleSetsInverted != holeSetsInverted) {
      //                 // hole sets are changed, check if there are any scores for this flight
      //                 flightScores = this.getScoresCopy(flight); //flight.ScoresQL;
      //                 console.log(flightScores);
      //                 if (flightScores) {
      //                     oldHoles = this.getCourseHolesCopy(flightId);
      //                     if (oldHoles != null) {
      //                         //flight.removeExtraHoleSets(oldHoles);
      //                     }
      //                 }
  
      //                 console.log(oldHoles);
      //                 //flight.setCourseHoleSets(holeSetsSelection);
      //                 //flight.setCourseHoleSetsInverted(holeSetsInverted);
      //                 if (flightScores != null && oldHoles != null) {
  
      //                     let dataLeaderboard = await this.facadeService.getCourseInformation(flight.courseId);
                    
      //                     if(dataLeaderboard.course.length == 0) return ;
  
      //                     let courseQLs: any = dataLeaderboard.course[0];
      //                     let holesQLs: any = courseQLs.HolesQL;
      //                     let newHoles = this.getCourseHoles(holeSetsSelection, holeSetsInverted, holesQLs);
      //                     console.log(newHoles);
                          
      //                     if (newHoles != null) {
      //                         //flight.removeExtraHoleSets(newHoles);
      //                         for (let score of flightScores) {
      //                           console.log(score);
      //                           let holeId: string = score.holeId;
      //                             for (let i = 0; i < oldHoles.length; i++) {
      //                               console.log(oldHoles[i].id + " <--> " + holeId);
      //                               if (oldHoles[i].id == holeId) {
      //                                     let newScore: Score = Object.assign({}, score);
  
      //                                     if (i < newHoles.length) {
      //                                         newScore.holeId =  newHoles[i].id;
      //                                         newScores.push(newScore);
      //                                     }
      //                                     break;
      //                                 }
      //                             }
      //                         }
      //                         console.log(flightScores);
      //                         console.log(newScores);
      //                         if (newScores.length > 0) {

      //                         }
      //                     }
  
      //                     let scoreDetailsDelete: string[] = [];
      //                     let scoreFlightIdsToRemove: string[] = [];
      //                     let scorePlayerIdsToRemove: string[] = [];
  
      //                     for(let oldScore of flightScores) {
      //                       console.log(oldScore);
      //                       if(oldScore["DetailQL"]) {
      //                         let detailId: string = oldScore["DetailQL"].id;
      //                         if (detailId)
      //                           scoreDetailsDelete.push(detailId);
      //                       }
                            
      //                       if(oldScore.flightId) scoreFlightIdsToRemove.push(oldScore.flightId);
      //                       if(oldScore.playerId) scorePlayerIdsToRemove.push(oldScore.playerId);
      //                     }
  
      //                     let scoresToInsert: Score[] = [];
      //                     let scoreDetail: ScoreDetail[] = []; 
  
      //                     for(let score of newScores) {
                            
      //                       if(score["DetailQL"]) {
      //                         let playerScoreDetail: ScoreDetail = {
      //                           id: UniqueIdGenerator.generate(),
      //                           putts: score["DetailQL"].putts,
      //                           penalties: score["DetailQL"].penalties,
      //                           fairway: score["DetailQL"].fairway,
      //                           gir: score["DetailQL"].gir,
      //                           sandSave: score["DetailQL"].sandSave,
      //                           upAndDown: score["DetailQL"].upAndDown,
      //                           penalty: score["DetailQL"].penalty,
      //                           firClub: score["DetailQL"].firClub,
      //                           girClub: score["DetailQL"].girClub,
      //                           girDistance: score["DetailQL"].girDistance,
      //                           sandSavePoint: score["DetailQL"].sandSavePoint,
      //                           upAndDownPoint: score["DetailQL"].upAndDownPoint,
      //                           upAndDownDistance: score["DetailQL"].upAndDownDistance,
      //                           girShot: score["DetailQL"].girShot,
      //                         }
      //                         scoreDetail.push(playerScoreDetail);
      //                       } 
  
      //                       let playerScore: any = {
      //                         playerId: score.playerId,
      //                         flightId: score.flightId,
      //                         holeId: score.holeId,
      //                         playerHandicap: this.precisionRound(score.playerHandicap, 0),
      //                         grossScore: score.grossScore,
      //                         updatedAt: score.updatedAt,
      //                         updaterId: score.updaterId,
      //                         updaterName: score.updaterName,
      //                         detailId: null,
      //                         detail: null
      //                         //detail: scoreDetail
      //                       }
  
      //                       scoresToInsert.push(playerScore);
      //                     }
  
                          
      //                     let result = await this.facadeService.updateDailyRoundCourseHoleset(flight.tournamentId, holeSetsSelection, holeSetsInverted, (scoreDetail.length > 0)? true : false, scoreDetailsDelete, scoreFlightIdsToRemove, scorePlayerIdsToRemove, scoresToInsert, tee, time, fMember, deleteMember,flightId);
      //                     console.log(result)
      //                     //this.facadeService.updateDailyRoundCourseHoleset(this.tournamentID, flightScores, newScores);
  
                          
      //                     if(result) {
      //                       this.snackBar.open("Flight has been updated.", "x", {
      //                         duration: 5000,
      //                       });
      //                     }
                          
                          
      //                 }

      //             }
      //             else{
  
                  
  
      //             let result = await this.facadeService.updateDailyRoundCourseHoleset(flight.tournamentId, holeSetsSelection, holeSetsInverted, false, [], [], [], [], tee, time, fMember, deleteMember, flightId);
      //             console.log(result)
      //             //this.facadeService.updateDailyRoundCourseHoleset(this.tournamentID, flightScores, newScores);
  
                  
      //             if(result) {
      //               this.snackBar.open("Flight has been updated.", "x", {
      //                 duration: 5000,
      //               });
      //             }
  
      //           }
  
  
      //         }

  
      //         let updatedFlight = await this.facadeService.singleRoundFlightsQuery(flightId);
      //         console.log(updatedFlight)
  

      //         let courseHoleSetTitle;
      //         if(updatedFlight.FlightsQL[0].CourseQL && updatedFlight.FlightsQL[0].CourseQL.CourseHoleSetsQL) {
      //           courseHoleSetTitle = updatedFlight.FlightsQL[0].CourseQL.CourseHoleSetsQL.find((a) => {
      //             return a.holeSets == updatedFlight.FlightsQL[0].courseHoleSets && a.inverted == updatedFlight.FlightsQL[0].courseHoleSetsInverted;
      //           });
      //         }
      //         console.log(courseHoleSetTitle);
  
      //           let flightHeader = await this.setupMatchplayHeader(updatedFlight.FlightsQL[0].courseId, updatedFlight.FlightsQL[0].courseHoleSets, updatedFlight.FlightsQL[0].courseHoleSetsInverted);
      //           console.log(flightHeader)
      //           let singleFlights = this.setupSingleFlight(updatedFlight.FlightsQL[0], flightHeader);
      //           console.log(singleFlights);
          
      //           //this.flightPlayers.push(singleFlight);
      //           //console.log(this.flightPlayers)
                
      //           let newFlightData =  this.singleFlight.filter(a => a.flightId == flightId);
      //           console.log(newFlightData);

      //           // for(let f in newFlightData){

      //           let flightIndex = this.singleFlight.findIndex(a => a.flightId == flightId && a.playerId == playerId);
                
      //           let changeFlightData = singleFlights.filter(a => a.flightId == flightId && a.playerId == playerId);
      //           console.log(changeFlightData);

      //           for(let playerFlight of singleFlights) {

      //             console.log(playerFlight);

      //             let currentIndex = this.singleFlight.findIndex(i => i.playerId == playerFlight.playerId);

      //             this.singleFlight[currentIndex] = playerFlight;
      //             this.singleFlight[currentIndex]["courseHoleSetTitle"] = courseHoleSetTitle.displayName;
      //           }
                

      //           console.log(this.singleFlight)
      //           }
                
      
              
      //     // }
      //     else {
      //         console.log("else executed");
      //     }
      // });
    }
  
    public getCourseHolesCopy(id) : Array<Hole> {
      
      let flight = this.singleFlight.find((f) => {
        return f.flightId == id
      });
  
      if (!flight) {
          return null;
      }
  
      let holesCopy: Array<Hole> = new Array<Hole>();
      for (let hole of flight.header.courseHoles9) {
          holesCopy.push(hole);
      }
      for (let hole of flight.header.courseHoles18) {
        holesCopy.push(hole);
      }
  
      return holesCopy;
      }
  
    public getScoresCopy(flight) : Array<Score> {
        
      let ScoresQL: Array<Score> = new Array<Score>();
  
      if(flight.MembersQL.length > 0) {
        for (let member of flight.MembersQL) {
          if(member.ScoresQL.length > 0) {
            for (let score of member.ScoresQL) {
              ScoresQL.push(score);
            }
          }
        }
      }
  
      return ScoresQL;
    }
  
    getCourseHoles(holeSets, courseHoleSetsInverted, holesQLs) {
      
      this.courseHoleSet = holeSets;
  
      //if(this.courseHoleSet == 3) this.courseHoleSet = 12;
  
      let courseHoles9: Hole[] = [];
      let courseHoles18: Hole[] = [];
      let courseHoles: Hole[] = [];
  
      // var isPresent = this.coursesList.some(function(el){ return el.id === courseQLs.id});
      
      // if(!isPresent) {
      //   let courseInfo: any = {
      //     id: courseQLs.id,
      //     name: courseQLs.name
      //   }
      //   this.coursesList.push(courseInfo);
      // }
  
      //console.log(this.coursesList);
      
      holesQLs = holesQLs.sort(this.Comparator);
      console.log(holesQLs);
      this.removeExtraHoleSets(holeSets, holesQLs, courseHoleSetsInverted);
      //console.log(holesQLs);
      for (let holeQL of holesQLs) {
        //let teeDistance = JSON.parse(holeQL.teeDistances);
        let teeDistance = holeQL.teeDistances;
  
        if(holeQL.holeNo < 10) {
          //holeQL.yardage9 = yardage9;
          //courseHoles9.push(holeQL);
          //console.log(courseHoleSetsInverted);
          courseHoles9.push(holeQL);
          courseHoles.push(holeQL);
        }
        else if(holeQL.holeNo > 9 && holeQL.holeNo < 19) {
            courseHoles18.push(holeQL);
            courseHoles.push(holeQL);
        }
        else { }
  
      }
  
      return courseHoles;
    }
        
  }
