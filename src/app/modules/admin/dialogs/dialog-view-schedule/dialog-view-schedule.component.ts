import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';

@Component({
  selector: 'app-dialog-view-schedule',
  templateUrl: './dialog-view-schedule.component.html',
  styleUrls: ['./dialog-view-schedule.component.scss']
})
export class DialogViewScheduleComponent implements OnInit {

  public response: any;
  scheduleInfo: any;

  constructor(
      public dialogRef: MatDialogRef<DialogViewScheduleComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit() {
    this.scheduleInfo = this.data.schedule;
    //console.log(this.scheduleInfo);
  }

  onNoClick(): void {
      this.dialogRef.close();
  }

}
