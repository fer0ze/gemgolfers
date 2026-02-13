import { Component, OnInit, ViewChild } from "@angular/core";
import { FacadeService } from "../../../shared/services/facade.service";
import { MatLegacyPaginator as MatPaginator } from '@angular/material/legacy-paginator';
import { MatSort } from '@angular/material/sort';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar';
import { AnyAaaaRecord } from "dns";

@Component({
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
