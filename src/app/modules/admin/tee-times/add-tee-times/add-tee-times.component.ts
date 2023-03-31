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

@Component({
    selector: 'app-add-tee-times',
    templateUrl: './add-tee-times.component.html',
    styleUrls: ['./add-tee-times.component.scss'],
})
export class AddTeeTimesComponent implements OnInit {
    scheduleForm: FormGroup;
    loggedInuser: Player;
    refresh: boolean = false;
    teeSlots: string[] = [];
    minDate: Date;
    maxDate: Date;
    drawerMode: 'over' | 'side' = 'side';
    constructor(
        private fb: FormBuilder,
        private facadeService: FacadeService,
        public snackBar: MatSnackBar,
        private router:Router,
    ) {}

    ngOnInit() {
        this.scheduleForm = this.fb.group({
            allowNineHole: [false, Validators.required],
            BookingDate: ['', Validators.required],
            startTime: ['09:00', Validators.required],
            endTime: ['16:00', Validators.required],
            interval: [5, Validators.required],
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
            this.loggedInuser = JSON.parse(
                localStorage.getItem(Constants.LOGGED_IN_USER)
            );
            let clubId: string = this.loggedInuser.adminClubId;

            let isExist: TeeTime[] =
                await this.facadeService.isTeeTimeDateExist(
                    clubId,
                    General.parseToDate(this.scheduleForm.value.BookingDate)
                );

            console.log(isExist['tee_time_booking']);

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
                clubInfo.length > 0 && clubInfo.courses.length > 0
                    ? clubInfo.courses[0].id
                    : '-KpFJ5_ODeRpEQCz9Drd';

            this.generateTeeTimes();
            console.log(this.teeSlots);

            let teeTimeSlots: TeeTimeSlot[] = [];

            for (let slot of this.teeSlots) {
                let tee1: any = {
                    id: UniqueIdGenerator.generate(),
                    slotTime: slot,
                    joinedMembers: 0,
                    startingHole:
                        this.scheduleForm.value.startingHole == 'both'
                            ? 1
                            : Number(this.scheduleForm.value.startingHole),
                    flightId: null,
                };

                teeTimeSlots.push(tee1);

                if (this.scheduleForm.value.startingHole == 'both') {
                    let tee10: any = {
                        id: UniqueIdGenerator.generate(),
                        slotTime: slot,
                        joinedMembers: 0,
                        startingHole: 10,
                        flightId: null,
                    };

                    teeTimeSlots.push(tee10);
                }
            }

            //console.log(this.scheduleForm);
            const schedule: TeeTime = {
                id: UniqueIdGenerator.generate(),
                clubId: clubId,
                courseId: courseId,
                bookingDate: General.parseToDate(
                    this.scheduleForm.value.BookingDate
                ),
                startTime: this.scheduleForm.value.startTime,
                endTime: this.scheduleForm.value.endTime,
                interval: this.scheduleForm.value.interval,
                teeTimeSlot: teeTimeSlots,
                allowNineHole: this.scheduleForm.value.allowNineHole,
            };

            console.log(schedule);

            let response = this.facadeService.AddTeeTimeSchedule(schedule);

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
            let startLimit: Date = new Date(
                Constants.DEFAULT_DATE +
                    ' ' +
                    this.scheduleForm.value.startTime.substr(0, 5)
            );
            let endLimit: Date = new Date(
                Constants.DEFAULT_DATE +
                    ' ' +
                    this.scheduleForm.value.endTime.substr(0, 5)
            );
            console.log(startLimit);
            while (startLimit <= endLimit) {
                var h = startLimit.getHours();
                var m = startLimit.getMinutes();

                this.teeSlots.push(
                    ('0' + h).slice(-2) + ':' + ('0' + m).slice(-2)
                );

                startLimit.setMinutes(
                    startLimit.getMinutes() + this.scheduleForm.value.interval
                );
                console.log(this.scheduleForm.value.interval);
                console.log(startLimit);
            }
        } catch {}
    }

    public reset() {
        this.scheduleForm.reset();
    }

    public onCancel() {}
}
