import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: "app-dialog-showfeedback",
  templateUrl: "./dialog-showfeedback.component.html",
  styleUrls: ["./dialog-showfeedback.component.scss"],
})
export class DialogShowfeedbackComponent implements OnInit {

  showMessage: boolean = true;
  feedbackForm!: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DialogShowfeedbackComponent>,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    if (!this.data) {
      this.showMessage = false;
      this.initForm();
    }
  }

  initForm() {
    this.feedbackForm = new FormGroup({
      type: new FormControl('GENERAL_FEEDBACK', [Validators.required]),
      message: new FormControl('', [Validators.required]),
    });
  }

  submitFeedback() {
    if (this.feedbackForm.valid) {
      this.dialogRef.close(this.feedbackForm.getRawValue());

      // Example payload:
      // {
      //   type: 'bug',
      //   message: 'Something is broken'
      // }

      // Call API or close dialog with data
    }
  }
}
