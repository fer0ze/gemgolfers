import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { FormArray, FormBuilder, Validators, FormGroup } from "@angular/forms";
import { FacadeService } from "../../../../shared/services/facade.service";
import { DatePipe } from "@angular/common";

@Component({
  selector: "app-dialog-close-round",
  templateUrl: "./dialog-close-round.component.html",
  styleUrls: ["./dialog-close-round.component.scss"],
})
export class DialogCloseRoundComponent implements OnInit {
  public collection: any;
  cutOffform: FormGroup;
  copyFlights: boolean = false;
  public categoryList: FormArray;
  public flightSettings: any;
  public nDate: Date;
  public tournament_member_category: any;
  public playingCat: any[] = [];
  public catArray: any[] = [];
  public PlayingFlight: Boolean;
  flightData: any;

  constructor(
    private datePipe: DatePipe,
    public dialogRef: MatDialogRef<DialogCloseRoundComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private facadeService: FacadeService
  ) {}

  async ngOnInit() {
    this.cutOffform = this.fb.group({
      category: this.fb.array([]),
    });

    console.log(this.data);
    console.log(this.cutOffform);

    this.categoryList = this.cutOffform.get("category") as FormArray;
    for (let c of this.data.categories) {
      console.log(c);

      console.log(c.category);
      this.tournament_member_category =
        await this.facadeService.getFlightSettings(
          this.data.tournament,
          c.category
        );
      console.log(this.tournament_member_category);

      this.tournament_member_category =
        this.tournament_member_category.tournament_member_category;
      console.log(this.tournament_member_category);
    }

    // for(let c of this.data.categories) {
    //   this.addField(c);
    // }

    for (let c of this.data.categories) {
      this.catArray[c.category] = [];
      this.catArray[c.category]["value"] = false;
      console.log(this.catArray);
      this.addCategoryFlightField(c.category);
    }

    //this.categoryList.removeAt(0);
    console.log(this.categoryList);
  }

  createFlightSettings(cat: any): FormGroup {
    console.log(this.categoryList);

    console.log(this.tournament_member_category);
    console.log(cat);
    console.log(this.data.startDate);

    const FilteredFlight = this.tournament_member_category.filter((a) => {
      return a.category == cat;
    });

    console.log(FilteredFlight);
     console.log(this.data.round);
     
    if (this.data.round - 1 > 1) {
      //var startDate = new Date(this.datePipe.transform(this.data.startDate, 'dd-MM-yyyy'));
      var startDate = new Date(this.data.startDate);
      startDate.setDate(startDate.getDate() - (parseInt(this.data.round) - 1));
      console.log(startDate);
      //console.log(new Date(this.datePipe.transform(FilteredFlight[0].flightSettings.playingDate[0].Date, 'dd-MM-yyyy')));
      let sDate = this.datePipe.transform(startDate, "yyyyMMdd");
      console.log(sDate);
      if (FilteredFlight.length > 1) {
      this.PlayingFlight = FilteredFlight[0].flightSettings.playingDate.filter(
        (a) => {
          return (
            a.Date == sDate &&
            a.playing == true &&
            FilteredFlight[0].category == cat
          );
          //return ((new Date(this.datePipe.transform(a.Date, 'dd-MM-yyyy')).getTime())  == (startDate ).getTime() && (a.playing == true) && (FilteredFlight[0].category == cat))
        }
      );
      

      console.log(this.PlayingFlight);
      }else {
        console.log("Flights No");
      }
      // if(PlayingFlight.length > 0)
      // {
    } else {
      //var startDate = new Date(this.datePipe.transform(this.data.startDate, 'dd-MM-yyyy'));
      var startDate = new Date(this.data.startDate);
      startDate.setDate(startDate.getDate());
      console.log(startDate);
      //console.log(new Date(this.datePipe.transform(FilteredFlight[0].flightSettings.playingDate[0].Date, 'dd-MM-yyyy')));
      let sDate = this.datePipe.transform(startDate, "yyyyMMdd");
      console.log(sDate);
      if (FilteredFlight.length > 1) {
        this.PlayingFlight =
          FilteredFlight[0].flightSettings.playingDate.filter((a) => {
            return (
              a.Date == sDate &&
              a.playing == true &&
              FilteredFlight[0].category == cat
            );
            //return ((new Date(this.datePipe.transform(a.Date, 'dd-MM-yyyy')).getTime())  == (startDate ).getTime() && (a.playing == true) && (FilteredFlight[0].category == cat))
          });
        console.log(this.PlayingFlight);
      } else {
        console.log("Flights No");
      }
    }
    //   this.playingCat = true
    // }
    if (FilteredFlight.length > 0) {
      this.flightData = FilteredFlight[0].flightSettings;
    }
    console.log(this.flightData);

    return this.fb.group({
      name: [cat ? cat : "", Validators.compose([Validators.required])],
      copy: ["0", Validators.required],
      players: [3, Validators.required],
      time: ["09:00 AM", Validators.required],
      interval: [0, Validators.required],
      tee: ["1_10", Validators.required],
      type: ["GROSS", Validators.required],
      order: ["desc", Validators.required],
      copyFlights: ["No", Validators.required],
      cuttScore: [""],
      playing: [this.catArray[cat].value],
      lastRoundPlayed: [this.PlayingFlight],
    });
  }

  selectionChange(evt, cat) {
    console.log(evt);
    console.log(cat);

    evt.value == "1"
      ? (this.catArray[cat].value = true)
      : (this.catArray[cat].value = false);
  }

  createCategory(cat: any): FormGroup {
    return this.fb.group({
      name: [cat ? cat : "", Validators.compose([Validators.required])],
      value: ["0", Validators.compose([Validators.required])],
    });
  }

  get categoryFormGroup() {
    return this.cutOffform.get("category") as FormArray;
  }

  // addField(category: any) {
  //   const control = this.cutOffform.get("category") as FormArray;
  //   control.push(this.createCategory(category));
  //   console.log(control)
  // }

  addCategoryFlightField(category: any) {
    const control = this.cutOffform.get("category") as FormArray;
    console.log(this.catArray[category].value);
    //if(this.catArray[category].value == true)
    //{
    control.push(this.createFlightSettings(category));
    console.log(control);
    //}
  }

  onSubmit() {
    // TODO: Use EventEmitter with form value
    console.warn(this.cutOffform.value);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
