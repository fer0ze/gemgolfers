import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FacadeService } from 'app/shared/services/facade.service';
import { HandicapService } from 'app/shared/services/handicap.service';

@Component({
    selector: 'app-dialog-tee',
    templateUrl: './dialog-tee.component.html',
    styleUrls: ['./dialog-tee.component.scss'],
})
export class DialogTeeComponent implements OnInit {
    show: boolean = false;
    showPanelty: boolean = false;
    form: FormGroup;
    tees: any[] = [];
    constructor(
        public dialogRef: MatDialogRef<DialogTeeComponent>, private handicapService: HandicapService, public snackBar: MatSnackBar,
        @Inject(MAT_DIALOG_DATA) public data: any, public facadeService: FacadeService,
    ) { }
    async ngOnInit() {
        this.form = new FormGroup({
            tee: new FormControl('', [Validators.required]),
        });

        console.log(this.data);
        let club: any =
            this.data.loggedInUser.membership.length > 0
                ? this.data.loggedInUser.membership[0].club
                : null;

        let courseID =
            club != null ? club.courses[0].id : '-LUFS3FCQKOGpJ2IEHmf';
        let tees = await this.facadeService.getTeesOfCourse(courseID);
        console.log(tees);
        this.tees = tees?.course_tees;


    }
    onNoClick(): void {
        this.dialogRef.close();
    }
    async changeTee() {
        console.log(this.form.getRawValue());
        try {
            let formValue = this.form.getRawValue();
            let response = await this.facadeService.changePlayerTee(this.data.player.id, formValue?.tee?.tee_name?.key, formValue?.tee?.tee_id);
            if (response) {
                let newObj = {
                    playerId: this.data.player.id,
                    count: 8,
                };
                await this.handicapService
                    .calculateHandicapWHS(newObj)
                    .then((response) => {
                        this.snackBar.open('Tees Changed successfully!.', 'x', {
                            duration: 2000,
                        });
                        this.dialogRef.close();
                    })
                    .catch((err) => {
                        //console.log('error' + err);
                        this.snackBar.open('Error!.', 'x', {
                            duration: 5000,
                        });
                    });
            }
        } catch (error) {
            this.snackBar.open('Error!.', 'x', {
                duration: 5000,
            });
        }
    }
}
