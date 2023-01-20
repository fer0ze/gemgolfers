import { Component, Input, OnInit, ViewChild } from "@angular/core";
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormControl,
  FormArray,
  Validators,
} from "@angular/forms";
import { read, utils } from "xlsx";
import { Router, ActivatedRoute } from "@angular/router";
import { FacadeService } from "../../../../shared/services/facade.service";
import { Club } from "../../../../shared/models/club.model";
import { Course, CourseHoles } from "../../../../shared/models/course.model";
import {
  Tournament,
  TournamentRounds,
  TournamentMember,
  matchFormat,
} from "../../../../shared/models/tournament.model";
import {
  Player,
  PlayerCategory,
  Marshal,
} from "../../../../shared/models/player.model";
import { Flight, FlightMembers } from "../../../../shared/models/flight.model";
import {
  UniqueIdGenerator,
  passwordGenerator,
  Constants,
  General,
} from "../../../../shared/classes/general";
import { SelectionModel } from "@angular/cdk/collections";
import { of } from "rxjs";
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from "@angular/cdk/drag-drop";
import { DialogAddPlayerComponent } from "../../dialogs/dialog-add-player/dialog-add-player.component";
import { DialogPlayerComponent } from "../../dialogs/dialog-player/dialog-player.component";
import { DialogPlayerListComponent } from "../../dialogs/dialog-player-list/dialog-player-list.component";
import { DialogOverviewComponent } from "../../dialogs/dialog-overview/dialog-overview.component";
import { DialogMoveFlightComponent } from "../../dialogs/dialog-move-flight/dialog-move-flight.component";
import { ViewTournamentComponent } from "../view-tournament/view-tournament.component";

@Component({
  selector: "app-flight-management",
  templateUrl: "./flight-management.component.html",
  styleUrls: ["./flight-management.component.scss"],
})
export class FlightManagementComponent implements OnInit {

  @Input()
	tournamentID: string;
  dataSource: MatTableDataSource<any>;
  dataSources: MatTableDataSource<any>;
  drawerMode: 'side' | 'over';
  displayedColumns = [
    "firstName",
    "lastName",
    "handicap",
    "playerCategory",
    "action",
  ];
  membersColumns = [
    "firstName",
    "lastName",
    "handicap",
    "playerCategory",
    "select",
  ];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginators: MatPaginator;
  @ViewChild(MatSort) sorts: MatSort;
  selection = new SelectionModel<Player>(true, []);
  public formGroup: FormGroup;
  public contactList: FormArray;
  showFiller = false;
  showCategory: boolean = true;
  newFlights: any[] = [];
  categoryCounts: any = [];
  loggedInuser: Player;
  tournamentInfo: any;
  tournamentMember: any[] = [];
  selectedMembers: Player[][] = [];
  //tournamentID: string;
  isLoading: boolean = true;
  preFlightTime: string;
  flightRound: number = 0;
  activeRound: number;
  noOfRounds: number;
  tRounds: TournamentRounds[] = [];
  roundFlights: any[] = [];
  copyScoreInfo: any[] = [];
  flightTees: Map<string, any> = new Map<string, any>();
  file: File;
  addFlightNum: number = 0;
  addFlights: boolean = true;
  arrayBuffer: any;
  flightsData: any;
  importedFlights: boolean = false;
  playerTee: boolean = false;
  importedFlightsNum: number = 0;
  exist: Player[];
  newPlayers: Player[] = [];
  showTeams: boolean = false;
  teamName: string;
  dataPlayers: any;
  index: any = 0;
  aggregate = 0;
  pageSize: any = 20;
  clubMembers: any[] = [];
  player: any[];

  selectPlayer: any;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public snackBar: MatSnackBar,
    private _formBuilder: FormBuilder,
    public dialog: MatDialog,
      private _viewTournamentComponent: ViewTournamentComponent,
    private facadeService: FacadeService
  ) {}

  // returns all form groups under flights
  get contactFormGroup() {
    return this.formGroup.get("flights") as FormArray;
  }

  async ngOnInit() {
    this.loggedInuser = JSON.parse(
      localStorage.getItem(Constants.LOGGED_IN_USER)
    );
    console.log(this.loggedInuser);

    // this.route.paramMap.subscribe((params) => {
    //   this.tournamentID = params.get("id");
    // });
  console.log(this.tournamentID);
  
    let dataFullTournament = await this.facadeService.getTournamentsFlights(
     
      this.tournamentID
    );

    this.tournamentInfo = dataFullTournament.TournamentQL;
    this.activeRound = this.tournamentInfo[0].activeRound;
    this.noOfRounds = this.tournamentInfo[0].noOfRounds;

    console.log(this.tournamentInfo[0]);
    let selectedClubId: string =
      this.loggedInuser.userRole > 1
        ? this.loggedInuser.adminClubId
        : this.tournamentInfo[0].clubId;
    this.clubMembers = [];
    console.log(selectedClubId);
    let dataFullTournaments = await this.facadeService.getTournamentMembers(
      this.tournamentID
    );
    console.log(dataFullTournaments);

    this.tournamentMember = dataFullTournaments.TournamentMemberQL;
    this.clubMembers = await this.facadeService.getPlayerByClub(selectedClubId);
    this.aggregate = this.clubMembers["AggregateQL"]["aggregate"].totalCount;

    this.syncClubMembers();
    if (this.tournamentInfo[0].activeRound > this.tournamentInfo[0].noOfRounds)
    // this.flightRound = this.tournamentInfo[0].noOfRounds;
    // else this.flightRound = this.tournamentInfo[0].activeRound;
    if (this.tournamentInfo[0]["matchFormat"] == matchFormat.TEXAS_SCRAMBLE) {
      this.showTeams = true;
    }
    this.getSelectedPlayers();
    //this.syncTournamentMembers();
    // console.log(clubMembersData);

    // for (let i = 0; i < clubMembersData.length; i++) {
    //   this.clubMembers.push(clubMembersData[i].player);
    // }
    //console.log(this.clubMembers);

    this.isLoading = false;

    //console.log(this.tournamentInfo[0]);
    if (this.tournamentInfo[0]) {
      for (let round = 1; round <= this.tournamentInfo[0].noOfRounds; round++) {
        let r: any = {
          Text: "Round " + round,
          Value: round,
        };
        this.tRounds.push(r);
      }
    }

    console.log(dataFullTournament);

    // this.tournamentMember = dataFullTournament.TournamentMemberQL;
    // this.isLoading = false;
    // console.log(this.tournamentMember);

    // for (let m in this.tournamentMember)
    //   this.tournamentMember[m]["fullName"] =
    //     this.tournamentMember[m].player.firstName +
    //     " " +
    //     this.tournamentMember[m].player.lastName;
    //console.log(this.tournamentMember);
    // this.syncTournamentMembers();
    // this.dataSource = new MatTableDataSource(this.tournamentMember);
    // setTimeout(() => (this.dataSource.paginator = this.paginator));
    // this.dataSource.sort = this.sort;
  }

  getPlayerInformationByNameClub(filterValue: string) {
    console.log(filterValue);
    if (filterValue == "") {
      this.syncClubMembers();
      return;
    }
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.player = [];
    for (let c of this.clubMembers["club_member"]) {
      c["fullname"] = c.player["firstName"] + " " + c.player["lastName"];
      if (c["fullname"].toLowerCase().includes(filterValue)) {
        this.player.push(c);
        this.selectPlayer = c;
      }
    }
    console.log(this.player);
    this.setDataSources(this.player);
  }
  setDataSources(dataSource: Array<Player>) {
    this.dataSources = new MatTableDataSource(dataSource);
    this.dataSources.sort = this.sort;
    console.log(this.dataSource);
  }
  getPlayerInformationByNameTournament(filterValue: string) {
    console.log(filterValue);
    if (filterValue == "") {
      this.syncTournamentMembers();

      return;
    }
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.player = [];
    for (let c of this.tournamentMember) {
      c["fullname"] = c.player["firstName"] + " " + c.player["lastName"];
      if (c["fullname"].toLowerCase().includes(filterValue)) {
        this.player.push(c);
        this.selectPlayer = c;
      }
    }
    console.log(this.player);
    this.setDataSource(this.player);
  }
  setDataSource(dataSource: Array<Player>) {
    this.dataSource = new MatTableDataSource(dataSource);
    this.dataSource.sort = this.sort;
    console.log(this.dataSource);
  }

  tabClicked(tab: any) {
    if (tab.index == 1) {
      this.syncTournamentMembers();
    } else {
      this.masterToggle();
      this.syncClubMembers();
    }
    // this.index = 0;
    // this.pageSize = 20;
    // if (tab.index == 1) {
    //   this.syncHandicapWHS();
    // } else {
    //   this.syncHandicapCongu();
    // }
  }
  onPageFired(event) {
    this.index = event.pageIndex * event.pageSize;
    this.pageSize = event.pageSize;
    console.log(this.index);
    this.syncClubMembers();

    console.log(event);
  }
  syncClubMembers() {
    let count = 0;
    this.player = [];
    for (
      this.index;
      this.index < this.clubMembers["club_member"].length;
      this.index++
    ) {
      //console.log(this.index);

      let flag: boolean = false;
      for (let c of this.tournamentMember) {
        if (
          c.playerId == this.clubMembers["club_member"][this.index]["player"].id
        ) {
          flag = true;
          break;
        }
      }
      if (flag == false) {
        count++;
        this.player.push(this.clubMembers["club_member"][this.index]);
        if (count >= this.pageSize) break;
      }
    }

    this.index = 0;
    this.dataSources = new MatTableDataSource(this.player);
    this.dataSources.sort = this.sorts;
    this.isLoading = false;
    this.player = [];
    //setTimeout(() => (this.dataSources.paginator = this.paginators), 2000);
  }

  syncTournamentMembers() {
    // console.log(this.tournamentMember);
    // console.log(this.selectedMembers);
    let count = 0;
    let flightPlayers: any[] = [];
    if (this.selectedMembers.length > 0) {
      for (let member of this.tournamentMember) {
        for (
          let index = 0;
          index < this.selectedMembers[count].length;
          index++
        ) {
          if (this.selectedMembers[count][index].id == member.playerId) {
            let obj = {
              playerId: member.playerId,
            };
            flightPlayers.push(obj);
            break;
          }

          if (
            this.selectedMembers.length - 1 > count &&
            this.selectedMembers[count].length <= index + 1
          ) {
            count++;
            index = -1;
          }
        }
        count = 0;
      }
    }
    console.log(flightPlayers);
    if (flightPlayers.length > 0) {
      for (let member of flightPlayers) {
        let index = 0;
        for (let mem of this.tournamentMember) {
          if (mem.playerId == member.playerId) {
            this.tournamentMember[index].status = true;
          }

          index++;
        }
      }
    }
    console.log(this.tournamentMember);

    this.dataSource = new MatTableDataSource(this.tournamentMember);
    this.dataSource.sort = this.sort;
    setTimeout(() => (this.dataSource.paginator = this.paginator), 1000);
    this.isLoading = false;
  }

  onHoleChange($event, i, j) {
    //console.log(i);
    //console.log(this.stages[i]);
    //console.log(this.stages[i][j]);
    //this.stages[i][j][1] = $event.target.value;
    let flight_1_hole: string = (<HTMLInputElement>(
      document.getElementById("flight_" + i + "_hole")
    )).value;
    //console.log(flight_1_hole);
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }

  getNextFlightTime(items: any) {
    let flightTime: string = "00:00";

    try {
      if (items.time) {
        let dateNow: Date = new Date(
          Constants.DEFAULT_DATE + " " + items.time.substr(0, 5)
        );

        var h = dateNow.getHours();
        var m = dateNow.getMinutes();

        flightTime = ("0" + h).slice(-2) + ":" + ("0" + m).slice(-2);
      }
    } catch {
      flightTime = "00:00";
    }

    return flightTime;
  }

  changeRound(item) {
    //console.log("Selected value: " + item.value);
    this.flightRound = item.index;
    this.roundFlights = [];
    this.selectedMembers = [];

    this.getSelectedPlayers();
  }

  isAllSelected() {
    //console.log(this.dataSource);
    if (this.dataSources) {
      const numSelected = this.selection.selected.length;
      const numRows = this.dataSources.data.length;
      return numSelected === numRows;
    }
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    console.log(this.selection);
    console.log(this.selection.selected.length);
    this.selection.clear();
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: Player): string {
    if (!row) {
      return `${this.isAllSelected() ? "select" : "deselect"} all`;
    }
    return `${this.selection.isSelected(row) ? "deselect" : "select"} player ${
      row.firstName
    } ${row.lastName}`;
  }

  updateCategorySelection(event, row) {
    console.log(this.selection.isSelected(row));
    let status = false;

    if (typeof event.checked !== "undefined")
      status = event.checked ? true : false;
    else {
      console.log(this.selection.isSelected(row));
      status = this.selection.isSelected(row) ? false : true;
    }
    this.showCategory = true;
    this.countCategoryMember(status, row);

    console.log(this.categoryCounts);
  }

  countCategoryMember(status, row) {
    let founded = this.categoryCounts.filter((a) => {
      return a.name == row["player"].playerCategory;
    });
    console.log(founded);

    if (status) {
      if (founded.length > 0) {
        founded[0].value = founded[0].value + 1;
      } else {
        let obj = {
          name: row["player"].playerCategory,
          value: 1,
        };
        this.categoryCounts.push(obj);
      }
    } else {
      if (founded.length > 0) {
        status
          ? (founded[0].value = founded[0].value - 1)
          : (founded[0].value = founded[0].value - 1);
        console.log(this.categoryCounts);
      }
    }
  }

  async getSelectedPlayers() {
    this.selectedMembers=[];
    if (this.tournamentInfo[0].FlightManagerQLi.length > 0) {
      if(this.flightRound==0)
      {
        this.roundFlights = this.tournamentInfo[0].FlightManagerQLi;
      }else{
        this.roundFlights = this.tournamentInfo[0].FlightManagerQLi.filter(
          (a) => {
            return a.flightRound == this.flightRound;
          }
        );
        
      }

      let outer = 0;

      for (var index in this.roundFlights) {
        console.log(this.roundFlights);

        //console.log(outer + "<--->" + cnter);

        let cnter = 0;
        this.selectedMembers[outer] = [];

        this.selectedMembers[outer]["id"] = this.roundFlights[index].id;
        if (this.showTeams) {
          this.selectedMembers[this.selectedMembers.length - 1]["firstName"] =
            this.roundFlights[index]["FlightName"].name;
        }
        this.selectedMembers[outer]["tournamentId"] =
          this.roundFlights[index].tournamentId;
        this.selectedMembers[outer]["time"] = this.roundFlights[index].time;
        this.selectedMembers[outer]["startingHole"] =
          this.roundFlights[index].startingHole;
        this.selectedMembers[outer]["tee"] = this.roundFlights[index].tee;
        this.selectedMembers[outer]["tee_id"] = this.roundFlights[index].tee_id;

        if (this.roundFlights[index].MembersQL.length > 0)
          this.selectedMembers[outer][cnter] =
            this.roundFlights[index].MembersQL;

        for (let member of this.roundFlights[index].MembersQL) {
          this.selectedMembers[outer][cnter] = <Player>member.PlayerQL;
          this.selectedMembers[outer][cnter]["attendance"] = member.attendance;
          this.selectedMembers[outer][cnter]["playingTee"] = member.playingTee;
          this.selectedMembers[outer][cnter]["tee_id"] = member.tee_id;
          cnter++;
        }

        outer++;
      }
    }
    console.log(this.selectedMembers);
    //console.log(this.groups);
  }

  OnChange($event, i: number, j: number) {
    // console.log(i);
    // console.log(j);
    // console.log($event.checked);
    // this.selectedMembers[i][j]["attendance"] = $event.checked;
  }

  async saveFlights() {
    this.loggedInuser = JSON.parse(
      localStorage.getItem(Constants.LOGGED_IN_USER)
    );
    let tournamentFlights: Flight[] = [];
    let flightName: any[] = [];
    let flightsToRemove: string[] = [];
    let flightMembersToRemove: string[] = [];
    let membersFromFlightToRemove: string[] = [];
    let flightMembersToSave: any[] = [];
    let tournamentFlightMembers: FlightMembers[];
    let fcnter = 0;
    let runningFlightcounter = 0;
    this.copyScoreInfo = [];

    //console.log(this.selectedMembers);
    //console.log(this.roundFlights);

    for (var index in this.selectedMembers) {
      tournamentFlightMembers = [];

      for (let index2 in this.selectedMembers[index]) {
        if (Number.isInteger(Number(index2))) {
          if (!this.playerTee) {
            let roundTeeId: any = General.getPlayersTe(
              this.selectedMembers[index][index2].playerCategory
                ? this.selectedMembers[index][index2].playerCategory
                : "AMATEURS"
            );
            let FM: any = {
              playerId: this.selectedMembers[index][index2].id,
              flightId: this.selectedMembers[index]["id"],
              attendance: this.selectedMembers[index][index2]["attendance"]
                ? this.selectedMembers[index][index2]["attendance"]
                : false,
              playingTee: roundTeeId.result ? roundTeeId.result : "AMATEURS",
              tee_id: roundTeeId.id,
            };
            tournamentFlightMembers.push(FM);
            flightMembersToSave.push(FM);
          } else if (this.selectedMembers[index][index2].id) {
            let FM: any = {
              playerId: this.selectedMembers[index][index2].id,
              flightId: this.selectedMembers[index]["id"],
              attendance: this.selectedMembers[index][index2]["attendance"]
                ? this.selectedMembers[index][index2]["attendance"]
                : false,
              playingTee: this.selectedMembers[index][index2].playingTee
                ? this.selectedMembers[index][index2].playingTee
                : "AMATEURS",
              tee_id: this.selectedMembers[index][index2].tee_id,
            };
            tournamentFlightMembers.push(FM);
            flightMembersToSave.push(FM);
          }
        }
      }

      //console.log(this.selectedMembers[index].length);
      fcnter++;
      if (this.selectedMembers[index].length > 0) {
        runningFlightcounter++;
        console.log(tournamentFlightMembers);

        let startingHole = parseFloat(
          (<HTMLInputElement>(
            document.getElementById("flight_" + index + "_hole")
          )).value
        );
        let startTime: string = (<HTMLInputElement>(
          document.getElementById("flight_" + index + "_time")
        )).value;

        if (this.showTeams) {
          this.teamName = (<HTMLInputElement>(
            document.getElementById("flight_" + index + "_name")
          )).value;
        }

        //let stTime: Time;
        //stTime.hours = 9;
        //stTime.minutes = 0;

        let roundFlightData = this.roundFlights.filter((a) => {
          return a.flightRound == this.flightRound && a.flightNo == fcnter;
        });

        console.log(roundFlightData);
        console.log(this.selectedMembers[index]);

        let currentFlightId: string;

        if (roundFlightData && roundFlightData.length > 0)
          currentFlightId =
            roundFlightData.length > 0
              ? roundFlightData[0].id
              : UniqueIdGenerator.generate();
        else if (this.selectedMembers[index]["id"])
          currentFlightId = this.selectedMembers[index]["id"]
            ? this.selectedMembers[index]["id"]
            : UniqueIdGenerator.generate();

        let flight: any = {
          id: currentFlightId,
          tournamentId: this.tournamentID,
          courseId:
            roundFlightData.length > 0
              ? roundFlightData[0].courseId
              : this.tournamentInfo[0].courseId,
          adminId:
            roundFlightData.length > 0
              ? roundFlightData[0].adminId
              : this.tournamentInfo[0].adminId,
          courseHoleSets:
            roundFlightData.length > 0 ? roundFlightData[0].courseHoleSets : 0,
          flightNo: runningFlightcounter,
          flightRound: this.flightRound,
          startingHole: startingHole,
          tee: roundFlightData.length > 0 ? roundFlightData[0].tee : "AMATEURS",
          tee_id: roundFlightData.length > 0 ? roundFlightData[0].tee_id : "1",
          date:
            roundFlightData.length > 0
              ? roundFlightData[0].date
              : this.tournamentInfo[0].startDate,
          time: startTime,
          ended: false,
        };
        if (this.showTeams) {
          let flightNames: any = {
            flightId: currentFlightId,
            name: this.teamName,
          };

          flightName.push(flightNames);
        }
        console.log(flight);
        tournamentFlights.push(flight);

        console.log(tournamentFlights);

        //break;
        console.log(roundFlightData.length);

        let oldMembers: any;

        if (roundFlightData && roundFlightData.length > 0) {
          if (roundFlightData[0].MembersQL) {
            oldMembers = roundFlightData[0].MembersQL;
          } else {
            oldMembers = roundFlightData[0];
          }
        } else oldMembers = [];

        console.log(oldMembers);
        //   for (let ids of oldMembers) {
        //   let FM: any = {
        //     playerId: ids.playerId,
        //     flightId: currentFlightId,
        //     attendance: false,
        //     playingTee: ids.playingTee,
        //     tee_id: ids.tee_id,
        //   };
        //   flightMembersToSave.push(FM);
        // }
        console.log(tournamentFlightMembers);

        console.log(flightMembersToSave);

        var removed = oldMembers.filter(
          (n) =>
            !tournamentFlightMembers.some((n2) => n.playerId == n2.playerId)
        );
        console.log(removed);

        for (let ids of removed) {
          flightMembersToRemove.push(ids.playerId);
          membersFromFlightToRemove.push(currentFlightId);

          var newFlight: any = this.selectedMembers.filter((n) =>
            n.some((n2) => n2.id == ids.playerId)
          );

          console.log(newFlight);
          console.log(newFlight.length);

          //if(newFlight.length > 0) {
          let copy: any = {
            playerId: ids.playerId,
            fromFlight: currentFlightId,
            toFlight: newFlight.length > 0 ? newFlight[0].id : currentFlightId,
          };

          this.copyScoreInfo.push(copy);
          //}
        }

        // var added = tournamentFlightMembers.filter(
        //   (n) => !oldMembers.some((n2) => n.playerId == n2.playerId)
        // );
        // console.log(added);

        // if (added.length > 0) {
        //   for (let ids of added) {
        //     let FM: any = {
        //       playerId: ids.playerId,
        //       flightId: currentFlightId,
        //       attendance: false,
        //       playingTee: ids.playingTee,
        //       tee_id: ids.tee_id,
        //     };

        //     flightMembersToSave.push(FM);
        //     console.log(flightMembersToSave);
        //  }
        //}
        //break;
      } else {
        //console.log("deleting");
        //console.log(this.roundFlights);
        let roundFlightData = this.roundFlights.filter((a) => {
          return a.flightRound == this.flightRound && a.flightNo == fcnter;
        });
        //console.log(roundFlightData);
        if (roundFlightData.length > 0) {
          let oldMembers: any = roundFlightData[0].MembersQL;
          // console.log(oldMembers);

          for (let ids of oldMembers) {
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

    console.log(this.tournamentInfo[0].id);
    console.log(flightsToRemove);
    console.log(flightName);

    console.log(flightMembersToRemove);
    console.log(tournamentFlights);
    console.log(flightMembersToSave);
    console.log(membersFromFlightToRemove);
    console.log(this.copyScoreInfo);
    let save: boolean;
    if (this.showTeams == true) {
      console.log(true);

      save = <boolean>await this.facadeService.SaveTournamentFlightforTaxes(
        this.tournamentInfo[0].id,
        flightName,
        tournamentFlights,

        flightMembersToSave
      );
    } else {
      console.log(false);

      save = <boolean>await this.facadeService.SaveTournamentFlight(
        this.tournamentInfo[0].id,
        tournamentFlights,

        flightMembersToSave
      );
    }
    this.newFlights = [];
    this.addFlightNum = 0;
    this.importedFlightsNum = 0;
    this.importedFlights = false;

    for (let copy of this.copyScoreInfo) {
      await this.facadeService.copyPlayerScore(
        copy.playerId,
        copy.fromFlight,
        copy.toFlight
      );
    }

    let update = <boolean>(
      await this.facadeService.DeleteFlightsAndMembers(
        flightsToRemove,
        membersFromFlightToRemove,
        flightMembersToRemove
      )
    );
    console.log(save);
    console.log(update);

    if (save && update) {
      this.snackBar.open(
        "Flights have been saved and updated successfully.",
        "x",
        {
          duration: 5000,
        }
      );
    } else if (save && !update) {
      this.snackBar.open(
        "Flights have not been saved but updated successfully.",
        "x",
        {
          duration: 5000,
        }
      );
    } else {
      this.snackBar.open(
        "Flights have not been saved and updated successfully.",
        "x",
        {
          duration: 5000,
        }
      );
    }

    let dataFullTournament = await this.facadeService.getTournamentsFlights(
    
      this.tournamentID
    );
    this.tournamentInfo = dataFullTournament.TournamentQL;

    this.roundFlights = this.tournamentInfo[0].FlightManagerQLi.filter((a) => {
      return a.flightRound == this.flightRound;
    });

    //console.log(tournamentFlights);
  }
  async saveTournamentMembers() {
    let tournamentmember: TournamentMember[] = [];
    let counter: number;
    let DelplayerIndex: any;
    let DelplayerInfo: any;
    let selectionArray = Object.assign({}, this.selection.selected);

    for (var index in selectionArray) {
      if (selectionArray[index]) {
        let founded = this.tournamentMember.filter((a) => {
          return a.playerId == selectionArray[index]["player"].id;
        });

        if (founded.length == 0) {
          //this.tournamentMember.push(selectionArray[index]);

          let obj = {
            fullName: selectionArray[index]["player"]["fullName"],
            player: {
              firstName: selectionArray[index]["player"]["firstName"],
              id: selectionArray[index]["player"]["id"],
              handicap: selectionArray[index]["player"]["handicap"],
              lastName: selectionArray[index]["player"]["lastName"],
              playerCategory: selectionArray[index]["player"]["playerCategory"],
            },
            playerId: selectionArray[index]["player"]["id"],
            tournamentId: this.tournamentID,
            status: false,
          };
          console.log(obj);
          this.tournamentMember.push(obj);

          let member: any = {
            tournamentId: this.tournamentID,
            playerId: selectionArray[index]["player"].id,
            status: true,
          };
          tournamentmember.push(member);
        }
        counter = parseInt(index) + 1;
        console.log(counter);

        console.log(selectionArray);
      }
    }
    this.showCategory = false;
    //console.log(this.categoryCounts[0]);

    //this.categoryCounts[0].value = this.categoryCounts[0].value - counter;
    //console.log(this.categoryCounts[0].value);

    console.log(tournamentmember);

    let result = <any>(
      await this.facadeService.insertTournamentMember(tournamentmember)
    );

    if (result) {
      this.snackBar.open("Tournament members have been saved.", "x", {
        duration: 5000,
      });
      this.syncTournamentMembers();
      this.syncClubMembers();

      this.masterToggle();
    }
  }

  async saveSingleFlight(flightData: any, flightNo: number) {
    this.loggedInuser = JSON.parse(
      localStorage.getItem(Constants.LOGGED_IN_USER)
    );
    let tournamentFlights: Flight[] = [];
    let flightName: any[] = [];
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

      for (let index2 in flightData[index]) {
        if (Number.isInteger(Number(index2))) {
          let roundTeeId: any = General.getPlayersTe(
            flightData[index][index2].playerCategory
          );

          let FM: any = {
            playerId: flightData[index][index2].id,
            attendance: flightData[index][index2]["attendance"],
            playingTee: roundTeeId.result,
            tee_id: roundTeeId.id,
          };

          tournamentFlightMembers.push(FM);
        }
      }

      //console.log(flightData[index].length);
      fcnter++;
      if (flightData[index].length > 0) {
        runningFlightcounter++;
        //console.log(tournamentFlightMembers);

        let startingHole = parseFloat(
          (<HTMLInputElement>(
            document.getElementById("flight_" + flightNo + "_hole")
          )).value
        );
        let startTime: string = (<HTMLInputElement>(
          document.getElementById("flight_" + flightNo + "_time")
        )).value;

        let name: string = (<HTMLInputElement>(
          document.getElementById("flight_" + flightNo + "_name")
        )).value;

        //let stTime: Time;
        //stTime.hours = 9;
        //stTime.minutes = 0;

        let roundFlightData = this.roundFlights.filter((a) => {
          return a.flightRound == this.flightRound && a.flightNo == fcnter;
        });

        //console.log(roundFlightData);
        //console.log(this.selectedMembers[index]);

        let currentFlightId: string;

        if (roundFlightData && roundFlightData.length > 0)
          currentFlightId =
            roundFlightData.length > 0
              ? roundFlightData[0].id
              : UniqueIdGenerator.generate();
        else if (this.selectedMembers[index]["id"])
          currentFlightId = this.selectedMembers[index]["id"]
            ? this.selectedMembers[index]["id"]
            : UniqueIdGenerator.generate();

        let flight: any = {
          id: currentFlightId,
          tournamentId: this.tournamentInfo[0].id,
          courseId:
            roundFlightData.length > 0
              ? roundFlightData[0].courseId
              : this.tournamentInfo[0].courseId,
          adminId:
            roundFlightData.length > 0
              ? roundFlightData[0].adminId
              : this.tournamentInfo[0].adminId,
          courseHoleSets:
            roundFlightData.length > 0 ? roundFlightData[0].courseHoleSets : 0,
          flightNo: runningFlightcounter,
          flightRound: this.flightRound,
          startingHole: startingHole,
          tee: roundFlightData.length > 0 ? roundFlightData[0].tee : "AMATEURS",
          date:
            roundFlightData.length > 0
              ? roundFlightData[0].date
              : this.tournamentInfo[0].startDate,
          time: startTime,
          ended: false,
        };

        let flightNames: any = {
          flightId: currentFlightId,
          name: name,
        };
        //console.log(flight);
        tournamentFlights.push(flight);
        flightName.push(flightNames);
        //break;
        //console.log(roundFlightData.length);

        let oldMembers: any;

        if (roundFlightData && roundFlightData.length > 0) {
          oldMembers = roundFlightData[0].MembersQL;
        } else oldMembers = [];

        // console.log(oldMembers);
        // console.log(tournamentFlightMembers);

        var removed = oldMembers.filter(
          (n) =>
            !tournamentFlightMembers.some((n2) => n.playerId == n2.playerId)
        );
        //console.log(removed);

        for (let ids of removed) {
          flightMembersToRemove.push(ids.playerId);
          membersFromFlightToRemove.push(currentFlightId);

          var newFlight: any = this.selectedMembers.filter((n) =>
            n.some((n2) => n2.id == ids.playerId)
          );
          //console.log(newFlight);

          if (newFlight.length > 0) {
            let copy: any = {
              playerId: ids.playerId,
              fromFlight: currentFlightId,
              toFlight: newFlight[0].id,
            };

            this.copyScoreInfo.push(copy);
          }
        }

        var added = tournamentFlightMembers.filter(
          (n) => !oldMembers.some((n2) => n.playerId == n2.playerId)
        );
        //console.log(added);

        for (let ids of added) {
          let FM: any = {
            playerId: ids.playerId,
            flightId: currentFlightId,
            attendance: ids.attendance,
          };

          flightMembersToSave.push(FM);
        }

        //break;
      } else {
        //console.log("deleting");
        //console.log(this.roundFlights);
        let roundFlightData = this.roundFlights.filter((a) => {
          return a.flightRound == this.flightRound && a.flightNo == fcnter;
        });
        //console.log(roundFlightData);
        if (roundFlightData.length > 0) {
          let oldMembers: any = roundFlightData[0].MembersQL;
          //console.log(oldMembers);

          for (let ids of oldMembers) {
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

    //this.facadeService.SaveTournamentFlights(this.tournamentInfo.id, flightsToRemove, membersFromFlightToRemove, flightMembersToRemove, tournamentFlights, flightMembersToSave);
    let save: boolean;
    if (this.showTeams) {
      save = <boolean>await this.facadeService.SaveTournamentFlightforTaxes(
        this.tournamentInfo[0].id,
        flightName,
        tournamentFlights,

        flightMembersToSave
      );
    } else {
      save = <boolean>await this.facadeService.SaveTournamentFlight(
        this.tournamentInfo[0].id,
        tournamentFlights,

        flightMembersToSave
      );
    }
    this.newFlights = [];

    for (let copy of this.copyScoreInfo) {
      await this.facadeService.copyPlayerScore(
        copy.playerId,
        copy.fromFlight,
        copy.toFlight
      );
    }

    await this.facadeService.DeleteFlightsAndMembers(
      flightsToRemove,
      membersFromFlightToRemove,
      flightMembersToRemove
    );

    let dataFullTournament = await this.facadeService.getTournamentsFlights(
     
      this.tournamentID
    );
    this.tournamentInfo = dataFullTournament.TournamentQL;

    this.roundFlights = this.tournamentInfo[0].FlightManagerQLi.filter((a) => {
      return a.flightRound == this.flightRound;
    });

    this.snackBar.open("Flights have been saved successfully.", "x", {
      duration: 5000,
    });

    //console.log(tournamentFlights);
  }
  editFlight(id){
    this.router.navigate(['./manage/', id], { relativeTo: this.route });

  }
  addFlight() {
    //console.log(this.selectedMembers.length);
  this._viewTournamentComponent.matDrawer.open();
    this.selectedMembers[this.selectedMembers.length] = [];
    this.selectedMembers[this.selectedMembers.length - 1]["id"] =
      UniqueIdGenerator.generate();
    this.selectedMembers[this.selectedMembers.length - 1]["time"] = "09:00";
    this.selectedMembers[this.selectedMembers.length - 1]["firstName"] =
      "Team Name";
    this.selectedMembers[this.selectedMembers.length - 1]["adminId"] = this
      .roundFlights.length
      ? this.roundFlights[0]["adminId"]
      : this.tournamentInfo[0].adminId;
    this.selectedMembers[this.selectedMembers.length - 1]["courseHoleSets"] =
      this.roundFlights.length
        ? this.roundFlights[0]["courseHoleSets"]
        : this.tournamentInfo[0].courseHoleSets;
    this.selectedMembers[this.selectedMembers.length - 1][
      "courseHoleSetsInverted"
    ] = this.roundFlights.length
      ? this.roundFlights[0]["courseHoleSetsInverted"]
      : this.tournamentInfo[0].courseHoleSetsInverted;
    this.selectedMembers[this.selectedMembers.length - 1]["courseId"] = this
      .roundFlights.length
      ? this.roundFlights[0]["courseId"]
      : this.tournamentInfo[0].courseId;
    this.selectedMembers[this.selectedMembers.length - 1]["tournamentId"] = this
      .roundFlights.length
      ? this.roundFlights[0]["tournamentId"]
      : this.tournamentInfo[0].id;
    this.selectedMembers[this.selectedMembers.length - 1]["startingHole"] = "1";
    this.selectedMembers[this.selectedMembers.length - 1]["tee"] = "";
    this.selectedMembers[this.selectedMembers.length - 1]["flightRound"] =
      this.flightRound;
    this.selectedMembers[this.selectedMembers.length - 1]["date"] = this
      .roundFlights.length
      ? this.roundFlights[0]["date"]
      : this.tournamentInfo[0].startDate;
    this.selectedMembers[this.selectedMembers.length - 1]["flightNo"] = this
      .selectedMembers.length
      ? this.selectedMembers.length
      : 1;
    this.selectedMembers[this.selectedMembers.length - 1]["tee_id"] = "1";

    //this.newFlight.push(this.selectedMembers[this.selectedMembers.length - 1]);
    //console.log(this.newFlight.id);
    this.newFlights[this.addFlightNum] =
      this.selectedMembers[this.selectedMembers.length - 1];
    console.log(this.newFlights[this.addFlightNum]);
    this.addFlightNum++;
    //console.log(this.selectedMembers.length);
    //this.selectedMembers[this.selectedMembers.length - 1].push(player);
    //console.log(this.selectedMembers);
  }

  saveFlight(index: number) {
    //console.log(index);
    const dialogRef = this.dialog.open(DialogOverviewComponent, {
      width: "350px",
      data: "Do you want to save group " + (index + 1) + "?",
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        //console.log(this.selectedMembers[index]);
        let singleFlight: any[] = [];
        singleFlight.push(this.selectedMembers[index]);
        this.saveSingleFlight(singleFlight, index);
        //this.selectedMembers.splice(index, 1);
      } else {
        //console.log("cancel delete action");
      }
    });
  }

  addExistingPlayer() {
    let tournamentMember: TournamentMember[] = [];
    const dialogRef = this.dialog.open(DialogPlayerComponent, {
      width: "900px",
      data: {
        flights: this.selectedMembers.length,
        tournament: this.tournamentID,
      },
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      console.log(result);
      var lookup = [];

      if (result) {
        console.log("record deleted.");
        for (let i in result) {
          this.exist = this.selectedMembers.find((item) =>
            item.some((f) => f.id == result[i].player.id)
          );
        }
        if (this.exist) {
          this.snackBar.open("Player already exist in the list.", "x", {
            duration: 5000,
          });

          return;
        }

        this.newPlayers = [];
        for (let m of result) {
          let obj = {
            fullName: m.player["fullName"],
            player: {
              firstName: m.player["firstName"],
              id: m.player["id"],
              handicap: m.player["handicap"],
              lastName: m.player["lastName"],
              playerCategory: m.player["playerCategory"],
            },
            playerId: m.player["id"],
            tournamentId: this.tournamentID,
            status: false,
          };
          console.log(obj);
          this.tournamentMember.push(obj);

          let objs: Player = {
            id: m.player["id"],
            adminClubId: m.player["adminClubId"]
              ? m.player["adminClubId"]
              : null,
            firebaseUid: m.player["firebaseUid"]
              ? m.player["firebaseUid"]
              : null,
            fcmToken: m.player["fcmToken"] ? m.player["fcmToken"] : null,
            gemId: m.player["gemId"] ? m.player["gemId"] : null,
            firstName: m.player["firstName"] ? m.player["firstName"] : null,
            lastName: m.player["lastName"] ? m.player["lastName"] : null,
            gender: m.player["gender"] ? m.player["gender"] : null,
            dob: m.player["dob"] ? m.player["dob"] : null,
            picture: m.player["picture"] ? m.player["picture"] : null,
            email: m.player["email"] ? m.player["email"] : null,
            phone: m.player["phone"] ? m.player["phone"] : null,
            playerCategory: m.player["playerCategory"]
              ? m.player["playerCategory"]
              : null,
            handicap: m.player["handicap"] ? m.player["handicap"] : null,
            online: false,
            countryCode: m.player["countryCode"]
              ? m.player["countryCode"]
              : null,
            extraData: m.player["extraData"] ? m.player["extraData"] : null,
            userRole: m.player["userRole"] ? m.player["userRole"] : null,
            membershipNumber: m.player["membershipNumber"]
              ? m.player["membershipNumber"]
              : null,
            membership: [],
          };
          this.newPlayers.push(objs);
        }
        console.log(this.newPlayers);

        for (let i of result) {
          let member: any = {
            tournamentId: this.tournamentID,
            playerId: i.player["id"],
            status: true,
          };
          tournamentMember.push(member);
        }

        let results = <any>(
          await this.facadeService.insertTournamentMember(tournamentMember)
        );

        if (results) {
          this.snackBar.open("Tournament members have been saved.", "x", {
            duration: 5000,
          });
          this.syncTournamentMembers();
        }

        if (result[0].flight != 10000) {
          //console.log(this.selectedMembers[result[0].flight]);
          console.log(result[0].flight);

          this.selectedMembers[result[0].flight - 1].splice(
            this.selectedMembers[result[0].flight - 1].length,
            0,
            ...this.newPlayers
          );
        }
        console.log(this.selectedMembers);
      } else {
        //console.log("cancel delete action");
      }
    });
  }
  selectedTee(event, playerId) {
    console.log(playerId);
    let target = event.source.selected._element.nativeElement;
    let selectedData = {
      value: event.value,
      text: target.innerText.trim(),
    };
    console.log(this.roundFlights);
    if (this.roundFlights) {
      let roundTeeId: any = General.getPlayersTe(selectedData.text);
      for (let index in this.roundFlights) {
        if (this.roundFlights[index].id === playerId) {
          this.roundFlights[index].tee = selectedData.value;
          this.roundFlights[index].tee_id = roundTeeId.id;
        }
      }
    }

    let roundTeeId: any = General.getPlayersTe(selectedData.text);
    for (let index = 0; index < this.addFlightNum; index++) {
      if (this.newFlights && this.newFlights[index]["id"] == playerId) {
        this.newFlights[index]["tee"] = selectedData.value;
        this.newFlights[index]["tee_id"] = roundTeeId.id;
        this.roundFlights.push(this.newFlights[index]);
        console.log(this.newFlights[index]);
        console.log(this.roundFlights);
      }
    }
    if (this.importedFlights == true) {
      let roundTeeId: any = General.getPlayersTe(selectedData.text);
      for (let index = 0; index < this.importedFlightsNum; index++) {
        if (this.newFlights[index]["id"] == playerId) {
          this.newFlights[index]["tee"] = selectedData.value;
          this.newFlights[index]["tee_id"] = roundTeeId.id;
          this.roundFlights.push(this.newFlights[index]);
          console.log(this.newFlights[index]);
          console.log(this.roundFlights);
          return;
        }
      }
    }
  }
  selectedPlayerTee(event, playerId) {
    console.log(playerId);
    let target = event.source.selected._element.nativeElement;
    let selectedData = {
      value: event.value,
      text: target.innerText.trim(),
    };
    console.log(selectedData);
    console.log(this.selectedMembers);
    let roundTeeId: any = General.getPlayersTe(selectedData.text);
    for (var index in this.selectedMembers) {
      for (let index2 in this.selectedMembers[index]) {
        if (this.selectedMembers[index][index2].id == playerId) {
          this.selectedMembers[index][index2].playingTee = selectedData.value;
          this.selectedMembers[index][index2].tee_id = roundTeeId.id;
          console.log(this.selectedMembers[index][index2]);
          this.playerTee = true;
        }
      }
    }
  }

  addPlayer() {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent, {
      data: { flights: this.selectedMembers.length },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        //console.log("record deleted.");
        console.log(result);
        this.selectedMembers[this.selectedMembers.length - 1].splice(
          this.selectedMembers[this.selectedMembers.length - 1].length - 3,
          0,
          result
        );
      } else {
        //console.log("cancel delete action");
      }
    });
  }

  removePlayer(flight: number, player: number) {
    //console.log(flight + "<- ->" + player);
    const dialogRef = this.dialog.open(DialogOverviewComponent, {
      width: "350px",
      data: "Do you want to remove this player from group?",
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        //console.log("record deleted.");
        this.selectedMembers[flight].splice(player, 1);
      } else {
        //console.log("cancel delete action");
      }
    });
  }

  movePlayer(flight: number, cplayer: number) {
    console.log(flight + "<- ->" + cplayer);
    let player: Player = this.selectedMembers[flight][cplayer];
    const dialogRef = this.dialog.open(DialogMoveFlightComponent, {
      width: "350px",
      panelClass: "transparent",
      disableClose: true,
      data: {
        flights: this.selectedMembers.length,
        name: player.firstName + " " + player.lastName,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log(result);
        //let player: Player = this.selectedMembers[flight][cplayer];
        //console.log(player);
        this.selectedMembers[flight].splice(cplayer, 1);
        //console.log(this.selectedMembers);
        this.selectedMembers[result - 1].splice(
          this.selectedMembers[result - 1].length - 3,
          0,
          player
        );
      } else {
        //console.log("cancel delete action");
      }
    });
  }

  moveTournamentMember(player: Player) {
    const dialogRef = this.dialog.open(DialogMoveFlightComponent, {
      width: "350px",
      panelClass: "transparent",
      disableClose: true,
      data: {
        flights: this.selectedMembers.length,
        name: player.firstName + " " + player.lastName,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        let exist = this.selectedMembers.find((item) =>
          item.some((f) => f.id == player.id)
        );
        if (exist) {
          this.snackBar.open("Player already exist in the list.", "x", {
            duration: 5000,
          });

          return;
        }

        //let player: Player = this.selectedMembers[flight][cplayer];
        //console.log(player);
        //console.log(this.selectedMembers);
        this.selectedMembers[result - 1].splice(
          this.selectedMembers[result - 1].length - 3,
          0,
          player
        );
      } else {
        //console.log("cancel delete action");
      }
    });
  }

  onFileChange(event) {
    console.log(event.target.files.length);
    if (event.target.files.length > 0) {
      this.file = event.target.files[0];

      console.log(this.file);
    }
  }

  parseFlightsData() {
    let fileReader = new FileReader();
    fileReader.onload = (e) => {
      this.arrayBuffer = fileReader.result;
      var data = new Uint8Array(this.arrayBuffer);
      var arr = new Array();
      for (var i = 0; i != data.length; ++i)
        arr[i] = String.fromCharCode(data[i]);
      var bstr = arr.join("");
      var workbook = read(bstr, { type: "binary" });
      var first_sheet_name = workbook.SheetNames[0];
      var worksheet = workbook.Sheets[first_sheet_name];
      this.flightsData = utils.sheet_to_json(worksheet, {
        raw: true,
        defval: "",
      });

      console.log(this.flightsData);
      this.importExcelData();
      //this.providerservice.importexcel(this.exceljsondata).subscribe(data=>{
      //})
    };
    fileReader.readAsArrayBuffer(this.file);
  }

  async importExcelData() {
    console.log(this.flightsData);
    let tournamentMember: TournamentMember[] = [];
    let index = 0;
    for (let flight of this.flightsData) {
      let player = await this.facadeService.getPlayerByMembershipNumber(
        flight.membershipNumber + ""
      );
      console.log(player);

      if (player.length == 0) {
        player = await this.facadeService.getPlayerByPhone(flight.phone + "");
      }

      if (player.length > 5) {
        console.log(flight.membershipNumber);
        continue;
      }
      //console.log(flight.membershipNumber);
      let roundTeeId: any = General.getPlayersTe(flight.tee);
      if (!this.showTeams) {
        if (flight.flightNo > this.selectedMembers.length) {
          this.selectedMembers[this.selectedMembers.length] = [];
          this.selectedMembers[this.selectedMembers.length - 1]["id"] =
            UniqueIdGenerator.generate();
          this.selectedMembers[this.selectedMembers.length - 1]["time"] =
            flight.time;
          this.selectedMembers[this.selectedMembers.length - 1][
            "startingHole"
          ] = flight.startingHole;
          this.selectedMembers[this.selectedMembers.length - 1]["flightRound"] =
            flight.flightRound ? flight.flightRound : this.flightRound;

          this.selectedMembers[this.selectedMembers.length - 1]["tee_id"] =
            roundTeeId.id;
          this.selectedMembers[this.selectedMembers.length - 1]["date"] =
            flight.date ? flight.date : this.tournamentInfo[0][0].startDate;
          this.selectedMembers[this.selectedMembers.length - 1]["tee"] = "";
          this.selectedMembers[this.selectedMembers.length - 1]["flightNo"] =
            this.selectedMembers.length ? this.selectedMembers.length : 1;
          this.selectedMembers[this.selectedMembers.length - 1][
            "tournamentId"
          ] = this.roundFlights.length
            ? this.roundFlights[0]["tournamentId"]
            : this.tournamentInfo[0].id;
          this.selectedMembers[this.selectedMembers.length - 1]["adminId"] =
            this.roundFlights.length
              ? this.roundFlights[0]["adminId"]
              : this.tournamentInfo[0].adminId;
          this.selectedMembers[this.selectedMembers.length - 1][
            "courseHoleSets"
          ] = this.roundFlights.length
            ? this.roundFlights[0]["courseHoleSets"]
            : this.tournamentInfo[0].courseHoleSets;
          this.selectedMembers[this.selectedMembers.length - 1][
            "courseHoleSetsInverted"
          ] = this.roundFlights.length
            ? this.roundFlights[0]["courseHoleSetsInverted"]
            : this.tournamentInfo[0].courseHoleSetsInverted;
          this.selectedMembers[this.selectedMembers.length - 1]["courseId"] =
            this.roundFlights.length
              ? this.roundFlights[0]["courseId"]
              : this.tournamentInfo[0][0].courseId;
        }
        this.selectedMembers[flight.flightNo - 1].splice(
          this.selectedMembers[flight.flightNo - 1].length - 3,
          0,
          player[0]
        );
        this.selectedMembers[flight.flightNo - 1]["time"] = flight.time;
        this.selectedMembers[flight.flightNo - 1]["startingHole"] =
          flight.startingHole;
        this.selectedMembers[this.selectedMembers.length - 1]["flightRound"] =
          flight.flightRound ? flight.flightRound : this.flightRound;

        this.selectedMembers[this.selectedMembers.length - 1]["tee_id"] =
          roundTeeId.id;
        this.selectedMembers[this.selectedMembers.length - 1]["tee"] = "";
        (this.selectedMembers[this.selectedMembers.length - 1]["date"] =
          flight.date ? flight.date : this.tournamentInfo[0].startDate),
          (this.selectedMembers[this.selectedMembers.length - 1]["flightNo"] =
            this.selectedMembers.length ? this.selectedMembers.length : 1);
        this.selectedMembers[this.selectedMembers.length - 1]["tournamentId"] =
          this.roundFlights.length
            ? this.roundFlights[0]["tournamentId"]
            : this.tournamentInfo[0].id;
        this.selectedMembers[this.selectedMembers.length - 1]["adminId"] = this
          .roundFlights.length
          ? this.roundFlights[0]["adminId"]
          : this.tournamentInfo[0].adminId;
        this.selectedMembers[this.selectedMembers.length - 1][
          "courseHoleSets"
        ] = this.roundFlights.length
          ? this.roundFlights[0]["courseHoleSets"]
          : this.tournamentInfo[0].courseHoleSets;
        this.selectedMembers[this.selectedMembers.length - 1][
          "courseHoleSetsInverted"
        ] = this.roundFlights.length
          ? this.roundFlights[0]["courseHoleSetsInverted"]
          : this.tournamentInfo[0].courseHoleSetsInverted;
        this.selectedMembers[this.selectedMembers.length - 1]["courseId"] = this
          .roundFlights.length
          ? this.roundFlights[0]["courseId"]
          : this.tournamentInfo[0].courseId;
        this.newFlights[index] =
          this.selectedMembers[this.selectedMembers.length - 1];
        index++;
        this.importedFlights = true;
        this.importedFlightsNum++;
        console.log(this.newFlights[index]);
      } else {
        if (flight.teamNo > this.selectedMembers.length) {
          this.selectedMembers[this.selectedMembers.length] = [];
          this.selectedMembers[this.selectedMembers.length - 1]["id"] =
            UniqueIdGenerator.generate();
          this.selectedMembers[this.selectedMembers.length - 1]["time"] =
            flight.time;
          this.selectedMembers[this.selectedMembers.length - 1][
            "startingHole"
          ] = flight.startingHole;
          // this.selectedMembers[this.selectedMembers.length - 1]["flightRound"] =
          //   flight.flightRound ? flight.flightRound : this.flightRound;

          this.selectedMembers[this.selectedMembers.length - 1]["tee_id"] =
            roundTeeId.id;
          this.selectedMembers[this.selectedMembers.length - 1]["firstName"] =
            flight.teamName;
          this.selectedMembers[this.selectedMembers.length - 1]["date"] =
            flight.date ? flight.date : this.tournamentInfo[0].startDate;
          this.selectedMembers[this.selectedMembers.length - 1]["tee"] = "";
          this.selectedMembers[this.selectedMembers.length - 1]["flightNo"] =
            this.selectedMembers.length ? this.selectedMembers.length : 1;
          this.selectedMembers[this.selectedMembers.length - 1][
            "tournamentId"
          ] = this.roundFlights.length
            ? this.roundFlights[0]["tournamentId"]
            : this.tournamentInfo[0].id;
          this.selectedMembers[this.selectedMembers.length - 1]["adminId"] =
            this.roundFlights.length
              ? this.roundFlights[0]["adminId"]
              : this.tournamentInfo[0].adminId;
          this.selectedMembers[this.selectedMembers.length - 1][
            "courseHoleSets"
          ] = this.roundFlights.length
            ? this.roundFlights[0]["courseHoleSets"]
            : this.tournamentInfo[0].courseHoleSets;
          this.selectedMembers[this.selectedMembers.length - 1][
            "courseHoleSetsInverted"
          ] = this.roundFlights.length
            ? this.roundFlights[0]["courseHoleSetsInverted"]
            : this.tournamentInfo[0].courseHoleSetsInverted;
          this.selectedMembers[this.selectedMembers.length - 1]["courseId"] =
            this.roundFlights.length
              ? this.roundFlights[0]["courseId"]
              : this.tournamentInfo[0].courseId;
        }
        {
          this.selectedMembers[flight.teamNo - 1].splice(
            this.selectedMembers[flight.teamNo - 1].length - 3,
            0,
            player[0]
          );
          this.selectedMembers[flight.teamNo - 1]["time"] = flight.time;
          this.selectedMembers[flight.teamNo - 1]["startingHole"] =
            flight.startingHole;
          this.selectedMembers[this.selectedMembers.length - 1]["flightRound"] =
            flight.flightRound ? flight.flightRound : this.flightRound;

          this.selectedMembers[this.selectedMembers.length - 1]["tee_id"] =
            roundTeeId.id;
          this.selectedMembers[this.selectedMembers.length - 1]["firstName"] =
            flight.teamName;
          this.selectedMembers[this.selectedMembers.length - 1]["tee"] = "";
          (this.selectedMembers[this.selectedMembers.length - 1]["date"] =
            flight.date ? flight.date : this.tournamentInfo[0].startDate),
            (this.selectedMembers[this.selectedMembers.length - 1]["flightNo"] =
              this.selectedMembers.length ? this.selectedMembers.length : 1);
          this.selectedMembers[this.selectedMembers.length - 1][
            "tournamentId"
          ] = this.roundFlights.length
            ? this.roundFlights[0]["tournamentId"]
            : this.tournamentInfo[0].id;
          this.selectedMembers[this.selectedMembers.length - 1]["adminId"] =
            this.roundFlights.length
              ? this.roundFlights[0]["adminId"]
              : this.tournamentInfo[0].adminId;
          this.selectedMembers[this.selectedMembers.length - 1][
            "courseHoleSets"
          ] = this.roundFlights.length
            ? this.roundFlights[0]["courseHoleSets"]
            : this.tournamentInfo[0].courseHoleSets;
          this.selectedMembers[this.selectedMembers.length - 1][
            "courseHoleSetsInverted"
          ] = this.roundFlights.length
            ? this.roundFlights[0]["courseHoleSetsInverted"]
            : this.tournamentInfo[0].courseHoleSetsInverted;
          this.selectedMembers[this.selectedMembers.length - 1]["courseId"] =
            this.roundFlights.length
              ? this.roundFlights[0]["courseId"]
              : this.tournamentInfo[0].courseId;
          this.newFlights[index] =
            this.selectedMembers[this.selectedMembers.length - 1];

          this.importedFlights = true;
          this.importedFlightsNum++;
          console.log(this.newFlights[index]);
          console.log(player);
          index++;
        }
      }
      console.log(player);

      let find: boolean = true;
      if (this.tournamentMember.length > 0) {
        for (let member of this.tournamentMember) {
          if (member.playerId != player[0].id) {
            find = false;
          }
        }

        if (!find) {
          let obj = {
            fullName: player[0]["fullName"],
            player: {
              firstName: player[0]["firstName"],
              id: player[0]["id"],
              handicap: player[0]["handicap"],
              lastName: player[0]["lastName"],
              playerCategory: player[0]["playerCategory"],
            },
            playerId: player[0]["id"],
            tournamentId: this.tournamentID,
            status: false,
          };
          let member: any = {
            tournamentId: this.tournamentID,
            playerId: player[0]["id"],
            status: true,
          };
          this.tournamentMember.push(obj);
          tournamentMember.push(member);
        }
      } else {
        let obj = {
          fullName: player[0]["fullName"],
          player: {
            firstName: player[0]["firstName"],
            id: player[0]["id"],
            handicap: player[0]["handicap"],
            lastName: player[0]["lastName"],
            playerCategory: player[0]["playerCategory"],
          },
          playerId: player[0]["id"],
          tournamentId: this.tournamentID,
          status: false,
        };
        let member: any = {
          tournamentId: this.tournamentID,
          playerId: player[0]["id"],
          status: true,
        };
        this.tournamentMember.push(obj);
        tournamentMember.push(member);
      }
    }
    if (tournamentMember.length > 0) {
      let results = <any>(
        await this.facadeService.insertTournamentMember(tournamentMember)
      );

      if (results) {
        this.snackBar.open(
          "Tournament members from Files have been saved.",
          "x",
          {
            duration: 5000,
          }
        );
        this.syncTournamentMembers();
      }
    }
    console.log(this.importedFlightsNum);
    console.log(this.newFlights);

    console.log(this.selectedMembers);
  }

  redirectToScores() {
    this.router.navigate(["/matchplay/" + this.tournamentID]);
  }

  redirectToDetail() {
    this.router.navigate(["/tournaments/view/" + this.tournamentID]);
  }
  redirectToAttendance() {
    this.router.navigate(["/tournaments/attendance/" + this.tournamentID]);
  }
}
