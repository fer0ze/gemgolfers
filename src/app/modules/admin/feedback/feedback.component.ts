import { Component, OnInit, ViewChild } from "@angular/core";
import { FacadeService } from "../../../shared/services/facade.service";
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AnyAaaaRecord } from "dns";
import { DialogShowfeedbackComponent } from "../dialogs/dialog-showfeedback/dialog-showfeedback.component";

@Component({
  selector: "app-feedback",
  templateUrl: "./feedback.component.html",
  styleUrls: ["./feedback.component.scss"],
})
export class FeedbackComponent implements OnInit {
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  feedback: any[] = [];
  displayedColumns = ["id", "name", "type", "contact", "details"];
  courseData: any;
  constructor(private facadeService: FacadeService, public dialog: MatDialog) {}

  async ngOnInit() {
    let feedbacks = await this.facadeService.getAllFeedback();
    this.feedback = feedbacks.feedback;
    console.log(this.feedback);
    this.dataSource = new MatTableDataSource(this.feedback);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  showMessage(message) {
    console.log(message);
    const dialogRef = this.dialog.open(DialogShowfeedbackComponent, {
      width: "50%",
      data: { message: message },
    });
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
