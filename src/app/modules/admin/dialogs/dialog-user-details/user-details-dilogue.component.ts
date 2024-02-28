import { DialogOverviewComponent } from "../dialog-overview/dialog-overview.component";
import { Component, Inject, OnInit, ViewChild } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { PlayerHanidcap } from "../../../../shared/models/player.model";
import { PlayerHandicap } from "../../../../shared/classes/player-hanidcap";
import { FacadeService } from "../../../../shared/services/facade.service";
import { PlayerQL } from "../../../../shared/fragments/player.fragment";
import * as jsPDF from "jspdf";
import "jspdf-autotable";
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { DatePipe, formatDate } from "@angular/common";

@Component({
  selector: "app-user-details-dilogue",
  templateUrl: "./user-details-dilogue.component.html",
  styleUrls: ["./user-details-dilogue.component.scss"],
})
export class UserDetailsDilogueComponent implements OnInit {
  dataSource: MatTableDataSource<any>;
  displayedColumns = [
    "id",
    "date",
    "playingHandicapCongu",
    "playingHandicapWHS",
    "playingTee",
  ];
  public response: any;
  playerId: string;
  playerHandicapList: any[] = [];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    public dialogRef: MatDialogRef<UserDetailsDilogueComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private facadeService: FacadeService,
    private datePipe: DatePipe
  ) {}

  async ngOnInit() {
    //console.log(this.data);
    this.playerId = this.data.id;
    //console.log(this.playerId);
    this.playerHandicapList =
      await this.facadeService.getPlayerHandicapListByPlayer(
        this.playerId,
        this.datePipe.transform(
          this.data.from.toString(),
          "yyyy-MM-ddTHH:mm:SS" + "+00:00"
        ),
        this.datePipe.transform(
          this.data.to.toString(),
          "yyyy-MM-ddTHH:mm:SS" + "+00:00"
        )
      );
    //console.log(this.playerHandicapList);
    this.playerHandicapList = this.playerHandicapList["flight"].sort(
      this.ComparatorDate
    );
    //console.log(this.playerHandicapList);
    this.dataSource = new MatTableDataSource(this.playerHandicapList);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  ComparatorDate(a, b) {
    if (a["date"] < b["date"]) return 1;
    if (a["date"] > b["date"]) return -1;
    return 0;
  }
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  public downloadAsPDFCongu() {
    var doc = new jsPDF();
    doc.setFontSize(15);
    doc.text(
      this.playerHandicapList[0].members[0]["player"].firstName +
        " " +
        this.playerHandicapList[0].members[0]["player"].lastName +
        " | " +
        this.playerHandicapList[0].members[0]["player"].membershipNumber,
      75,
      15
    );
    doc.text(
      " Rounds Played From " +
        this.datePipe.transform(this.data.to.toString(), "MMM d, y") +
        " to " +
        this.datePipe.transform(this.data.from.toString(), "MMM d, y"),
      40,
      22
    );

    doc.setFontSize(18);
    doc.setTextColor(100);

    // From HTML
    doc.autoTable({
      html: "#pdfTable",
      startY: 25,
      theme: "grid",
      useCss: false,
    });

    // Open PDF document in new tab
    doc.output("dataurlnewwindow");

    // Download PDF document
    //doc.save('flights.pdf');
  }
}
