import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-edit-player-handicap',
  templateUrl: './dialog-edit-player-handicap.component.html',
  styleUrls: ['./dialog-edit-player-handicap.component.scss']
})

export class DialogEditPlayerHandicapComponent implements OnInit {


  public playersForm: FormGroup;
  constructor(
    public dialogRef: MatDialogRef<DialogEditPlayerHandicapComponent>,
    private _formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {

    this.playersForm = this._formBuilder.group({
      handicap: ['', [Validators.required]],
    });

    this.playersForm.patchValue({
      handicap: this.data.player.handicap
    });
  }


  onNoClick(): void {
    this.dialogRef.close();
  }

  onSaveClick(): void {
    this.dialogRef.close(this.playersForm.value);
  }

}
