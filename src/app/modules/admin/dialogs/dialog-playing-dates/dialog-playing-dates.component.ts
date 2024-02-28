import { Component, Inject, OnInit } from "@angular/core";
import {
  MatDialogRef,
  MAT_DIALOG_DATA,

} from "@angular/material/dialog";
import { MatCheckboxModule } from "@angular/material/checkbox";
@Component({
  selector: "app-dialog-playing-dates",
  templateUrl: "./dialog-playing-dates.component.html",
  styleUrls: ["./dialog-playing-dates.component.scss"],
})
export class DialogPlayingDatesComponent implements OnInit {
  date: any[] = [];
  playingDates: any[] = [];
  categoryDate: any[] = [];
  category: any[] = [];
  constructor(
    public dialogRef: MatDialogRef<DialogPlayingDatesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    //console.log(this.data);
    for (let i of this.data.dates) {
      //console.log(i);
      let obj = {
        dates: i,
      };
      this.date.push(obj);
    }
    // for (let i of this.data.category) {
    //   //console.log(i);
    //   let obj = {
    //     cat: i,
    //   };
    //   this.category.push(obj);
    // }
    this.category=this.data.category.name;
    // if (this.category.length > 1) {
    //   let pop: any = this.category.pop();
    //   this.categoryDate.push(pop);
    //   //console.log(this.categoryDate);
    //   //console.log(this.category);
    // }
    //console.log(this.category);
    //console.log(this.categoryDate);
  }

  dateChange(event, t) {
    ////console.log(this.category[0]["cat"].id);
    ////console.log(this.category["cat"].id);

    let obj = {
      id:
      this.data.category.id,
      name:
      this.data.category.name,

      dates: t,
    };

    this.playingDates.push(obj);
    //console.log(t);
    //console.log(this.playingDates);
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}
