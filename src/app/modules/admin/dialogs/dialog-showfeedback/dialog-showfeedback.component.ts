import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { FacadeService } from "app/shared/services/facade.service";
import { FEEDBACK_STATUSES } from "../../feedback/feedback.component";

@Component({
    standalone: false,
  selector: "app-dialog-showfeedback",
  templateUrl: "./dialog-showfeedback.component.html",
  styleUrls: ["./dialog-showfeedback.component.scss"],
})
export class DialogShowfeedbackComponent implements OnInit {

  isDetailView: boolean = false;
  feedbackForm!: FormGroup;
  statuses = FEEDBACK_STATUSES;
  selectedStatus: string = 'pending';
  saving: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DialogShowfeedbackComponent>,
    private facadeService: FacadeService,
  ) { }

  ngOnInit() {
    if (this.data?.feedback) {
      this.isDetailView = true;
      this.selectedStatus = this.data.feedback.status ?? 'pending';
    } else {
      this.feedbackForm = new FormGroup({
        type: new FormControl('GENERAL_FEEDBACK', [Validators.required]),
        message: new FormControl('', [Validators.required]),
      });
    }
  }

  getStatusColor(status: string): string {
    return this.statuses.find(s => s.value === status)?.color ?? '#94a3b8';
  }

  getInitials(): string {
    const p = this.data?.feedback?.player;
    if (!p) return '?';
    return ((p.firstName?.[0] ?? '') + (p.lastName?.[0] ?? '')).toUpperCase();
  }

  async saveStatus() {
    this.saving = true;
    const ok = await this.facadeService.updateFeedbackStatus(this.data.feedback.id, this.selectedStatus);
    this.saving = false;
    if (ok) {
      this.dialogRef.close(this.selectedStatus);
    }
  }

  submitFeedback() {
    if (this.feedbackForm.valid) {
      this.dialogRef.close(this.feedbackForm.getRawValue());
    }
  }
}
