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
    public facadeService: FacadeService
  ) {}

  async ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.courseID = params.get("id");
    });
    this.loggedInuser = JSON.parse(
      localStorage.getItem(Constants.LOGGED_IN_USER)
    );
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

    //----------------------------------------------------------------------------------------- Update Checking --------------------------------------------------------------------------------//
    if (this.courseID) {
      this.currentCourse = <Course>(
        await this.facadeService.getCourseByID(this.courseID)
      );
      //------------------------------------Sorting the Array according to the No of hole----------------------------------------------------//
      this.currentCourse["course"][0].holes.sort(
        this.ComparatorHandicapDifferentialAsc
      );

      //---------------------------Push the Array in Table----------------------------//
      for (
        let index = 0;
        index < this.currentCourse["course"][0].noOfHoles;
        index++
      ) {
        console.log(this.currentCourse["course"][0].holes[index]);
        let hol = this.currentCourse["course"][0].holes[index];
        let hole: any = {
          id: hol.id,
          holeNo: hol.holeNo,
          par: hol.par,
          courseId: hol.courseId,
          index: hol.index,
          teeDistances: {
            AMATEURS: hol["teeDistances"].AMATEURS
              ? hol["teeDistances"].AMATEURS
              : hol["teeDistances"].white,
            SENIORS: hol["teeDistances"].SENIORS
              ? hol["teeDistances"].SENIORS
              : hol["teeDistances"].yellow,
            PROFESSIONALS: hol["teeDistances"].PROFESSIONALS
              ? hol["teeDistances"].PROFESSIONALS
              : hol["teeDistances"].blue,
            JUNIORS: hol["teeDistances"].JUNIORS
              ? hol["teeDistances"].JUNIORS
              : hol["teeDistances"].red,
          },
        };
        this.noOfHole++;
        this.holesSet.push(hole);
      }

      this.frmTitle = "Update Course";
      this.flag = true;
      console.log(this.currentCourse);

      //----------------------------------------------------------------------SET THE VALUES OF FORM---------------------------------------------------//
      if (this.currentCourse["course"][0].name) {
        this.courseForm.setValue({
          courseName: this.currentCourse["course"][0].name,
          country: this.currentCourse["course"][0].country,
          slopeRating: this.currentCourse["course"][0].slopeRating,
          noOfHoles: this.currentCourse["course"][0].noOfHoles,
          city: this.currentCourse["course"][0].city,
          courseRating: this.currentCourse["course"][0].courseRating,
          par: this.currentCourse["course"][0].par,
        });
        //-----------------------------------------------------------------------------SHOW THE RESPECTIVE TABLE-------------------------------------------//
        this.showTable(this.currentCourse["course"][0].noOfHoles);
      }
    } else {
      this.frmTitle = "Create Course Form";
      this.courseID = UniqueIdGenerator.generate();
      this.holesSet = [];
    }
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

  //--------------------------------------------------------------------------------Functions------------------------------------------------------------------------------------//

  //=======================COMPARIOSON FUNCTIONS FOR ARRAY======================================//
  ComparatorHandicapDifferentialAsc(a, b) {
    if (a["holeNo"] < b["holeNo"]) return -1;
    if (a["holeNo"] > b["holeNo"]) return 1;
    return 0;
  }

  //=======================CREATE AND SAVE COURSE BUTTON FUNCTION============================//
  public createPlayer = async (playerFormValue: any) => {
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
        this.snackBar.open("Course Not added!", "x", {
          duration: 5000,
        });
      }
    }
  };

  //==================================== Hole Change Functions  =====================//
  public selectedHole(item) {
    switch (item.value) {
      case "9":
        this.nineHoles = true;
        this.eighteenHoles = false;
        this.twentySevenHoles = false;
        this.thirtysixHoles = false;
        this.HolesSets(9);
        break;
      case "18":
        this.nineHoles = false;
        this.eighteenHoles = true;
        this.twentySevenHoles = false;
        this.thirtysixHoles = false;
        this.HolesSets(18);
        break;
      case "27":
        this.nineHoles = false;
        this.eighteenHoles = false;
        this.twentySevenHoles = true;
        this.thirtysixHoles = false;
        this.HolesSets(27);
        break;
      default:
        this.nineHoles = false;
        this.eighteenHoles = false;
        this.twentySevenHoles = false;
        this.thirtysixHoles = true;
        this.HolesSets(36);
        break;
    }
  }

  //=================   Creation oh Holes   ==================//
  public HolesSets(Count: number) {
    if (this.flag == true) {
      if (this.noOfHole == 18 && Count == 9) {
        this.prevHoleSet = [];
        this.prevHoleSet = this.holesSet.filter((a) => a.holeNo > 9);
        this.holesSet.splice(9, 9);
        this.noOfHole = 9;
        this.falgA = true;
        // console.log(this.holesSet);
        return;
      }
      this.noOfHole++;
      this.prev = this.noOfHole;
      if (this.falgA && this.prevHoleSet.length > 0) {
        for (let hol of this.prevHoleSet) {
          this.holesSet.push(hol);
        }
        this.noOfHole = 18;
      } else if (this.flag) {
        for (let index = this.prev; index <= Count; index++) {
          let hole: any = {
            id: UniqueIdGenerator.generate(),
            holeNo: index,
            par: null,
            index: null,
            courseId: this.courseID,
            teeDistances: {
              AMATEURS: null,
              SENIORS: null,
              PROFESSIONALS: null,
              JUNIORS: null,
            },
          };
          this.holesSet.push(hole);
          this.noOfHole = 18;
        }
      }
    } else {
      this.holesSet = [];
      for (let index = 1; index <= Count; index++) {
        let hole: any = {
          id: UniqueIdGenerator.generate(),
          holeNo: index,
          par: null,
          index: null,
          teeDistances: {
            AMATEURS: null,
            SENIORS: null,
            PROFESSIONALS: null,
            JUNIORS: null,
          },
        };

        this.holesSet.push(hole);
      }
    }
  }

  //===========================PAR INPUT============================//
  onParInput(item: any, number: any) {
    console.log(item);
    let count = number + 1;
    let holeNum = this.holesSet.find((a) => a.holeNo == count);
    holeNum.par = item;
    console.log(holeNum);
    this.holesSet.splice(number, 1, holeNum);
    console.log(this.holesSet);
  }

  //===========================INDEX INPUT============================//
  onIndexInput(item: any, number: any) {
    let count = number + 1;
    let holeNum = this.holesSet.find((a) => a.holeNo == count);
    holeNum.index = item;
    console.log(holeNum);
    this.holesSet.splice(number, 1, holeNum);
    console.log(this.holesSet);
  }

  //===========================AMATUER TEE INPUT============================//
  onAmateursTee(item: any, number: any) {
    let count = number + 1;
    let holeNum = this.holesSet.find((a) => a.holeNo == count);
    holeNum.teeDistances["AMATEURS"] = item;
    console.log(holeNum);
    this.holesSet.splice(number, 1, holeNum);
    console.log(this.holesSet);
  }

  //===========================SENIORS TEE  INPUT============================//
  onSeniorsTee(item: any, number: any) {
    let count = number + 1;
    let holeNum = this.holesSet.find((a) => a.holeNo == count);
    holeNum.teeDistances["SENIORS"] = item;
    console.log(holeNum);
    this.holesSet.splice(number, 1, holeNum);
    console.log(this.holesSet);
  }

  //===========================PROFESSIONAL TEE  INPUT============================//
  onProfessionalsTee(item: any, number: any) {
    let count = number + 1;
    let holeNum = this.holesSet.find((a) => a.holeNo == count);
    holeNum.teeDistances["PROFESSIONALS"] = item;
    console.log(holeNum);
    this.holesSet.splice(number, 1, holeNum);
    console.log(this.holesSet);
  }

  //===========================JUNIOR TEE INPUT============================//
  onJuniorsTee(item: any, number: any) {
    let count = number + 1;
    let holeNum = this.holesSet.find((a) => a.holeNo == count);
    holeNum.teeDistances["JUNIORS"] = item;
    console.log(holeNum);
    this.holesSet.splice(number, 1, holeNum);
    console.log(this.holesSet);
  }

  //===========================CANCEL BUTTON INPUT============================//
  public onCancel = () => {
    this.location.back();
  };

  //===========================SHOW TABLE  INPUT============================//
  public showTable(totalHoles) {
    if (totalHoles == 9) {
      this.nineHoles = true;
      this.eighteenHoles = false;
      this.twentySevenHoles = false;
      this.thirtysixHoles = false;
      this.courseForm.get("noOfHoles").setValue("9");
    } else if (totalHoles == 18) {
      this.nineHoles = false;
      this.eighteenHoles = true;
      this.twentySevenHoles = false;
      this.thirtysixHoles = false;
      this.courseForm.get("noOfHoles").setValue("18");
    } else if (totalHoles == 27) {
      this.nineHoles = false;
      this.eighteenHoles = false;
      this.twentySevenHoles = true;
      this.thirtysixHoles = false;
      this.courseForm.get("noOfHoles").setValue("27");
    } else if (totalHoles == 36) {
      this.nineHoles = false;
      this.eighteenHoles = false;
      this.twentySevenHoles = false;
      this.thirtysixHoles = true;
      this.courseForm.get("noOfHoles").setValue("36");
    } else {
      this.courseForm.get("noOfHoles").setValue(totalHoles);
    }
  }

  countrySelected(event) {
    let obj = Country.getCity(event);
    for (let objs of obj["cities"]) {
      this.listCity =objs.split("|");
   
    }
  
  }
}
