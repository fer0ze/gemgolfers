import { Component, OnInit, ViewChild } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Location } from "@angular/common";
import { Router, ActivatedRoute } from "@angular/router";

import { Club } from "../../../../shared/models/club.model";
import { Flight, FlightMembers } from "../../../../shared/models/flight.model";
import {
  Player,
  PlayerCategory,
  ClubMembership,
  handicap_change_log,
} from "../../../../shared/models/player.model";
import {
  Tournament,
  TournamentMember,
} from "../../../../shared/models/tournament.model";
import { AddDailyRound } from "../../../../shared/models/tournament.model";
import { FacadeService } from "../../../../shared/services/facade.service";
import {
  UniqueIdGenerator,
  generateGemId,
  Constants,
  General,
} from "../../../../shared/classes/general";
import { of, Observable } from "rxjs";
// import { DialogOverviewComponent } from "../../material-components/dialog-overview/dialog-overview.component";
// import { DialogPlayerComponent } from "../../material-components/dialog-player/dialog-player.component";
import {
  MatTableDataSource,
} from "@angular/material/table";
//import { DialogAddPlayerComponent } from "../../material-components/dialog-add-player/dialog-add-player.component";
import { DatePipe } from "@angular/common";
import { DialogAddExisitingPlayerComponent } from "../../dialogs/dialog-add-exisiting-player/dialog-add-exisiting-player.component";
import { join } from "path";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatDialog } from "@angular/material/dialog";

@Component({
  selector: "app-add-daily-round",
  templateUrl: "./add-daily-round.component.html",
  styleUrls: ["./add-daily-round.component.scss"],
})
export class AddDailyRoundComponent implements OnInit {
  public starterForm: FormGroup;
  public frmTitle: string;
  private playerID: string;
  currentPlayer: any = [];
  clubID: any;
  currentDate: Date;
  public selectedTime = "08:00";
  membersColumns: string[] = ["name", "handicap", "category", "tee", "delete"];
  last: boolean = false;
  loggedInuser: Player;
  updateHandicap: boolean = false;
  handicapLog: any;
  playerStatus: Boolean = false;
  currentTournament: Tournament;
  selectedMembers: any = [];
  tournamentMembers: Player[] = [];
  flightMembers: FlightMembers[] = [];
  playerTees: Map<string, any> = new Map<string, any>();
  selectedRoundTee = "AMATEURS";

  filteredClubOptions: Observable<Club[]>;
  hideClubs: boolean = true;
  clubTitle: string;
  tournamentID: string;
  selectedCourseHoleSet: string;
  courseHoleSetNames;
  membersSource: MatTableDataSource<Player>;
  isLoading = true;

  @ViewChild(MatPaginator) Mempaginator: MatPaginator;
  @ViewChild("msort") Memsort: MatSort;

  constructor(
    private datepipe: DatePipe,
    public dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    public snackBar: MatSnackBar,
    public facadeService: FacadeService
  ) {}

  ngAfterViewInit(): void {
    //console.log("Init");
  }

  async ngOnInit() {
    //console.log(this.route.snapshot.paramMap.get("id"));

    this.route.paramMap.subscribe((params) => {
      this.playerID = params.get("id");
    });

    this.loggedInuser = JSON.parse(
      localStorage.getItem(Constants.LOGGED_IN_USER)
    );
    this.tournamentID = UniqueIdGenerator.generate();

    if (this.loggedInuser) {
      let clubInfo: any =
        this.loggedInuser.membership.length > 0
          ? this.loggedInuser.membership[0].club
          : null;

      this.hideClubs = this.loggedInuser.userRole > 1 ? true : false;
      this.clubTitle = clubInfo ? clubInfo.name : "";
    }

    this.clubID = this.loggedInuser.membership[0].club;
    console.log(this.clubID);

    this.currentDate = new Date();
    this.getSelectedCourse(
      this.clubID.courses.length > 0
        ? this.clubID.courses[0].id
        : "-LUFS3FCQKOGpJ2IEHmf"
    );

    this.starterForm = new FormGroup({
      holeSets: new FormControl("", [Validators.required]),
      //startingHole: new FormControl('', [Validators.required]),
      startingTime: new FormControl("08:00 AM", [Validators.required]),
      roundTee: new FormControl("", [Validators.required]),
      roundDate: new FormControl(
        this.datepipe.transform(this.currentDate.toString(), "yyyy-MM-dd"),
        [Validators.required]
      ),
      handicapSystem: new FormControl("", [Validators.required]),
      //addPlayer: new FormControl('')
    });

    console.log(this.starterForm.value);
  }

  changeFlight(item) {
    //console.log("Selected value: " + item.value);
    this.selectedCourseHoleSet = item.value;
    console.log(this.selectedCourseHoleSet);
  }

  getSelectedCourse(course) {
    this.facadeService
      .getCourseHoleSets(course)
      .subscribe((selectedCourseHoleSet) => {
        console.log(selectedCourseHoleSet);
        if (selectedCourseHoleSet.course_hole_sets.length > 0) {
          this.courseHoleSetNames = selectedCourseHoleSet.course_hole_sets;
          //this.showCourseHole = true;
        } else {
          //this.showCourseHole = false;
        }
      });
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.starterForm.controls[controlName].hasError(errorName);
  };

  public onCancel = () => {
    this.location.back();
  };

  public createStarter = (starterFormValue: any) => {
    if (this.starterForm.valid) {
      //this.executeStarterCreation(starterFormValue);
      this.createTournament(starterFormValue);
    }
  };

  async createTournament(starterFormValue: any) {
    this.loggedInuser = JSON.parse(
      localStorage.getItem(Constants.LOGGED_IN_USER)
    );

    starterFormValue.roundDate = this.datepipe.transform(
      starterFormValue.roundDate.toString(),
      "yyyy-MM-dd"
    );
    console.log(starterFormValue.roundDate);
    const addRound: AddDailyRound = {
      holeSets: starterFormValue.holeSets,
      //startingHole: starterFormValue.startingHole,
      startingTime: starterFormValue.startingTime,
      roundTee: starterFormValue.roundTee,
      roundDate: starterFormValue.roundDate,
      //addPlayer : starterFormValue.addPlayer
    };

    console.log(addRound);

    let tournamentFlights: Flight[] = [];
    let fcnter = 0;
    let roundMembers: any[] = [];

    for (let member of this.flightMembers) {
      let playerTee: any = this.playerTees.get(member.playerId);
      console.log(playerTee);
      let Tee;
      if (playerTee == undefined) {
        Tee = starterFormValue.roundTee
          ? starterFormValue.roundTee
          : "AMATEURS";
      } else {
        Tee = "AMATEURS";
      }
      let playerTeeId: any = General.getCourseTeeId(Tee);
      let playerTeeName = playerTee
        ? playerTee.value
        : starterFormValue.roundTee;
      let flightMember = {
        playerId: member.playerId,
        attendance: false,
        playingTee: playerTeeName,
        tee_id: General.getCourseTeeId(playerTeeName)
          ? General.getCourseTeeId(playerTeeName).id
          : 1,
        guest: null,
      };
      console.log(flightMember);

      roundMembers.push(flightMember);
    }

    fcnter++;

    let roundTee = starterFormValue.roundTee
      ? starterFormValue.roundTee
      : "AMATEURS";
    let roundTeeId: any = General.getCourseTeeId(roundTee)
      ? General.getCourseTeeId(roundTee).id
      : 1;
    console.log(roundTeeId.id);

    console.log(roundTeeId.result);
    let index = this.selectedCourseHoleSet.indexOf("_");
    let flight: any = {
      id: UniqueIdGenerator.generate(),
      //tournamentId: this.tournamentID,
      courseId:
        this.clubID.courses.length > 0
          ? this.clubID.courses[0].id
          : "-LUFS3FCQKOGpJ2IEHmf",
      adminId: this.loggedInuser.id,
      courseHoleSets: this.selectedCourseHoleSet.substring(0, index),
      flightNo: fcnter,
      flightRound: 0,
      startingHole: 1,
      tee_id: roundTeeId,
      tee: roundTee,
      category: null,
      date: this.starterForm.value.roundDate,
      time: addRound.startingTime,
      ended: false,
      courseHoleSetsInverted: false,
      members: {
        data: roundMembers,
      },
    };

    console.log(flight);
    tournamentFlights.push(flight);
    console.log(tournamentFlights);

    let tournament: Tournament = {
      id: this.tournamentID,
      clubId: this.loggedInuser.adminClubId,
      leagueId: null,
      courseId:
        this.clubID.courses.length > 0
          ? this.clubID.courses[0].id
          : "-LUFS3FCQKOGpJ2IEHmf",
      adminId: this.loggedInuser.id,
      title:
        this.currentDate.toString().substring(0, 10) +
        " " +
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
      playingOnWhs:
        this.starterForm.value.handicapSystem == "true" ? true : false,
      matchFormat: "STROKE_PLAY",
      pointsFormats: null,
      pointsValues: null,
      handicapAllocations: null,
      tee: roundTee,
      tee_id: roundTeeId,
      scoreManagement: "ONLY_PLAYERS",
      startDate: this.starterForm.value.roundDate,
      endDate: this.starterForm.value.roundDate,
      flightsCategory: null,
      started: true,
      invited: false,
      singleRound: true,
      sponsorName: "",
      sponsorLogo: "",
      mobileLogoUrl: "",
      webLogoUrl: "",
      courseHoleSetsInverted: false,
      categories: [],
      marshals: [],
      flights: tournamentFlights,
      members: [],
    };

    console.log(tournament);

    let result = <any>await this.facadeService.addTournament(tournament);
    //this.executeStarterCreation(this.starterForm)
    this.currentTournament = tournament;
    console.log(result);

    if (result) {
      this.snackBar.open("Daily Round has been setup.", "x", {
        duration: 5000,
      });

      this.currentTournament = tournament;
      //this.router.navigate(["/daily-rounds"]);
          this.starterForm.reset();
      //this.router.navigate(["/daily-rounds/"]);
    }
  }

  async searchPlayer(query) {
    let player;

    if (query) {
      player = <Player[]>(
        await this.facadeService.getPlayerByMembershipNumber(query)
      );

      console.log(this.clubID["id"]);
      let date = this.starterForm.value.roundDate;
      if (!player || player.length == 0) {
        player = <Player>(
          await this.facadeService.getPlayerByMembershipNumberClubwise(
            this.clubID["id"],
            query,
            query
          )
        );
      }
      console.log(this.datepipe.transform(date.toString(), "yyyy-MM-dd"));

      if (player.length == 1) {
        let founded = await this.facadeService.getPlayerTodayRound(
          player[0].id,
          this.datepipe.transform(date.toString(), "yyyy-MM-dd")
        );

        if (founded && founded.length > 0) {
          this.snackBar.open("Player already played in a round today.", "x", {
            duration: 5000,
          });

          return;
        }

        founded = this.tournamentMembers.filter((a) => {
          return a.id == player[0].id;
        });
        console.log(founded);

        if (founded.length == 0) {
          if (this.flightMembers.length > 3) {
            this.snackBar.open(
              "Maximum 4 players are allowed per flight.",
              "x",
              {
                duration: 5000,
              }
            );

            return false;
          }

          let member: any = {
            playerId: player[0].id,

            attendance: true,
          };

          this.flightMembers.push(member);

          this.tournamentMembers.push(player[0]);

          this.syncTournamentMembers();
          this.snackBar.open("Player has been added in the list.", "x", {
            duration: 5000,
          });
        } else {
          this.snackBar.open("Player already exist in the list.", "x", {
            duration: 5000,
          });
        }
      } else {
        if (player.length == 0) return;

        const dialogRef = this.dialog.open(DialogAddExisitingPlayerComponent, {
          width: "80%",
          data: { players: player },
        });

        dialogRef.afterClosed().subscribe(async (result) => {
          console.log(result);
          if (result) {
            //console.log("record deleted.");
            console.log(result);
            console.log(this.datepipe.transform(date.toString(), "yyyy-MM-dd"));

            let founded = await this.facadeService.getPlayerTodayRound(
              result.player.id,
              this.datepipe.transform(date.toString(), "yyyy-MM-dd")
            );

            if (founded && founded.length > 0) {
              this.snackBar.open(
                "Player already played in a round today.",
                "x",
                {
                  duration: 5000,
                }
              );

              return;
            }

            founded = this.tournamentMembers.filter((a) => {
              return a.id == result.player.id;
            });
            console.log(founded);

            if (founded.length == 0) {
              if (this.flightMembers.length > 3) {
                this.snackBar.open(
                  "Maximum 4 players are allowed per flight.",
                  "x",
                  {
                    duration: 5000,
                  }
                );

                return false;
              }

              let member: any = {
                playerId: result.player.id,
                attendance: false,
              };

              console.log(this.flightMembers);
              console.log(this.tournamentMembers);
              let obj: Player = {
                id: result.player.id,
                adminClubId: result.player.adminClubId,
                firebaseUid: result.player.firebaseUid,
                fcmToken: result.player.fcmToken,
                gemId: result.player.gemId,
                firstName: result.player.firstName,
                lastName: result.player.lastName,
                gender: result.player.gender,
                dob: result.player.dob,
                picture: result.player.picture,
                email: result.player.email,
                phone: result.player.phone,
                playerCategory: result.player.playerCategory,
                handicap: result.player.handicap,
                online: false,
                countryCode: result.player.countryCode,
                extraData: result.player.extraData,
                userRole: result.player.isClubAdmin == true ? 2 : 3,
                membership: result.player.membership,
                membershipNumber: result.player.membershipNumber,
              };
              console.log(obj);
              console.log(this.tournamentMembers);

              this.tournamentMembers.push(obj);
              this.flightMembers.push(member);

              console.log(this.tournamentMembers);
              console.log(this.flightMembers);
              // if(this.tournamentMembers.length==2 && this.last==true)
              // {
              //   this.tournamentMembers.splice(0,1);
              //   console.log(this.tournamentMembers);
              //   console.log(this.flightMembers);
              //   //this.flightMembers.splice(0,1);

              // }

              console.log(this.tournamentMembers);
              this.syncTournamentMembers();
              this.snackBar.open("Player has been added in the list.", "x", {
                duration: 5000,
              });
            } else {
              this.snackBar.open("Player already exist in the list.", "x", {
                duration: 5000,
              });
            }
          } else {
            //console.log("cancel delete action");
          }
        });
      }
    }
  }

  syncTournamentMembers() {
    of(this.tournamentMembers)
      .pipe()
      .subscribe(
        (data) => {
          this.isLoading = false;
          console.log(this.tournamentMembers);
          this.tournamentMembers.forEach(
            (obj, i) => (obj["fullName"] = obj.firstName + " " + obj.lastName)
          );
          this.membersSource = new MatTableDataSource(this.tournamentMembers);
          this.membersSource.sort = this.Memsort;
          this.membersSource.paginator = this.Mempaginator;
          console.log(this.membersSource);

          //this.updateTMCategorySelection();
        },
        (error) => (this.isLoading = false)
      );
  }

  removePlayer(playerId: string) {
    console.log(playerId);
    console.log(this.tournamentMembers);
    let data: any = this.tournamentMembers;
    console.log(data);
    let DelplayerIndex: any = data.findIndex((a) => {
      return a.id == playerId;
    });
    console.log(DelplayerIndex);

    let DelplayerInfo: any = data.filter((a) => {
      return a.id == playerId;
    });
    console.log(DelplayerInfo);

    //console.log(flight + "<- ->" + player);

    //console.log("record deleted.");
    data.splice(DelplayerIndex, 1);
    //data.splice(playerId, 1);
    console.log(data);
    //this.tournamentMembers.splice(0,0,DelplayerInfo[0])

    this.tournamentMembers = data;
    if (data.length > 0) {
      let flightDelMem = this.flightMembers.filter((a) => {
        return a.playerId == data[0].id;
      });
      this.flightMembers = flightDelMem;
      console.log(this.flightMembers);
      console.log(this.tournamentMembers);

      this.syncTournamentMembers();
    } else {
      this.flightMembers = [];
      this.tournamentMembers = [];
      this.last = true;
      console.log(this.flightMembers);
      console.log(this.tournamentMembers);

      this.syncTournamentMembers();
    }

    //this.facadeService.deleteTournamentMember(this.tournamentID, playerId);
    // } else {
    //   console.log("cancel delete action");
    // }
  }
  addPlayer() {
    // const dialogRef = this.dialog.open(DialogAddPlayerComponent, {
    //   data: { flights: this.selectedMembers.length },
    // });

    // dialogRef.afterClosed().subscribe((result) => {
    //   if (result) {
    //     //console.log("record deleted.");
    //     //console.log(result);
    //     this.flightMembers.push(result);
    //     this.tournamentMembers.push(result);
    //     console.log(this.flightMembers);
    //     console.log(this.tournamentMembers);

    //     //console.log(this.clubMembers);
    //     this.syncTournamentMembers();
    //   } else {
    //     //console.log("cancel delete action");
    //   }
    // });
  }

  selectedTee(event, playerId) {
    console.log(playerId);
    let target = event.source.selected._element.nativeElement;
    let selectedData = {
      value: event.value,
      text: target.innerText.trim(),
    };

    this.playerTees.set(playerId, selectedData);
    console.log(this.playerTees);
  }

  //  async executeStarterCreation(starterFormValue:any)  {

  //     this.loggedInuser = JSON.parse(localStorage.getItem(Constants.LOGGED_IN_USER));

  //     const addRound: AddDailyRound = {
  //       holeSets: starterFormValue.holeSets,
  //       //startingHole: starterFormValue.startingHole,
  //       startingTime : starterFormValue.startingTime,
  //       roundTee : starterFormValue.roundTee,
  //       roundDate : starterFormValue.roundDate,
  //       //addPlayer : starterFormValue.addPlayer

  //     };

  //     console.log(addRound)

  //     let tournamentFlights: Flight[] = [];
  //     let fcnter = 0;

  //         fcnter++;

  //         let flight: any = {
  //           id: UniqueIdGenerator.generate(),
  //           tournamentId: this.tournamentID,
  //           courseId: this.clubID.courses[0].id,
  //           adminId: this.loggedInuser.id,
  //           courseHoleSets: this.selectedCourseHoleSet.substring(0,1),
  //           flightNo: fcnter,
  //           flightRound: 0,
  //           startingHole: 1,
  //           tee: addRound.roundTee,
  //           category: null,
  //           date: General.parseToDate((this.starterForm.value.roundDate)? this.starterForm.value.roundDate: this.currentDate.toString()),
  //           time:  addRound.startingTime,
  //           ended: false,
  //           courseHoleSetsInverted: false,
  //           'members': {
  //             'data': this.flightMembers
  //           }
  //         }

  //         console.log(flight);
  //         tournamentFlights.push(flight);
  //         console.log(tournamentFlights);

  //     let result = <any>await this.facadeService.createNextRoundFlights(tournamentFlights);

  //     if(result) {
  //         this.snackBar.open("Daily Rounds Flight has been created.", "x", {
  //           duration: 5000,
  //         });
  //         //this.reset();
  //         //this.router.navigate(['/daily-rounds']);
  //       //}
  //     }

  //   }
}
