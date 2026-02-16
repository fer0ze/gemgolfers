import { Component, OnInit, ViewChild } from "@angular/core";
import { FacadeService } from "../../../shared/services/facade.service";
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    standalone: false,
  selector: "app-coursesRequest",
  templateUrl: "./coursesRequest.component.html",
  styleUrls: ["./coursesRequest.component.scss"],
})
export class CoursesRequestComponent implements OnInit {
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  coursesRequest: any[] = [];
  displayedColumns = ["id", "name", "country","state", "city","createdAt", "admin"];
  courseData: any;
  constructor(private facadeService: FacadeService, public dialog: MatDialog) {}

  async ngOnInit() {
    let coursesRequests = await this.facadeService.getAllCoursesRequest();
    this.coursesRequest = coursesRequests.course_request;
    console.log(this.coursesRequest);
    this.dataSource = new MatTableDataSource(this.coursesRequest);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
