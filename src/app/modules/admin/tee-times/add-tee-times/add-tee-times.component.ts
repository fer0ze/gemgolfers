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

@Component({
    selector: 'app-add-tee-times',
    templateUrl: './add-tee-times.component.html',
    styleUrls: ['./add-tee-times.component.scss'],
})
export class AddTeeTimesComponent implements OnInit {
    scheduleForm: FormGroup;
    loggedInuser: Player;
    showTeeTime: boolean = false;
    teeSlots: string[] = [];
    minDate: Date;
    maxDate: Date;
    drawerMode: 'over' | 'side' = 'side';
    constructor(
        private fb: FormBuilder,
        private facadeService: FacadeService,
        public snackBar: MatSnackBar,
        private router: Router,
        private _localStorage: LocalStorageService,
    ) { }

    ngOnInit() {
        this.scheduleForm = this.fb.group({
            allowNineHole: [false, Validators.required],
            BookingDate: ['', Validators.required],
            teeBookingTime: ['09:00', Validators.required],
            teeOneStartTime: ['09:00', Validators.required],
            teeOneEndTime: ['16:00', Validators.required],
            teeTenStartTime: ['09:00', Validators.required],
            teeTenEndTime: ['16:00', Validators.required],
            interval: [5, Validators.required],
            noOfPlayers: ['4', Validators.required],
            startingHole: ['1', Validators.required],

        });

        let today: Date = new Date();
        let dd = String(today.getDate()).padStart(2, '0');
        let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        let yyyy = today.getFullYear();

        let todayDate: Date = General.parseToDate(mm + '/' + dd + '/' + yyyy);

        const currentYear = new Date().getFullYear();
        this.minDate = todayDate;
        this.maxDate = new Date(currentYear + 1, 11, 31);
    }

    createHobbies(hobbiesInputs) {
        const arr = hobbiesInputs.map((hobby) => {
            return new FormControl(hobby.selected || false);
        });
        return new FormArray(arr);
    }

    async createSchedule() {
        // TODO: Use EventEmitter with form value
        try {
            console.log(this.scheduleForm.value);
            this.loggedInuser = this._localStorage.get(Constants.LOGGED_IN_USER);

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

            let clubInfo: any =
                this.loggedInuser.membership.length > 0
                    ? this.loggedInuser.membership[0].club
                    : [];
            console.log(clubInfo);
            let courseId: string =
                clubInfo?.courses.length > 0
                    ? clubInfo.courses[0].id
                    : '-KpFJ5_ODeRpEQCz9Drd';

            this.generateTeeTimes();
            console.log(this.teeSlots);

            let teeTimeSlots: TeeTimeSlot[] = [];

            for (let slot of this.teeSlots) {

                let tee1: any = {
                    id: UniqueIdGenerator.generate(),
                    slotTime:this.convertToUTCTime(slot),
                    joinedMembers: 0,
                    startingHole:
                        this.scheduleForm.value.startingHole !== 'both'
                            ? Number(this.scheduleForm.value.startingHole)
                            : 1,
                    flightId: null,
                };
                if (this.scheduleForm.value.startingHole == 'both') {
                    if (slot < this.scheduleForm.value.teeOneEndTime) {
                        tee1.startingHole = 1;
                    } else {
                        tee1.startingHole = 10;
                    }
                }
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
                clubId: clubId,
                courseId: courseId,
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

    generateTeeTimes() {
        try {
            this.teeSlots = [];
            let startLimit;
            let endLimit;
            if (this.scheduleForm.value.startingHole == '1' || this.scheduleForm.value.startingHole == '10') {
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
            } else if (this.scheduleForm.value.startingHole == 'both') {
                startLimit = new Date(
                    Constants.DEFAULT_DATE +
                    ' ' +
                    this.scheduleForm.value.teeOneStartTime.substr(0, 5)
                );
                endLimit = new Date(
                    Constants.DEFAULT_DATE +
                    ' ' +
                    this.scheduleForm.value.teeTenEndTime.substr(0, 5)
                );
            }
            //console.log(startLimit);
            while (startLimit <= endLimit) {
                var h = startLimit.getHours();
                var m = startLimit.getMinutes();

                this.teeSlots.push(
                    ('0' + h).slice(-2) + ':' + ('0' + m).slice(-2)
                );

                startLimit.setMinutes(
                    startLimit.getMinutes() + this.scheduleForm.value.interval
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
