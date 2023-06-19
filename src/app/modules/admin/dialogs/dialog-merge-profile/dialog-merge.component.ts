import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-dialog-merge',
    templateUrl: './dialog-merge.component.html',
    styleUrls: ['./dialog-merge.component.scss'],
})
export class DialogMergeComponent implements OnInit {
    show: boolean = false;
    showPanelty: boolean = false;
    form: FormGroup;

    ngOnInit() {
        this.form = new FormGroup({
            count: new FormControl('', [Validators.required]),
        });
        this.form.get('count').clearValidators();
        this.form.get('count').updateValueAndValidity();
        this.showPanelty=this.data.isPanelty;
    }
    constructor(
        public dialogRef: MatDialogRef<DialogMergeComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {}

    onNoClick(): void {
        this.dialogRef.close();
    }
    toggle(event) {
        console.log(event);
        this.show = event.checked;

        if (this.show) {
            this.form.get('count').addValidators([Validators.required]);

        } else {
            this.form.get('count').clearValidators();
        }
        this.form.get('count').updateValueAndValidity();
    }
}
