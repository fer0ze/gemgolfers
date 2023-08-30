import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormArray} from '@angular/forms';
import { Router, ActivatedRoute   } from '@angular/router';
import { FacadeService } from '../../../../shared/services/facade.service';
import { TournamentRounds } from '../../../../shared/models/tournament.model';
import { Player } from '../../../../shared/models/player.model';
import { Flight, FlightMembers } from '../../../../shared/models/flight.model';
import { UniqueIdGenerator, Constants, passwordGenerator } from '../../../../shared/classes/general';

import { of } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
//import { DialogIncompleteFlightsComponent } from '../../material-components/dialog-incomplete-flights/dialog-incomplete-flights.component';
import { DialogAddPlayerComponent } from "../../dialogs/dialog-add-player/dialog-add-player.component";
import { DialogPlayerComponent } from "../../dialogs/dialog-player/dialog-player.component";
import { DialogPlayerListComponent } from "../../dialogs/dialog-player-list/dialog-player-list.component";
import { DialogOverviewComponent } from "../../dialogs/dialog-overview/dialog-overview.component";
import { DialogMoveFlightComponent } from "../../dialogs/dialog-move-flight/dialog-move-flight.component";
//import { read, utils } from 'xlsx'

import * as jsPDF from 'jspdf'; 
import 'jspdf-autotable';

import { Apollo } from 'apollo-angular';
import * as Query from '../../../../shared/GraphQL/flights.gql';

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.scss']
})
export class AttendanceComponent implements OnInit {

  dataSource: MatTableDataSource<any>;
  displayedColumns = ['flightNo', 'teebox', 'firstName', 'lastName', 'handicap', 'action'];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('pdfTable') pdfTable: ElementRef;

  public formGroup: FormGroup;
  public contactList: FormArray;

  loggedInuser: Player;
  tournamentInfo: any;
  tournamentMembers: Player[];
  selectedMembers: Player[][] = [];
  tournamentID: string;
  isLoading: boolean = true;
  preFlightTime: string;
  flightRound: number = 1;
  activeRound: number;
  tRounds: TournamentRounds[] = [];
  roundFlights: any[] = [];
  incompleteFlights: any[] = [];
  file: File;
  arrayBuffer: any;
  flightsData: any;
  copyScoreInfo: any[] = [];
  totalArrived: number = 0;
  totalNotArrived: number = 0;
  isPorcessing: boolean = false;

  constructor(private apollo: Apollo, private router: Router, private route: ActivatedRoute, public snackBar: MatSnackBar, private _formBuilder: FormBuilder, public dialog: MatDialog, private facadeService: FacadeService) { }

  head = [['ID', 'Country', 'Rank', 'Capital', 'e']]

  data = [
    [1, 'Finland', 7.632, 'Helsinki'],
    [2, 'Norway', 7.594, 'Oslo'],
    [3, 'Denmark', 7.555, 'Copenhagen'],
    [4, 'Iceland', 7.495, 'Reykjavík'],
    [5, 'Switzerland', 7.487, 'Bern'],
    [9, 'Sweden', 7.314, 'Stockholm'],
    [73, 'Belarus', 5.483, 'Minsk'],
  ]

  createPdf() {
    var doc = new jsPDF();

    doc.setFontSize(18);
    doc.text('My PDF Table', 11, 8);
    doc.setFontSize(11);
    doc.setTextColor(100);


    (doc as any).autoTable({
      head: this.head,
      body: this.data,
      theme: 'striped',
      didDrawCell: data => {
        console.log(data.column.index)
      }
    })

    // Open PDF document in new tab
    doc.output('dataurlnewwindow')

    // Download PDF document  
    doc.save('table.pdf');
  }

  public downloadAsPDF() {
    var doc = new jsPDF()

    doc.setFontSize(18);
    doc.text('Tournament Flights', 15, 15);
    doc.setFontSize(11);
    doc.setTextColor(100);

    // From HTML
    doc.autoTable({ 
      html: '#pdfTable', 
      startY: 25,
      useCss: true,
    });
  
    // Open PDF document in new tab
    doc.output('dataurlnewwindow');

    // Download PDF document  
    //doc.save('flights.pdf');
  } 

  onFileChange(event) {
    console.log(event.target.files.length);
    if (event.target.files.length > 0) {
     this.file = event.target.files[0];

     console.log(this.file);
    }
  }

//   parseFlightsData() {
//     let fileReader = new FileReader();
//     fileReader.onload = (e) => {
//       this.arrayBuffer = fileReader.result;
//       var data = new Uint8Array(this.arrayBuffer);
//       var arr = new Array();
//       for(var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
//       var bstr = arr.join("");
//       var workbook = read(bstr, {type:"binary"});
//       var first_sheet_name = workbook.SheetNames[0];
//       var worksheet = workbook.Sheets[first_sheet_name];
//       this.flightsData = utils.sheet_to_json(worksheet,{raw:true, defval:""});

//       console.log(this.flightsData);
//       this.importExcelData();
//       //this.providerservice.importexcel(this.exceljsondata).subscribe(data=>{
//       //})
//     }
//     fileReader.readAsArrayBuffer(this.file);
//  }

//   async importExcelData(){

//     for(let flight of this.flightsData) {
//       let player = await this.facadeService.getPlayerByGEMID(flight.gemId);

//       console.log(flight.flightNo + "<--->" + this.selectedMembers.length);

//       if(flight.flightNo > this.selectedMembers.length)
//       {
//         this.selectedMembers[this.selectedMembers.length] = [];
//         this.selectedMembers[this.selectedMembers.length - 1]["id"] = UniqueIdGenerator.generate();
//         this.selectedMembers[this.selectedMembers.length - 1]["time"] = flight.time;
//         this.selectedMembers[this.selectedMembers.length - 1]["startingHole"] = flight.startingHole;
//       }

//       this.selectedMembers[flight.flightNo - 1].splice(this.selectedMembers[flight.flightNo - 1].length - 4, 0, player[0]);
//     }

//     console.log(this.selectedMembers);
//   }

  // returns all form groups under flights
  get contactFormGroup() {
    return this.formGroup.get('flights') as FormArray;
  }

  ngOnInit() {
   this.loggedInuser = this._localStorage.get(Constants.LOGGED_IN_USER);

    this.route.paramMap.subscribe(params => {
      this.tournamentID = params.get("id");
    });

    // of(this.tournamentInfo).pipe()
    //   .subscribe(async data => {
    //     let dataFullTournament = await this.facadeService.getTournamentsFlights(this.loggedInuser.id, this.tournamentID);

    //     this.tournamentInfo = dataFullTournament.TournamentQL;
    //     this.isLoading = false;
    //     //this.totalArrived = dataFullTournament.ArrivedPlayers.aggregate.count;

    //    //console.log(this.tournamentInfo);

    //    this.tRounds = [];

    //    for(let round=1; round <= this.tournamentInfo.noOfRounds; round++)
    //     {
    //       let r: any = {
    //         Text: "Round " + round,
    //         Value: round
    //       }
    //       this.tRounds.push(r);
    //     }

    //     if(this.tournamentInfo.activeRound > this.tournamentInfo.noOfRounds)
    //       this.flightRound = this.tournamentInfo.noOfRounds;
    //     else
    //       this.flightRound = this.tournamentInfo.activeRound;

    //    this.getSelectedPlayers();
    //   });
    of(this.tournamentInfo).pipe()
      .subscribe(async data => {
        this.apollo.subscribe({
          query: Query.FlightManagersQuery,
          variables: {
       
            'tournamentId': this.tournamentID
          }
          })
          .subscribe(({ data }) => {
            if (!data) {

              } else {
                  let dataFullTournament: any = data;

                  this.tournamentInfo = dataFullTournament.TournamentQL;
                  this.isLoading = false;
                  this.isPorcessing = false;
                  //this.totalArrived = dataFullTournament.ArrivedPlayers.aggregate.count;

                  //console.log(this.tournamentInfo);

                  this.tRounds = [];
                  if(this.tournamentInfo) {

                    for(let round=1; round <= this.tournamentInfo.noOfRounds; round++)
                    {
                      let r: any = {
                        Text: "Round " + round,
                        Value: round
                      }
                      this.tRounds.push(r);
                    }

                    this.activeRound = this.tournamentInfo.activeRound;

                    if(this.tournamentInfo.activeRound > this.tournamentInfo.noOfRounds)
                      this.flightRound = this.tournamentInfo.noOfRounds;
                    else
                      this.flightRound = this.tournamentInfo.activeRound;

                    this.getSelectedPlayers();
                  }
              }
          });
      });

  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;

    if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
    }
  }

  onHoleChange($event, i, j) {
    //console.log(i);
    //console.log(this.stages[i]);
    //console.log(this.stages[i][j]);
    //this.stages[i][j][1] = $event.target.value;
    let flight_1_hole : string = (<HTMLInputElement>document.getElementById("flight_" + i + "_hole")).value;
    //console.log(flight_1_hole);
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      //console.log("moveItemInArray called");
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
        // console.log("transferArrayItem called");
        // console.log(event.previousContainer.data);
        // console.log(event.container.data);
        // console.log(event.previousIndex);
        //  console.log(event.item.data);
        
        this.moveFlightPlayer(event.previousContainer.data, event.container.data, event.item.data, true);
    }
  }

  async moveFlightPlayer(fromFlight: any, toFlight: any, player: any, flag: boolean) {
    this.isPorcessing = true;
    let memberToSave: FlightMembers[] = [];

    let FM: any = {
      playerId: player.id,
      flightId: toFlight.id,
      attendance: player.attendance
    }

    memberToSave.push(FM);

    // console.log(memberToSave);
    // console.log(player.id);
    // console.log(fromFlight.id);
    // console.log(toFlight.id);

    await this.facadeService.moveFlightsPlayer(memberToSave);

    if(flag) {
      await this.facadeService.copyPlayerScore(player.id, fromFlight.id, toFlight.id);
    }
    //this.isPorcessing = false;
  }

  getNextFlightTime(items: any) {

    let flightTime: string = "00:00";

    try {

      if(items.time) {
        let dateNow : Date = new Date(Constants.DEFAULT_DATE + " " + items.time.substr(0,5));

        var h = dateNow.getHours();
        var m = dateNow.getMinutes();

        flightTime = ('0' + h).slice(-2) + ":" + ('0' + m).slice(-2);
      }
    }
    catch {
      flightTime = "00:00";
    }

    return flightTime;
  }

  changeRound(item) {
    //console.log("Selected value: " + item.value);
    this.flightRound = item.value;
    this.roundFlights = [];
    this.selectedMembers = [];

    this.getSelectedPlayers();
  }

  async getSelectedPlayers() {
    this.roundFlights = this.tournamentInfo.FlightManagerQLi.filter((a) => {
      return a.flightRound == this.flightRound;
    });

    //console.log(this.roundFlights);

    let outer = 0;
    this.tournamentMembers = [];
    this.incompleteFlights = [];
    let noofArrived = 0;
    this.totalArrived = 0;

    for (var index in this.roundFlights) {
      //console.log(outer + "<--->" + cnter);

      let cnter = 0;
      noofArrived = 0;
      this.selectedMembers[outer] = [];

      this.selectedMembers[outer]["id"] = this.roundFlights[index].id;
      this.selectedMembers[outer]["tournamentId"] = this.roundFlights[index].tournamentId;
      this.selectedMembers[outer]["time"] = this.roundFlights[index].time;
      this.selectedMembers[outer]["startingHole"] = this.roundFlights[index].startingHole;

      this.selectedMembers[outer][cnter] = this.roundFlights[index].MembersQL;

      for(let member of this.roundFlights[index].MembersQL)
      {
        this.selectedMembers[outer][cnter] = <Player> member.PlayerQL;
        this.selectedMembers[outer][cnter]["attendance"] = member.attendance;

        let currentMember: any = member.PlayerQL;
        currentMember["flightId"] = this.selectedMembers[outer]["id"];
        currentMember["flightNo"] = (Number(index) + 1);
        currentMember["startingHole"] = this.selectedMembers[outer]["startingHole"];
        currentMember["attendance"] = member.attendance;
        this.tournamentMembers.push(currentMember);
        cnter++;

        if(member.attendance) {
          noofArrived += 1;
          this.totalArrived++;
        }

      }

      //console.log(this.roundFlights[index].MembersQL.length + "<>" + noofArrived);
      if(this.roundFlights[index].MembersQL.length == noofArrived)
        this.selectedMembers[outer]["completed"] = true;
      else
      {
        this.selectedMembers[outer]["completed"] = false;
        this.incompleteFlights.push(this.roundFlights[index]);
      }
      outer++;
    }
    //console.log(this.tournamentMembers);

    this.dataSource = new MatTableDataSource(this.tournamentMembers);

    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;


    if(this.totalArrived > this.tournamentMembers.length)
      this.totalNotArrived = this.totalArrived - this.tournamentMembers.length;
    else
      this.totalNotArrived = this.tournamentMembers.length - this.totalArrived;

    //this.selectedMembers = this.selection.selected;

    //this.selectedMembers.sort((a,b) => (a.handicap > b.handicap) ? 1 : ((b.handicap > a.handicap) ? -1 : 0));
    /*
    this.selectedMembers.sort(function(a, b){
      if(a.handicap > b.handicap) { return -1; }
      if(a.handicap < b.handicap) { return 1; }
      return 0;
    });
    */
    //console.log(this.selectedMembers);
    //console.log(this.groups);
  }

  OnChange($event, i: number, j: number) {
    // console.log(i);
    // console.log(j);
    // console.log($event.checked);
    // this.selectedMembers[i][j]["attendance"] = $event.checked;
  }

  async saveFlights() {
   this.loggedInuser = this._localStorage.get(Constants.LOGGED_IN_USER);
    let tournamentFlights: Flight[] = [];
    let flightsToRemove: string[] = [];
    let flightMembersToRemove: string[] = [];
    let membersFromFlightToRemove: string[] = [];
    let flightMembersToSave: FlightMembers[] = [];
    let tournamentFlightMembers: FlightMembers[];
    let fcnter = 0;
    let runningFlightcounter = 0;
    this.copyScoreInfo = [];
    this.isPorcessing = true;

    //console.log(this.selectedMembers);
    //console.log(this.roundFlights);

    for (var index in this.selectedMembers) {

      tournamentFlightMembers = [];

      for(let index2 in this.selectedMembers[index]) {
        if(Number.isInteger(Number(index2))) {
          let FM: any = {
            playerId: this.selectedMembers[index][index2].id,
            attendance: this.selectedMembers[index][index2]["attendance"]
          }

          tournamentFlightMembers.push(FM);
        }
      }

      //console.log(this.selectedMembers[index].length);
      fcnter++;
      if(this.selectedMembers[index].length > 0)
      {
        runningFlightcounter++;
        //console.log(tournamentFlightMembers);


        let startingHole = parseFloat((<HTMLInputElement>document.getElementById("flight_" + index + "_hole")).value);
        let startTime : string = (<HTMLInputElement>document.getElementById("flight_" + index + "_time")).value;

        //let stTime: Time;
        //stTime.hours = 9;
        //stTime.minutes = 0;

        let roundFlightData = this.roundFlights.filter((a) => {
          return a.flightRound == this.flightRound && a.flightNo == fcnter;
        });

        //console.log(roundFlightData);
        //console.log(this.selectedMembers[index]);

        let currentFlightId: string;

        if(roundFlightData && roundFlightData.length  > 0)
          currentFlightId = (roundFlightData.length > 0)? roundFlightData[0].id : UniqueIdGenerator.generate();
        else if (this.selectedMembers[index]["id"])
          currentFlightId = (this.selectedMembers[index]["id"])? this.selectedMembers[index]["id"] : UniqueIdGenerator.generate();

        let flight: any = {
          id: currentFlightId,
          tournamentId: this.tournamentInfo.id,
          courseId: (roundFlightData.length > 0)? roundFlightData[0].courseId : this.tournamentInfo.courseId,
          adminId: (roundFlightData.length > 0)? roundFlightData[0].adminId : this.tournamentInfo.adminId,
          courseHoleSets: (roundFlightData.length > 0)? roundFlightData[0].courseHoleSets : 0,
          flightNo: runningFlightcounter,
          flightRound: this.flightRound,
          startingHole: startingHole,
          tee: (roundFlightData.length > 0)? roundFlightData[0].tee : "BLUE",
          date: (roundFlightData.length > 0)? roundFlightData[0].date : this.tournamentInfo.startDate,
          time: startTime,
          ended: false
        }
        //console.log(flight);
        tournamentFlights.push(flight);
        //break;
        //console.log(roundFlightData.length);

        let oldMembers: any;

        if (roundFlightData && roundFlightData.length > 0) {
          oldMembers = roundFlightData[0].MembersQL;
        }
        else
          oldMembers = [];

        //console.log(oldMembers);
        //console.log(tournamentFlightMembers);

        let removed = oldMembers.filter(n => !tournamentFlightMembers.some(n2 => n.playerId == n2.playerId));
        //console.log(removed);

        for(let ids of removed) {
          flightMembersToRemove.push(ids.playerId);
          membersFromFlightToRemove.push(currentFlightId);

          let newFlight: any = this.selectedMembers.filter(n => n.some(n2 => n2.id == ids.playerId));

          //console.log(newFlight);
          //console.log(newFlight.length);

          //if(newFlight.length > 0) {
            let copy: any = {
              playerId: ids.playerId,
              fromFlight: currentFlightId,
              toFlight: (newFlight.length > 0)? newFlight[0].id : currentFlightId
            }

            this.copyScoreInfo.push(copy);
          //}
        }

        let added = tournamentFlightMembers.filter(n => !oldMembers.some(n2 => n.playerId == n2.playerId));
        //console.log(added);

        for(let ids of added) {
          let FM: any = {
            playerId: ids.playerId,
            flightId: currentFlightId,
            attendance: ids.attendance
          }

          flightMembersToSave.push(FM);
        }

        //break;
      }
      else {
        //console.log("deleting");
        //console.log(this.roundFlights);
        let roundFlightData = this.roundFlights.filter((a) => {
          return a.flightRound == this.flightRound && a.flightNo == fcnter;
        });
        //console.log(roundFlightData);
        if(roundFlightData.length > 0) {
          let oldMembers: any = roundFlightData[0].MembersQL;
          //console.log(oldMembers);

          for(let ids of oldMembers) {
            flightMembersToRemove.push(ids.playerId);
            membersFromFlightToRemove.push(roundFlightData[0].id);
          }

          //for(let ids of oldMembers) {
            //flightMembersToRemove.push(ids.playerId);
          //}

          flightsToRemove.push(roundFlightData[0].id);
        }
        //fcnter--;
      }
    }

    // console.log(this.tournamentInfo.id);
    // console.log(flightsToRemove);
    // console.log(flightMembersToRemove);
    // console.log(tournamentFlights);
    // console.log(flightMembersToSave);


    // this.facadeService.SaveTournamentFlights(this.tournamentInfo.id, flightsToRemove, membersFromFlightToRemove, flightMembersToRemove, tournamentFlights, flightMembersToSave);

    // let dataFullTournament = await this.facadeService.getTournamentsFlights(this.loggedInuser.id, this.tournamentID);
    // this.tournamentInfo = dataFullTournament.TournamentQL;

    // this.getSelectedPlayers();

    // this.snackBar.open("Flights have been saved successfully.", "x", {
    //   duration: 5000,
    // });

    await this.facadeService.SaveTournamentFlights(this.tournamentInfo.id, tournamentFlights, flightMembersToSave);

    for(let copy of this.copyScoreInfo) {
      await this.facadeService.copyPlayerScore(copy.playerId, copy.fromFlight, copy.toFlight);
    }

    await this.facadeService.DeleteFlightsAndMembers(flightsToRemove, membersFromFlightToRemove, flightMembersToRemove);

    //let dataFullTournament = await this.facadeService.getTournamentsFlights(this.loggedInuser.id, this.tournamentID);
    //this.tournamentInfo = dataFullTournament.TournamentQL;

    // this.roundFlights = this.tournamentInfo.FlightManagerQLi.filter((a) => {
    //   return a.flightRound == this.flightRound;
    // });
    this.isPorcessing = false;

    this.snackBar.open("Flights have been saved successfully.", "x", {
      duration: 5000,
    });

    //console.log(tournamentFlights);
  }

  saveFlight(index: number) {
    //console.log(index);
    const dialogRef = this.dialog.open(DialogOverviewComponent, {
        width: '350px',
        data: "Do you want to save group " + (index + 1) + "?"
    });

    dialogRef.afterClosed().subscribe(result => {
        if(result) {
            //console.log(this.selectedMembers[index]);
            let singleFlight: any[] = [];
            singleFlight.push(this.selectedMembers[index]);
            this.saveSingleFlight(singleFlight, index);
            //this.selectedMembers.splice(index, 1);
        }
        else {
            //console.log("cancel delete action");
        }
    });
  }

  async saveSingleFlight(flightData: any, flightNo: number) {
   this.loggedInuser = this._localStorage.get(Constants.LOGGED_IN_USER);
    let tournamentFlights: Flight[] = [];
    let flightsToRemove: string[] = [];
    let flightMembersToRemove: string[] = [];
    let membersFromFlightToRemove: string[] = [];
    let flightMembersToSave: FlightMembers[] = [];
    let tournamentFlightMembers: FlightMembers[];
    let fcnter = flightNo;
    let runningFlightcounter = flightNo;
    this.copyScoreInfo = [];

    //console.log(this.selectedMembers);
    //console.log(flightData);

    for (var index in flightData) {

      tournamentFlightMembers = [];

      for(let index2 in flightData[index]) {
        if(Number.isInteger(Number(index2))) {
          let FM: any = {
            playerId: flightData[index][index2].id,
            attendance: flightData[index][index2]["attendance"]
          }

          tournamentFlightMembers.push(FM);
        }
      }

      //console.log(flightData[index].length);
      fcnter++;
      if(flightData[index].length > 0)
      {
        runningFlightcounter++;
        //console.log(tournamentFlightMembers);


        let startingHole = parseFloat((<HTMLInputElement>document.getElementById("flight_" + flightNo + "_hole")).value);
        let startTime : string = (<HTMLInputElement>document.getElementById("flight_" + flightNo + "_time")).value;

        //let stTime: Time;
        //stTime.hours = 9;
        //stTime.minutes = 0;

        let roundFlightData = this.roundFlights.filter((a) => {
          return a.flightRound == this.flightRound && a.flightNo == fcnter;
        });

        //console.log(roundFlightData);
        //console.log(this.selectedMembers[index]);

        let currentFlightId: string;

        if(roundFlightData && roundFlightData.length  > 0)
          currentFlightId = (roundFlightData.length > 0)? roundFlightData[0].id : UniqueIdGenerator.generate();
        else if (this.selectedMembers[index]["id"])
          currentFlightId = (this.selectedMembers[index]["id"])? this.selectedMembers[index]["id"] : UniqueIdGenerator.generate();

        let flight: any = {
          id: currentFlightId,
          tournamentId: this.tournamentInfo.id,
          courseId: (roundFlightData.length > 0)? roundFlightData[0].courseId : this.tournamentInfo.courseId,
          adminId: (roundFlightData.length > 0)? roundFlightData[0].adminId : this.tournamentInfo.adminId,
          courseHoleSets: (roundFlightData.length > 0)? roundFlightData[0].courseHoleSets : 0,
          flightNo: runningFlightcounter,
          flightRound: this.flightRound,
          startingHole: startingHole,
          tee: (roundFlightData.length > 0)? roundFlightData[0].tee : "BLUE",
          date: (roundFlightData.length > 0)? roundFlightData[0].date : this.tournamentInfo.startDate,
          time: startTime,
          ended: false
        }
        //console.log(flight);
        tournamentFlights.push(flight);
        //break;
        //console.log(roundFlightData.length);

        let oldMembers: any;

        if (roundFlightData && roundFlightData.length > 0) {
          oldMembers = roundFlightData[0].MembersQL;
        }
        else
          oldMembers = [];

        //console.log(oldMembers);
        //console.log(tournamentFlightMembers);

        let removed = oldMembers.filter(n => !tournamentFlightMembers.some(n2 => n.playerId == n2.playerId));
        //console.log(removed);

        for(let ids of removed) {
          flightMembersToRemove.push(ids.playerId);
          membersFromFlightToRemove.push(currentFlightId);

          let newFlight: any = this.selectedMembers.filter(n => n.some(n2 => n2.id == ids.playerId));
          console.log(newFlight);

          if(newFlight.length > 0) {
            let copy: any = {
              playerId: ids.playerId,
              fromFlight: currentFlightId,
              toFlight: newFlight[0].id
            }

            this.copyScoreInfo.push(copy);
          }
        }

        let added = tournamentFlightMembers.filter(n => !oldMembers.some(n2 => n.playerId == n2.playerId));
        //console.log(added);

        for(let ids of added) {
          let FM: any = {
            playerId: ids.playerId,
            flightId: currentFlightId,
            attendance: ids.attendance
          }

          flightMembersToSave.push(FM);
        }

        //break;
      }
      else {
        //console.log("deleting");
        //console.log(this.roundFlights);
        let roundFlightData = this.roundFlights.filter((a) => {
          return a.flightRound == this.flightRound && a.flightNo == fcnter;
        });
        //console.log(roundFlightData);
        if(roundFlightData.length > 0) {
          let oldMembers: any = roundFlightData[0].MembersQL;
          //console.log(oldMembers);

          for(let ids of oldMembers) {
            flightMembersToRemove.push(ids.playerId);
            membersFromFlightToRemove.push(roundFlightData[0].id);
          }

          //for(let ids of oldMembers) {
            //flightMembersToRemove.push(ids.playerId);
          //}

          flightsToRemove.push(roundFlightData[0].id);
        }
        //fcnter--;
      }
    }

    // console.log(this.tournamentInfo.id);
    // console.log(flightsToRemove);
    // console.log(flightMembersToRemove);
    // console.log(tournamentFlights);
    // console.log(flightMembersToSave);


    // this.facadeService.SaveTournamentFlights(this.tournamentInfo.id, flightsToRemove, membersFromFlightToRemove, flightMembersToRemove, tournamentFlights, flightMembersToSave);

    // let dataFullTournament = await this.facadeService.getTournamentsFlights(this.loggedInuser.id, this.tournamentID);
    // this.tournamentInfo = dataFullTournament.TournamentQL;

    // this.roundFlights = this.tournamentInfo.FlightManagerQLi.filter((a) => {
    //   return a.flightRound == this.flightRound;
    // });

    // this.snackBar.open("Flights have been saved successfully.", "x", {
    //   duration: 5000,
    // });

    await this.facadeService.SaveTournamentFlights(this.tournamentInfo.id, tournamentFlights, flightMembersToSave);

    for(let copy of this.copyScoreInfo) {
      await this.facadeService.copyPlayerScore(copy.playerId, copy.fromFlight, copy.toFlight);
    }

    await this.facadeService.DeleteFlightsAndMembers(flightsToRemove, membersFromFlightToRemove, flightMembersToRemove);

    let dataFullTournament = await this.facadeService.getTournamentsFlights(this.loggedInuser.id, this.tournamentID);
    this.tournamentInfo = dataFullTournament.TournamentQL;

    this.roundFlights = this.tournamentInfo.FlightManagerQLi.filter((a) => {
      return a.flightRound == this.flightRound;
    });

    this.snackBar.open("Flights have been saved successfully.", "x", {
      duration: 5000,
    });

    //console.log(tournamentFlights);
  }

  addFlight() {
    // //console.log(this.selectedMembers.length);
    // this.selectedMembers[this.selectedMembers.length] = [];
    // this.selectedMembers[this.selectedMembers.length - 1]["id"] = UniqueIdGenerator.generate();
    // this.selectedMembers[this.selectedMembers.length - 1]["time"] = "09:00";
    // this.selectedMembers[this.selectedMembers.length - 1]["startingHole"] = "1";
    // //console.log(this.selectedMembers.length);
    // //this.selectedMembers[this.selectedMembers.length - 1][];
    // //console.log(this.selectedMembers);

    let newTournamentFlights: Flight[] = [];
    let newFlightMembersToSave: FlightMembers[] = [];

    let flight: any = {
      id: UniqueIdGenerator.generate(),
      tournamentId: this.tournamentInfo.id,
      courseId: this.tournamentInfo.courseId,
      adminId: this.tournamentInfo.adminId,
      courseHoleSets: 0,
      flightNo: this.selectedMembers.length + 1,
      flightRound: this.flightRound,
      startingHole: "1",
      tee: "BLUE",
      date: this.tournamentInfo.startDate,
      time: "9:00",
      ended: false
    }
    newTournamentFlights.push(flight);
    //console.log(flight);

    this.facadeService.SaveTournamentFlights(this.tournamentInfo.id, newTournamentFlights, newFlightMembersToSave);
  }

  removeFlights(index: number) {
    //console.log(index);
    const dialogRef = this.dialog.open(DialogOverviewComponent, {
        width: '350px',
        data: "Do you want to delete group " + (index + 1) + "?"
    });

    dialogRef.afterClosed().subscribe(result => {
        if(result) {
            //console.log("record deleted.");
            this.selectedMembers.splice(index, 1);
        }
        else {
            //console.log("cancel delete action");
        }
    });
  }

  addExistingPlayer() {

    const dialogRef = this.dialog.open(DialogPlayerComponent, {
        width: '350px',
        data: {flights: this.selectedMembers.length}
    });

    dialogRef.afterClosed().subscribe(result => {
      //console.log(result);
      if(result) {
            //console.log("record deleted.");
            //console.log(result.flight);
            //console.log(this.selectedMembers[result.flight]);
            //this.selectedMembers[result.flight].splice(this.selectedMembers[result.flight].length - 4, 0, result.player);
            this.moveFlightPlayer(this.selectedMembers[result.flight], this.selectedMembers[result.flight], result.player, false);
        }
        else {
            //console.log("cancel delete action");
        }
    });
  }

  addPlayer() {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent, {
      data: {flights: this.selectedMembers.length}
    });

    dialogRef.afterClosed().subscribe(result => {

      if(result) {
            //console.log("record deleted.");
            //console.log(result);
            //this.selectedMembers[this.selectedMembers.length - 1].splice(this.selectedMembers[this.selectedMembers.length - 1].length - 3, 0, result);
            if(this.selectedMembers.length > 0)
              this.moveFlightPlayer(this.selectedMembers[0], this.selectedMembers[0], result, false);
            else {
              this.snackBar.open("There is no any flight exist. Add a flight first.", "x", {
                duration: 5000,
              });
            }

        }
        else {
            //console.log("cancel delete action");
        }
    });
  }

  removePlayer(flight: number, player: number) {
    //console.log(flight + "<- ->" + player);
    const dialogRef = this.dialog.open(DialogOverviewComponent, {
      width: '350px',
      data: "Do you want to remove this player from group?"
    });

    dialogRef.afterClosed().subscribe(result => {
        if(result) {
            //console.log("record deleted.");
            this.selectedMembers[flight].splice(player, 1);
        }
        else {
            //console.log("cancel delete action");
        }
    });
  }

  movePlayer(flight: number, cplayer: number) {
    //console.log(flight + "<- ->" + player);
    
    let player: Player = this.selectedMembers[flight][cplayer];
    const dialogRef = this.dialog.open(DialogMoveFlightComponent, {
      width: '350px',
      data: {flights: this.selectedMembers.length, name: player.firstName + " " + player.lastName}
    });

    dialogRef.afterClosed().subscribe(result => {
        if(result) {
          //console.log(flight);  
          //console.log(result);
            
            //console.log(this.selectedMembers[flight]);
            //console.log(this.selectedMembers[result - 1]);
            // this.selectedMembers[flight].splice(cplayer, 1);
            
            // this.selectedMembers[result - 1].splice(this.selectedMembers[result - 1].length - 3, 0, player);
            this.moveFlightPlayer(this.selectedMembers[flight], this.selectedMembers[result - 1], player, true);
        }
        else {
            //console.log("cancel delete action");
        }
    });
  }

  async moveArrivedPlayer(flight: number, player: any) {
    //console.log(flight + "<- ->" + player);
    
    //let rawPlayer: any = await this.facadeService.getPlayerByID(playerId);
    
    //if(rawPlayer.length > 0) var player = rawPlayer[0];
    
    //console.log(player);
    flight = flight - 1;
    const dialogRef = this.dialog.open(DialogMoveFlightComponent, {
      width: '350px',
      data: {flights: this.selectedMembers.length, name: player.firstName + " " + player.lastName}
    });

    dialogRef.afterClosed().subscribe(result => {
        if(result) {
          //console.log(flight);  
          //console.log(result);
            
            //console.log(this.selectedMembers[flight]);
            //console.log(this.selectedMembers[result - 1]);
            // this.selectedMembers[flight].splice(cplayer, 1);
            
            // this.selectedMembers[result - 1].splice(this.selectedMembers[result - 1].length - 3, 0, player);
            this.moveFlightPlayer(this.selectedMembers[flight], this.selectedMembers[result - 1], player, true);
        }
        else {
            //console.log("cancel delete action");
        }
    });
  }

  async markAttendance(flightId, playerId, status) {
    // console.log(flightId);
    // console.log(playerId);
    // console.log(status);

    let result = this.facadeService.markPlayerAttendance(flightId, playerId, status);
    //console.log(this.loggedInuser.id);

    let dataFullTournament = await this.facadeService.getTournamentsFlights(this.loggedInuser.id, this.tournamentID);
    this.tournamentInfo = dataFullTournament.TournamentQL;

    //this.getSelectedPlayers();

    // this.roundFlights = this.tournamentInfo.FlightManagerQLi.filter((a) => {
    //   return a.flightRound == this.flightRound;
    // });

  }

  viewIncompleteFlights() {
    const dialogRef = this.dialog.open(DialogIncompleteFlightsComponent, {
      width: '350px',
      data: {flights: this.incompleteFlights}
    });

    dialogRef.afterClosed().subscribe(result => {
        if(result) {
            //console.log("record deleted.");
        }
        else {
            //console.log("cancel delete action");
        }
    });
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

}
