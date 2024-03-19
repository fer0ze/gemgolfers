import { Component, OnInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
    FormArray,
    FormControl,
    FormBuilder,
    Validators,
    FormGroup,
} from '@angular/forms';
import { Player } from '../../../../shared/models/player.model';
import { TeeTime, TeeTimeSlot } from '../../../../shared/models/teetime.model';
import { FacadeService } from '../../../../shared/services/facade.service';
import {
    General,
    UniqueIdGenerator,
    Constants,
} from '../../../../shared/classes/general';
import { Router } from '@angular/router';
import { LocalStorageService } from 'app/shared/services/localStorage';
import { Course } from 'app/shared/models/course.model';
import { map, startWith } from 'rxjs';
import { Club } from 'app/shared/models/club.model';

@Component({
    selector: 'app-add-tee-times',
    templateUrl: './add-tee-times.component.html',
    styleUrls: ['./add-tee-times.component.scss'],
})
export class AddTeeTimesComponent implements OnInit {
    scheduleForm: FormGroup;
    loggedInuser: Player;
    showTeeTime: boolean = false;
    showGuestTee: boolean = false;
    showGuestTime: boolean = false;
    teeSlots: any[] = [];
    minDate: Date;
    maxDate: Date;
    Courses: Course[] = [];
    Clubs: Club[] = [];
    filteredCourseOptions: any;
    filteredClubOptions: any;
    tee: '1' | '10' = '1';
    guestTee: '1' | '10' = '1';
    hideClubs: boolean = true;
    constructor(
        private fb: FormBuilder,
        private facadeService: FacadeService,
        public snackBar: MatSnackBar,
        private router: Router,
        private _localStorage: LocalStorageService,
    ) { }

    async ngOnInit() {
        this.loggedInuser = this._localStorage.get(Constants.LOGGED_IN_USER);
        console.log(this.loggedInuser);

        this.scheduleForm = this.fb.group({
            allowNineHole: [false, Validators.required],
            teeDate: [new Date(), Validators.required],
            bookingDate: [new Date(), Validators.required],
            teeBookingTime: ['09:00', Validators.required],
            teeOneStartTime: ['09:00', Validators.required],
            teeOneEndTime: ['16:00', Validators.required],
            teeTenStartTime: ['09:00', Validators.required],
            teeTenEndTime: ['16:00', Validators.required],
            guestTeeOneStartTime: ['09:00', Validators.required],
            guestTeeOneEndTime: ['16:00', Validators.required],
            guestTeeTenStartTime: ['09:00', Validators.required],
            guestTeeTenEndTime: ['16:00', Validators.required],
            interval: [5, Validators.required],
            courseName: ['', Validators.required],
            club: ['', Validators.required],
            noOfPlayers: ['4', Validators.required],
            allowGuest: ['0', Validators.required],
            startingHole: ['1', Validators.required],
            guestStartingHole: ['1', Validators.required],
        });
        let dataClubs = await this.facadeService.getClubList();
        this.Clubs = dataClubs.club;
        let dataCourses = await this.facadeService.getCoursesList();
        this.Courses = dataCourses.course;
        this.hideClubs = this.loggedInuser.userRole > 1 ? true : false;
        let today: Date = new Date();
        let dd = String(today.getDate()).padStart(2, '0');
        let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        let yyyy = today.getFullYear();

        let todayDate: Date = General.parseToDate(mm + '/' + dd + '/' + yyyy);

        const currentYear = new Date().getFullYear();
        this.minDate = todayDate;
        this.maxDate = new Date(currentYear + 1, 11, 31);
        if (this.loggedInuser.userRole > 1) {
            let clubInfo: any =
                this.loggedInuser?.membership.length > 0
                    ? this.loggedInuser?.membership[0].club
                    : [];

            let courseName: string =
                clubInfo?.courses.length > 0
                    ? clubInfo?.courses[0].name
                    : '-KpFJ5_ODeRpEQCz9Drd';
            let courseId: string =
                clubInfo?.courses.length > 0
                    ? clubInfo?.courses[0].id
                    : '-KpFJ5_ODeRpEQCz9Drd';
            this.scheduleForm.get('courseName').setValue({
                id: courseId,
                name: courseName
            })
            this.scheduleForm
                .get('club')
                .setValue({
                    id: clubInfo?.id,
                    name: clubInfo?.name
                });
        }
        this.filteredCourseOptions = this.scheduleForm
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


        this.filteredClubOptions = this.scheduleForm
            .get('club')!
            .valueChanges.pipe(
                startWith(''),
                map((value) =>
                    typeof value === 'string' ? value : value ? value.name : ''
                ),
                map((name) => (name ? this._filter(name) : this.Clubs.slice()))
            );
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

    async createSchedule() {
        // TODO: Use EventEmitter with form value
        try {
            console.log(this.scheduleForm.value);
            let clubId: string = this.loggedInuser.adminClubId;
            let isExist: TeeTime[] =
                await this.facadeService.isTeeTimeDateExist(
                    clubId,
                    General.parseToDate(this.scheduleForm.value.teeDate)
                );

            //console.log(isExist['tee_time_booking']);

            if (isExist['tee_time_booking'].length > 0) {
                this.snackBar.open(
                    'Selected date is already exist. Choose different.',
                    'x',
                    {
                        duration: 5000,
                    }
                );
                return false;
            }

            this.generateTeeTimes();
            console.log(this.teeSlots);

            let teeTimeSlots: TeeTimeSlot[] = [];

            for (let slot of this.teeSlots) {

                let tee1: any = {
                    id: UniqueIdGenerator.generate(),
                    slotTime: (slot.time),
                    joinedMembers: 0,
                    startingHole:
                        this.scheduleForm.value.startingHole !== 'both'
                            ? Number(this.scheduleForm.value.startingHole)
                            : slot.hole,
                    flightId: null,
                    allowGuest: slot.allowGuest,
                };
                teeTimeSlots.push(tee1);
            }

            const schedule: TeeTime = {
                id: UniqueIdGenerator.generate(),
                clubId: this.scheduleForm.value?.club.id,
                courseId: this.scheduleForm.value?.courseName.id,
                bookingDate: General.parseToDate(this.scheduleForm.value.bookingDate),
                teeDate: General.parseToDate(this.scheduleForm.value.teeDate),
                startTime: this.scheduleForm.value.teeOneStartTime,
                noOfPlayers: Number(this.scheduleForm.value.noOfPlayers),
                endTime: this.scheduleForm.value.startingHole == 'both' ? this.scheduleForm.value.teeTenEndTime : this.scheduleForm.value.teeOneEndTime,
                interval: this.scheduleForm.value.interval,
                teeTimeSlot: teeTimeSlots,
                allowNineHole: this.scheduleForm.value.allowNineHole,
                bookingTime: this.scheduleForm.value.teeBookingTime
            };

            //console.log(schedule);

            let response = await this.facadeService.AddTeeTimeSchedule(schedule);

            if (response) {
                this.snackBar.open('Tee Time has been created.', 'x', {
                    duration: 2000,
                });
                this.reset();
                this.router.navigate(['/teetimes']);
            }
        } catch {
            this.snackBar.open('Something went wrong. Try again later.', 'x', {
                duration: 5000,
            });
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

        return this.Courses;
    }
    displayCourseFn(course: any): string {
        //console.log(course);
        return typeof course === 'string'
            ? course
            : course.course
                ? course.course.name
                : course.name;
    }
    displayFn(club: Club): string {
        return typeof club === 'string' ? club : club ? club.name : '';
    }

    generateTeeTimes() {

        try {
            this.teeSlots = [];
            const createSlot = (hole, startTime, endTime, guestHole) => {
                let startLimit = new Date(Constants.DEFAULT_DATE + ' ' + startTime.substr(0, 5));
                const endLimit = new Date(Constants.DEFAULT_DATE + ' ' + endTime.substr(0, 5));
                while (startLimit <= endLimit) {
                    const h = startLimit.getHours();
                    const m = startLimit.getMinutes();
                    const time = ('0' + h).slice(-2) + ':' + ('0' + m).slice(-2);
                    const allowGuest = this.scheduleForm.value.allowGuest == '1' &&
                        this.scheduleForm.value.guestTeeOneStartTime && hole == guestHole &&
                        this.scheduleForm.value.guestTeeOneEndTime &&
                        startLimit >= new Date(Constants.DEFAULT_DATE + ' ' + this.scheduleForm.value.guestTeeOneStartTime.substr(0, 5)) &&
                        startLimit <= new Date(Constants.DEFAULT_DATE + ' ' + this.scheduleForm.value.guestTeeOneEndTime.substr(0, 5));
                    this.teeSlots.push({ hole, time, allowGuest });
                    startLimit.setMinutes(startLimit.getMinutes() + this.scheduleForm.value.interval);
                }
            };
            let hole = this.scheduleForm.value.startingHole !== 'both'
                ? Number(this.scheduleForm.value.startingHole) : 1;
            let guesthole = this.scheduleForm.value.guestStartingHole !== 'both'
                ? Number(this.scheduleForm.value.guestStartingHole) : 1;
            createSlot(hole, this.scheduleForm.value.teeOneStartTime, this.scheduleForm.value.teeOneEndTime, guesthole);
            if (this.scheduleForm.value.startingHole == 'both') {
                createSlot(10, this.scheduleForm.value.teeTenStartTime, this.scheduleForm.value.teeTenEndTime, guesthole);
            }
        } catch { }
    }


    public reset() {
        this.scheduleForm.reset();
    }

    public onCancel() { }

    public teeChange(event) {
        console.log(event);
        if (event.value == 'both') {
            this.showTeeTime = true;
            this.tee = '1';
        } else {
            this.tee = event.value;
            this.showTeeTime = false;
        }
    }
    public guestTeeChange(event) {
        console.log(event);
        if (event.value == 'both') {
            this.showGuestTee = true;
            this.guestTee = '1';
        } else {
            this.guestTee = event.value;
            this.showGuestTee = false;
        }
    }
    public participantsChange(event) {
        console.log(event);
        if (event.value == '1') {
            this.showGuestTime = true;
        } else {
            this.showGuestTime = false;
        }
    }

    convertToUTC(timeString) {
        // Parse the time string
        const [hours, minutes] = timeString.split(':').map(str => parseInt(str));

        // Create a Date object with today's date and the provided time
        const date = new Date(General.parseToDate(this.scheduleForm.value.BookingDate));
        date.setHours(hours);
        date.setMinutes(minutes);

        // Convert the time to UTC by subtracting the timezone offset
        date.setMinutes(date.getMinutes() - date.getTimezoneOffset());

        // Return the time in UTC format
        return date.toISOString();
    }
    convertToUTCTime(timeString: string): string {
        // Parse the time string
        const [hours, minutes] = timeString.split(':').map(str => parseInt(str));

        // Create a Date object with today's date and the provided time
        const date = new Date();
        date.setUTCHours(hours);
        date.setUTCMinutes(minutes);

        // Convert the time to UTC by subtracting the timezone offset
        date.setMinutes(date.getMinutes() - date.getTimezoneOffset());

        // Return the time in UTC format
        return date.toISOString().substr(11, 5);
    }

}
