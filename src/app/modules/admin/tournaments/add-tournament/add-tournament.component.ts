import { Component, OnInit, ViewChild } from '@angular/core';
import { StepperOrientation } from '@angular/material/stepper';
import {
    AbstractControl,
    FormBuilder,
    FormGroup,
    FormControl,
    FormArray,
    Validators,
} from '@angular/forms';
import { filter } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { FacadeService } from '../../../../shared/services/facade.service';
import { Club } from '../../../../shared/models/club.model';
import {
    Course,
    CourseHoles,
    CourseHoleSet,
} from '../../../../shared/models/course.model';
import {
    matchFormat,
    Tournament,
    TournamentCategory,
    TournamentMember,
    TournamentRoundCourses,
} from '../../../../shared/models/tournament.model';
import {
    Player,
    PlayerCategory,
    Marshal,
} from '../../../../shared/models/player.model';
import { Flight, FlightMembers } from '../../../../shared/models/flight.model';
import {
    UniqueIdGenerator,
    passwordGenerator,
    Constants,
    General,
} from '../../../../shared/classes/general';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SelectionModel } from '@angular/cdk/collections';
import { RequireMatch } from '../../../../shared/classes/CustomValidator';
import { of, Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import {
    CdkDragDrop,
    moveItemInArray,
    transferArrayItem,
} from '@angular/cdk/drag-drop';
import { DialogAddPlayerComponent } from '../../dialogs/dialog-add-player/dialog-add-player.component';
import { DialogPlayerComponent } from '../../dialogs/dialog-player/dialog-player.component';
import { DialogPlayerListComponent } from '../../dialogs/dialog-player-list/dialog-player-list.component';
import { DialogOverviewComponent } from '../../dialogs/dialog-overview/dialog-overview.component';
import { DialogMoveFlightComponent } from '../../dialogs/dialog-move-flight/dialog-move-flight.component';
import { DatePipe } from '@angular/common';
import { MatStepper } from '@angular/material/stepper';
import { AmazingTimePickerService } from 'amazing-time-picker';
import { DialogPlayingDatesComponent } from '../../dialogs/dialog-playing-dates/dialog-playing-dates.component';
import { LocalStorageService } from 'app/shared/services/localStorage';
import { BreakpointObserver } from '@angular/cdk/layout';
import { DialogAddMemberComponent } from '../../dialogs/dialog-add-member/dialog-add-member.component';
import { LogsService } from 'app/shared/services/logs.service';
import { Team, TeamMembers } from 'app/shared/models/team.model';
//import { DialogPlayingDatesComponent } from "../../material-components/dialog-playing-dates/dialog-playing-dates.component";

@Component({
    selector: 'app-add-tournament',
    templateUrl: './add-tournament.component.html',
    styleUrls: ['./add-tournament.component.scss'],
})
export class AddTournamentComponent implements OnInit {
    valid1 = new FormControl('');
    valid2 = new FormControl('');
    valid3 = new FormControl('');
    valid4 = new FormControl('');
    valid5 = new FormControl('');
    displayedColumns: string[] = [
        'firstName',
        'handicap',
        'playerCategory',
        'select',
    ];
    index = 0;
    membersColumns: string[] = [
        'firstName',
        'handicap',
        'playerCategory',
        'delete',
    ];
    matchFormats: string[] = [
        "STROKE_PLAY",
        "STABLEFORD",
        "MODIFIED_STABLEFORD",
        "SPLIT_SIXES",
    ];

    dataSource: MatTableDataSource<Player>;
    selection = new SelectionModel<Player>(true, []);
    isLoading = true;
    intervalPerFlight = 0;
    stepTitle: string = 'Tournament Setup Form';
    PLcats: Player[] = [];
    tournamentCourses: any[] = [];
    formGroup: FormGroup;
    filteredClubOptions: Observable<Club[]>;
    filteredCourseOptions: any;
    selectedIndex: any = 0;
    nameFormGroup: FormGroup;
    emailFormGroup: FormGroup;
    loggedInuser: Player;
    Clubs: Club[] = [];
    showCategory: boolean = true;
    clubMembers: Player[] = [];
    selectedMembers: any = [];
    categoryCounts: any = [];
    TMcategoryCounts: any = [];
    Courses: Course[] = [];
    _courseHoles: CourseHoles[] = [];
    Categories: PlayerCategory[] = [];
    isAmateur: boolean;
    tournamentMembers: Player[] = [];
    selectedTeams1: any[][] = [];
    selectedTeams2: any[][] = [];
    selectedTeams: any[] = [];
    assignedOpponents: Set<string> = new Set<string>();
    teamMembersToSave: any[] = [];
    isSenior: boolean
    membersSource: MatTableDataSource<Player>;
    isVeterans: boolean;
    isJuniors: boolean;
    isLadies: boolean;
    isProfessionals: boolean;
    isProAm: boolean;
    selected: boolean;
    isMarshals: boolean;
    hideClubs: boolean = true;
    showTexas: boolean = false;
    showMatchPlay: boolean = false;
    showMultipleCourses: boolean = false;
    multiCourse: boolean = false;
    showShambles: boolean = false;
    showBest: boolean = false;
    clubTitle: string;
    sDate: Date;
    tournamentID: string;
    subTournamentID: string = '';
    public selectedTime = '08:00 AM';
    public preFlightTime = this.selectedTime;
    minDate: Date;
    maxDate: Date;
    courseIndex: number = 0;
    courseFlag: boolean = true;;
    currentTournament: any;
    classifiedPlayers: any[] = [];
    setupInitialized: boolean = false;
    playingFlight: any[] = [];
    courseHoleSetNames: any[];
    courseHoleSetName: any[] = [];
    courseChange: boolean = false;
    courseHoleSetCount: number = 0;
    showCourseHole: boolean = false;
    atpTime: any;
    stepperOrientation: Observable<StepperOrientation>;
    editTournament: boolean = false;
    playingDat: any[] = [];
    @ViewChild('paginatorLegal') paginator: MatPaginator;
    @ViewChild('dsort') sort: MatSort;

    @ViewChild('paginatorGSTN') Mempaginator: MatPaginator;
    @ViewChild('msort') Memsort: MatSort;
    showDates: boolean = false;
    dates: any[] = [];
    datesPlaying: any[] = [];
    showCat: boolean = true;
    showSubtournament: boolean = false;
    onHoleChange($event, i, j) {
        //console.log(i);

        let flight_1_hole: string = (<HTMLInputElement>(
            document.getElementById('flight_' + i + '_hole')
        )).value;
        //console.log(flight_1_hole);
    }

    drop(event: CdkDragDrop<string[]>) {
        ////console.log(event);
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
    swapArrayElements<T>(arr: T[], indexA: number, indexB: number): void {
        if (indexA < 0 || indexB < 0 || indexA >= arr.length || indexB >= arr.length) {
            // Check if the indices are within the valid range of the array
            return;
        }

        const temp = arr[indexA];
        arr[indexA] = arr[indexB];
        arr[indexB] = temp;
    }
    swapOuterObjects(previousArray: any[], newArray: any[], index1: number, index2: number): void {
        let newindex = 0;
        let newindex2 = 0;
        if (index2 < 2) {
            newindex = 0
        } else {
            newindex = 1;
        }
        if (index1 < 2) {
            newindex2 = 0
        } else {
            newindex2 = 1;
        }
        index2 = index2 % 2;
        index1 = index1 % 2;
        const temp = previousArray[newindex2][index1];
        previousArray[newindex2][index1] = newArray[newindex][index2];
        newArray[newindex][index2] = temp;
    }
    swapInnerObjects(mainArray: any[], index1: number, index2: number): void {
        // Assuming mainArray[index1] and mainArray[index2] are arrays with the 'PairName' property
        index2 = index2 % 2;
        const temp = mainArray[0][index1];
        mainArray[0][index1] = mainArray[1][index2];
        mainArray[1][index2] = temp;
    }
    dragDroppedShambles(event: CdkDragDrop<string[]>) {
        const newIndex = event.currentIndex;
        const previousIndex = event.previousIndex;
        //console.log(newIndex);
        //console.log(previousIndex);
        if (event.previousContainer === event.container) {
            if (previousIndex == 0 && newIndex == 1) {
                //console.log('No changes');
            } else if ((previousIndex == 0 || previousIndex == 1) && (newIndex == 2 || newIndex == 3)) {
                this.swapInnerObjects(event.container.data, previousIndex, newIndex);
            } else if ((previousIndex == 2 || previousIndex == 3) && (newIndex == 0 || newIndex == 1)) {
                this.swapInnerObjects(event.container.data, newIndex, previousIndex);
            }
        }
        else {
            if (previousIndex == 0 && newIndex == 1) {
                //console.log('No changes');
            } else if ((previousIndex == 0 || previousIndex == 1) && (newIndex == 2 || newIndex == 3)) {
                this.swapOuterObjects(event.previousContainer.data, event.container.data, previousIndex, newIndex)
            } else if ((previousIndex == 2 || previousIndex == 3) && (newIndex == 0 || newIndex == 1)) {
                this.swapOuterObjects(event.previousContainer.data, event.container.data, newIndex, previousIndex)
            }
        }

    }
    dragDropped(event: CdkDragDrop<string[]>) {
        const newIndex = event.currentIndex;
        const previousIndex = event.previousIndex;
        //console.log(newIndex);
        //console.log(previousIndex);
        if ((previousIndex % 2 == 0) && (newIndex % 2 == 0)) {
            this.swapArrayElements(event.container.data, previousIndex, newIndex);
        } else if ((previousIndex % 2 === 1) && (newIndex % 2 == 1)) {
            this.swapArrayElements(event.container.data, previousIndex, newIndex);
        }


        // Use newIndex to access the correct index where the item was dropped.
        // For example, you can swap elements in the `items` array using `swapArrayElements`.
        // Example: swapArrayElements(this.items, event.previousIndex, newIndex);
    }
    /** Returns a FormArray with the name 'formArray'. */
    get formArray(): AbstractControl | null {
        return this.formGroup.get('formArray');
    }

    private marshalValidators = [Validators.maxLength(3)];

    constructor(
        private atp: AmazingTimePickerService,
        private breakpointObserver: BreakpointObserver,
        private datePipe: DatePipe,
        private router: Router,
        private route: ActivatedRoute,
        public snackBar: MatSnackBar,
        private _formBuilder: FormBuilder, private logger: LogsService,
        public dialog: MatDialog, private _localStorage: LocalStorageService,
        private facadeService: FacadeService
    ) {
        this.setState(this.valid1, true);
        this.setState(this.valid2, true);
        this.setState(this.valid3, true);
        this.setState(this.valid4, true);
        this.setState(this.valid5, true);
        this.stepperOrientation = breakpointObserver
            .observe('(min-width: 800px)')
            .pipe(map(({ matches }) => (matches ? 'horizontal' : 'vertical')));

    }



    async ngOnInit() {
        this.loggedInuser = this._localStorage.get(Constants.LOGGED_IN_USER);


        this.route.paramMap.subscribe((params) => {
            this.tournamentID = params.get('id');
        });

        if (this.loggedInuser) {
            let clubInfo: any =
                this.loggedInuser.membership.length > 0
                    ? this.loggedInuser.membership[0].club
                    : null;

            this.hideClubs = this.loggedInuser.userRole > 1 ? true : false;
            this.clubTitle = clubInfo ? clubInfo.name : '';
        }

        this.formGroup = this._formBuilder.group({
            formArray: this._formBuilder.array([
                this._formBuilder.group({
                    titleFormCtrl: ['', [Validators.required]],
                    prefixFormCtrl: ['', [Validators.required]],
                    numOfRounds: ['1', Validators.required],
                    typeFormCtrl: ['2', Validators.required],
                    handicapAllocations: ['AS_IS', Validators.required],
                    startDateFormCtrl: ['', Validators.required],
                    endDateFormCtrl: ['', Validators.required],
                    teamMatch: ['1', Validators.required],
                    clubsFormCtrl: [
                        this.loggedInuser.userRole > 1
                            ? this.loggedInuser.membership.length > 0
                                ? this.loggedInuser.membership[0].club.name
                                : this.loggedInuser.adminClubId
                            : this.loggedInuser.adminClubId,
                        [Validators.required, RequireMatch],
                    ],
                    courseInfo: this._formBuilder.array([
                        this._formBuilder.group({
                            courseName: [
                                '',
                            ],
                            matchFormat: [Constants.MF_STROKE_PLAY],
                            multiFormat: ['SINGLE'],
                        }),
                    ]),
                    courseHoleSet: [''],
                    subTournament: this._formBuilder.array([
                        this._formBuilder.group({
                            title: [''],
                            prefix: [''],
                            matchFormat: [Constants.MF_BESTBALL],
                        }),
                    ]),
                    clubctgies: this._formBuilder.array([]),
                    scoreManagement: ['ONLY_PLAYERS'],
                    marshalStart: ['', this.marshalValidators],
                    noofMarshals: ['', this.marshalValidators],
                    handicapCats: [false],
                    handicapRatio: [''],
                    prizeCategoryA: [''],
                    prizeCategoryB: [''],
                    amateursGT: [''],
                    amateursNT: [''],
                    seniorsGT: [''],
                    seniorsNT: [''],
                    veteransGT: [''],
                    veteransNT: [''],
                    juniorsGT: [''],
                    juniorsNT: [''],
                    ladiesGT: [''],
                    ladiesNT: [''],
                    professionalsGT: [''],
                    professionalsNT: [''],
                    spLongestDriveOne: [''],
                    spLongestDriveTwo: [''],
                    spNearestDrive: [''],
                    askConfirmation: [false],
                    courses: this._formBuilder.array([]),
                }),
                this._formBuilder.group({
                    category: this._formBuilder.array([]),
                }),
            ]),
        });

        let dataClubs = await this.facadeService.getClubList();
        this.Clubs = dataClubs.club;

        let dataCourses = await this.facadeService.getCoursesList();
        this.Courses = dataCourses.course;

        // this.Categories =  this.facadeService.getPlayerCategories();
        this._courseHoles = this.facadeService.getCourseHoles('');
        ////console.log(this.Categories);

        let playerCategoryList = this.facadeService.getPlayerCategories();
        //console.log(playerCategoryList);

        //this._courseHoles = this.facadeService.getCourseHoles('');

        let today: Date = new Date();
        let dd = String(today.getDate()).padStart(2, '0');
        let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        let yyyy = today.getFullYear();
        // this.courseFormGroup
        let todayDate: Date = General.parseToDate(mm + '/' + dd + '/' + yyyy);
        /*
    this.nameFormGroup = this._formBuilder.group({
      firstNameCtrl: ['', Validators.required],
      lastNameCtrl: ['', Validators.required],
    });
    
    this.emailFormGroup = this._formBuilder.group({
      emailCtrl: ['', Validators.email]
    });
    */

        this.route.paramMap.subscribe((params) => {
            this.tournamentID = params.get('id');
        });

        if (this.tournamentID) {
            this.valid1.reset();
            let tournamentInfo = await this.facadeService.getTournamentByID(
                this.tournamentID
            );
            this.editTournament = true;
            //console.log(tournamentInfo);
            this.currentTournament =
                tournamentInfo.tournament.length > 0
                    ? tournamentInfo.tournament[0]
                    : [];

            console.log(this.currentTournament);
            //console.log(this.currentTournament.teams);

            // this.getSelectedCourse(this.currentTournament['CourseQL']);

            if (this.currentTournament) {
                this.formArray.get([0]).patchValue({
                    titleFormCtrl: this.currentTournament.title,
                    prefixFormCtrl: this.currentTournament.prefix,
                    startDateFormCtrl: this.currentTournament.startDate,
                    endDateFormCtrl: this.currentTournament.endDate,
                    numOfRounds: this.currentTournament.noOfRounds.toString(),
                    teamMatch: this.currentTournament.teamMatch == true ? '2' : '1',
                    courseHoleSet:
                        this.currentTournament.courseHoleSets +

                        '_' +
                        this.currentTournament.courseHoleSetsInverted,
                    scoreManagement: this.currentTournament.scoreManagement,
                    marshalStart: this.currentTournament.marshalsStartWith,
                    noofMarshals: this.currentTournament.noOfMarshals,
                });
                if (this.currentTournament.scoreManagement != Constants.SM_ONLY_PLAYERS) {
                    this.isMarshals = true;
                }
                if (this.currentTournament.teamMatch) {
                    this.currentTournament.teams.forEach((team) => {
                        const newTeam = {
                            id: team.id,
                            name: team.name,
                            color: team.color,
                            members: [] // Initialize an empty array for members
                        };

                        // Loop through each member in membersQL
                        team.membersQL.forEach((memberQL) => {
                            const playerQL = memberQL.player; // Get the player object from membersQL

                            // Extract relevant properties from the player object
                            const player = {
                                id: playerQL.id,
                                firstName: playerQL.firstName,
                                lastName: playerQL.lastName,
                                handicap: playerQL.handicap,
                                playerCategory: playerQL.playerCategory,
                                membershipNumber: playerQL.membershipNumber,
                            };

                            // Push the player into the new team's members array
                            newTeam.members.push(player);
                        });

                        // Push the new team into this.selectedTeams
                        this.selectedTeams.push(newTeam);
                    })

                    this.matchFormats = [
                        "MATCH_PLAY",
                        "TEXAS_SCRAMBLE",
                        "2_BALL_SCRAMBLE",
                        "3_BALL_SCRAMBLE",
                        "4_BALL_SCRAMBLE",
                        "SHAMBLES",
                        "BEST_THREE",
                        "BEST_TWO",
                    ]
                }
                if (this.currentTournament.matchFormat == matchFormat.MATCH_PLAY) {
                    this.showMatchPlay = true;
                    this.showCat = false;
                } else if (this.currentTournament.matchFormat == matchFormat.TEXAS_SCRAMBLE || this.currentTournament.matchFormat == matchFormat.THREE_BALL_SCRAMBLE
                    || this.currentTournament.matchFormat == matchFormat.TWO_BALL_SCRAMBLE ||
                    this.currentTournament.matchFormat == matchFormat.SHAMBLES ||
                    this.currentTournament.matchFormat == matchFormat.FOUR_BALL_SCRAMBLE) {
                    this.showCat = false;
                    this.showTexas = true;
                } else if (this.currentTournament.matchFormat == matchFormat.STABLEFORD || this.currentTournament.matchFormat == matchFormat.MODIFIED_STABLEFORD || this.currentTournament.matchFormat == matchFormat.SPLIT_SIXES) {
                    this.showCat = false;
                } else if (this.currentTournament.matchFormat == matchFormat.BEST_THREE ||
                    this.currentTournament.matchFormat == matchFormat.BEST_TWO) {
                    this.showBest = true;
                    this.showCat = false;
                }

                //this.stepIndex = 1;

                //console.log(this.currentTournament);

                if (this.currentTournament.members)
                    for (let p of this.currentTournament.members)
                        this.tournamentMembers.push(<Player>p['PlayerQL']);

                this.syncTournamentMembers();

                //this.selection = new SelectionModel<Player>(true, this.tournamentMembers);
                let TM = [];
                //console.log(this.tournamentMembers);
                for (let obj of this.tournamentMembers) {
                    if (this.currentTournament.opponents.length > 0) {
                        for (let objA of this.currentTournament.opponents) {
                            if (objA.team1MemberId == obj.id && objA.team1Id == this.selectedTeams1[0]['id']) {
                                this.selectedTeams1[0].push(obj);
                            }
                            if (objA.team2MemberId == obj.id && objA.team2Id == this.selectedTeams2[0]['id']) {
                                this.selectedTeams2[0].push(obj);
                            }
                        }
                    }
                }

                let selectedClubId: string;
                if (this.loggedInuser.userRole > 1 && this.loggedInuser.adminClubId) {
                    selectedClubId = this.loggedInuser.adminClubId
                } else if (this.loggedInuser.userRole == 1 && this.loggedInuser.adminClubId) {
                    selectedClubId = this.loggedInuser.adminClubId
                }
                this.clubMembers = [];
                //console.log(selectedClubId);
                let clubMembersData: any =
                    await this.facadeService.getPlayerByClub(selectedClubId);

                for (let i = 0; i < clubMembersData.club_member.length; i++) {
                    this.clubMembers.push(
                        clubMembersData.club_member[i].player
                    );
                }
                this.tournamentCourses = this.currentTournament['CoursesQL'];
                if (this.tournamentCourses.length > 0) {
                    this.showMultipleCourses = true;
                    for (let course of this.tournamentCourses) {
                        const chkArray = this.formArray.get([0]).get('courses') as FormArray;
                        chkArray.push(
                            this._formBuilder.group({
                                courseName: [course.course, Validators.required],
                                round: [course.round, Validators.required],
                                courseHolSet: [course.courseHoleSets, Validators.required]
                            })
                        );
                    }
                } else {
                    this.formArray
                        .get([0])
                        .get('courseInfo')!
                        .get([0])
                        .get('courseName')
                        .setValue({
                            name: this.currentTournament['CourseQL'].name,
                        });
                }

                //console.log(this.clubMembers);

                this.syncClubMembers();

                //this.dataSource = new MatTableDataSource(this.clubMembers);


                this.formGroup.get('formArray')!
                    .get([0])
                    .get('courseInfo')!
                    .get([0])
                    .get('matchFormat')!
                    .setValue(this.currentTournament.matchFormat);
                this.formArray
                    .get([0])
                    .get('clubsFormCtrl')!
                    .setValue(
                        this._filterClub(this.currentTournament.clubId)[0],
                    );



                // this.formArray
                // .get([0])
                // .get("courseInfo")!
                // .get([0])
                // .get("matchFormat")
                // .setValue({value: this.currentTournament.matchFormat})
                //console.log(this.currentTournament['CategoriesQL']);

                for (let p of playerCategoryList) {
                    let founded = this.currentTournament['CategoriesQL'].filter(
                        (a) => {
                            return a.category == p.name;
                        }
                    );

                    if (founded.length > 0) {
                        const chkArray = <FormArray>(
                            this.formArray.get([0]).get('clubctgies')
                        );
                        chkArray.push(
                            new FormControl({
                                id: 1,
                                name: p.name,
                                checked: founded.length > 0 ? true : false,
                                dates:
                                    founded.length > 0
                                        ? founded[0].flightSettings
                                        : [],
                            })
                        );
                        if (founded[0].flightSettings.length > 0) {
                            for (let obj of founded[0].flightSettings) {
                                let objA = {
                                    id: p.id,
                                    name: p.name,
                                    playingDates: obj,
                                };
                                this.dates.push(objA);
                            }
                        }

                        // let obj = {
                        //     id: 1,
                        //     name: p.name,
                        //     // playingDates: result[i]['dates'],
                        // };
                        // this.dates.push(obj);

                    }

                    let checkBoxCat: any = {
                        id: p.id,
                        name: p.name,
                        checked: founded.length > 0 ? true : false,
                    };

                    this.Categories.push(checkBoxCat);
                }
                this.minDate = tournamentInfo.startDate;
                //const chkArray = <FormArray>this.formArray.get([0]).get("clubctgies");
                //chkArray.push(new FormControl({ id: 1, name: "Amateurs", checked: false }));
            }
        } else {
            for (let p of playerCategoryList) {
                let checkBoxCat: any = {
                    id: p.id,
                    name: p.name,
                    checked: false,
                };

                this.Categories.push(checkBoxCat);
            }
        }

        this.filteredClubOptions = this.formArray
            .get([0])
            .get('clubsFormCtrl')!
            .valueChanges.pipe(
                startWith(''),
                map((value) =>
                    typeof value === 'string' ? value : value ? value.name : ''
                ),
                map((name) => (name ? this._filter(name) : this.Clubs.slice()))
            );
        //console.log(this.filteredClubOptions);

        // this.formArray
        // .get([0])
        // .get('courseInfo')
        // .get([0])
        // .get('courseName').valueChanges.subscribe(newValue=>{
        //     this.filteredCourseOptions = this.filterValues(newValue);
        // })
        this.filteredCourseOptions = this.formArray
            .get([0])
            .get('courseInfo')!
            .get([0])
            .get('courseName')!
            .valueChanges.pipe(
                startWith(''),
                map((value) =>
                    typeof value === 'string' ? value : value ? value.name : ''
                ),
                map((name) =>
                    name ? this._filterCourse(name) : this.Courses.slice()
                )
            );

        //console.log(this.filteredCourseOptions);

        const currentYear = new Date().getFullYear();
        if (!this.tournamentID) {
            this.maxDate = new Date(currentYear + 1, 11, 31);
            this.minDate = todayDate;
        }

        if (this.loggedInuser.userRole > 1) {
            this.formArray.get([0]).get('clubsFormCtrl').clearValidators();
            this.formArray
                .get([0])
                .get('clubsFormCtrl')
                .updateValueAndValidity();
        }
    }

    filterValues(search: string): any {
        //console.log('aaa');
    }
    createCourses(round: any): FormGroup {
        return this._formBuilder.group({
            courseName: [
                '',
                [Validators.required, RequireMatch],
            ],
            round: [round],
            courseHolSet: [''],
        });
    }

    createCategory(cat: any): FormGroup {
        let playersperFlight = '2';
        if (cat != 'Teams') {
            return this._formBuilder.group({
                name: [
                    cat ? cat.name : '',
                    Validators.compose([Validators.required]),
                ],
                playersperFlight: [
                    '2',
                    Validators.compose([Validators.required]),
                ],
                flightStartTime: ['08:00', Validators.required],
                arrangeBy: ['handicap', Validators.required],
                selectedcategories: [
                    this.formArray.get([0]).get('clubctgies').value,
                ],
                arrangements: ['0', Validators.required],
                startingHole: ['1_10', Validators.required],
                flightsInterval: ['10'],

                playingDate: this.checkDate(cat),
            });
        } else {
            if (this.formArray.get([0]).value.courseInfo[0].matchFormat == matchFormat.TEXAS_SCRAMBLE) {
                playersperFlight = '4'
            } else if (this.formArray.get([0]).value.courseInfo[0].matchFormat == matchFormat.TWO_BALL_SCRAMBLE) {
                playersperFlight = '2'

            } else if (this.formArray.get([0]).value.courseInfo[0].matchFormat == matchFormat.THREE_BALL_SCRAMBLE || this.formArray.get([0]).value.courseInfo[0].matchFormat == matchFormat.SPLIT_SIXES) {
                playersperFlight = '3'
            } else if (this.formArray.get([0]).value.courseInfo[0].matchFormat == matchFormat.SHAMBLES || this.formArray.get([0]).value.courseInfo[0].matchFormat == matchFormat.FOUR_BALL_SCRAMBLE) {
                playersperFlight = '4'
            }
            return this._formBuilder.group({
                name: [
                    cat ? cat : '',
                    Validators.compose([Validators.required]),
                ],
                playersperFlight: [
                    playersperFlight,
                    Validators.compose([Validators.required]),
                ],
                flightStartTime: ['08:00', Validators.required],
                arrangeBy: ['handicap', Validators.required],
                arrangements: ['0', Validators.required],
                startingHole: ['1_10', Validators.required],
                flightsInterval: ['10'],
                playingDate: null,
            });

        }
    }
    setState(control: FormControl, state: boolean) {
        if (state) {
            control.setErrors({ required: true });
        } else {
            control.reset();
        }
    }
    get courseFormGroup() {
        return <FormArray>this.formArray.get([0]).get('courses');
    }
    get categoryFormGroup() {
        return <FormArray>this.formArray.get([1]).get('category');
    }

    PlayingDateFormGroup(index) {
        let catControls = this.categoryFormGroup;
        ////console.log(catControls);
        //console.log(catControls.controls[index].get('playingDate'));

        return <FormArray>catControls.controls[index].get('playingDate');
    }

    calculateDiff(startDate, endDate) {
        let days = Math.floor(
            (endDate.getTime() - startDate.getTime()) / 1000 / 60 / 60 / 24
        );
        return days;
    }

    getplayingDate() {
        this.playingDat = [];
        let sDate = new Date(this.formArray.get([0]).value.startDateFormCtrl);
        let eDate = new Date(this.formArray.get([0]).value.endDateFormCtrl);
        //sDate.setDate(sDate.getDate() + 1);

        //console.log(sDate);
        //console.log(eDate);
        //console.log(this.calculateDiff(sDate, eDate));

        let noOfDays: any = this.calculateDiff(sDate, eDate);
        return this.playingDat;
    }
    getplayingDates() {
        this.playingDat = [];
        let sDate = new Date(this.formArray.get([0]).value.startDateFormCtrl);
        let eDate = new Date(this.formArray.get([0]).value.endDateFormCtrl);
        //sDate.setDate(sDate.getDate() + 1);

        //console.log(sDate);
        //console.log(eDate);
        //console.log(this.calculateDiff(sDate, eDate));

        let noOfDays: any = this.calculateDiff(sDate, eDate);
        for (let i = 0; i <= noOfDays; i++) {
            let dte = new Date(sDate);
            dte.setDate(sDate.getDate() + i);
            //console.log(dte);
            let dteday = this.datePipe.transform(dte, 'yyyyMMdd');
            //console.log(dteday);
            this.playingDat[i] =
                dteday.substring(8, 6) +
                '-' +
                dteday.substring(6, 4) +
                '-' +
                +dteday.substring(0, 4);
            //selectedDate [i] = this.datePipe.transform(selectedDate[i], 'dd-MM-yyyy')

            //   this.selectedMembers.push(person);
            //console.log(this.playingDat[i]);
        }
        //console.log(this.playingDat);
        return this.playingDat;
    }

    addFlightField(category: any) {
        const control = this.formArray.get([1]).get('category') as FormArray;
        control.push(this.createCategory(category));
    }
    addCourseField(round: any) {
        const control = this.formArray.get([0]).get('courses') as FormArray;
        control.push(this.createCourses(round));

        // Get the index of the newly added control
        const index = control.length - 1;

        // Set up value change observable for the newly added control
        const courseNameControl = control.at(index).get('courseName');
        this.setupValueChangeObservable(courseNameControl);
    }

    setupValueChangeObservable(control: AbstractControl) {
        control.valueChanges.pipe(
            startWith(''),
            map((value) =>
                typeof value === 'string' ? value : value ? value.name : ''
            ),
            map((name) =>
                name ? this._filterCourse(name) : this.Courses.slice()
            )
        );
    }
    displayFn(club: Club): string {
        return typeof club === 'string' ? club : club ? club.name : '';
    }

    displayCourseFn(course: any): string {
        //console.log(course);
        return typeof course === 'string'
            ? course
            : course.course
                ? course.course.name
                : course.name;
    }

    private _filter(value: string): Club[] {
        //console.log(value);

        if (value) {
            const filterValue = value.toLowerCase();

            return this.Clubs.filter(
                (option) => option.name.toLowerCase().indexOf(filterValue) === 0
            );
        }

        return this.Clubs;
    }
    private _filterClub(value: string) {
        //console.log(value);

        if (value) {
            const filterValue = value.toLowerCase();

            return this.Clubs.filter(
                (option) => option.id.toLowerCase().indexOf(filterValue) === 0
            );
        }

    }

    private _filterCourse(value: any): Course[] {
        //console.log('value=' + value);

        if (value) {
            if (typeof value === 'object') {
                const filterValue = value.name
                    ? value.name.toLowerCase()
                    : value.course.name.toLowerCase();
                return this.Courses.filter(
                    (option) =>
                        option.name.toLowerCase().indexOf(filterValue) >= 0
                );
            } else {
                const filterValue = value.toLowerCase();
                return this.Courses.filter(
                    (option) =>
                        option.name.toLowerCase().indexOf(filterValue) >= 0
                );
            }
        }

        return this.Courses.slice();
    }

    checkDate(cat) {
        //console.log(cat);
        if (this.editTournament == true) {
            return this.checkCatToUpdate(cat, false);
        }
        this.datesPlaying = [];
        for (let i of this.dates) {
            if (i.id == cat.id || i.name == cat.name) {
                this.datesPlaying.push(i['playingDates']);
            }
        }
        //console.log(this.datesPlaying);
        return this.datesPlaying;
    }

    updateChkbxArray(chk, index, isChecked, key) {
        const chkArray = <FormArray>this.formArray.get([0]).get(key);
        if (isChecked) {
            //sometimes inserts values already included creating double records for the same values -hence the defence
            if (chkArray.controls.findIndex((x) => x.value.id == chk.id) == -1)
                chkArray.push(new FormControl({ id: chk.id, name: chk.name }));

            //console.log(chkArray);
            //this.dateSetup();
            this.getplayingDates();
            this.showDates = true;
            let category;
            category = this.formArray.get([0]).get('clubctgies').value;
            //console.log(category);

            const dialogRef = this.dialog.open(DialogPlayingDatesComponent, {
                width: '800px',

                data: {
                    dates: this.playingDat,
                    category: chk,
                },
            });

            dialogRef.afterClosed().subscribe((result) => {
                //console.log(result);
                if (result) {
                    for (let i = 0; i < result.length; i++) {
                        let obj = {
                            id: result[i]['id'],
                            name: result[i]['name'],
                            playingDates: result[i]['dates'],
                        };
                        this.dates.push(obj);
                    }
                    //console.log(this.dates);
                } else {
                    this.snackBar.open('Dates have not been saved', 'x', {
                        duration: 3000,
                    });
                }
            });
            //this.PlayingDateFormGroup(index)
        } else {
            let idx = chkArray.controls.findIndex(
                (x) => x.value.name == chk.name
            );
            chkArray.removeAt(idx);
            this.dates = this.dates.filter((x) => x.name != chk.name);
            //console.log(this.dates);
        }

        if (chkArray.controls.findIndex((x) => x.value.id == 1) != -1)
            this.isAmateur = true;
        else {
            this.isAmateur = false;
            this.selected = false;
            this.formArray.get([0]).get('handicapCats').setValue(false);
        }

        if (chkArray.controls.findIndex((x) => x.value.id == 2) != -1)
            this.isSenior = true;
        else this.isSenior = false;

        if (chkArray.controls.findIndex((x) => x.value.id == 3) != -1)
            this.isVeterans = true;
        else this.isVeterans = false;

        if (chkArray.controls.findIndex((x) => x.value.id == 4) != -1)
            this.isJuniors = true;
        else this.isJuniors = false;

        if (chkArray.controls.findIndex((x) => x.value.id == 5) != -1)
            this.isLadies = true;
        else this.isLadies = false;

        if (chkArray.controls.findIndex((x) => x.value.id == 6) != -1)
            this.isProfessionals = true;
        else this.isProfessionals = false;

        if (chkArray.controls.findIndex((x) => x.value.id == 7) != -1)
            this.isProAm = true;
        else this.isProAm = false;

        ////console.log(chkArray.controls);
        ////console.log(chkArray.controls.findIndex(x => x.value.id == 1));
    }

    updateCourseHolSet(chk, isChecked, key) {
        const chkArray = <FormArray>this.formArray.get([0]).get(key);
        if (isChecked) {
            //sometimes inserts values already included creating double records for the same values -hence the defence
            if (chkArray.controls.findIndex((x) => x.value.id == chk.id) == -1)
                chkArray.push(
                    new FormControl({
                        id: chk.id,
                        name: chk.name,
                        checked: true,
                    })
                );
        } else {
            let idx = chkArray.controls.findIndex((x) => x.value.id == chk.id);
            chkArray.removeAt(idx);
        }
    }

    onChangeEventFunc(name: string, isChecked: boolean) {
        const courseHoleSet = this.formArray
            .get([0])
            .get('courseHoleSet') as FormArray;
        //console.log(isChecked['checked']);
        if (isChecked['checked']) {
            courseHoleSet.controls.push(new FormControl(name));
            this.courseHoleSetCount += 1;
        } else {
            const index = courseHoleSet.controls.findIndex(
                (x) => x.value === name
            );
            courseHoleSet.removeAt(index);
            this.courseHoleSetCount -= 1;
        }
        //console.log(courseHoleSet);
    }

    existInList(name: string) {
        let courseHoles = this.formArray
            .get([0])
            .get('courseHoleSet') as FormArray;
        let founded: boolean = false;

        for (let a of courseHoles.controls) {
            if (name == a.value) founded = true;
        }
        return founded;
    }

    public datechange(event) {
        this.getplayingDates();
        //console.log(event);
    }

    getSelectedCourse(course) {
        this.courseHoleSetNames = [];

        this.facadeService
            .getCourseHoleSets(course.id)
            .subscribe((selectedCourseHoleSet) => {
                //console.log(selectedCourseHoleSet);
                if (selectedCourseHoleSet.course_hole_sets.length > 0) {
                    this.courseHoleSetNames =
                        selectedCourseHoleSet.course_hole_sets;
                    this.showCourseHole = true;
                } else {
                    this.showCourseHole = false;

                    this.formArray.get([0]).patchValue({
                        courseHoleSet: [],
                    });
                }
            });
    }
    getSelectedCourses(course) {
        this.courseHoleSetNames = [];
        this.courseChange = true;
        //console.log(this.courseChange);
        this.formArray
            .get([0])
            .get('courseInfo')
            .get([0])
            .get('courseName')
            .setValue({ course });
        this.facadeService
            .getCourseHoleSets(course.id)
            .subscribe((selectedCourseHoleSet) => {
                //console.log(selectedCourseHoleSet);
                if (selectedCourseHoleSet.course_hole_sets.length > 0) {
                    this.courseHoleSetNames =
                        selectedCourseHoleSet.course_hole_sets;
                    this.showCourseHole = true;
                } else {
                    this.showCourseHole = false;

                    this.formArray.get([0]).patchValue({
                        courseHoleSet: [],
                    });
                }
            });
    }
    getSelectedCoursesMulti(course, index) {

        this.courseChange = true;
        //console.log(this.courseChange);
        this.facadeService
            .getCourseHoleSets(course.id)
            .subscribe((selectedCourseHoleSet) => {
                //console.log(selectedCourseHoleSet);
                if (selectedCourseHoleSet.course_hole_sets.length > 0) {
                    this.courseHoleSetName.push(selectedCourseHoleSet.course_hole_sets)
                    // this.filteredCourseOptions = this.Courses.slice();
                    this.filteredCourseOptions = of(this._filterCourse(''));
                } else {
                }
            });
    }
    courseChnage(values, i) {
        if (this.courseIndex != i) {
            this.courseFlag = true;
        }
        if (this.courseFlag) {
            this.filteredCourseOptions = this.formArray.get([0])
                .get('courses')
                .get([i])
                .get('courseName')!
                .valueChanges.pipe(
                    startWith(''),
                    map((value) =>
                        typeof value === 'string' ? value : value ? value.name : ''
                    ),
                    map((name) =>
                        name ? this._filterCourse(name) : this.Courses.slice()
                    )
                );
            this.courseIndex = i;
            this.courseFlag = false;
        } else if (this.courseIndex != i) {
            this.courseFlag = true;
        }
    }

    checkCatToUpdate(cat, check: boolean) {
        //console.log(cat);
        let flag: boolean = false;
        if (check) {
            for (let i of this.currentTournament['categories']) {
                if (i.category == cat) {
                    return i.id;
                }
            }
            return UniqueIdGenerator.generate();
        } else {
            for (let i of this.currentTournament['categories']) {
                if (i.category == cat.name) {
                    flag = this.checkUpdatesofDates(cat);
                    //console.log(flag);
                    if (flag) {
                        return i.flightSettings;
                    }
                }
            }

            this.datesPlaying = [];
            for (let j of this.dates) {
                if (j.name == cat.name) {
                    this.datesPlaying.push(j['playingDates']);
                }
            }
            //console.log(this.datesPlaying);
            return this.datesPlaying;
        }
    }

    public checkUpdatesofDates(cat): boolean {
        for (let j of this.dates) {
            if (j.name == cat.name) {
                return false;
            }
        }
        return true;
    }

    hasHoleSet1to9(courseHoleSetTitle): boolean {
        if (!this.currentTournament) return false;

        let courseHoleSets = this.currentTournament
            ? this.currentTournament.courseHoleSets
            : 0;
        let founded =
            courseHoleSets > 0 && (courseHoleSets & Constants.Holes1to9) != 0;

        if (founded) {
            const courseHoleSet = this.formArray
                .get([0])
                .get('courseHoleSet') as FormArray;
            courseHoleSet.controls.push(new FormControl(courseHoleSetTitle));
            this.courseHoleSetCount += 1;
        }

        return founded;
    }

    hasHoleSet10to18(courseHoleSetTitle): boolean {
        if (!this.currentTournament) return false;

        let courseHoleSets = this.currentTournament
            ? this.currentTournament.courseHoleSets
            : 0;
        let founded =
            courseHoleSets > 0 && (courseHoleSets & Constants.Holes10to18) != 0;

        if (founded) {
            const courseHoleSet = this.formArray
                .get([0])
                .get('courseHoleSet') as FormArray;
            courseHoleSet.controls.push(new FormControl(courseHoleSetTitle));
            this.courseHoleSetCount += 1;
        }

        return founded;
    }

    hasHoleSet19to27(courseHoleSetTitle): boolean {
        if (!this.currentTournament) return false;

        let courseHoleSets = this.currentTournament
            ? this.currentTournament.courseHoleSets
            : 0;
        let founded =
            courseHoleSets > 0 && (courseHoleSets & Constants.Holes19to27) != 0;

        if (founded) {
            const courseHoleSet = this.formArray
                .get([0])
                .get('courseHoleSet') as FormArray;
            courseHoleSet.controls.push(new FormControl(courseHoleSetTitle));
            this.courseHoleSetCount += 1;
        }

        return founded;
    }

    hasHoleSet28to36(courseHoleSetTitle): boolean {
        if (!this.currentTournament) return false;

        let courseHoleSets = this.currentTournament
            ? this.currentTournament.courseHoleSets
            : 0;
        let founded =
            courseHoleSets > 0 && (courseHoleSets & Constants.Holes28to36) != 0;

        if (founded) {
            const courseHoleSet = this.formArray
                .get([0])
                .get('courseHoleSet') as FormArray;
            courseHoleSet.controls.push(new FormControl(courseHoleSetTitle));
            this.courseHoleSetCount += 1;
        }

        return founded;
    }

    handicapCategoriesSelection(isChecked) {
        if (isChecked) {
            this.selected = true;
        } else {
            this.selected = false;
        }
    }

    setupMarshals(selectedValue) {
        if (selectedValue != Constants.SM_ONLY_PLAYERS) {
            this.isMarshals = true;

            // add required validator
            this.formArray
                .get([0])
                .get('marshalStart')
                .setValidators(Validators.required);
            this.formArray
                .get([0])
                .get('noofMarshals')
                .setValidators(Validators.required);
            this.formArray
                .get([0])
                .get('marshalStart')
                .updateValueAndValidity();
            this.formArray
                .get([0])
                .get('noofMarshals')
                .updateValueAndValidity();
        } else {
            this.isMarshals = false;

            // remove required validator
            this.formArray.get([0]).get('marshalStart').clearValidators();
            this.formArray.get([0]).get('noofMarshals').clearValidators();
            this.formArray
                .get([0])
                .get('marshalStart')
                .updateValueAndValidity();
            this.formArray
                .get([0])
                .get('noofMarshals')
                .updateValueAndValidity();
        }
    }

    resetClubMembers(selectedValue) {
        //console.log(selectedValue);
        this.clubMembers = [];
        this.selectedMembers = [];
        this.selection.clear();
        this.isLoading = true;
        ////console.log(this.selectedMembers);
    }

    get courseFileds() {
        return <FormArray>this.formArray.get([0]).get('courseInfo');
    }
    get subTournamentFileds() {
        return <FormArray>this.formArray.get([0]).get('subTournament');
    }

    get flightFileds() {
        return <FormArray>this.formArray.get([3]).get('flightInfo');
    }

    getCourseControl() {
        return this._formBuilder.group({
            courseName: ['', [Validators.required, RequireMatch]],
            matchFormat: [Constants.MF_STROKE_PLAY],
        });
    }

    addField() {
        const control = this.formArray.get([0]).get('courseInfo') as FormArray;
        control.push(this.getCourseControl());
    }

    deleteCourseInfo(index) {
        this.courseFileds.removeAt(index);
    }


    getSelectedPlayers(index, stepper: MatStepper) {
        //console.log(index);
        this.flightArrangementSetup();
        this.selectedMembers = [];
        this.assignedOpponents = new Set<string>();
        for (
            let i = 0;
            i < this.formArray.get([1]).get('category').value.length;
            i++
        ) {
            const person = {
                title: this.formArray.get([1]).get('category').value[i].name,
                Members: this.getFilteredCategory(
                    this.formArray.get([1]).get('category').value[i].name
                ),
            };

            if (typeof person.Members !== 'undefined') {
                this.selectedMembers.push(person);
            }
            //console.log(person);


            this.formArray.get([1]).get('category').value[i].playingDate =
                this.checkDate(
                    this.formArray.get([1]).get('category').value[i]
                );
        }
        if (index < this.formArray.get([1]).get('category').value.length - 1) {
            this.selectedIndex = ++index;
        } else {
            this.valid2.reset();
            stepper.next();
        }
        //console.log(this.selectedMembers);
    }

    getFC(event, category: any) {
        const selectedATP = this.atp.open();
        selectedATP.afterClose().subscribe((t) => {
            this.atpTime = t;
            //console.log(t);
            //console.log(category);
            this.getFilteredCategory(category);
        });
    }

    getFilteredCategory(PLcategory: any) {
        let selMembers: any[][] = [];

        let FilteredPL: Player[] = [];
        let flightTime: any = '9:00 AM';
        let flightTee: any = 'AMATEURS';
        let flightTeeID: any = '1';

        let cnter = 0;
        let lanter = 0;
        let outer = 0;

        let Pdate: any = this.datePipe.transform(
            this.formArray.get([0]).value.startDateFormCtrl,
            'dd-MM-yyyy'
        );
        //console.log(Pdate);
        //Pdate=Pdate.replace('-');

        if (
            this.formArray.get([0]).value.courseInfo[0].matchFormat == 'STROKE_PLAY'
        ) {
            FilteredPL = this.tournamentMembers.filter((a) => {
                return a.playerCategory == PLcategory;
            });
        } else {
            if (this.formArray.get([0]).value.courseInfo[0].matchFormat == matchFormat.TEXAS_SCRAMBLE) {
                this.showTexas = true;
            } else if (this.formArray.get([0]).value.courseInfo[0].matchFormat == matchFormat.MATCH_PLAY) {
                this.showMatchPlay = true;
            } else if (this.formArray.get([0]).value.courseInfo[0].matchFormat == matchFormat.BEST_THREE
                || this.formArray.get([0]).value.courseInfo[0].matchFormat == matchFormat.BEST_TWO) {
                this.showBest = true;
            }
            FilteredPL = [...this.tournamentMembers];
        }

        const FilteredFlight = this.formArray
            .get([1])
            .get('category')
            .value.filter((a) => {
                return a.name == PLcategory;
            });

        //console.log(FilteredFlight);
        //console.log(this.teamMembersToSave);

        if (FilteredFlight.length > 0) {
            let PperFlight = FilteredFlight[0].playersperFlight;
            FilteredPL.forEach((filteredPlayer: any) => {
                if (cnter == 0) selMembers[outer] = [];
            });
            //console.log(FilteredPL);

            for (let obj of FilteredPL) {
                if (this.showMatchPlay) {
                    // if (this.checkTeamMembers(this.teamMembersToSave, obj.id)) {
                    if (cnter == 0) selMembers[outer] = [];
                    selMembers[outer][cnter] = obj;
                    let oponentId = '';
                    oponentId = this.getSecondOpponent(this.selectedTeams, obj)
                    if (oponentId != '') {
                        const indexOf = FilteredPL.findIndex(player => player.id === oponentId);
                        selMembers[outer][++cnter] = FilteredPL[indexOf];
                        FilteredPL.splice(indexOf, 1)
                        if (cnter == parseInt(PperFlight) - 1) {
                            cnter = 0;
                            outer++;
                        } else {
                            cnter++;
                        }
                    }
                    // }
                } else if (!this.showShambles) {
                    if (cnter == 0) selMembers[outer] = [];
                    selMembers[outer][cnter] = obj;
                    if (cnter == parseInt(PperFlight) - 1) {
                        cnter = 0;
                        outer++;
                    } else {
                        cnter++;
                    }
                } else if (this.showShambles) {
                    if (cnter == 0 && lanter == 0) {
                        selMembers[outer] = [];
                        selMembers[outer][cnter] = [];
                        selMembers[outer][cnter]['PairName'] = obj.firstName + '/' + obj.lastName;
                    }
                    if (cnter == 0 && lanter !== 0) {
                        selMembers[outer][lanter] = [];
                        selMembers[outer][lanter]['PairName'] = obj.firstName + '/' + obj.lastName;
                    }
                    selMembers[outer][lanter].push(obj);
                    if (cnter == 1 && lanter == 0 && selMembers[outer].length != 2) {
                        cnter = 0;
                        //outer++;
                        lanter++;
                    } else if (selMembers[outer][lanter].length == 2) {
                        cnter = 0;
                        outer++;
                        lanter = 0;
                    } else {
                        cnter++;
                    }
                }
            }
            let tempSelMembers: any[] = [];
            for (const index in selMembers) {
                tempSelMembers = [];
                tempSelMembers = selMembers;
                tempSelMembers[index]['tee'] = flightTee;
                tempSelMembers[index]['tee_id'] = 1;
                tempSelMembers[index]['name'] = 'Team' + index;
                tempSelMembers[index]['time'] = this.atpTime
                    ? this.atpTime
                    : flightTime;
                selMembers = tempSelMembers;
            }
            //console.log(selMembers);

        }

        // }
        return selMembers;
    }

    getTeamColor(item) {
        for (const team of this.selectedTeams) {
            for (const member of team.members) {
                if (member.id === item.id) {
                    const style = {};
                    style['background-color'] = team.color;
                    return style;// Return the color of the team containing the member
                }
            }
        }
        return ''; // Return an empty string if the member is not found in any team
    }
    multiCourseChange(value) {
        if (value) {
            const control = this.formArray.get([0]).get('courses') as FormArray;
            control.clear();
            for (let i = 1; i <= Number(this.formArray.get([0]).value.numOfRounds); i++) {
                this.addCourseField(i);
            }
        }
        value ? this.showMultipleCourses = true : this.showMultipleCourses = false;
    }



    getNextFlighttee(k: number, index: number, category, flightData?) {
        let startingHoleOption: any;
        const FilteredFlight = this.formArray
            .get([1])
            .get('category')
            .value.filter((a) => {
                return a.name == category;
            });

        startingHoleOption = FilteredFlight[0].startingHole;

        if (startingHoleOption == '1') {
            flightData.tee = 1;
            return 1;
        } else if (startingHoleOption == '10') {
            flightData.tee = 10;
            return 10;
        } else if (startingHoleOption == '1_10') {
            if (index == 0 || index % 2 == 0) {
                flightData.tee = 1;
                return 1;
            } else {
                flightData.tee = 10;
                return 10;
            }
        } else if (startingHoleOption == 'shotgun') {
            if (index == 0) {
                flightData.tee = 1;
                return 1;
            }
            let startingHole: number = parseFloat(
                (<HTMLInputElement>(
                    document.getElementById(
                        'flight_' + k + '_' + (index - 1) + '_hole'
                    )
                )).value
            );

            if (startingHole == 18) {
                flightData.tee = 1;
                return 1;
            } else flightData.tee = startingHole + 1;
            return startingHole + 1;
        } else {
        }
    }

    trackByMethod(index: number, el: any): number {
        return el.id;
    }

    getNextFlightTime(k: number, index: number, category, flightData?) {
        const FilteredFlight = this.formArray
            .get([1])
            .get('category')
            .value.filter((a) => {
                return a.name == category;
            });
        // //console.log(FilteredFlight);

        // let startingHoleOption: any = this.formArray.get([0]).value.startDateFormCtrl;

        let makeInterval: boolean = true;

        if (FilteredFlight[0].startingHole == '1_10') {
            let tee = this.getNextFlighttee(k, index, category, flightData);

            if (tee == 1) makeInterval = true;
            else makeInterval = false;
        } else if (FilteredFlight[0].startingHole == '10') {
            let tee = this.getNextFlighttee(k, index, category, flightData);
            if (tee == 10) makeInterval = true;
            else makeInterval = false;
        } else if (FilteredFlight[0].startingHole == '1') {
            let tee = this.getNextFlighttee(k, index, category, flightData);
            if (tee == 1) makeInterval = true;
            else makeInterval = false;
        }
        ////console.log("2020-01-01 " + ((index == 0)? this.formArray.get([1]).value.flightStartTime : this.preFlightTime) + "");
        let dateNow: Date = new Date(
            Constants.DEFAULT_DATE +
            ' ' +
            (index == 0
                ? FilteredFlight[0].flightStartTime
                : this.preFlightTime) +
            ''
        );
        // //console.log(FilteredFlight[0].flightStartTime);

        let arrangements: string = FilteredFlight[0].arrangements;
        if (arrangements == '0') {
            makeInterval
                ? dateNow.setMinutes(
                    dateNow.getMinutes() +
                    (FilteredFlight[0].flightsInterval && index > 0
                        ? parseInt(FilteredFlight[0].flightsInterval)
                        : 0)
                )
                : '';
            // //console.log(dateNow);

            let h = dateNow.getHours();
            let m = dateNow.getMinutes();

            this.preFlightTime =
                ('0' + h).slice(-2) + ':' + ('0' + m).slice(-2);
        } else {
            makeInterval
                ? dateNow.setMinutes(
                    dateNow.getMinutes() -
                    (FilteredFlight[0].flightsInterval && index > 0
                        ? parseInt(FilteredFlight[0].flightsInterval)
                        : 0)
                )
                : '';
            // //console.log(dateNow);

            let h = dateNow.getHours();
            let m = dateNow.getMinutes();

            this.preFlightTime =
                ('0' + h).slice(-2) + ':' + ('0' + m).slice(-2);
            // //console.log(this.preFlightTime);
            flightData.time = this.preFlightTime;
            return this.preFlightTime;
        }
        flightData.time = this.preFlightTime;
        return this.preFlightTime;
    }

    tournamentSetup() {
        this.stepTitle = 'Tournament Setup Form';
    }

    public close() {
        this.showDates = false;
        //console.log('sd');
    }

    flightsSetup(stepper: MatStepper, action: string) {
        this.stepTitle = 'flights Setup Form';
        //this.saveTournamentMembers();
        //console.log(this.formArray.get([0]).value.courseInfo[0].matchFormat);
        if (
            this.formArray.get([0]).value.courseInfo[0].matchFormat == matchFormat.STROKE_PLAY
        ) {
            let sDate = new Date(
                this.formArray.get([0]).value.startDateFormCtrl
            );
            let dteday = this.datePipe.transform(sDate, 'yyyyMMdd');
            let date =
                dteday.substring(8, 6) +
                '-' +
                dteday.substring(6, 4) +
                '-' +
                +dteday.substring(0, 4);
            //console.log(this.formArray.get([0]).get('clubctgies').value);
            //console.log(date);

            if (!this.setupInitialized) {
                for (
                    let i = 0;
                    i < this.formArray.get([0]).get('clubctgies').value.length;
                    i++
                ) {
                    for (let obj of this.dates) {
                        if (
                            obj.playingDates['dates'] == date &&
                            this.formArray.get([0]).get('clubctgies').value[i]
                                .name == obj.name
                        ) {
                            this.addFlightField(
                                this.formArray.get([0]).get('clubctgies').value[
                                i
                                ]
                            );
                        }
                    }
                }
                //console.log(
                //     this.formArray.get([0]).get('clubctgies').value.length
                // );
            }
        } else if (this.formArray.get([0]).value.courseInfo[0].matchFormat !== matchFormat.MATCH_PLAY) {
            this.addFlightField('Teams');
        }

        // //console.log(this.formArray.get([1]).get('category'));
        if (action === 'next') stepper.next();
        else if (action === 'back') stepper.previous();
        else {
        }
        //this.router.navigate(["/tournaments/view/" + this.tournamentID]);
    }
    datechanged(event, t) {
        //console.log(event);
        //console.log(t);
    }

    tournamentMembersSetup() {
        //console.log(this.stepTitle);

        this.stepTitle = 'Select Tournament Members';
        this.syncClubMembers();
        this.syncTournamentMembers();
    }

    flightArrangementSetup() {
        this.stepTitle = 'flights Arrangement';
    }

    getGrossNetTop(selectedCTName, type) {
        if (
            selectedCTName.replace(/\s/g, '').toLowerCase() ==
            Constants.CATEGORY_AMATEURS.replace(/\s/g, '').toLowerCase()
        ) {
            if (type == 'GT') return +this.formArray.get([0]).value.amateursGT;
            else return +this.formArray.get([0]).value.amateursNT;
        } else if (
            selectedCTName.replace(/\s/g, '').toLowerCase() ==
            Constants.CATEGORY_SENIORS.replace(/\s/g, '').toLowerCase()
        ) {
            if (type == 'GT') return +this.formArray.get([0]).value.seniorsGT;
            else return +this.formArray.get([0]).value.seniorsNT;
        } else if (
            selectedCTName.replace(/\s/g, '').toLowerCase() ==
            Constants.CATEGORY_VETERANS.replace(/\s/g, '').toLowerCase()
        ) {
            if (type == 'GT') return +this.formArray.get([0]).value.veteransGT;
            else return +this.formArray.get([0]).value.veteransNT;
        } else if (
            selectedCTName.replace(/\s/g, '').toLowerCase() ==
            Constants.CATEGORY_JUNIORS.replace(/\s/g, '').toLowerCase()
        ) {
            if (type == 'GT') return +this.formArray.get([0]).value.juniorsGT;
            else return +this.formArray.get([0]).value.juniorsNT;
        } else if (
            selectedCTName.replace(/\s/g, '').toLowerCase() ==
            Constants.CATEGORY_LADIES.replace(/\s/g, '').toLowerCase()
        ) {
            if (type == 'GT') return +this.formArray.get([0]).value.ladiesGT;
            else return +this.formArray.get([0]).value.ladiesNT;
        } else if (
            selectedCTName.replace(/\s/g, '').toLowerCase() ==
            Constants.CATEGORY_PROFESSIONALS.replace(/\s/g, '').toLowerCase()
        ) {
            if (type == 'GT')
                return +this.formArray.get([0]).value.professionalsGT;
            else return +this.formArray.get([0]).value.professionalsNT;
        } else return 0;
    }

    getCourseHoleSetValue() {
        let selectedHoleSet = this.formArray
            .get([0])
            .get('courseHoleSet') as FormArray;
        //console.log(this.formArray.get([0]).get('courseHoleSet'));
        let courseHoleSet: number = 0;
        for (let a of selectedHoleSet.controls) {
            let option = this.courseHoleSetNames.filter((f) => {
                return f.name == a.value;
            });
            courseHoleSet += option[0].id;
        }

        return courseHoleSet;
    }

    getFlightTime(items: any) {
        let flightTime: string = '08:00';

        try {
            if (items.time) {
                let dateNow: Date = new Date(
                    Constants.DEFAULT_DATE + ' ' + items.time.substr(0, 5)
                );

                let h = dateNow.getHours();
                let m = dateNow.getMinutes();

                flightTime = ('0' + h).slice(-2) + ':' + ('0' + m).slice(-2);
            }
        } catch {
            flightTime = '08:00';
        }

        return flightTime;
    }

    async createTournament(stepper: MatStepper) {
        this.loggedInuser = this._localStorage.get(Constants.LOGGED_IN_USER);

        let tournamentCats: TournamentCategory[] = [];
        let tournamentRoundCourses: TournamentRoundCourses[] = [];

        let marshalsData: Marshal[] = [];

        //const tc:TournamenCategory = [];
        if (!this.tournamentID)
            this.tournamentID = UniqueIdGenerator.generate();

        if (this.showMultipleCourses) {
            if (this.formArray.get([0]).value.numOfRounds > 1) {
                for (let index in this.formArray.get([0]).value.courses) {
                    console.log(this.formArray.get([0]).value.courses[index]);
                    let course = this.formArray.get([0]).value.courses[index];
                    let courseHoleSet = course.courseHolSet?.split('_');

                    let obj: TournamentRoundCourses = {
                        round: course.round,
                        courseId: course?.courseName?.id ?? '',
                        courseHoleSets: courseHoleSet ? Number(courseHoleSet[0]) : 3,
                        inverted: courseHoleSet[1] == 'false' ? false : true,
                    }
                    tournamentRoundCourses.push(obj);
                }
            }

        }
        console.log(tournamentRoundCourses);

        for (let index in this.formArray.get([0]).value.clubctgies) {
            let TCdata: any;
            if (
                this.formArray
                    .get([0])
                    .value.clubctgies[index].name.replace(/\s/g, '')
                    .toLowerCase() ==
                Constants.CATEGORY_AMATEURS.replace(/\s/g, '').toLowerCase()
            ) {
                //this.TCdata.lowerLimitStart = 1;
                //this.TCdata.lowerLimitEnd = this.formArray.get([0]).value.prizeCategoryA;

                if (
                    this.formArray.get([0]).value.handicapCats &&
                    this.formArray.get([0]).value.prizeCategoryA != '' &&
                    this.formArray.get([0]).value.prizeCategoryB != ''
                ) {
                    TCdata = {
                        lowerLimitStart: 1,
                        lowerLimitEnd: this.formArray.get([0]).value
                            .handicapCats
                            ? this.formArray.get([0]).value.prizeCategoryA
                            : '',
                        upperLimitStart: this.formArray.get([0]).value
                            .handicapCats
                            ? this.formArray.get([0]).value.prizeCategoryB
                            : '',
                        upperLimitEnd: 18,
                    };
                }
            }

            let prizeInfo: any;

            if (
                this.formArray
                    .get([0])
                    .value.clubctgies[index].name.replace(/\s/g, '')
                    .toLowerCase() ==
                Constants.CATEGORY_PRO_AM.replace(/\s/g, '').toLowerCase()
            ) {
                if (this.formArray.get([0]).value.handicapRatio) {
                    prizeInfo = {
                        handicapratio: this.formArray.get([0]).value
                            .handicapRatio,
                    };
                }
            } else {
                if (
                    this.getGrossNetTop(
                        this.formArray.get([0]).value.clubctgies[index].name,
                        'GT'
                    ) ||
                    this.getGrossNetTop(
                        this.formArray.get([0]).value.clubctgies[index].name,
                        'NT'
                    )
                ) {
                    prizeInfo = {
                        noofgrosstop: this.getGrossNetTop(
                            this.formArray.get([0]).value.clubctgies[index]
                                .name,
                            'GT'
                        ),
                        noofnettop: this.getGrossNetTop(
                            this.formArray.get([0]).value.clubctgies[index]
                                .name,
                            'NT'
                        ), //,
                    };
                }
            }

            let tc: any = {
                id: UniqueIdGenerator.generate(),
                //tournamentId: this.tournamentID,
                category: this.formArray.get([0]).value.clubctgies[index].name,
                handicapLimits: TCdata ? TCdata : null,
                prizeInformation: prizeInfo ? prizeInfo : null,
                flightSettings: this.checkDate(
                    this.formArray.get([0]).value.clubctgies[index]
                ),
                default: true,
                //flightSettings: null,
            };

            tournamentCats.push(tc);
        }

        for (let i = 1; i <= this.formArray.get([0]).value.noofMarshals; i++) {
            let uniquePassword: string = passwordGenerator.generate();

            let mshl: any = {
                id: UniqueIdGenerator.generate(),
                //tournamentId: this.tournamentID,
                email:
                    this.formArray.get([0]).value.marshalStart +
                    (i + '').padStart(2, '0') +
                    '@gem.com',
                password: uniquePassword,
                dateValidTill: General.parseToDate(
                    this.formArray.get([0]).value.endDateFormCtrl
                ),
                firstHole: 1,
                lastHole: 18,
            };

            marshalsData.push(mshl);
        }

        let courseHoleSetsData = this.formArray.get([0]).value.courseHoleSet;
        let handicapAllocations = {
            handicapAllocation: this.formArray.get([0]).value
                .handicapAllocations,
        };
        //console.log(handicapAllocations);

        if (
            this.formArray.get([0]).value.courseInfo[0].matchFormat ==
            matchFormat.TEXAS_SCRAMBLE || this.formArray.get([0]).value.courseInfo[0].matchFormat ==
            matchFormat.TWO_BALL_SCRAMBLE || this.formArray.get([0]).value.courseInfo[0].matchFormat ==
            matchFormat.THREE_BALL_SCRAMBLE || this.formArray.get([0]).value.courseInfo[0].matchFormat ==
            matchFormat.FOUR_BALL_SCRAMBLE
        ) {
            this.showTexas = true;
        }
        if (this.formArray.get([0]).value.courseInfo[0].matchFormat ==
            matchFormat.SHAMBLES) {
            this.showShambles = true;
        }
        if (this.formArray.get([0]).value.courseInfo[0].matchFormat == matchFormat.MATCH_PLAY) {
            this.showMatchPlay = true;
        } else if (this.formArray.get([0]).value.courseInfo[0].matchFormat == matchFormat.BEST_THREE
            || this.formArray.get([0]).value.courseInfo[0].matchFormat == matchFormat.BEST_TWO) {
            this.showBest = true;
        }
        courseHoleSetsData.length > 0
            ? (courseHoleSetsData = courseHoleSetsData.split('_', 2))
            : (courseHoleSetsData = []);

        console.log(this.formArray);

        let tournament = {
            id: this.tournamentID, //(this.tournamentID)? this.tournamentID : UniqueIdGenerator.generate(),
            clubId:
                this.loggedInuser.userRole > 1
                    ? this.loggedInuser.adminClubId
                    : this.formArray.get([0]).value.clubsFormCtrl.id,
            leagueId: null,
            courseId: this.formArray.get([0]).value.courseInfo[0]?.courseName?.course?.id ?? this.formArray.get([0]).value.courses[0]?.courseName?.id,
            adminId: this.loggedInuser.id,
            title: this.formArray.get([0]).value.titleFormCtrl,
            prefix: this.formArray.get([0]).value.prefixFormCtrl,
            courseHoleSets:
                courseHoleSetsData.length > 0
                    ? Number(courseHoleSetsData[0])
                    : 0,
            teamMatch: this.formArray.get([0]).value.teamMatch == '1' ? false : true,
            pairsMatch: false,
            interLeague: false,
            playingOnWhs: false,
            publicTournament: false,
            confirmParticipants: this.formArray.get([0]).value.askConfirmation,
            noOfRounds: this.formArray.get([0]).value.numOfRounds,
            activeRound: 1,
            matchFormat: this.formArray.get([0]).value.courseInfo[0]
                .matchFormat,
            multiFormat:
                this.formArray.get([0]).value.courseInfo[0].multiFormat ==
                    'SINGLE'
                    ? false
                    : true,
            pointsFormats: null,
            subTournament: false,
            pointsValues: null,
            handicapAllocations: handicapAllocations,
            tee: 'AMATEURS',
            marshalsStartWith: this.formArray.get([0]).value.marshalStart,
            noOfMarshals: this.formArray.get([0]).value.noofMarshals,
            tee_id: 1,
            scoreManagement: this.formArray.get([0]).value.scoreManagement,
            startDate: General.parseToDate(
                this.formArray.get([0]).value.startDateFormCtrl
            ),
            endDate: General.parseToDate(
                this.formArray.get([0]).value.endDateFormCtrl
            ),
            flightsCategory: null,
            started: true,
            invited: false,
            singleRound: false,
            sponsorName: '',
            sponsorLogo: '',
            mobileLogoUrl: '',
            webLogoUrl: '',
            courseHoleSetsInverted:
                courseHoleSetsData.length > 0
                    ? courseHoleSetsData[1] == 'true'
                        ? true
                        : false
                    : false,
            categories: tournamentCats,
            createdAt: new Date().toISOString(),
            marshals: marshalsData,
            flights: [],
            members: [],
            tourId: this.loggedInuser.userRole == 4 ? this._localStorage.get(Constants.TOUR_ID) : null,
            tournament_round_courses: tournamentRoundCourses,
        };

        //console.log(tournament);

        let result = <any>(
            await this.facadeService.createTournamentMarshals(marshalsData)
        );

        if (this.formArray.get([0]).value.prefixFormCtrl) {
            let checkPrfix: any = [];
            checkPrfix = <Tournament>(
                await this.facadeService.checkPrefix(
                    this.formArray.get([0]).value.prefixFormCtrl
                )
            );

            //console.log(checkPrfix);

            if (checkPrfix.length > 0) {
                this.snackBar.open('Prefix already exist.', 'x', {
                    duration: 5000,
                });
            } else {
                let result = <any>(
                    await this.facadeService.addTournament(tournament)
                    // //console.log('a')
                );
                this.currentTournament = tournament;
                //console.log(result);
                if (result) {

                    // this.valid2.reset();
                    this.setState(this.valid1, false);
                    this.setState(this.valid2, false);

                    if (
                        this.showSubtournament == true
                    ) {
                        this.createSubtournament(this.tournamentID);
                    }
                    this.valid1.reset();
                    this.valid2.reset();
                    this.snackBar.open('Tournament has been created.', 'x', {
                        duration: 3000,
                    });
                    // this.valid2.reset();

                    if (this.formArray.get([0]).value.clubsFormCtrl) {
                        let selectedClubId: string =
                            this.loggedInuser.userRole > 1
                                ? this.loggedInuser.adminClubId
                                : this.formArray.get([0]).value.clubsFormCtrl
                                    .id;
                        this.clubMembers = [];
                        //console.log(selectedClubId);
                        //console.log(
                        //     this.formArray.get([0]).get('clubctgies').value
                        // );

                        if (this.loggedInuser.userRole == 4) {
                            selectedClubId = this._localStorage.get(Constants.TOUR_ID);
                            let clubMembersData: any =
                                await this.facadeService.getPlayersListByTour(
                                    selectedClubId
                                );

                            for (
                                let i = 0;
                                i < clubMembersData.tour_member.length;
                                i++
                            ) {
                                this.clubMembers.push(
                                    clubMembersData.tour_member[i].player
                                );
                            }
                        } else {
                            let clubMembersData: any =
                                await this.facadeService.getPlayerByClub(
                                    selectedClubId
                                );

                            for (
                                let i = 0;
                                i < clubMembersData.club_member.length;
                                i++
                            ) {
                                this.clubMembers.push(
                                    clubMembersData.club_member[i].player
                                );
                            }
                        }


                        //console.log(this.clubMembers);

                        this.syncClubMembers();

                        stepper.next();
                        console.log(this.clubMembers);

                        //this.dataSource = new MatTableDataSource(this.clubMembers);
                    } else {
                        alert('Select Club');
                    }
                }
                // if (result) {

                //   this.currentTournament = tournament;
                //   const dialogRef = this.dialog.open(DialogOverviewComponent, {
                //     width: "350px",
                //     data: "Do you want to Add Members Now ?",
                //   });
                //   dialogRef.afterClosed().subscribe((result) => {
                //     if (result) {
                //       this.snackBar.open("Tournament has been created.", "x", {
                //         duration: 5000,
                //       });
                //       this.router.navigate([
                //         "/tournaments/manage/" + this.tournamentID,
                //       ]);
                //     } else {
                //       this.snackBar.open("Tournament has been created.", "x", {
                //         duration: 5000,
                //       });
                //       this.router.navigate(["/tournaments/view/" + this.tournamentID]);
                //     }
                //   });

                //   this.reset();
                //   this.router.navigate(['/tournaments/view/' + this.tournamentID]);
                // }
            }
        }
    }

    async editTournaments(stepper: MatStepper) {
        this.loggedInuser = this._localStorage.get(Constants.LOGGED_IN_USER);
        let tournamentCats: TournamentCategory[] = [];

        let marshalsData: Marshal[] = [];
        for (let index in this.formArray.get([0]).value.clubctgies) {
            let TCdata: any;
            if (
                this.formArray
                    .get([0])
                    .value.clubctgies[index].name.replace(/\s/g, '')
                    .toLowerCase() ==
                Constants.CATEGORY_AMATEURS.replace(/\s/g, '').toLowerCase()
            ) {
                //this.TCdata.lowerLimitStart = 1;
                //this.TCdata.lowerLimitEnd = this.formArray.get([0]).value.prizeCategoryA;

                if (this.formArray.get([0]).value.handicapCats) {
                    TCdata = {
                        lowerLimitStart: 1,
                        lowerLimitEnd: this.formArray.get([0]).value
                            .handicapCats
                            ? this.formArray.get([0]).value.prizeCategoryA
                            : '',
                        upperLimitStart: this.formArray.get([0]).value
                            .handicapCats
                            ? this.formArray.get([0]).value.prizeCategoryB
                            : '',
                        upperLimitEnd: 18,
                    };
                }
            }

            let prizeInfo: any;

            if (
                this.formArray
                    .get([0])
                    .value.clubctgies[index].name.replace(/\s/g, '')
                    .toLowerCase() ==
                Constants.CATEGORY_PRO_AM.replace(/\s/g, '').toLowerCase()
            ) {
                if (this.formArray.get([0]).value.handicapRatio) {
                    prizeInfo = {
                        handicapratio: this.formArray.get([0]).value
                            .handicapRatio,
                    };
                }
            } else {
                if (
                    this.getGrossNetTop(
                        this.formArray.get([0]).value.clubctgies[index].name,
                        'GT'
                    ) ||
                    this.getGrossNetTop(
                        this.formArray.get([0]).value.clubctgies[index].name,
                        'NT'
                    )
                ) {
                    prizeInfo = {
                        noofgrosstop: this.getGrossNetTop(
                            this.formArray.get([0]).value.clubctgies[index]
                                .name,
                            'GT'
                        ),
                        noofnettop: this.getGrossNetTop(
                            this.formArray.get([0]).value.clubctgies[index]
                                .name,
                            'NT'
                        ), //,
                    };
                }
            }

            let tc: any = {
                id: this.tournamentID
                    ? this.checkCatToUpdate(
                        this.formArray.get([0]).value.clubctgies[index].name,
                        true
                    )
                    : UniqueIdGenerator.generate(),
                tournamentId: this.tournamentID,
                category: this.formArray.get([0]).value.clubctgies[index].name,
                handicapLimits: TCdata ? TCdata : null,
                prizeInformation: prizeInfo ? prizeInfo : null,
                flightSettings: this.checkDate(
                    this.formArray.get([0]).value.clubctgies[index]
                ),
                default: true,
                //flightSettings: null,
            };
            //console.log(tc);
            // let json= JSON.stringify(tc.flightSettings);

            // tc["flightSettings"]=json;
            //console.log(tc);
            tournamentCats.push(tc);
            //console.log(tournamentCats);
        }
        if (
            this.formArray.get([0]).value.courseInfo[0].matchFormat ==
            matchFormat.TEXAS_SCRAMBLE || this.formArray.get([0]).value.courseInfo[0].matchFormat ==
            matchFormat.TWO_BALL_SCRAMBLE || this.formArray.get([0]).value.courseInfo[0].matchFormat ==
            matchFormat.THREE_BALL_SCRAMBLE || this.formArray.get([0]).value.courseInfo[0].matchFormat ==
            matchFormat.FOUR_BALL_SCRAMBLE

        ) {
            this.showTexas = true;
        }
        if (this.formArray.get([0]).value.courseInfo[0].matchFormat ==
            matchFormat.SHAMBLES) {
            this.showShambles = true;
        }
        for (let i = 1; i <= this.formArray.get([0]).value.noofMarshals; i++) {
            let uniquePassword: string = passwordGenerator.generate();

            let mshl: any = {
                id: UniqueIdGenerator.generate(),
                tournamentId: this.tournamentID,
                email:
                    this.formArray.get([0]).value.marshalStart +
                    (i + '').padStart(2, '0') +
                    '@gem.com',
                password: uniquePassword,
                dateValidTill: General.parseToDate(
                    this.formArray.get([0]).value.endDateFormCtrl
                ),
                firstHole: 1,
                lastHole: 18,
            };

            marshalsData.push(mshl);
        }

        let courseHoleSetsData = this.formArray.get([0]).value.courseHoleSet;

        courseHoleSetsData.length > 0
            ? (courseHoleSetsData = courseHoleSetsData.split('_', 2))
            : (courseHoleSetsData = []);
        let handicapAllocations = {
            handicapAllocation: this.formArray.get([0]).value
                .handicapAllocations,
        };
        let tournament = {
            id: this.tournamentID,
            clubId:
                this.loggedInuser.userRole > 1
                    ? this.loggedInuser.adminClubId
                    : this.formArray.get([0]).value.clubsFormCtrl.id,
            leagueId: null,
            courseId:
                this.loggedInuser.userRole > 1 &&
                    this.currentTournament &&
                    this.courseChange == true
                    ? this.formArray.get([0]).value.courseInfo[0].courseName
                        .course.id
                    : this.currentTournament['CourseQL'].id,
            adminId: this.loggedInuser.id,
            title: this.formArray.get([0]).value.titleFormCtrl,
            prefix: this.formArray.get([0]).value.prefixFormCtrl,
            courseHoleSets:
                courseHoleSetsData.length > 0
                    ? Number(courseHoleSetsData[0])
                    : 0,
            teamMatch: this.formArray.get([0]).value.courseInfo[0].teamMatch == '1' ? false : true,
            pairsMatch: false,
            interLeague: false,
            playingOnWhs: false,
            publicTournament: false,
            confirmParticipants: this.formArray.get([0]).value.askConfirmation,
            noOfRounds: this.formArray.get([0]).value.numOfRounds,
            activeRound: 1,
            matchFormat: this.formArray.get([0]).value.courseInfo[0]
                .matchFormat,
            multiFormat:
                this.formArray.get([0]).value.courseInfo[0].multiFormat ==
                    'SINGLE'
                    ? false
                    : true,
            pointsFormats: null,
            pointsValues: null,
            handicapAllocations: handicapAllocations,
            tee: 'AMATEURS',
            tee_id: 1,
            scoreManagement: this.formArray.get([0]).value.scoreManagement,
            marshalsStartWith: this.formArray.get([0]).value.marshalStart,
            noOfMarshals: this.formArray.get([0]).value.noofMarshals,
            startDate: General.parseToDate(
                this.formArray.get([0]).value.startDateFormCtrl
            ),
            endDate: General.parseToDate(
                this.formArray.get([0]).value.endDateFormCtrl
            ),
            flightsCategory: null,
            started: true,
            invited: false,
            singleRound: false,
            sponsorName: '',
            sponsorLogo: '',
            mobileLogoUrl: '',
            webLogoUrl: '',
            courseHoleSetsInverted:
                courseHoleSetsData.length > 0
                    ? courseHoleSetsData[1] == 'true'
                        ? true
                        : false
                    : false,
        };
        //console.log(tournament);
        //console.log(tournamentCats);
        //console.log(marshalsData);

        let result = <boolean>(
            await this.facadeService.editTournament(
                tournament,
                tournamentCats,
                marshalsData
            )
        );
        if (result) {
            this.snackBar.open('Tournament has been updated.', 'x', {
                duration: 5000,
            });
            stepper.next();
            //this.router.navigate(['/tournaments/view/' + this.tournamentID]);
        } else {
            this.snackBar.open('Error! Try Again later.', 'x', {
                duration: 5000,
            });
        }
    }

    syncTournamentMembers() {
        of(this.tournamentMembers)
            .pipe()
            .subscribe(
                (data) => {
                    this.isLoading = false;
                    //console.log(this.tournamentMembers);
                    // this.tournamentMembers.forEach(
                    //   (obj, i) => (obj["fullName"] = obj.firstName + " " + obj.lastName)
                    // );
                    this.membersSource = new MatTableDataSource(
                        this.tournamentMembers
                    );
                    this.membersSource.sort = this.Memsort;
                    this.membersSource.paginator = this.Mempaginator;

                    this.updateTMCategorySelection();
                },
                (error) => (this.isLoading = false)
            );
    }

    async saveTournamentMembers(stepper: MatStepper, team: boolean) {
        let tournamentMember: TournamentMember[] = [];
        let counter: number;
        let DelplayerIndex: any;
        let DelplayerInfo: any;
        let selectionArray = Object.assign({}, this.selection.selected);

        for (let index in selectionArray) {
            if (selectionArray[index]) {
                let founded = this.tournamentMembers.filter((a) => {
                    return a.id == selectionArray[index].id;
                });

                if (founded.length == 0)
                    this.tournamentMembers.push(selectionArray[index]);

                let member: any = {
                    tournamentId: this.tournamentID,
                    playerId: selectionArray[index].id,
                    status: true,
                };
                if (this.showSubtournament) {
                    let member: any = {
                        tournamentId: this.subTournamentID,
                        playerId: selectionArray[index].id,
                        status: true,
                    };
                    tournamentMember.push(member);
                }
                tournamentMember.push(member);
                counter = parseInt(index) + 1;
                //console.log(counter);

                //console.log(selectionArray);
            }
        }
        this.showCategory = false;
        ////console.log(this.categoryCounts[0]);

        //this.categoryCounts[0].value = this.categoryCounts[0].value - counter;
        ////console.log(this.categoryCounts[0].value);

        //console.log(tournamentMember);

        let result = <any>(
            await this.facadeService.insertTournamentMember(tournamentMember)
        );

        if (result && team) {
            const dialogRef = this.dialog.open(DialogOverviewComponent, {
                width: '350px',
                data: 'Do you want to add more members?',
            });
            dialogRef.afterClosed().subscribe((resultA) => {
                if (!resultA) {
                    const control = this.formArray.get([1]).get('category') as FormArray;

                    //console.log(control.length);

                    control.clear();
                    if (
                        this.formArray.get([0]).value.courseInfo[0]
                            .matchFormat == matchFormat.STROKE_PLAY
                    ) {

                        let sDate = new Date(
                            this.formArray.get([0]).value.startDateFormCtrl
                        );
                        let dteday = this.datePipe.transform(sDate, 'yyyyMMdd');
                        let date =
                            dteday.substring(8, 6) +
                            '-' +
                            dteday.substring(6, 4) +
                            '-' +
                            +dteday.substring(0, 4);
                        //console.log(date);

                        for (
                            let i = 0;
                            i <
                            this.formArray.get([0]).get('clubctgies').value
                                .length;
                            i++
                        ) {
                            for (let obj of this.dates) {
                                if (
                                    obj.playingDates['dates'] == date &&
                                    this.formArray
                                        .get([0])
                                        .get('clubctgies').value[i].name ==
                                    obj.name
                                ) {
                                    this.addFlightField(
                                        this.formArray
                                            .get([0])

                                            .get('clubctgies').value[i]
                                    );

                                }
                            }
                        }
                        this.setupInitialized = true;

                    } else if (this.formArray.get([0]).value.courseInfo[0]
                        .matchFormat != matchFormat.MATCH_PLAY) {
                        this.addFlightField('Teams');
                    }

                    stepper.next();
                }
            });
            this.snackBar.open('Tournament members have been saved.', 'x', {
                duration: 5000,
            });
            this.valid1.reset();
            this.syncTournamentMembers();
            this.syncClubMembers();
            this.categoryCounts = [];

            // //console.log(
            //     this.formArray.get([0]).get('clubctgies').value.length
            // );
            // for (
            //     let i = 0;
            //     i < this.formArray.get([0]).get('clubctgies').value.length;
            //     i++
            // ) {
            //     this.addplayingDate(i);
            // }

            //}
        } else if (result && !team) {
            this.snackBar.open('Team members have been saved.', 'x', {
                duration: 5000,
            });
            this.valid1.reset();
            this.syncTournamentMembers();
            this.syncClubMembers();
            this.categoryCounts = [];
        }
    }
    async saveTournamentTeams(stepper: MatStepper, team: boolean) {
        let tournamentMember: TeamMembers[] = [];
        let counter: number;
        let DelplayerIndex: any;
        let DelplayerInfo: any;
        this.teamMembersToSave = [];
        let teamsToSave: Team[] = [];
        let teamsMembersToRemove: any[] = [];
        // let selectionArray = Object.assign({}, this.selection.selected);
        let flag: boolean = true;
        // if (this.selectedTeams1[0].length !== this.selectedTeams2[0].length) {
        //     this.snackBar.open('Teams Members are not equal.', 'x', {
        //         duration: 2000,
        //     });
        //     return;
        // }
        this.selectedTeams.forEach((team, index) => {
            tournamentMember = [];
            let name: string = (<HTMLInputElement>(
                document.getElementById(
                    'team_' + index + '_name'
                )
            )).value;

            let color: string = (<HTMLInputElement>(
                document.getElementById(
                    'team_' + index + '_color'
                )
            )).value;
            team['name'] = name;
            team['color'] = color;
            teamsMembersToRemove.push(team.id);
            team.members.forEach((mem) => {
                let member: any = {
                    playerId: mem.id,
                }
                tournamentMember.push(member);
            })
            let teams: any = {
                id: team.id,
                tournamentId: this.tournamentID,
                adminId: this.loggedInuser.id,
                name: name,
                color: color,
                membersQL: {
                    data: tournamentMember,
                },
            }
            teamsToSave.push(teams);
        })
        //console.log(teamsToSave);
        // //console.log(this.teamMembersToSave);
        let result = <any>(
            await this.facadeService.insertTournamentTeam(teamsToSave, this.tournamentID, teamsMembersToRemove)
        );

        if (result) {
            if (
                this.formArray.get([0]).value.courseInfo[0].matchFormat === matchFormat.STROKE_PLAY
            ) {

                let sDate = new Date(
                    this.formArray.get([0]).value.startDateFormCtrl
                );
                let dteday = this.datePipe.transform(sDate, 'yyyyMMdd');
                let date =
                    dteday.substring(8, 6) +
                    '-' +
                    dteday.substring(6, 4) +
                    '-' +
                    +dteday.substring(0, 4);
                // //console.log(date);
                if (!this.setupInitialized) {
                    for (
                        let i = 0;
                        i <
                        this.formArray.get([0]).get('clubctgies').value
                            .length;
                        i++
                    ) {
                        for (let obj of this.dates) {
                            if (
                                obj.playingDates['dates'] == date &&
                                this.formArray
                                    .get([0])
                                    .get('clubctgies').value[i].name ==
                                obj.name
                            ) {
                                this.addFlightField(
                                    this.formArray
                                        .get([0])
                                        .get('clubctgies').value[i]
                                );
                            }
                        }
                    }
                    this.setupInitialized = true;
                }
            } else {
                const control = this.formArray.get([1]).get('category') as FormArray;

                //console.log(control.length);

                control.clear();
                this.addFlightField('Teams');
            }
            this.snackBar.open('Tournament Teams have been saved.', 'x', {
                duration: 2000,
            });
            stepper.next();
        } else {
            this.snackBar.open('Error!.Try Again', 'x', {
                duration: 2000,
            });
        }


        this.valid1.reset();
        this.syncTournamentMembers();
        this.syncClubMembers();
        this.categoryCounts = [];
    }
    addTeam(index) {
        const randomColor = General.generateRandomColor();
        this.selectedTeams.push({
            id: UniqueIdGenerator.generate(),
            name: '',
            color: randomColor,
            members: []
        });
        // //console.log(this.selectedTeams);

    }
    onColorChange(event: Event, id: any) {
        const inputElement = event.target as HTMLInputElement;
        const teamToUpdate = this.selectedTeams.find(t => t.id === id);
        if (teamToUpdate) {
            teamToUpdate.color = inputElement.value;
        }
    }

    editTeam(teamId, index) {
        //console.log(index);
        try {
            this.logger.log('Add New member to Team', "info", teamId);

            let TM = [];
            for (let obj of this.tournamentMembers) {
                let play = {
                    id: obj.id,
                    firstName: obj.firstName,
                    lastName: obj.lastName,
                    handicap: obj.handicap,
                    playerCategory: obj.playerCategory,
                    membershipNumber: obj.membershipNumber,
                    email: obj.email,
                }
                TM.push(play);
            }

            const dialogRef = this.dialog.open(DialogAddMemberComponent, {
                data: {
                    id: teamId,
                    members: TM,
                },
            });

            dialogRef.afterClosed().subscribe((result) => {
                //console.log(result);
                if (result.length > 0) {
                    let playerAdded = false; // Flag to track if the player has been added to a team
                    for (let obj of result) {
                        for (let team of this.selectedTeams) {
                            const isPlayerPresent = team.members.some(member => member.id === obj.id);
                            if (isPlayerPresent) {
                                playerAdded = true;
                            }
                        }
                        if (!playerAdded) {
                            const teamToUpdate = this.selectedTeams.find(t => t.id === teamId);
                            if (teamToUpdate) {
                                teamToUpdate.members.push(obj);
                            }
                        }
                    }
                    if (playerAdded) {
                        // Show a message if the player is already present in all teams
                        this.snackBar.open('Player already exists in teams.', 'x', {
                            duration: 2000,
                        });
                    }
                }

            });
        } catch (error) {
            this.logger.log('Getting Tournaments DataAdd New member to flight Failed', "error", error.toString());
        }
    }
    async getFormData(stepper: MatStepper, action: string) {
        // let courseHoleSetValue = this.getCourseHoleSetValue();
        // let validateValue: boolean = false;

        // if(courseHoleSetValue == 0 || courseHoleSetValue == 3 || courseHoleSetValue == 9 || courseHoleSetValue == 12)
        //   validateValue = true;
        // else {
        //   alert("You must select a valid 18 holes combination.");
        //   return validateValue;
        // }
        // //console.log(this.formArray.get([0]).get('clubctgies').value);
        this.tournamentMembersSetup();
        // if (!this.currentTournament && action != "back") {
        //  this.createTournament();
        // } else if(action != "back") {
        //   // //console.log(this.formArray.get([0]).value.prefixFormCtrl);
        //   // //console.log(this.formArray.get([0]).value.titleFormCtrl);
        //   // //console.log(this.formGroup.value["formArray"]);
        //   // //console.log(this.formGroup.get("formArray"));

        //   //console.log(this.formArray.get("formArray"));
        //   //this.editTournaments();
        // }

        if (action === 'next') stepper.next();
        else if (action === 'back') stepper.previous();
        else {
        }

        if (this.formArray.get([0]).value.clubsFormCtrl) {
            let selectedClubId: string =
                this.loggedInuser.userRole > 1
                    ? this.loggedInuser.adminClubId
                    : this.formArray.get([0]).value.clubsFormCtrl.id;
            this.clubMembers = [];
            // //console.log(selectedClubId);
            // //console.log(this.formArray.get([0]).get('clubctgies').value);

            let clubMembersData: any = await this.facadeService.getPlayerByClub(
                selectedClubId
            );

            for (let i = 0; i < clubMembersData.club_member.length; i++) {
                this.clubMembers.push(clubMembersData.club_member[i].player);
            }

            // //console.log(this.clubMembers);

            this.syncClubMembers();

            ////console.log(this.clubMembers);

            //this.dataSource = new MatTableDataSource(this.clubMembers);
        } else {
            alert('Select Club');
        }

        // this.tournamentMembersSetup();

        // //console.log(this.formArray.get([1]).value.category);

        // if (this.formArray.get([0]).value.clubsFormCtrl) {
        //   let selectedClubId: string = (this.loggedInuser.userRole > 1) ? this.loggedInuser.adminClubId : this.formArray.get([0]).value.clubsFormCtrl.id;
        //   this.clubMembers = [];
        //   //console.log(selectedClubId);
        //   let clubMembersData: any = await this.facadeService.getPlayerByClub(selectedClubId);

        //   for (let i = 0; i < clubMembersData.length; i++) {
        //     this.clubMembers.push(clubMembersData[i].player);
        //   }

        //   this.syncClubMembers();
        //   ////console.log(this.clubMembers);

        //   //this.dataSource = new MatTableDataSource(this.clubMembers);
        // }
    }

    syncClubMembers() {
        of(this.clubMembers)
            .pipe()
            .subscribe(
                (data) => {
                    this.isLoading = false;
                    // //console.log(this.clubMembers);

                    this.clubMembers = this.clubMembers.filter(
                        (ar) =>
                            !this.tournamentMembers.find(
                                (rm) => rm.id === ar.id
                            )
                    );
                    // //console.log(this.clubMembers);

                    this.dataSource = new MatTableDataSource(this.clubMembers);
                    this.dataSource.sort = this.sort;
                    this.dataSource.paginator = this.paginator;
                },
                (error) => (this.isLoading = false)
            );
    }
    getSecondOpponent(teams: any[], player: any): string {
        for (const team of teams) {
            const isPlayerInTeam = team.members.some(member => member.id === player.id);
            if (!isPlayerInTeam) { // Check if the player is not in this team
                for (const member of team.members) {
                    if (member.id !== player.id && !this.assignedOpponents.has(member.id)) {
                        this.assignedOpponents.add(member.id); // Mark this member as assigned
                        return member.id; // Return the ID of the first member that is not the current player
                    }
                }
            }
        }
        return ''; // Return empty string if no available opponent is found
    }

    checkTeamMembers(teamMembersToSave, playerId): boolean {

        for (let data of teamMembersToSave) {
            if (data.team1MemberId == playerId) {
                return true;
            } else if (data.team2MemberId == playerId) {
                return true;
            }
        }
        return true;
    }

    applyFilter(filterValue: string) {
        filterValue = filterValue.trim(); // Remove whitespace
        filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
        // //console.log(this.dataSource);
        this.dataSource.filter = filterValue;

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    applyMembersFilter(filterValue: string) {
        filterValue = filterValue.trim(); // Remove whitespace
        filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
        // //console.log(this.membersSource);
        this.membersSource.filter = filterValue;

        if (this.membersSource.paginator) {
            this.membersSource.paginator.firstPage();
        }
    }

    async createFlights() {
        this.loggedInuser = this._localStorage.get(Constants.LOGGED_IN_USER);
        let tournamentFlights: Flight[] = [];
        let tournamentMember: TournamentMember[] = [];
        let flightName: any[] = [];
        let fcnter = 0;
        let ind: number = 0;

        let tournamentFlightMembers: FlightMembers[];
        let tournamentPairs: any[];
        let tournamentTeamOpponents: any[] = [];

        if (this.currentTournament)
            this.tournamentID = this.currentTournament.id;
        for (let index in this.selectedMembers) {
            let counter: number = 0;

            tournamentFlightMembers = [];
            tournamentPairs = [];
            const FilteredFlight = this.formArray
                .get([1])
                .get('category')
                .value.filter((a) => {
                    return a.name == this.selectedMembers[index].title;
                });

            // //console.log(FilteredFlight);
            // //console.log(this.selectedMembers);

            for (let index2 in this.selectedMembers[index]) {
                if (index2 != 'title') {

                    for (var index3 in this.selectedMembers[index][index2]) {
                        tournamentPairs = [];
                        ind = 0;
                        for (var index4 in this.selectedMembers[index][index2][index3]) {

                            if (this.formArray.get([0]).value.courseInfo[0].matchFormat == matchFormat.SHAMBLES) {
                                if (Number.isInteger(Number(index4))) {
                                    let pair = {
                                        id: UniqueIdGenerator.generate(),
                                        tournamentId: this.tournamentID,
                                        pairName: this.selectedMembers[index][index2][index3][index4].PairName,
                                        member1Id: this.selectedMembers[index][index2][index3][index4][0].id,
                                        member2Id: this.selectedMembers[index][index2][index3][index4][1].id,
                                    }
                                    tournamentPairs.push(pair);
                                    for (var index5 in this.selectedMembers[index][index2][index3][index4]) {
                                        if (Number.isInteger(Number(index5))) {
                                            //console.log(this.selectedMembers[index][index2][index3][index4][index5].playerCategory);

                                            let roundTeeId: any = General.getPlayersTe(
                                                this.selectedMembers[index][index2][index3][index4][index5].playerCategory
                                            );
                                            //console.log(roundTeeId.id);
                                            let FM: any = {
                                                playerId:
                                                    this.selectedMembers[index][index2][index3][index4][index5].id,
                                                attendance: false,
                                                playingTee: roundTeeId.result,
                                                tee_id: roundTeeId.id,
                                            };
                                            //console.log(FM);
                                            tournamentFlightMembers.push(FM);
                                        }
                                    }
                                }
                            } else if (this.formArray.get([0]).value.courseInfo[0].matchFormat == matchFormat.MATCH_PLAY) {
                                if (Number.isInteger(Number(index4))) {
                                    if (ind % 2 == 0) {
                                        let newIndex = Number(index4) + 1;
                                        let teamOpponent = {
                                            id: UniqueIdGenerator.generate(),
                                            team1Id: this.selectedTeams[0]['id'],
                                            team2Id: this.selectedTeams[1]['id'],
                                            team1MemberId: this.selectedMembers[index][index2][index3][index4].id,
                                            team2MemberId: this.selectedMembers[index][index2][index3][newIndex].id,
                                            tournamentId: this.tournamentID,
                                        }
                                        tournamentTeamOpponents.push(teamOpponent);
                                    }
                                    ind++;
                                    if (Number.isInteger(Number(index4))) {


                                        let roundTeeId: any = General.getPlayersTe(
                                            this.selectedMembers[index][index2][index3][
                                                index4
                                            ].playerCategory
                                        );

                                        let FM: any = {
                                            playerId:
                                                this.selectedMembers[index][index2][
                                                    index3
                                                ][index4].id,
                                            attendance: false,
                                            playingTee: roundTeeId.result,
                                            tee_id: roundTeeId.id,
                                        };

                                        tournamentFlightMembers.push(FM);
                                    }
                                }
                            } else {
                                if (Number.isInteger(Number(index4))) {

                                    let roundTeeId: any = General.getPlayersTe(
                                        this.selectedMembers[index][index2][index3][
                                            index4
                                        ].playerCategory
                                    );
                                    let FM: any = {
                                        playerId:
                                            this.selectedMembers[index][index2][
                                                index3
                                            ][index4].id,
                                        attendance: false,
                                        playingTee: roundTeeId.result,
                                        tee_id: roundTeeId.id,
                                    };

                                    tournamentFlightMembers.push(FM);
                                }
                            }
                        }
                        let roundTeeId1: any = General.getPlayersTees(
                            tournamentFlightMembers[0].playingTee
                        );
                        if (tournamentFlightMembers.length > 0) {
                            // //console.log(tournamentFlightMembers);
                            fcnter++;
                            let flight: any = {
                                id: UniqueIdGenerator.generate(),
                                tournamentId: this.tournamentID,
                                courseId: this.currentTournament.courseId,
                                adminId: this.loggedInuser.id,
                                courseHoleSets: this.currentTournament
                                    .courseHoleSets
                                    ? this.currentTournament.courseHoleSets
                                    : 3,
                                flightNo: fcnter,
                                flightRound: 1,
                                categoryRound: 1,
                                tee_id: roundTeeId1.id,
                                startingHole:
                                    this.selectedMembers[index][index2][index3]
                                        .tee,
                                tee: roundTeeId1.name,
                                category: this.selectedMembers[index].title,
                                date: General.parseToDate(
                                    this.formArray.get([0]).value
                                        .startDateFormCtrl
                                ),
                                time: this.selectedMembers[index][index2][
                                    index3
                                ].time,
                                ended: false,
                                courseHoleSetsInverted: this.currentTournament
                                    .courseHoleSetsInverted
                                    ? this.currentTournament
                                        .courseHoleSetsInverted
                                    : false,
                                members: {
                                    data: tournamentFlightMembers,
                                },
                                pairs: {
                                    data: tournamentPairs,
                                },
                                team: {
                                    data: tournamentTeamOpponents,
                                }
                            };
                            tournamentTeamOpponents = [];
                            if (this.showTexas) {
                                let name: string = (<HTMLInputElement>(
                                    document.getElementById(
                                        'flight_' + counter + '_name'
                                    )
                                )).value;
                                //console.log(name);

                                let flightNames: any = {
                                    flightId: flight.id,
                                    name: name,
                                };

                                flightName.push(flightNames);
                            }
                            counter = counter + 1;

                            //console.log(flight);
                            tournamentFlights.push(flight);
                            //console.log(tournamentFlights);
                            tournamentFlightMembers = [];

                            //break;
                        }

                    }
                }
            }
        }

        let result = <any>(
            await this.facadeService.createNextRoundFlights(tournamentFlights)
        );
        if (this.showTexas == true) {
            await this.facadeService.addFlightName(flightName);
        }

        if (result) {
            this.snackBar.open('Tournament has been setup.', 'x', {
                duration: 5000,
            });
            this.reset();
            this.router.navigate(['/tournaments/view/' + this.tournamentID]);
        }
    }
    removeTeamPlayer(playerId: string, teamId: string) {
        // Find the team with the given ID
        const teamToUpdate = this.selectedTeams.find(team => team.id === teamId);

        // Check if the team is found
        if (teamToUpdate) {
            // Filter out the player to be removed from the team's members array
            teamToUpdate.members = teamToUpdate.members.filter(member => member.id !== playerId);
        } else {
            // Handle the case where the team with the given ID is not found
            //console.log('Team not found');
        }
    }

    deleteTeam(teamId) {
        this.selectedTeams = this.selectedTeams.filter((team) => team.id !== teamId)
    }

    removePlayer(playerId: string) {

        //console.log(playerId);
        //console.log(this.tournamentMembers);
        let data: any = this.tournamentMembers;
        //console.log(data);
        let DelplayerIndex: any = data.findIndex((a) => {
            return a.id == playerId;
        });
        //console.log(DelplayerIndex);

        let DelplayerInfo: any = data.filter((a) => {
            return a.id == playerId;
        });
        //console.log(DelplayerInfo);

        ////console.log(flight + "<- ->" + player);
        const dialogRef = this.dialog.open(DialogOverviewComponent, {
            width: '350px',
            data: 'Do you want to remove this player from group?',
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                ////console.log("record deleted.");
                data.splice(DelplayerIndex, 1);
                //data.splice(playerId, 1);
                this.clubMembers.splice(0, 0, DelplayerInfo[0]);

                //console.log(this.selection);

                this.tournamentMembers = data;
                this.selection.clear();
                this.syncClubMembers();
                this.syncTournamentMembers();

                this.facadeService.deleteTournamentMember(
                    this.tournamentID,
                    playerId
                );
            } else {
                ////console.log("cancel delete action");
            }
        });
    }
    roundChange(event) {
        this.multiCourse = Number(event.value) > 1;
    }
    movePlayer(flight: number, cplayer: number) {
        ////console.log(flight + "<- ->" + player);
        let player: Player = this.selectedMembers[flight][cplayer];
        const dialogRef = this.dialog.open(DialogMoveFlightComponent, {
            width: '350px',
            panelClass: 'transparent',
            disableClose: true,
            data: {
                flights: this.selectedMembers.length,
                name: player.firstName + ' ' + player.lastName,
            },
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                ////console.log(result);
                //let player: Player = this.selectedMembers[flight][cplayer];
                ////console.log(player);
                this.selectedMembers[flight].splice(cplayer, 1);
                ////console.log(this.selectedMembers);
                this.selectedMembers[result - 1].splice(
                    this.selectedMembers[result - 1].length - 3,
                    0,
                    player
                );
            } else {
                ////console.log("cancel delete action");
            }
        });
    }

    public reset() {
        this.formGroup.reset();
    }

    /** Whether the number of selected elements matches the total number of rows. */
    isAllSelected() {
        ////console.log(this.dataSource);
        if (this.dataSource) {
            const numSelected = this.selection.selected.length;
            const numRows = this.dataSource.data.length;
            return numSelected === numRows;
        }
    }
    // /** The label for the checkbox on the passed row */
    checkboxLabel(row?: Player): string {
        if (!row) {
            return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
        }
        return `${this.selection.isSelected(row) ? 'deselect' : 'select'
            } player ${row.firstName} ${row.lastName}`;
    }

    addFlight() {
        ////console.log(this.selectedMembers.length);
        this.selectedMembers[this.selectedMembers.length] = [];
        this.selectedMembers[this.selectedMembers.length - 1]['id'] =
            UniqueIdGenerator.generate();
        this.selectedMembers[this.selectedMembers.length - 1]['time'] = '09:00';
        this.selectedMembers[this.selectedMembers.length - 1]['startingHole'] =
            '1';
        ////console.log(this.selectedMembers.length);
        //this.selectedMembers[this.selectedMembers.length - 1].push(player);
        ////console.log(this.selectedMembers);
    }

    addFlightPlayer() {
        const dialogRef = this.dialog.open(DialogPlayerComponent, {
            width: '350px',
            data: { flights: this.selectedMembers.length },
        });

        dialogRef.afterClosed().subscribe((result) => {
            //console.log(result);
            if (result) {
                ////console.log("record deleted.");
                //console.log(result.player);
                this.selectedMembers[result.flight].splice(
                    this.selectedMembers[result.flight].length - 3,
                    0,
                    result.player
                );
            } else {
                ////console.log("cancel delete action");
            }
        });
    }

    addPlayer() {
        const dialogRef = this.dialog.open(DialogAddPlayerComponent, {
            data: { flights: this.selectedMembers.length },
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                ////console.log("record deleted.");
                //console.log(result);
                this.clubMembers.push(result);
                ////console.log(this.clubMembers);
                this.syncClubMembers();
            } else {
                ////console.log("cancel delete action");
            }
        });
    }

    playerList() {
        const dialogRef = this.dialog.open(DialogPlayerListComponent, {
            data: { players: this.tournamentMembers },
        });

        dialogRef.afterClosed().subscribe((result) => {
            //console.log(result);
            if (result) {
                ////console.log("record deleted.");
                //console.log(result);
                this.clubMembers.push(result);
                //console.log(this.clubMembers);
                this.syncClubMembers();
            } else {
                ////console.log("cancel delete action");
            }
        });
    }

    async searchPlayer() {
        // const dialogRef = this.dialog.open(DialogPlayerComponent, {
        //     width: '740px',
        //     data: { flights: this.selectedMembers.length },
        // });
        // if(this.subTournamentID==''){

        // }
        let datas = await this.facadeService.getPlayersListForTournament(
            this.loggedInuser.adminClubId
        );
        const dialogRef = this.dialog.open(DialogPlayerListComponent, {
            data: { players: datas.player, tournamentID: this.tournamentID, subTournamentID: this.subTournamentID },
        });

        dialogRef.afterClosed().subscribe(async (result) => {
            //console.log(result);
            if (result) {
                let dataFullTournaments: any;

                dataFullTournaments =
                    await this.facadeService.getTournamentMembers(
                        this.tournamentID
                    );
                //console.log(dataFullTournaments);
                this.tournamentMembers = [];
                for (let p of dataFullTournaments.TournamentMemberQL)
                    this.tournamentMembers.push(p['player']);

                this.syncClubMembers();
                this.syncTournamentMembers();
            }
            // if (result.length == 1) {
            //     ////console.log("record deleted.");
            //     //console.log(result);

            //     let founded = this.tournamentMembers.filter((a) => {
            //         return a.id == result[0].player.id;
            //     });
            //     //console.log(founded);

            //     if (founded.length == 0) {
            //         let tournamentMember: TournamentMember[] = [];

            //         let member: any = {
            //             tournamentId: this.tournamentID,
            //             playerId: result[0].player.id,
            //             status: true,
            //         };

            //         tournamentMember.push(member);
            //         this.saveMembers(tournamentMember);
            //         this.tournamentMembers.push(result[0].player);
            //         this.syncTournamentMembers();
            //     } else {
            //         this.snackBar.open(
            //             'Player already exist in the list.',
            //             'x',
            //             {
            //                 duration: 5000,
            //             }
            //         );
            //     }
            // } else if (result.length > 1) {
            //     result.forEach((element) => {
            //         let founded = this.tournamentMembers.filter((a) => {
            //             return a.id == element.player.id;
            //         });
            //         //console.log(founded);

            //         if (founded.length == 0) {
            //             let tournamentMember: TournamentMember[] = [];

            //             let member: any = {
            //                 tournamentId: this.tournamentID,
            //                 playerId: element.player.id,
            //                 status: true,
            //             };

            //             tournamentMember.push(member);
            //             this.saveMembers(tournamentMember);
            //             this.tournamentMembers.push(element.player);
            //             this.syncTournamentMembers();
            //         } else {
            //             this.snackBar.open(
            //                 'Player already exist in the list.',
            //                 'x',
            //                 {
            //                     duration: 5000,
            //                 }
            //             );
            //         }
            //     });
            // } else {
            // }
        });
    }

    async saveMembers(tournamentMember: TournamentMember[]) {
        let result = <any>(
            await this.facadeService.insertTournamentMember(tournamentMember)
        );

        if (result) {
            this.snackBar.open('Tournament member have been added.', 'x', {
                duration: 5000,
            });
        }
    }

    updateCategorySelection(event, row) {
        //console.log(this.selection.isSelected(row));
        let status = false;

        if (typeof event.checked !== 'undefined')
            status = event.checked ? true : false;
        else {
            //console.log(this.selection.isSelected(row));
            status = this.selection.isSelected(row) ? false : true;
        }
        this.showCategory = true;
        this.countCategoryMember(status, row);

        //console.log(this.categoryCounts);
    }

    countCategoryMember(status, row) {
        let founded = this.categoryCounts.filter((a) => {
            return a.name == row.playerCategory;
        });
        //console.log(founded);

        if (status) {
            if (founded.length > 0) {
                founded[0].value = founded[0].value + 1;
            } else {
                let obj = {
                    name: row.playerCategory,
                    value: 1,
                };
                this.categoryCounts.push(obj);
            }
        } else {
            if (founded.length > 0) {
                status
                    ? (founded[0].value = founded[0].value - 1)
                    : (founded[0].value = founded[0].value - 1);
                //console.log(this.categoryCounts);
            }
        }
    }

    async createSubtournament(tournamentID) {
        let subTournamentId = UniqueIdGenerator.generate();
        this.subTournamentID = subTournamentId;

        let courseHoleSetsData = this.formArray.get([0]).value.courseHoleSet;
        let handicapAllocations = {
            handicapAllocation: this.formArray.get([0]).value
                .handicapAllocations,
        };
        courseHoleSetsData.length > 0
            ? (courseHoleSetsData = courseHoleSetsData.split('_', 2))
            : (courseHoleSetsData = []);
        let tournament = {
            id: subTournamentId, //(this.tournamentID)? this.tournamentID : UniqueIdGenerator.generate(),
            clubId:
                this.loggedInuser.userRole > 1
                    ? this.loggedInuser.adminClubId
                    : this.formArray.get([0]).value.clubsFormCtrl.id,
            leagueId: null,
            courseId: this.formArray.get([0]).value.courseInfo[0]
                ? this.formArray.get([0]).value.courseInfo[0].courseName.course
                    .id
                : '',
            adminId: this.loggedInuser.id,
            title: this.formArray.get([0]).value.subTournament[0].title,
            prefix: this.formArray.get([0]).value.subTournament[0].prefix,
            subTournament: true,
            multiFormat: false,
            courseHoleSets:
                courseHoleSetsData.length > 0
                    ? Number(courseHoleSetsData[0])
                    : 0,
            teamMatch: false,
            pairsMatch: false,
            interLeague: false,
            playingOnWhs: false,
            publicTournament: false,
            confirmParticipants: this.formArray.get([0]).value.askConfirmation,
            noOfRounds: this.formArray.get([0]).value.numOfRounds,
            activeRound: 1,
            matchFormat: this.formArray.get([0]).value.subTournament[0]
                .matchFormat,

            pointsFormats: null,
            pointsValues: null,
            handicapAllocations: handicapAllocations,
            tee: 'AMATEURS',
            tee_id: 1,
            scoreManagement: 'ONLY_PLAYERS',
            startDate: General.parseToDate(
                this.formArray.get([0]).value.startDateFormCtrl
            ),
            endDate: General.parseToDate(
                this.formArray.get([0]).value.endDateFormCtrl
            ),
            flightsCategory: null,
            started: true,
            invited: false,
            singleRound: false,
            sponsorName: '',
            sponsorLogo: '',
            mobileLogoUrl: '',
            webLogoUrl: '',
            courseHoleSetsInverted:
                courseHoleSetsData.length > 0
                    ? courseHoleSetsData[1] == 'true'
                        ? true
                        : false
                    : false,
            categories: [],
            marshals: [],
            flights: [],
            members: [],
            tourId: this.loggedInuser.userRole == 4 ? this._localStorage.get(Constants.TOUR_ID) : null,
        };
        let result = <any>await this.facadeService.addTournament(tournament);
        // //console.log(tournament)
        if (result) {
            let obj = {
                tournamentId: tournamentID,
                subTournamentId: subTournamentId,
            };
            let response = <any>await this.facadeService.addSubTournament(obj);
            if (response) {
                this.snackBar.open('Sub Tournament has been created.', 'x', {
                    duration: 3000,
                });
            }
        }
    }

    updateTMCategorySelection() {
        this.TMcategoryCounts = [];
        if (this.tournamentMembers.length > 0) {
            for (let catCount of this.tournamentMembers) {
                //console.log(catCount);
                let founded = this.TMcategoryCounts.filter((a) => {
                    return a.name == catCount.playerCategory;
                });

                if (founded.length > 0) {
                    founded[0].value = founded[0].value + 1;
                } else {
                    let obj = {
                        name: catCount.playerCategory,
                        value: 1,
                    };
                    this.TMcategoryCounts.push(obj);
                }
            }
        }
        //console.log(this.TMcategoryCounts);
        return this.TMcategoryCounts;
    }
    deletedTMcategorySelection(PLcategory) {
        //console.log(PLcategory);
        let founded = this.updateTMCategorySelection();
        if (founded.length > 0) {
            for (let catCount in founded) {
                //console.log(catCount);
                if (founded[catCount].name == PLcategory) {
                    founded[catCount].value = founded[catCount].value - 1;
                } else {
                }
            }
            //console.log(founded);
            this.TMcategoryCounts = founded;
        }
    }
    selectedTee(event, playerId) {
        let target = event.source.selected._element.nativeElement;
        let selectedData = {
            value: event.value,
            text: target.innerText.trim(),
        };
    }
    formatChange(event) {

        if (event.value == matchFormat.STROKE_PLAY) {
            this.showCat = true;
        } else {
            this.showCat = false;
        }
    }
    teamMatchChange(event) {
        this.matchFormats = []
        if (event.value == '1') {
            this.matchFormats = [
                "STROKE_PLAY",
                "STABLEFORD",
                "MODIFIED_STABLEFORD",
                "SPLIT_SIXES",

            ]
            this.showCat = true;
            this.formGroup.get('formArray')!
                .get([0])
                .get('courseInfo')!
                .get([0])
                .get('matchFormat')!
                .setValue("STROKE_PLAY");
        } else {
            this.matchFormats = [
                "MATCH_PLAY",
                "TEXAS_SCRAMBLE",
                "2_BALL_SCRAMBLE",
                "3_BALL_SCRAMBLE",
                "4_BALL_SCRAMBLE",
                "SHAMBLES",
                "BEST_THREE",
                "BEST_TWO",
            ]
            this.showCat = false;
            this.formGroup.get('formArray')!
                .get([0])
                .get('courseInfo')!
                .get([0])
                .get('matchFormat')!
                .setValue("MATCH_PLAY");
        }
    }

    typeChange(event) {
        if (event.value == 'SINGLE') {
            this.showSubtournament = false;
        } else {
            this.showSubtournament = true;
        }
    }

}
