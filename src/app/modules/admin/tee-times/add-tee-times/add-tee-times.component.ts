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
    teeSlots: any[] = [];
    minDate: Date;
    maxDate: Date;
    Courses: Course[] = [];
    Clubs: Club[] = [];
    filteredCourseOptions: any;
    filteredClubOptions: any;
    drawerMode: 'over' | 'side' = 'side';
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
            BookingDate: ['', Validators.required],
            teeBookingTime: ['09:00', Validators.required],
            teeOneStartTime: ['09:00', Validators.required],
            teeOneEndTime: ['16:00', Validators.required],
            teeTenStartTime: ['09:00', Validators.required],
            teeTenEndTime: ['16:00', Validators.required],
            interval: [5, Validators.required],
            courseName: ['', Validators.required],
            club: ['', Validators.required],
            noOfPlayers: ['4', Validators.required],
            allowGuest: ['0', Validators.required],
            startingHole: ['1', Validators.required],

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
                    General.parseToDate(this.scheduleForm.value.BookingDate)
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

            // let clubInfo: any =
            //     this.loggedInuser.membership.length > 0
            //         ? this.loggedInuser.membership[0].club
            //         : [];
            // console.log(clubInfo);
            // let courseId: string =
            //     clubInfo?.courses.length > 0
            //         ? clubInfo.courses[0].id
            //         : '-KpFJ5_ODeRpEQCz9Drd';

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
                    allowGuest: this.scheduleForm.value.allowGuest == '1' ? true : false,
                };
                // if (this.scheduleForm.value.startingHole == 'both') {
                //     if (slot < this.scheduleForm.value.teeOneEndTime) {
                //         tee1.startingHole = 1;
                //     } else {
                //         tee1.startingHole = 10;
                //     }
                // }
                teeTimeSlots.push(tee1);

                // if (this.scheduleForm.value.startingHole == 'both') {
                //     let tee10: any = {
                //         id: UniqueIdGenerator.generate(),
                //         slotTime: slot,
                //         joinedMembers: 0,
                //         startingHole: 10,
                //         flightId: null,
                //     };

                //     teeTimeSlots.push(tee10);
                // }
            }
            //  console.log(this.convertToUTC(this.scheduleForm.value.teeBookingTime));

            ////console.log(this.scheduleForm);
            const schedule: TeeTime = {
                id: UniqueIdGenerator.generate(),
                clubId: this.scheduleForm.value?.club.id,
                courseId: this.scheduleForm.value?.courseName.id,
                bookingDate: General.parseToDate(this.scheduleForm.value.BookingDate),
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
                    duration: 5000,
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
            let startLimit;
            let endLimit;
            let startLimit10;
            let endLimit10;
            if (this.scheduleForm.value.startingHole == 'both') {
                startLimit10 = new Date(
                    Constants.DEFAULT_DATE +
                    ' ' +
                    this.scheduleForm.value.teeTenStartTime.substr(0, 5)
                );
                endLimit10 = new Date(
                    Constants.DEFAULT_DATE +
                    ' ' +
                    this.scheduleForm.value.teeTenEndTime.substr(0, 5)
                );
            }
            startLimit = new Date(
                Constants.DEFAULT_DATE +
                ' ' +
                this.scheduleForm.value.teeOneStartTime.substr(0, 5)
            );
            endLimit = new Date(
                Constants.DEFAULT_DATE +
                ' ' +
                this.scheduleForm.value.teeOneEndTime.substr(0, 5)
            );
            //console.log(startLimit);
            while (startLimit <= endLimit) {
                var h = startLimit.getHours();
                var m = startLimit.getMinutes();

                this.teeSlots.push({
                    hole: 1,
                    time: ('0' + h).slice(-2) + ':' + ('0' + m).slice(-2)
                });

                startLimit.setMinutes(
                    startLimit.getMinutes() + this.scheduleForm.value.interval
                );
                //console.log(this.scheduleForm.value.interval);
                //console.log(startLimit);
            }
            while (startLimit10 <= endLimit10) {
                var h = startLimit10.getHours();
                var m = startLimit10.getMinutes();
                this.teeSlots.push({
                    hole: 10,
                    time: ('0' + h).slice(-2) + ':' + ('0' + m).slice(-2)
                });

                startLimit10.setMinutes(
                    startLimit10.getMinutes() + this.scheduleForm.value.interval
                );
                //console.log(this.scheduleForm.value.interval);
                //console.log(startLimit);
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
        } else {
            this.showTeeTime = false;
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
