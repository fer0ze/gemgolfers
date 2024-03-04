import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ViewEncapsulation } from "@angular/core";
import { Apollo } from "apollo-angular";
import { Player, ClubMembership } from "app/shared/models/player.model";
import { FacadeService } from "app/shared/services/facade.service";
import {
  UniqueIdGenerator,
  generateGemId,
  Constants,
  General,
} from "app/shared/classes/general";
import { of } from "rxjs";
import { read, utils } from "xlsx";
import { LogsService } from "app/shared/services/logs.service";
import { Course } from "app/shared/models/course.model";
import { LocalStorageService } from "app/shared/services/localStorage";

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.scss']
})
export class CourseComponent implements OnInit {

  dataSource: MatTableDataSource<Course>
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  Courses: Course[] = [];
  displayedColumns = [
    "name",
    "noOfHoles",
    "par",
    "country",
    "city",
    "action",
  ];
  courseData: any;
  public loggedInuser: any;
  constructor(
    private location: Router,
    private route: ActivatedRoute,
    private apollo: Apollo,
    public snackBar: MatSnackBar,
    public dialog: MatDialog,
    private facadeService: FacadeService,
    private logger: LogsService,
    private _localStorage: LocalStorageService

  ) { }

  async ngOnInit() {

    this.loggedInuser = this._localStorage.get(Constants.LOGGED_IN_USER);
    let dataCourses: any;
    if (this.loggedInuser.userRole === 1) {
      dataCourses = await this.facadeService.getCoursesList();
    } else {
      dataCourses = await this.facadeService.getCoursesListbyID(this.loggedInuser.id);
    }
    this.Courses = dataCourses?.course;
    //console.log(this.Courses)
    this.dataSource = new MatTableDataSource(this.Courses);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }


  redirectToUpdate = (id: string) => {
    this.location.navigate(["/course/update/" + id]);
  };

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  createCourse(){
    this.location.navigate(['/courses/add']);
  }

}
