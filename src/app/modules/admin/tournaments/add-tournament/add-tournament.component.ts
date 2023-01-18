import { Component, OnInit, ViewChild } from '@angular/core';
import {
    AbstractControl,
    FormBuilder,
    FormGroup,
    FormControl,
    FormArray,
    Validators,
} from '@angular/forms';
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
    membersColumns: string[] = ['name', 'handicap', 'category', 'delete'];
    dataSource: MatTableDataSource<Player>;
    selection = new SelectionModel<Player>(true, []);
    isLoading = true;
    intervalPerFlight = 0;
    stepTitle: string = 'Tournament Setup Form';
    PLcats: Player[] = [];

    formGroup: FormGroup;
    filteredClubOptions: Observable<Club[]>;
    filteredCourseOptions: Observable<Course[]>;

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
    isSenior: boolean;
    membersSource: MatTableDataSource<Player>;
    isVeterans: boolean;
    isJuniors: boolean;
    isLadies: boolean;
    isProfessionals: boolean;
    isProAm: boolean;
    selected: boolean;
    isMarshals: boolean;
    hideClubs: boolean = true;
    clubTitle: string;
    sDate: Date;
    tournamentID: string;
    public selectedTime = '08:00';
    public preFlightTime = this.selectedTime;
    minDate: Date;
    maxDate: Date;
    currentTournament: any;
    classifiedPlayers: any[] = [];
    setupInitialized: boolean = false;
    playingFlight: any[] = [];
    courseHoleSetNames: any[];
    courseChange: boolean = false;
    courseHoleSetCount: number = 0;
    showCourseHole: boolean = false;
    atpTime: any;
    editTournament: boolean = false;
    playingDat: any[] = [];
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild('dsort') sort: MatSort;

    @ViewChild(MatPaginator) Mempaginator: MatPaginator;
    @ViewChild('msort') Memsort: MatSort;
    showDates: boolean = false;
    dates: any[] = [];
    datesPlaying: any[] = [];
    showCat: boolean = true;
    onHoleChange($event, i, j) {
        console.log(i);

        let flight_1_hole: string = (<HTMLInputElement>(
            document.getElementById('flight_' + i + '_hole')
        )).value;
        console.log(flight_1_hole);
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

    /** Returns a FormArray with the name 'formArray'. */
    get formArray(): AbstractControl | null {
        return this.formGroup.get('formArray');
    }

    private marshalValidators = [Validators.maxLength(3)];

    constructor(
        private atp: AmazingTimePickerService,
        private datePipe: DatePipe,
        private router: Router,
        private route: ActivatedRoute,
        public snackBar: MatSnackBar,
        private _formBuilder: FormBuilder,
        public dialog: MatDialog,
        private facadeService: FacadeService
    ) {
        this.setState(this.valid1, false);
        this.setState(this.valid2, false);
        this.setState(this.valid3, false);
        this.setState(this.valid4, false);
        this.setState(this.valid5, false);
    }

    async ngOnInit() {
        this.loggedInuser = JSON.parse(
            localStorage.getItem(Constants.LOGGED_IN_USER)
        );

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
                    clubsFormCtrl: [
                        this.loggedInuser.userRole > 1
                            ? this.loggedInuser.membership.length > 0
                                ? this.loggedInuser.membership[0].club.name
                                : ''
                            : '',
                        [Validators.required, RequireMatch],
                    ],
                    courseInfo: this._formBuilder.array([
                        this._formBuilder.group({
                            courseName: ['', [RequireMatch]],
                            matchFormat: [Constants.MF_STROKE_PLAY],
                        }),
                    ]),
                    courseHoleSet: [],
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
        console.log(this.Categories);

        let playerCategoryList = this.facadeService.getPlayerCategories();
        console.log(playerCategoryList);

        this._courseHoles = this.facadeService.getCourseHoles('');

        let today: Date = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();

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
            let tournamentInfo = await this.facadeService.getTournamentByID(
                this.tournamentID
            );
            this.editTournament = true;
            console.log(tournamentInfo);
            this.currentTournament =
                tournamentInfo.tournament.length > 0
                    ? tournamentInfo.tournament[0]
                    : [];

            console.log(this.currentTournament);

            this.getSelectedCourse(this.currentTournament['CourseQL']);

            if (this.currentTournament) {
                this.formArray.get([0]).patchValue({
                    titleFormCtrl: this.currentTournament.title,
                    prefixFormCtrl: this.currentTournament.prefix,
                    startDateFormCtrl: this.currentTournament.startDate,
                    endDateFormCtrl: this.currentTournament.endDate,
                    numOfRounds: this.currentTournament.noOfRounds,
                    courseHoleSet:
                        this.currentTournament.courseHoleSets +
                        '_' +
                        this.currentTournament.courseHoleSetsInverted
                            ? 'true'
                            : 'false',
                });

                //this.stepIndex = 1;

                console.log(this.currentTournament);

                if (this.currentTournament.members)
                    for (let p of this.currentTournament.members)
                        this.tournamentMembers.push(<Player>p['PlayerQL']);

                this.syncTournamentMembers();

                //this.selection = new SelectionModel<Player>(true, this.tournamentMembers);

                console.log(this.tournamentMembers);

                let selectedClubId: string =
                    this.loggedInuser.userRole > 1
                        ? this.loggedInuser.adminClubId
                        : this.currentTournament.clubId;
                this.clubMembers = [];
                console.log(selectedClubId);
                let clubMembersData: any =
                    await this.facadeService.getPlayerByClub(selectedClubId);

                for (let i = 0; i < clubMembersData.club_member.length; i++) {
                    this.clubMembers.push(
                        clubMembersData.club_member[i].player
                    );
                }

                console.log(this.clubMembers);

                this.syncClubMembers();

                //this.dataSource = new MatTableDataSource(this.clubMembers);

                this.formArray
                    .get([0])
                    .get('courseInfo')!
                    .get([0])
                    .get('courseName')
                    .setValue({
                        name: this.currentTournament['CourseQL'].name,
                    });

                // this.formArray
                // .get([0])
                // .get("courseInfo")!
                // .get([0])
                // .get("matchFormat")
                // .setValue({value: this.currentTournament.matchFormat})

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
                            })
                        );
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

    // addplayingDates(category: any){
    //   const control = this.formArray.get([1]).get("category") as FormArray;
    //   control.push(this.playingDate(category[]));
    //   console.log(this.formArray.get([1]).get("playingDate"));
    // }

    createCategory(cat: any): FormGroup {
        return this._formBuilder.group({
            name: [cat ? cat : '', Validators.compose([Validators.required])],
            playersperFlight: ['3', Validators.compose([Validators.required])],
            flightStartTime: ['08:00 AM', Validators.required],
            arrangeBy: ['handicap', Validators.required],
            selectedcategories: [
                this.formArray.get([0]).get('clubctgies').value,
            ],
            arrangements: ['0', Validators.required],
            startingHole: ['1_10', Validators.required],
            flightsInterval: ['0'],

            playingDate: this._formBuilder.array([]),
        });
    }
    setState(control: FormControl, state: boolean) {
        if (state) {
            control.setErrors({ required: true });
        } else {
            control.reset();
        }
    }
    createPlayingDate(date: string): FormGroup {
        return this._formBuilder.group({
            Date: [date, Validators.required],
            playing: [false, Validators.required],
            noofHoles: ['18', Validators.required],
        });
    }

    get categoryFormGroup() {
        return <FormArray>this.formArray.get([1]).get('category');
    }

    PlayingDateFormGroup(index) {
        const catControls = (<FormArray>(
            this.formArray.get([1]).get('category')
        )) as FormArray;
        console.log(catControls);
        console.log(catControls.controls[index].get('playingDate'));

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

        console.log(sDate);
        console.log(eDate);
        console.log(this.calculateDiff(sDate, eDate));

        let noOfDays: any = this.calculateDiff(sDate, eDate);
        // for (let i = 0; i <= noOfDays; i++) {
        //   var dte = new Date(sDate);
        //   dte.setDate(sDate.getDate() + i);
        //   console.log(dte);
        //   let dteday = this.datePipe.transform(dte, "yyyyMMdd");
        //   console.log(dteday);
        //   this.playingDat[i] =
        //     dteday.substring(8, 6) +
        //     "-" +
        //     dteday.substring(6, 4) +
        //     "-" +
        //     +dteday.substring(0, 4);
        //   //selectedDate [i] = this.datePipe.transform(selectedDate[i], 'dd-MM-yyyy')

        //   //   this.selectedMembers.push(person);
        //   console.log(this.playingDat[i]);

        // }
        // console.log(this.playingDat);
        return this.playingDat;
    }
    getplayingDates() {
        this.playingDat = [];
        let sDate = new Date(this.formArray.get([0]).value.startDateFormCtrl);
        let eDate = new Date(this.formArray.get([0]).value.endDateFormCtrl);
        //sDate.setDate(sDate.getDate() + 1);

        console.log(sDate);
        console.log(eDate);
        console.log(this.calculateDiff(sDate, eDate));

        let noOfDays: any = this.calculateDiff(sDate, eDate);
        for (let i = 0; i <= noOfDays; i++) {
            var dte = new Date(sDate);
            dte.setDate(sDate.getDate() + i);
            console.log(dte);
            let dteday = this.datePipe.transform(dte, 'yyyyMMdd');
            console.log(dteday);
            this.playingDat[i] =
                dteday.substring(8, 6) +
                '-' +
                dteday.substring(6, 4) +
                '-' +
                +dteday.substring(0, 4);
            //selectedDate [i] = this.datePipe.transform(selectedDate[i], 'dd-MM-yyyy')

            //   this.selectedMembers.push(person);
            console.log(this.playingDat[i]);
        }
        console.log(this.playingDat);
        return this.playingDat;
    }

    //     Date: ['', Validators.required],
    //     playing: ['0', Validators.required],
    //     noofHoles: ['1_10', Validators.required],

    addplayingDate(index: number) {
        let dates = this.getplayingDates();
        console.log(index);
        for (let i of dates) {
            const control = this.formArray
                .get([1])
                .get('category') as FormArray;
            console.log(control);
            console.log(i);
            const newControl = control.controls[index].get(
                'playingDate'
            ) as FormArray;

            newControl.push(this.createPlayingDate(i));
        }
    }

    addFlightField(category: any) {
        const control = this.formArray.get([1]).get('category') as FormArray;

        console.log(control.length);

        control.push(this.createCategory(category));
        console.log(control);

        //newControl.push(this.createPlayingDate("Date of play"));
        //console.log(this.formArray.get([1]).get("category"));
        //console.log(this.formArray.get([1]).get("category").value[0].playingDate);
    }

    displayFn(club: Club): string {
        return typeof club === 'string' ? club : club ? club.name : '';
    }

    displayCourseFn(course: Course): string {
        console.log(course);
        return typeof course === 'string' ? course : course ? course.name : '';
    }

    private _filter(value: string): Club[] {
        if (value) {
            const filterValue = value.toLowerCase();

            return this.Clubs.filter(
                (option) => option.name.toLowerCase().indexOf(filterValue) === 0
            );
        }

        return this.Clubs;
    }

    private _filterCourse(value: string): Course[] {
        if (value) {
            const filterValue = value.toLowerCase();

            return this.Courses.filter(
                (option) => option.name.toLowerCase().indexOf(filterValue) >= 0
            );
        }

        return this.Courses;
    }

    checkDate(cat) {
        console.log(cat);
        if (this.editTournament == true) {
            return this.checkCatToUpdate(cat, false);
        }
        this.datesPlaying = [];
        for (let i of this.dates) {
            if (i.id == cat.id) {
                this.datesPlaying.push(i['playingDates']);
            }
        }
        console.log(this.datesPlaying);
        return this.datesPlaying;
    }

    updateChkbxArray(chk, index, isChecked, key) {
        const chkArray = <FormArray>this.formArray.get([0]).get(key);
        if (isChecked) {
            //sometimes inserts values already included creating double records for the same values -hence the defence
            if (chkArray.controls.findIndex((x) => x.value.id == chk.id) == -1)
                chkArray.push(new FormControl({ id: chk.id, name: chk.name }));
            console.log(chkArray);
            // this.dateSetup();
            // this.showDates = true;
            // let category;
            // category = this.formArray.get([0]).get("clubctgies").value;
            // console.log(category);

            // const dialogRef = this.dialog.open(DialogPlayingDatesComponent, {
            //   width: "500px",

            //   data: {
            //     dates: this.playingDat,
            //     category: this.formArray.get([0]).get("clubctgies").value,
            //   },
            // });

            // dialogRef.afterClosed().subscribe((result) => {
            //   console.log(result);
            //   if (result) {
            //     for (let i = 0; i < result.length; i++) {
            //       let obj = {
            //         id: result[i]["id"],
            //         name: result[i]["name"],
            //         playingDates: result[i]["dates"],
            //       };
            //       this.dates.push(obj);
            //     }
            //     console.log(this.dates);
            //   }
            // });
            //this.PlayingDateFormGroup(index)
        } else {
            let idx = chkArray.controls.findIndex(
                (x) => x.value.name == chk.name
            );
            chkArray.removeAt(idx);
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

        //console.log(chkArray.controls);
        //console.log(chkArray.controls.findIndex(x => x.value.id == 1));
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
        console.log(isChecked['checked']);
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
        console.log(courseHoleSet);
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
        console.log(event);
    }

    getSelectedCourse(course) {
        this.courseHoleSetNames = [];

        this.facadeService
            .getCourseHoleSets(course.id)
            .subscribe((selectedCourseHoleSet) => {
                console.log(selectedCourseHoleSet);
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

        // if(course.nameForHoles1to9 && course.nameForHoles10to18) {
        //   let course1to9 = { id: 1, name: course.nameForHoles1to9, checked: this.hasHoleSet1to9(course.nameForHoles1to9) };
        //   let course10to18 = { id: 2, name: course.nameForHoles10to18, checked: this.hasHoleSet10to18(course.nameForHoles10to18) };
        //   let course19to27 = { id: 4, name: course.nameForHoles19to27, checked: this.hasHoleSet19to27(course.nameForHoles19to27) };
        //   let course28to36 = { id: 8, name: course.nameForHoles28to36, checked: this.hasHoleSet28to36(course.nameForHoles28to36) };

        //   if(course.nameForHoles1to9) this.courseHoleSetNames.push(course1to9);
        //   if(course.nameForHoles10to18) this.courseHoleSetNames.push(course10to18);
        //   if(course.nameForHoles19to27) this.courseHoleSetNames.push(course19to27);
        //   if(course.nameForHoles28to36) this.courseHoleSetNames.push(course28to36);
        //   this.showCourseHole = true;
        // }
        // else this.showCourseHole = false;
    }
    getSelectedCourses(course) {
        this.courseHoleSetNames = [];
        this.courseChange = true;
        console.log(this.courseChange);
        this.formArray
            .get([0])
            .get('courseInfo')!
            .get([0])
            .get('courseName')
            .setValue({ course });

        this.facadeService
            .getCourseHoleSets(course.id)
            .subscribe((selectedCourseHoleSet) => {
                console.log(selectedCourseHoleSet);
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

        // if(course.nameForHoles1to9 && course.nameForHoles10to18) {
        //   let course1to9 = { id: 1, name: course.nameForHoles1to9, checked: this.hasHoleSet1to9(course.nameForHoles1to9) };
        //   let course10to18 = { id: 2, name: course.nameForHoles10to18, checked: this.hasHoleSet10to18(course.nameForHoles10to18) };
        //   let course19to27 = { id: 4, name: course.nameForHoles19to27, checked: this.hasHoleSet19to27(course.nameForHoles19to27) };
        //   let course28to36 = { id: 8, name: course.nameForHoles28to36, checked: this.hasHoleSet28to36(course.nameForHoles28to36) };

        //   if(course.nameForHoles1to9) this.courseHoleSetNames.push(course1to9);
        //   if(course.nameForHoles10to18) this.courseHoleSetNames.push(course10to18);
        //   if(course.nameForHoles19to27) this.courseHoleSetNames.push(course19to27);
        //   if(course.nameForHoles28to36) this.courseHoleSetNames.push(course28to36);
        //   this.showCourseHole = true;
        // }
        // else this.showCourseHole = false;
    }

    checkCatToUpdate(cat, check: boolean) {
        console.log(cat);
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
                    flag = this.yoyo(cat);
                    console.log(flag);
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
            console.log(this.datesPlaying);
            return this.datesPlaying;
        }
    }

    public yoyo(cat): boolean {
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
        console.log(selectedValue);
        this.clubMembers = [];
        this.selectedMembers = [];
        this.selection.clear();
        this.isLoading = true;
        //console.log(this.selectedMembers);
    }

    get courseFileds() {
        return <FormArray>this.formArray.get([0]).get('courseInfo');
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

    async getSelectedPlayers() {
        //console.log(this.selection.selected.length);
        this.flightArrangementSetup();
        this.selectedMembers = [];

        for (
            let i = 0;
            i < this.formArray.get([0]).get('clubctgies').value.length;
            i++
        ) {
            const person = {
                title: this.formArray.get([0]).get('clubctgies').value[i].name,
                Members: this.getFilteredCategory(
                    this.formArray.get([0]).get('clubctgies').value[i].name
                ),
            };

            if (typeof person.Members !== 'undefined') {
                this.selectedMembers.push(person);
            }
            console.log(person);

            console.log(this.formArray.get([1]).get('category'));
            for (let j in this.formArray.get([1]).get('category').value[i]
                .playingDate) {
                let sDte =
                    this.formArray
                        .get([1])
                        .get('category')
                        .value[i].playingDate[j].Date.substring(6, 10) +
                    this.formArray
                        .get([1])
                        .get('category')
                        .value[i].playingDate[j].Date.substring(3, 5) +
                    this.formArray
                        .get([1])
                        .get('category')
                        .value[i].playingDate[j].Date.substring(0, 2);
                this.formArray.get([1]).get('category').value[i].playingDate[
                    j
                ].Date = sDte;

                //this.formArray.get([1]).get("category").value[i].playingDate[j].Date = this.datePipe.transform(this.formArray.get([1]).get("category").value[i].playingDate[j].Date, 'yyyyMMdd');
            }
            console.log(this.formArray.get([1]).get('category').value[i]);
            let flightSettingsStatus: any =
                await this.facadeService.updateFlightSettings(
                    this.tournamentID,
                    this.formArray.get([1]).get('category').value[i].name,
                    this.formArray.get([1]).get('category').value[i]
                );
            console.log(flightSettingsStatus);
        }

        console.log(this.selectedMembers);
    }

    getFC(event, category: any) {
        const selectedATP = this.atp.open();
        selectedATP.afterClose().subscribe((t) => {
            this.atpTime = t;
            console.log(t);
            console.log(category);
            this.getFilteredCategory(category);
        });
    }

    getFilteredCategory(PLcategory: any) {
        let selMembers: Player[][] = [];

        let FilteredPL: Player[] = [];
        let flightTime: any = '9:00 AM';
        let flightTee: any = '1';

        let cnter = 0;
        let outer = 0;

        let Pdate: any = this.datePipe.transform(
            this.formArray.get([0]).value.startDateFormCtrl,
            'dd-MM-yyyy'
        );
        console.log(Pdate);

        FilteredPL = this.tournamentMembers.filter((a) => {
            return a.playerCategory == PLcategory;
        });

        const FilteredFlight = this.formArray
            .get([1])
            .get('category')
            .value.filter((a) => {
                return a.name == PLcategory;
            });

        console.log(FilteredFlight);
        this.playingFlight = FilteredFlight[0].playingDate.filter((a) => {
            return a.Date == Pdate;
        });

        console.log(FilteredFlight[0].playersperFlight);
        console.log(this.playingFlight);

        let PperFlight = FilteredFlight[0].playersperFlight;
        if (!this.playingFlight[0].playing) {
            return;
        } else {
            FilteredPL.forEach((filteredPlayer: any) => {
                if (cnter == 0) selMembers[outer] = [];
            });

            for (const index in FilteredPL) {
                //console.log(outer + "<--->" + cnter);
                console.log(FilteredPL);
                if (cnter == 0) selMembers[outer] = [];

                selMembers[outer][cnter] = FilteredPL[index];

                if (cnter == parseInt(PperFlight) - 1) {
                    cnter = 0;
                    outer++;
                } else {
                    cnter++;
                }
            }
            let tempSelMembers: any[] = [];
            for (const index in selMembers) {
                tempSelMembers = [];
                tempSelMembers = selMembers;
                tempSelMembers[index]['tee'] = flightTee;
                tempSelMembers[index]['time'] = this.atpTime
                    ? this.atpTime
                    : flightTime;
                selMembers = tempSelMembers;
            }
            console.log(selMembers);
        }
        return selMembers;
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
        console.log(FilteredFlight);

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
        }
        //console.log("2020-01-01 " + ((index == 0)? this.formArray.get([1]).value.flightStartTime : this.preFlightTime) + "");
        let dateNow: Date = new Date(
            Constants.DEFAULT_DATE +
                ' ' +
                (index == 0
                    ? FilteredFlight[0].flightStartTime
                    : this.preFlightTime) +
                ''
        );
        console.log(FilteredFlight[0].flightStartTime);

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
            console.log(dateNow);

            var h = dateNow.getHours();
            var m = dateNow.getMinutes();

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
            console.log(dateNow);

            var h = dateNow.getHours();
            var m = dateNow.getMinutes();

            this.preFlightTime =
                ('0' + h).slice(-2) + ':' + ('0' + m).slice(-2);
            console.log(this.preFlightTime);
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
        console.log('sd');
    }

    flightsSetup(stepper: MatStepper, action: string) {
        this.stepTitle = 'Flights Setup Form';
        //this.saveTournamentMembers();

        console.log(this.formArray.get([0]).get('clubctgies').value);

        if (!this.setupInitialized) {
            for (
                let i = 0;
                i < this.formArray.get([0]).get('clubctgies').value.length;
                i++
            ) {
                this.addFlightField(
                    this.formArray.get([0]).get('clubctgies').value[i].name
                );
            }
            console.log(this.formArray.get([0]).get('clubctgies').value.length);
            for (
                let i = 0;
                i < this.formArray.get([0]).get('clubctgies').value.length;
                i++
            ) {
                this.addplayingDate(i);
            }

            //this.setupInitialized = true;
        }

        console.log(this.formArray.get([1]).get('category'));
        if (action === 'next') stepper.next();
        else if (action === 'back') stepper.previous();
        else {
        }
        //this.router.navigate(["/tournaments/view/" + this.tournamentID]);
    }

    dateSetup() {
        //this.stepTitle = "Flights Setup Form";
        //this.saveTournamentMembers();

        console.log(this.formArray.get([0]).get('clubctgies').value);

        if (!this.setupInitialized) {
            for (
                let i = 0;
                i < this.formArray.get([0]).get('clubctgies').value.length;
                i++
            ) {
                this.addFlightField(
                    this.formArray.get([0]).get('clubctgies').value[i].name
                );
            }
            console.log(this.formArray.get([0]).get('clubctgies').value.length);
            // for (
            //   let i = 0;
            //   i < this.formArray.get([0]).get("clubctgies").value.length;
            //   i++
            // ) {
            //   //this.addplayingDate(i);
            // }

            this.getplayingDates();

            //this.setupInitialized = true;
        }

        console.log(this.formArray.get([1]).get('category'));
        //this.router.navigate(["/tournaments/view/" + this.tournamentID]);
    }

    datechanged(event, t) {
        console.log(event);
        console.log(t);
    }

    tournamentMembersSetup() {
        console.log(this.stepTitle);

        this.stepTitle = 'Select Tournament Members';
        this.syncClubMembers();
        this.syncTournamentMembers();
    }

    flightArrangementSetup() {
        this.stepTitle = 'Flights Arrangement';
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
        console.log(this.formArray.get([0]).get('courseHoleSet'));
        let courseHoleSet: number = 0;
        for (let a of selectedHoleSet.controls) {
            let option = this.courseHoleSetNames.filter((f) => {
                return f.name == a.value;
            });
            courseHoleSet += option[0].id;
        }

        return courseHoleSet;
    }

    async createTournament() {
        this.loggedInuser = JSON.parse(
            localStorage.getItem(Constants.LOGGED_IN_USER)
        );

        let tournamentCats: TournamentCategory[] = [];

        let marshalsData: Marshal[] = [];

        //const tc:TournamenCategory = [];
        if (!this.tournamentID)
            this.tournamentID = UniqueIdGenerator.generate();

        for (var index in this.formArray.get([0]).value.clubctgies) {
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
                id: UniqueIdGenerator.generate(),
                //tournamentId: this.tournamentID,
                category: this.formArray.get([0]).value.clubctgies[index].name,
                handicapLimits: TCdata ? TCdata : null,
                prizeInformation: prizeInfo ? prizeInfo : null,
                // flightSettings: this.checkDate(
                //   this.formArray.get([0]).value.clubctgies[index]
                // ),
                flightSettings: null,
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
        courseHoleSetsData.length > 0
            ? (courseHoleSetsData = courseHoleSetsData.split('_', 2))
            : (courseHoleSetsData = []);

        let tournament = {
            id: this.tournamentID, //(this.tournamentID)? this.tournamentID : UniqueIdGenerator.generate(),
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
            title: this.formArray.get([0]).value.titleFormCtrl,
            prefix: this.formArray.get([0]).value.prefixFormCtrl,
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
            matchFormat: this.formArray.get([0]).value.courseInfo[0]
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
            categories: tournamentCats,
            marshals: marshalsData,
            flights: [],
            members: [],
        };

        console.log(tournament);

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

            console.log(checkPrfix);

            if (checkPrfix.length > 0) {
                this.snackBar.open('Prefix already exist.', 'x', {
                    duration: 5000,
                });
            } else {
                let result = <any>(
                    await this.facadeService.addTournament(tournament)
                );
                this.currentTournament = tournament;
                console.log(result);
                if (result) {
                    this.snackBar.open('Tournament has been created.', 'x', {
                        duration: 3000,
                    });
                    this.valid1.reset();
                    // this.valid2.reset();

                    if (this.formArray.get([0]).value.clubsFormCtrl) {
                        let selectedClubId: string =
                            this.loggedInuser.userRole > 1
                                ? this.loggedInuser.adminClubId
                                : this.formArray.get([0]).value.clubsFormCtrl
                                      .id;
                        this.clubMembers = [];
                        console.log(selectedClubId);
                        console.log(
                            this.formArray.get([0]).get('clubctgies').value
                        );

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

                        console.log(this.clubMembers);

                        this.syncClubMembers();

                        //console.log(this.clubMembers);

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

    async editTournaments() {
        this.loggedInuser = JSON.parse(
            localStorage.getItem(Constants.LOGGED_IN_USER)
        );
        let tournamentCats: TournamentCategory[] = [];

        let marshalsData: Marshal[] = [];
        for (var index in this.formArray.get([0]).value.clubctgies) {
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
                // flightSettings: this.checkDate(
                //   this.formArray.get([0]).value.clubctgies[index]
                // ),
                flightSettings: null,
            };
            console.log(tc);
            // let json= JSON.stringify(tc.flightSettings);

            // tc["flightSettings"]=json;
            console.log(tc);
            tournamentCats.push(tc);
            console.log(tournamentCats);
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
            teamMatch: false,
            pairsMatch: false,
            interLeague: false,
            playingOnWhs: false,
            publicTournament: false,
            confirmParticipants: this.formArray.get([0]).value.askConfirmation,
            noOfRounds: this.formArray.get([0]).value.numOfRounds,
            activeRound: 1,
            matchFormat: this.formArray.get([0]).value.courseInfo[0]
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
        };
        console.log(tournament);
        console.log(tournamentCats);
        console.log(marshalsData);

        let result = <boolean>(
            await this.facadeService.editTournament(
                tournament,
                tournamentCats,
                marshalsData
            )
        );
        if (result) {
            this.snackBar.open('Tournament has been Updated.', 'x', {
                duration: 5000,
            });
            this.router.navigate(['/tournaments/view/' + this.tournamentID]);
        } else {
            this.snackBar.open('Tournament has been Not  Updated.', 'x', {
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
                    console.log(this.tournamentMembers);
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

    async saveTournamentMembers() {
        let tournamentMember: TournamentMember[] = [];
        let counter: number;
        let DelplayerIndex: any;
        let DelplayerInfo: any;
        let selectionArray = Object.assign({}, this.selection.selected);

        for (var index in selectionArray) {
            if (selectionArray[index]) {
                let founded = this.tournamentMembers.filter((a) => {
                    return a.id == selectionArray[index].id;
                });

                if (founded.length == 0)
                    this.tournamentMembers.push(selectionArray[index]);

                let member: any = {
                    tournamentId: '-NKviB8CxjtGUK-1bv_J',
                    playerId: selectionArray[index].id,
                    status: true,
                };
                tournamentMember.push(member);
                counter = parseInt(index) + 1;
                console.log(counter);

                console.log(selectionArray);
            }
        }
        this.showCategory = false;
        //console.log(this.categoryCounts[0]);

        //this.categoryCounts[0].value = this.categoryCounts[0].value - counter;
        //console.log(this.categoryCounts[0].value);

        console.log(tournamentMember);

        let result = <any>(
            await this.facadeService.insertTournamentMember(tournamentMember)
        );

        if (result) {
            this.snackBar.open('Tournament members have been saved.', 'x', {
                duration: 5000,
            });
            this.valid3.reset();
            this.syncTournamentMembers();
            this.syncClubMembers();
            this.categoryCounts = [];
            if (!this.setupInitialized) {
              for (
                  let i = 0;
                  i < this.formArray.get([0]).get('clubctgies').value.length;
                  i++
              ) {
                  this.addFlightField(
                      this.formArray.get([0]).get('clubctgies').value[i].name
                  );
              }
              console.log(this.formArray.get([0]).get('clubctgies').value.length);
              for (
                  let i = 0;
                  i < this.formArray.get([0]).get('clubctgies').value.length;
                  i++
              ) {
                  this.addplayingDate(i);
              }
  
              //this.setupInitialized = true;
          }
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
        console.log(this.formArray.get([0]).get('clubctgies').value);
        this.tournamentMembersSetup();
        // if (!this.currentTournament && action != "back") {
        //  this.createTournament();
        // } else if(action != "back") {
        //   // console.log(this.formArray.get([0]).value.prefixFormCtrl);
        //   // console.log(this.formArray.get([0]).value.titleFormCtrl);
        //   // console.log(this.formGroup.value["formArray"]);
        //   // console.log(this.formGroup.get("formArray"));

        //   console.log(this.formArray.get("formArray"));
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
            console.log(selectedClubId);
            console.log(this.formArray.get([0]).get('clubctgies').value);

            let clubMembersData: any = await this.facadeService.getPlayerByClub(
                selectedClubId
            );

            for (let i = 0; i < clubMembersData.club_member.length; i++) {
                this.clubMembers.push(clubMembersData.club_member[i].player);
            }

            console.log(this.clubMembers);

            this.syncClubMembers();

            //console.log(this.clubMembers);

            //this.dataSource = new MatTableDataSource(this.clubMembers);
        } else {
            alert('Select Club');
        }

        // this.tournamentMembersSetup();

        // console.log(this.formArray.get([1]).value.category);

        // if (this.formArray.get([0]).value.clubsFormCtrl) {
        //   let selectedClubId: string = (this.loggedInuser.userRole > 1) ? this.loggedInuser.adminClubId : this.formArray.get([0]).value.clubsFormCtrl.id;
        //   this.clubMembers = [];
        //   console.log(selectedClubId);
        //   let clubMembersData: any = await this.facadeService.getPlayerByClub(selectedClubId);

        //   for (let i = 0; i < clubMembersData.length; i++) {
        //     this.clubMembers.push(clubMembersData[i].player);
        //   }

        //   this.syncClubMembers();
        //   //console.log(this.clubMembers);

        //   //this.dataSource = new MatTableDataSource(this.clubMembers);
        // }
    }

    syncClubMembers() {
        of(this.clubMembers)
            .pipe()
            .subscribe(
                (data) => {
                    this.isLoading = false;
                    console.log(this.clubMembers);

                    this.clubMembers = this.clubMembers.filter(
                        (ar) =>
                            !this.tournamentMembers.find(
                                (rm) => rm.id === ar.id
                            )
                    );
                    console.log(this.clubMembers);

                    this.dataSource = new MatTableDataSource(this.clubMembers);
                    this.dataSource.sort = this.sort;
                    this.dataSource.paginator = this.paginator;
                },
                (error) => (this.isLoading = false)
            );
    }

    applyFilter(filterValue: string) {
        filterValue = filterValue.trim(); // Remove whitespace
        filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
        console.log(this.dataSource);
        this.dataSource.filter = filterValue;

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    applyMembersFilter(filterValue: string) {
        filterValue = filterValue.trim(); // Remove whitespace
        filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
        console.log(this.membersSource);
        this.membersSource.filter = filterValue;

        if (this.membersSource.paginator) {
            this.membersSource.paginator.firstPage();
        }
    }

    async createFlights() {
        this.loggedInuser = JSON.parse(
            localStorage.getItem(Constants.LOGGED_IN_USER)
        );
        let tournamentFlights: Flight[] = [];
        let tournamentMember: TournamentMember[] = [];
        let fcnter = 0;
        let ind: number = 0;

        let tournamentFlightMembers: FlightMembers[];

        if (this.currentTournament)
            this.tournamentID = this.currentTournament.id;
        for (var index in this.selectedMembers) {
            let counter: number = 0;

            tournamentFlightMembers = [];
            const FilteredFlight = this.formArray
                .get([1])
                .get('category')
                .value.filter((a) => {
                    return a.name == this.selectedMembers[index].title;
                });

            console.log(FilteredFlight);
            console.log(this.selectedMembers);

            for (var index2 in this.selectedMembers[index]) {
                if (index2 != 'title') {
                    for (var index3 in this.selectedMembers[index][index2]) {
                        for (var index4 in this.selectedMembers[index][index2][
                            index3
                        ]) {
                            if (Number.isInteger(Number(index4))) {
                                console.log(
                                    this.selectedMembers[index][index2][index3][
                                        index4
                                    ].playerCategory
                                );

                                let roundTeeId: any = General.getPlayersTe(
                                    this.selectedMembers[index][index2][index3][
                                        index4
                                    ].playerCategory
                                );
                                console.log(roundTeeId.id);
                                let FM: any = {
                                    playerId:
                                        this.selectedMembers[index][index2][
                                            index3
                                        ][index4].id,
                                    attendance: false,
                                    playingTee: roundTeeId.result,
                                    tee_id: roundTeeId.id,
                                };
                                console.log(FM);

                                tournamentFlightMembers.push(FM);

                                let TM: any = {
                                    playerId:
                                        this.selectedMembers[index][index2][
                                            index3
                                        ][index4].id,
                                    status: true,
                                    playingTee: roundTeeId.result,
                                    tee_id: roundTeeId.id,
                                };
                                console.log(TM);

                                tournamentMember.push(TM);
                            }
                        }
                        console.log(
                            this.selectedMembers[index][index2][index3][index4]
                                .playerCategory
                        );

                        let roundTeeId1: any = General.getPlayersTees(
                            tournamentFlightMembers[0].playingTee
                        );
                        console.log(roundTeeId1.id);

                        if (tournamentFlightMembers.length > 0) {
                            console.log(tournamentFlightMembers);
                            fcnter++;
                            let flight: any = {
                                id: UniqueIdGenerator.generate(),
                                tournamentId: this.tournamentID,
                                courseId: this.currentTournament.courseId,
                                adminId: this.loggedInuser.id,
                                courseHoleSets: this.currentTournament
                                    .courseHoleSets
                                    ? this.currentTournament.courseHoleSets
                                    : 0,
                                flightNo: fcnter,
                                flightRound: 1,
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
                            };

                            console.log(flight);
                            tournamentFlights.push(flight);
                            console.log(tournamentFlights);
                            tournamentFlightMembers = [];

                            //break;
                        }
                        counter = counter + 1;
                    }
                }
            }
        }

        //console.log(tournamentFlights);

        //let loggedInuser = JSON.parse(localStorage.getItem(Constants.LOGGED_IN_USER));
        let tournamentCats: TournamentCategory[] = [];

        let marshalsData: Marshal[] = [];

        //const tc:TournamenCategory = [];
        if (!this.tournamentID)
            this.tournamentID = UniqueIdGenerator.generate();

        for (var index in this.formArray.get([0]).value.clubctgies) {
            //console.log(index); // prints indexes: 0, 1, 2, 3

            //console.log(this.formArray.get([0]).value.clubctgies[index].id);
            //console.log(this.formArray.get([0]).value.clubctgies[index].name);
            //console.log(this.formArray.get([0]).value.clubctgies[index].name);
            //console.log(Constants.CATEGORY_AMATEURS);
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
                id: UniqueIdGenerator.generate(),
                //tournamentId: this.tournamentID,
                category: this.formArray.get([0]).value.clubctgies[index].name,
                handicapLimits: TCdata ? TCdata : null,
                prizeInformation: prizeInfo ? prizeInfo : null,
            };

            tournamentCats.push(tc);
        }

        for (let i = 1; i <= this.formArray.get([0]).value.noofMarshals; i++) {
            let uniquePassword: string = passwordGenerator.generate();

            let mshl: any = {
                id: UniqueIdGenerator.generate(),
                //tournamentId: this.tournamentID,
                email:
                    this.formArray.get([1]).value.marshalStart +
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
        //console.log(marshalsData);

        // let tournament: Tournament = {
        //   id: this.tournamentID,//(this.tournamentID)? this.tournamentID : UniqueIdGenerator.generate(),
        //   clubId: (this.loggedInuser.userRole > 1) ? this.loggedInuser.adminClubId : this.formArray.get([0]).value.clubsFormCtrl.id,
        //   leagueId: null,
        //   courseId: (this.formArray.get([0]).value.courseInfo[0]) ? this.formArray.get([0]).value.courseInfo[0].courseName.id : '',
        //   adminId: this.loggedInuser.id,
        //   title: this.formArray.get([0]).value.titleFormCtrl,
        //   prefix: this.formArray.get([0]).value.prefixFormCtrl,
        //   courseHoleSets: 0,
        //   teamMatch: false,
        //   pairsMatch: false,
        //   interLeague: false,
        //   publicTournament: false,
        //   confirmParticipants: this.formArray.get([0]).value.askConfirmation,
        //   noOfRounds: this.formArray.get([0]).value.numOfRounds,
        //   activeRound: 1,
        //   matchFormat: this.formArray.get([0]).value.courseInfo[0].matchFormat,
        //   pointsFormats: null,
        //   pointsValues: null,
        //   handicapAllocations: null,
        //   tee: "BLUE",
        //   scoreManagement: FilteredFlightt[0].scoreManagement,
        //   startDate: General.parseToDate(this.formArray.get([0]).value.startDateFormCtrl),
        //   endDate: General.parseToDate(this.formArray.get([0]).value.endDateFormCtrl),
        //   started: true,
        //   invited: false,
        //   singleRound: false,
        //   sponsorName: "",
        //   sponsorLogo: "",
        //   mobileLogoUrl: "",
        //   webLogoUrl: "",
        //   flightsCategory: FilteredFlightt,
        //   categories: tournamentCats,
        //   marshals: marshalsData,
        //   flights: tournamentFlights,
        //   members: tournamentMember,
        // };

        // let result = <any>await this.facadeService.addTournament(tournament);

        // if (result) {
        //   this.snackBar.open("Tournament has been setup.", "x", {
        //     duration: 5000,
        //   });
        //   this.reset();
        //   this.router.navigate(['/tournaments/view/' + this.tournamentID]);
        // }

        let result = <any>(
            await this.facadeService.createNextRoundFlights(tournamentFlights)
        );

        //result = <any>await this.facadeService.createTournamentMarshals(marshalsData);

        if (result) {
            this.snackBar.open('Tournament has been setup.', 'x', {
                duration: 5000,
            });
            this.reset();
            this.router.navigate(['/tournaments/view/' + this.tournamentID]);
        }
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
        const dialogRef = this.dialog.open(DialogOverviewComponent, {
            width: '350px',
            data: 'Do you want to remove this player from group?',
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                //console.log("record deleted.");
                data.splice(DelplayerIndex, 1);
                //data.splice(playerId, 1);
                this.clubMembers.splice(0, 0, DelplayerInfo[0]);

                console.log(this.selection);

                this.tournamentMembers = data;
                this.selection.clear();
                this.syncClubMembers();
                this.syncTournamentMembers();

                this.facadeService.deleteTournamentMember(
                    this.tournamentID,
                    playerId
                );
            } else {
                //console.log("cancel delete action");
            }
        });
    }

    movePlayer(flight: number, cplayer: number) {
        //console.log(flight + "<- ->" + player);
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
                //console.log(result);
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

    public reset() {
        this.formGroup.reset();
    }

    /** Whether the number of selected elements matches the total number of rows. */
    isAllSelected() {
        //console.log(this.dataSource);
        if (this.dataSource) {
            const numSelected = this.selection.selected.length;
            const numRows = this.dataSource.data.length;
            return numSelected === numRows;
        }
    }

    /** Selects all rows if they are not all selected; otherwise clear selection. */
    masterToggle() {
        console.log(this.selection);
        console.log(this.selection.selected.length);
        this.isAllSelected()
            ? this.selection.clear()
            : this.dataSource.data.forEach((row) => this.selection.select(row));
    }

    /** The label for the checkbox on the passed row */
    checkboxLabel(row?: Player): string {
        if (!row) {
            return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
        }
        return `${
            this.selection.isSelected(row) ? 'deselect' : 'select'
        } player ${row.firstName} ${row.lastName}`;
    }

    addFlight() {
        //console.log(this.selectedMembers.length);
        this.selectedMembers[this.selectedMembers.length] = [];
        this.selectedMembers[this.selectedMembers.length - 1]['id'] =
            UniqueIdGenerator.generate();
        this.selectedMembers[this.selectedMembers.length - 1]['time'] = '09:00';
        this.selectedMembers[this.selectedMembers.length - 1]['startingHole'] =
            '1';
        //console.log(this.selectedMembers.length);
        //this.selectedMembers[this.selectedMembers.length - 1].push(player);
        //console.log(this.selectedMembers);
    }

    addFlightPlayer() {
        const dialogRef = this.dialog.open(DialogPlayerComponent, {
            width: '350px',
            data: { flights: this.selectedMembers.length },
        });

        dialogRef.afterClosed().subscribe((result) => {
            console.log(result);
            if (result) {
                //console.log("record deleted.");
                console.log(result.player);
                this.selectedMembers[result.flight].splice(
                    this.selectedMembers[result.flight].length - 3,
                    0,
                    result.player
                );
            } else {
                //console.log("cancel delete action");
            }
        });
    }

    addPlayer() {
        const dialogRef = this.dialog.open(DialogAddPlayerComponent, {
            data: { flights: this.selectedMembers.length },
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                //console.log("record deleted.");
                //console.log(result);
                this.clubMembers.push(result);
                //console.log(this.clubMembers);
                this.syncClubMembers();
            } else {
                //console.log("cancel delete action");
            }
        });
    }

    playerList() {
        const dialogRef = this.dialog.open(DialogPlayerListComponent, {
            data: { players: this.tournamentMembers },
        });

        dialogRef.afterClosed().subscribe((result) => {
            console.log(result);
            if (result) {
                //console.log("record deleted.");
                console.log(result);
                this.clubMembers.push(result);
                console.log(this.clubMembers);
                this.syncClubMembers();
            } else {
                //console.log("cancel delete action");
            }
        });
    }

    searchPlayer() {
        const dialogRef = this.dialog.open(DialogPlayerComponent, {
            width: '740px',
            data: { flights: this.selectedMembers.length },
        });

        dialogRef.afterClosed().subscribe((result) => {
            console.log(result);
            if (result) {
                //console.log("record deleted.");
                console.log(result);

                let founded = this.tournamentMembers.filter((a) => {
                    return a.id == result.player.id;
                });
                console.log(founded);

                if (founded.length == 0) {
                    let tournamentMember: TournamentMember[] = [];

                    let member: any = {
                        tournamentId: this.tournamentID,
                        playerId: result.player.id,
                        status: true,
                    };

                    tournamentMember.push(member);
                    this.saveMembers(tournamentMember);
                    this.tournamentMembers.push(result.player);
                    this.syncTournamentMembers();
                } else {
                    this.snackBar.open(
                        'Player already exist in the list.',
                        'x',
                        {
                            duration: 5000,
                        }
                    );
                }
            } else {
                //console.log("cancel delete action");
            }
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
        console.log(this.selection.isSelected(row));
        let status = false;

        if (typeof event.checked !== 'undefined')
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
            return a.name == row.playerCategory;
        });
        console.log(founded);

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
                console.log(this.categoryCounts);
            }
        }
    }

    updateTMCategorySelection() {
        this.TMcategoryCounts = [];
        if (this.tournamentMembers.length > 0) {
            for (let catCount of this.tournamentMembers) {
                console.log(catCount);
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
        console.log(this.TMcategoryCounts);
        return this.TMcategoryCounts;
    }
    deletedTMcategorySelection(PLcategory) {
        console.log(PLcategory);
        let founded = this.updateTMCategorySelection();
        if (founded.length > 0) {
            for (let catCount in founded) {
                console.log(catCount);
                if (founded[catCount].name == PLcategory) {
                    founded[catCount].value = founded[catCount].value - 1;
                } else {
                }
            }
            console.log(founded);
            this.TMcategoryCounts = founded;
        }
    }
    selectedTee(event, playerId) {
        console.log(playerId);
        let target = event.source.selected._element.nativeElement;
        let selectedData = {
            value: event.value,
            text: target.innerText.trim(),
        };
    }
    texas(event) {
        console.log(this.formGroup.value);

        console.log(event);
        if (event.value == matchFormat.TEXAS_SCRAMBLE) {
            // let obj={
            //   id:1,
            //   name:"Amateurs"
            // }
            // this.formArray.get([0]).value.clubctgies.push(obj)
            // console.log( this.formArray.get([0]).value.clubctgies);

            this.showCat = false;
        } else {
            this.showCat = true;
        }
    }

    // getGrossNetTop(selectedCTName, type) {
    //   if (selectedCTName.replace(/\s/g, "").toLowerCase() == Constants.CATEGORY_AMATEURS.replace(/\s/g, "").toLowerCase()) {
    //     if (type == "GT")
    //       return +this.formArray.get([0]).value.amateursGT;
    //     else
    //       return +this.formArray.get([0]).value.amateursNT;
    //   }
    //   else if (selectedCTName.replace(/\s/g, "").toLowerCase() == Constants.CATEGORY_SENIORS.replace(/\s/g, "").toLowerCase()) {
    //     if (type == "GT")
    //       return +this.formArray.get([0]).value.seniorsGT;
    //     else
    //       return +this.formArray.get([0]).value.seniorsNT;
    //   }
    //   else if (selectedCTName.replace(/\s/g, "").toLowerCase() == Constants.CATEGORY_VETERANS.replace(/\s/g, "").toLowerCase()) {
    //     if (type == "GT")
    //       return +this.formArray.get([0]).value.veteransGT;
    //     else
    //       return +this.formArray.get([0]).value.veteransNT;
    //   }
    //   else if (selectedCTName.replace(/\s/g, "").toLowerCase() == Constants.CATEGORY_JUNIORS.replace(/\s/g, "").toLowerCase()) {
    //     if (type == "GT")
    //       return +this.formArray.get([0]).value.juniorsGT;
    //     else
    //       return +this.formArray.get([0]).value.juniorsNT;
    //   }
    //   else if (selectedCTName.replace(/\s/g, "").toLowerCase() == Constants.CATEGORY_LADIES.replace(/\s/g, "").toLowerCase()) {
    //     if (type == "GT")
    //       return +this.formArray.get([0]).value.ladiesGT;
    //     else
    //       return +this.formArray.get([0]).value.ladiesNT;
    //   }
    //   else if (selectedCTName.replace(/\s/g, "").toLowerCase() == Constants.CATEGORY_PROFESSIONALS.replace(/\s/g, "").toLowerCase()) {
    //     if (type == "GT")
    //       return +this.formArray.get([0]).value.professionalsGT;
    //     else
    //       return +this.formArray.get([0]).value.professionalsNT;
    //   }
    //   else return 0;
    // }

    // public hasError = (controlName: string, errorName: string) => {
    //   return this.clubForm.controls[controlName].hasError(errorName);
    // }
}
