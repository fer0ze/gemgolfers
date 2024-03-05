import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FacadeService } from 'app/shared/services/facade.service';
import { DialogPlayerListComponent } from '../dialog-player-list-flight/dialog-player-list.component';
import { LocalStorageService } from 'app/shared/services/localStorage';
import { Constants, General, UniqueIdGenerator } from 'app/shared/classes/general';
import { Player } from 'app/shared/models/player.model';
import { Flight, FlightMembers } from 'app/shared/models/flight.model';
import { AddDailyRound, Tournament } from 'app/shared/models/tournament.model';

@Component({
  selector: 'app-dialog-tee-time-slot',
  templateUrl: './dialog-tee-time-slot.component.html',
  styleUrls: ['./dialog-tee-time-slot.component.scss']
})
export class DialogTeeTimeSlotComponent implements OnInit {

  dataSource: MatTableDataSource<any>;
  displayedColumns = [
    'firstName',
    'lastName',
    'email',
    'handicap',
    'action',
  ];
  public response: any;
  slotList: any[] = [];
  panelOpenState = false;
  isLoading: boolean = false;
  loggedInuser: Player;
  flightMembers: FlightMembers[] = [];
  playerTees: Map<string, any> = new Map<string, any>();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  openedPanel: any = null;
  constructor(
    public dialogRef: MatDialogRef<DialogTeeTimeSlotComponent>,
    private _localStorage: LocalStorageService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private facadeService: FacadeService,
    public dialog: MatDialog,
    public snackBar?: MatSnackBar,
  ) { }

  ngOnInit() {
    this.loggedInuser = this._localStorage.get(Constants.LOGGED_IN_USER);
    console.log(this.data);
    this.slotList = this.data.slots;

    for (let item of this.slotList)
      item["name"] = (item.PlayerQL) ? item.PlayerQL.firstName + " " + item.PlayerQL.lastName : "";


  }

  isPanelOpened(item: any): boolean {
    // Check if the given item is the opened panel
    return this.openedPanel === item;
  }
  onPanelOpened(item: any) {
    // Set the openedPanel to the currently opened panel
    let members = [];
    this.dataSource = null;
    this.openedPanel = item;
    if (this.openedPanel.flight) {
      if (this.openedPanel.flight.MembersQL.length > 0) {
        this.openedPanel.flight.MembersQL.forEach(member => {
          let mem = {
            id: member.playerId,
            firstName: member.PlayerQL.firstName,
            lastName: member.PlayerQL.lastName,
            email: member.PlayerQL.email,
            handicap: member.PlayerQL.handicap,
          }
          members.push(mem)
        });
        this.dataSource = new MatTableDataSource(members);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }

    }
  }
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  async openAddPlayersDialog(item: any) {
    console.log(item);

    let datas = await this.facadeService.getPlayersListForTournament(
      this.loggedInuser.adminClubId
    );
    const dialogRef = this.dialog.open(DialogPlayerListComponent, {
      data: { players: datas.player },
    });

    // Handle dialog close or dismiss if needed
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (result) {
        for (var index in result) {
          let member: any = {
            playerId: result[index].id,
            attendance: false,
          };
          this.flightMembers.push(member);
          let playerTee = result[index].playerCategory;
          if (playerTee == 'Senior Amateurs') {
            playerTee = 'Seniors';
          }
          result[index]['playingTee'] = playerTee.toUpperCase();
          let selectedData = {
            value: result[index]['playingTee'],
            text: result[index]['playingTee'],
          };
          this.playerTees.set(result[index].id, selectedData);
        }
        if (!item.flightId) {
          this.createTournament(item, result);
        } else {
          this.insertFlightMember(item, this.flightMembers, result);
        }

      }
      console.log('The dialog was closed');
    });
  }

  async createTournament(item, players) {
    this.loggedInuser = this._localStorage.get(Constants.LOGGED_IN_USER);

    // starterFormValue.roundDate = this.datepipe.transform(
    //   starterFormValue.roundDate.toString(),
    //   'yyyy-MM-dd'
    // );

    for (let member of this.flightMembers) {
      let founded = await this.facadeService.getPlayerTodayRound(
        member.playerId,
        this.data.date
      );
      if (founded && founded.length > 0) {
        this.snackBar.open(
          'Player already played in a round today.',
          'x',
          {
            duration: 5000,
          }
        );

        return;
      }
    }
    //console.log(starterFormValue.roundDate);
    const addRound: AddDailyRound = {
      holeSets: '0',
      startingTime: item.slotTime,
      roundTee: "AMATEURS",
      roundDate: this.data.date,
      //addPlayer : starterFormValue.addPlayer
    };

    //console.log(addRound);

    let tournamentFlights: Flight[] = [];
    let fcnter = 0;
    let roundMembers: any[] = [];

    for (let member of this.flightMembers) {
      let playerTee: any = this.playerTees.get(member.playerId);
      //console.log(playerTee);
      let Tee;
      if (playerTee == undefined) {
        Tee = 'AMATEURS';
      }
      let playerTeeId: any = General.getCourseTeeId(Tee);
      let playerTeeName = playerTee
        ? playerTee.value
        : Tee;
      let flightMember = {
        playerId: member.playerId,
        attendance: false,
        playingTee: playerTeeName,
        tee_id: General.getCourseTeeId(playerTeeName)
          ? General.getCourseTeeId(playerTeeName).id
          : 1,
        guest: null,
      };
      //console.log(flightMember);

      roundMembers.push(flightMember);
    }

    fcnter++;

    let roundTee = 'AMATEURS';
    let roundTeeId: any = General.getCourseTeeId(roundTee)
      ? General.getCourseTeeId(roundTee).id
      : 1;
    let flight: any = {
      id: UniqueIdGenerator.generate(),
      courseId: '-LUFS3FCQKOGpJ2IEHmf',
      adminId: this.loggedInuser.id,
      courseHoleSets: 0,
      flightNo: 1,
      flightRound: 0,
      startingHole: 1,
      tee_id: roundTeeId,
      tee: roundTee,
      category: null,
      date: this.data.date,
      time: item.slotTime,
      ended: false,
      courseHoleSetsInverted: true,
      members: {
        data: roundMembers,
      },
    };

    //console.log(flight);
    tournamentFlights.push(flight);
    //console.log(tournamentFlights);

    let tournament: Tournament = {
      id: UniqueIdGenerator.generate(),
      clubId: this.loggedInuser.adminClubId,
      leagueId: null,
      courseId: '-LUFS3FCQKOGpJ2IEHmf',
      adminId: this.loggedInuser.id,
      title:
        this.data.date.toString().substring(0, 10) +
        ' ' +
        this.loggedInuser.membership[0].club.name,
      prefix: null,
      courseHoleSets: 3,
      teamMatch: false,
      pairsMatch: false,
      interLeague: false,
      publicTournament: false,
      confirmParticipants: false,
      noOfRounds: 1,
      activeRound: 1,
      playingOnWhs: true,
      matchFormat: 'STROKE_PLAY',
      pointsFormats: null,
      pointsValues: null,
      handicapAllocations: null,
      tee: roundTee,
      tee_id: roundTeeId,
      scoreManagement: 'ONLY_PLAYERS',
      startDate: this.data.date,
      endDate: this.data.date,
      flightsCategory: null,
      started: true,
      invited: false,
      singleRound: true,
      sponsorName: '',
      sponsorLogo: '',
      mobileLogoUrl: '',
      webLogoUrl: '',
      createdAt: new Date(this.data.date).toISOString(),
      courseHoleSetsInverted: false,
      categories: [],
      marshals: [],
      flights: tournamentFlights,
      members: [],
    };

    //console.log(tournament);
    let count = item.joinedMembers + this.flightMembers.length;
    let result = <any>await this.facadeService.addTournament(tournament, flight.id, item.id, count);
    if (result) {
      let members = [];
      item.joinedMembers = Number(count);
      for (var index in players) {
        let mem = {
          id: players[index].id,
          firstName: players[index].firstName,
          lastName: players[index].lastName,
          email: players[index].email,
          handicap: players[index].handicap,
        }
        members.push(mem)
      }
      this.dataSource.data = [...this.dataSource.data, ...members];
      this.dataSource._updateChangeSubscription();
    }
  }

  async insertFlightMember(item, member, players) {
    let roundMembers: any[] = [];
    for (let member of this.flightMembers) {
      let founded = await this.facadeService.getPlayerTodayRound(
        member.playerId,
        this.data.date
      );
      if (founded && founded.length > 0) {
        this.snackBar.open(
          'Player already played in a round today.',
          'x',
          {
            duration: 5000,
          }
        );

        return;
      } else {
        let FM: any = {
          playerId: member.playerId,
          flightId: item.flightId,
          attendance: false,
        };

        roundMembers.push(FM);
      }
    }
    let count = item.joinedMembers + this.flightMembers.length;
    let result = <any>await this.facadeService.insertFlightMembers(item.id, roundMembers, count);
    console.log(result);
    if (result) {
      let members = [];
      item.joinedMembers = Number(count);
      for (var index in players) {
        let mem = {
          id: players[index].id,
          firstName: players[index].firstName,
          lastName: players[index].lastName,
          email: players[index].email,
          handicap: players[index].handicap,
        }
        members.push(mem)
      }
      this.dataSource.data = [...this.dataSource.data, ...members];
      this.dataSource._updateChangeSubscription();
    }
  }
  async deleteUser(id: string, slote: any) {
    const count = slote.joinedMembers - 1;
    let result = await this.facadeService.DeleteFlightMembers(slote.flightId, id, count);
    if (result) {
      const slot = this.slotList.find((slots) => slots.id == slote.id);
      slot.joinedMembers--;
      const index = this.dataSource.data.findIndex(member => member.id === id);
      // If the item is found, remove it from the array
      if (index !== -1) {
        this.dataSource.data.splice(index, 1);
        // Update the data source
        this.dataSource._updateChangeSubscription();
      }
    }
  }
}
