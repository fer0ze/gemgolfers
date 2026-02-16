import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
    standalone: false,
    selector: 'app-dialog-overview',
    templateUrl: './dialog-overview.component.html',
    styleUrls: ['./dialog-overview.component.scss']
})
export class DialogOverviewComponent implements OnInit {
    ngOnInit() {}
    constructor(
        public dialogRef: MatDialogRef<DialogOverviewComponent>,
        @Inject(MAT_DIALOG_DATA) public message: any
    ) {}

    onNoClick(): void {
        this.dialogRef.close();
    }
}
