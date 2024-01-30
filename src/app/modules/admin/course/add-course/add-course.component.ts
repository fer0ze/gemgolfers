import { DatePipe, Location } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute, Router } from "@angular/router";
import { count } from "console";
import { stringify } from "querystring";
import { Country } from "app/shared/classes/country";
import { Constants, UniqueIdGenerator } from "app/shared/classes/general";
import { Course } from "app/shared/models/course.model";
import { FacadeService } from "app/shared/services/facade.service";
import { Hole } from "app/shared/models/hole.model";
import { LocalStorageService } from "app/shared/services/localStorage";

@Component({
  selector: "app-add-course",
  templateUrl: "./add-course.component.html",
  styleUrls: ["./add-course.component.scss"],
})
export class AddCourseComponent implements OnInit {
  // Variables //
  drawerMode: 'over' | 'side' = 'side';
  private courseID: string;
  public courseForm: FormGroup;
  currentCourse: any = [];
  public frmTitle: string;
  nineHoles: boolean = false;
  eighteenHoles: boolean = false;
  twentySevenHoles: boolean = false;
  thirtysixHoles: boolean = false;
  noOfHole: number = 0;
  holesSet: Hole[] = [];
  holes: Hole[] = [];
  loggedInuser: any;
  flag: Boolean = false;
  prevHoleSet: Hole[] = [];
  prev: number = 0;
  falgA: boolean = false;

  listCity = [];
  listCountries: {
    id: string; //------------------------------------Sorting the Array according to the No of hole----------------------------------------------------//
    cities: string[];
  } | {
    id: string; //------------------------------------Sorting the Array according to the No of hole----------------------------------------------------//
    cities: string[];
  }[];

  // Constructor //
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    public snackBar: MatSnackBar,
    public facadeService: FacadeService,
    private _localStorage: LocalStorageService
  ) { }

  async ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.courseID = params.get("id");
    });
    this.loggedInuser = this._localStorage.get(Constants.LOGGED_IN_USER);
    this.listCountries = Country.getCity('DEFAULT');

    //------------------------------------------------------------------------ Form Declaration --------------------------------------------------------------------------//
    this.courseForm = new FormGroup({
      courseName: new FormControl("", [
        Validators.required,
        Validators.maxLength(60),
      ]),
      country: new FormControl("", [
        Validators.required,
        Validators.maxLength(30),
      ]),
      city: new FormControl("", [
        Validators.required,
        Validators.maxLength(30),
      ]),
      noOfHoles: new FormControl("", [Validators.required]),
    });
  }

  //------------------------------------------------------------------------------Error handling-------------------------------------------------------------------//
  get courseName() {
    return this.courseForm.get("courseName");
  }
  get country() {
    return this.courseForm.get("country");
  }
  get city() {
    return this.courseForm.get("city");
  }



  //=======================CREATE AND SAVE COURSE BUTTON FUNCTION============================//
  public createCourse = async (playerFormValue: any) => {
    let course = {
      id: this.courseID,
      clubId:
        this.loggedInuser.userRole > 1 ? this.loggedInuser.adminClubId : null,
      name: playerFormValue.courseName,
      country: playerFormValue.country,
      // slopeRating: playerFormValue.slopeRating,
      noOfHoles: playerFormValue.noOfHoles,
      // holes: this.holesSet,
      teeDistanceUnit: "YARDS",
      par: "72",
      // courseRating: playerFormValue.courseRating,
      city: playerFormValue.city,
    };
    if (this.flag == true) {
      let courses = {
        id: this.courseID,
        clubId:
          this.loggedInuser.userRole > 1 ? this.loggedInuser.adminClubId : null,
        name: playerFormValue.courseName,
        country: playerFormValue.country,
        slopeRating: playerFormValue.slopeRating,
        noOfHoles: playerFormValue.noOfHoles,
        teeDistanceUnit: this.currentCourse["course"][0].teeDistanceUnit,
        countryGeonameId: this.currentCourse["course"][0].countryGeonameId,
        cityGeonameId: this.currentCourse["course"][0].cityGeonameId,
        par: playerFormValue.par,
        courseRating: playerFormValue.courseRating,
        city: playerFormValue.city,
      };

      const isSuccess = <boolean>(
        await this.facadeService.updateCourse(courses, this.holesSet)
      );
      if (isSuccess) {
        this.snackBar.open("Course has been Updated.", "x", {
          duration: 5000,
        });
        this.router.navigate(["/course"]);
      } else {
        this.snackBar.open("Course Not Updated!", "x", {
          duration: 5000,
        });
      }
    } else {
      const isSuccess = <boolean>await this.facadeService.AddCourse(course);
      if (isSuccess) {
        this.snackBar.open("Course has been created.", "x", {
          duration: 5000,
        });
        this.router.navigate(["/courses/view/" + this.courseID]);
      } else {
        this.snackBar.open("Error! Course name already exists.", "x", {
          duration: 5000,
        });

      }
    }
  };

  public onCancel = () => {
    this.location.back();
  };

  countrySelected(event) {
    let obj = Country.getCity(event);
    for (let objs of obj["cities"]) {
      this.listCity = objs.split("|");

    }

  }
}
