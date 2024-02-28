import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: "app-dialog-showfeedback",
  templateUrl: "./dialog-showfeedback.component.html",
  styleUrls: ["./dialog-showfeedback.component.scss"],
})
export class DialogShowfeedbackComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit() {
    //console.log(this.data);
  }
}
