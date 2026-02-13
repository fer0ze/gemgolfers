import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import {
    MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA,
    MatLegacyDialogRef as MatDialogRef,
    MatLegacyDialogClose as MatDialogClose,
} from '@angular/material/legacy-dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar';
import { Club } from '../../../../shared/models/club.model';
import {
    Player,
    PlayerCategory,
    ClubMembership,
} from '../../../../shared/models/player.model';
import { FacadeService } from '../../../../shared/services/facade.service';
import {
    UniqueIdGenerator,
    generateGemId,
    Constants,
    General,
} from '../../../../shared/classes/general';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSort } from '@angular/material/sort';
import { MatLegacyPaginator as MatPaginator } from '@angular/material/legacy-paginator';
@Component({
    selector: 'app-dialog-add-league',
    templateUrl: './dialog-add-league.component.html',
    styleUrls: ['./dialog-add-league.component.scss'],
})
export class DialogAddLeagueComponent implements OnInit {

    public tourForm: FormGroup;
    pictureUrl: any;
    file: any;
    @ViewChild('avatarFileInput') private _avatarFileInput: ElementRef;
    minDate: Date;
    maxDate: Date;
    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialogRef: MatDialogRef<DialogAddLeagueComponent>
    ) { }

    ngOnInit(): void {
        this.tourForm = new FormGroup({
            title: new FormControl('', [
                Validators.required,
                Validators.maxLength(60),
            ]),
            logo: new FormControl(''),
        });
    }

    onNoClick(): void {
        this.dialogRef.close();
    }
    onSubmit() {
    }
    createTour(value) {
        let result = {
            file: this.file,
            title: value.title,
        }
        this.dialogRef.close(result);
    }

    public hasError = (controlName: string, errorName: string) => {
        return this.tourForm.controls[controlName].hasError(errorName);
    };
    uploadAvatar(fileList: FileList): void {
        // Return if canceled
        if (!fileList.length) {
            this.pictureUrl = null;
            return;
        }

        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        this.file = fileList[0];
        //console.log(this.file);

        const reader = new FileReader();
        reader.onload = (event: any) => {
            // Set the selectedImage variable with the data URL
            this.pictureUrl = event.target.result;
        };

        // Return if the file is not allowed
        if (!allowedTypes.includes(this.file.type)) {
            return;
        }
        reader.readAsDataURL(this.file);
    }
}
