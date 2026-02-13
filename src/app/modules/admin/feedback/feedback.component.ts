import { Component, OnInit, ViewChild } from "@angular/core";
import { FacadeService } from "../../../shared/services/facade.service";
import { MatLegacyPaginator as MatPaginator } from '@angular/material/legacy-paginator';
import { MatSort } from '@angular/material/sort';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar';
import { AnyAaaaRecord } from "dns";
import { DialogShowfeedbackComponent } from "../dialogs/dialog-showfeedback/dialog-showfeedback.component";
import { Constants, General, UniqueIdGenerator } from "app/shared/classes/general";
import { LocalStorageService } from "app/shared/services/localStorage";
import { UserSessionModel } from "app/shared/models/player.model";

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
  displayedColumns = ["id", "name", "type", "contact", "createdAt", "details"];
  courseData: any;
  public loggedInuser: UserSessionModel;

  constructor(private facadeService: FacadeService, public dialog: MatDialog, public _localStorage: LocalStorageService, public snackBar: MatSnackBar) { }

  async ngOnInit() {

    this.loggedInuser = this._localStorage.get(Constants.LOGGED_IN_USER);
    let feedbacks: any;
    if (this._localStorage.isSuperAdmin()) {
      feedbacks = await this.facadeService.getAllFeedback();
    } else {
      feedbacks = await this.facadeService.getAllFeedbackByUserId(this.loggedInuser.id);
    }
    this.feedback = feedbacks.feedback;
    //console.log(this.feedback);
    this.dataSource = new MatTableDataSource(this.feedback);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  showMessage(message) {
    //console.log(message);
    const dialogRef = this.dialog.open(DialogShowfeedbackComponent, {
      width: "50%",
      data: { message: message },
    });
  }

  addNewFeedback() {
    const dialogRef = this.dialog.open(DialogShowfeedbackComponent, {
      width: "50%",
    });
    dialogRef.afterClosed().subscribe((result) => {
      //console.log(`Dialog result: ${result}`);
      if (result) {

        let feedback = {
          id: UniqueIdGenerator.generate(),
          userId: this.loggedInuser.id,
          type: result.type,
          name: this.loggedInuser.firstName + ' ' + this.loggedInuser.lastName,
          contact: this.loggedInuser.email,
          message: result.message,
        }
        this.facadeService.addFeedback(feedback).then((res) => {
          this.snackBar.open('Feedback submitted successfully!.', 'x', {
            duration: 2000,
          });
          this.ngOnInit();
        });
      }
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
