import { Component, Inject, OnInit, ViewChild } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Player } from "../../../../shared/models/player.model";
import * as jsPDF from "jspdf";
import "jspdf-autotable";
@Component({
  selector: "app-dialog-player-list",
  templateUrl: "./dialog-player-list.component.html",
  styleUrls: ["./dialog-player-list.component.scss"],
})
export class DialogPlayerListComponent implements OnInit {
  dataSource: MatTableDataSource<Player>;
  displayedColumns = ["id", "membershipNumber", "name", "handicap", "email"];
  public response: any;
  playerList: Player[] = [];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    public dialogRef: MatDialogRef<DialogPlayerListComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    this.playerList = this.data.players;

    this.dataSource = new MatTableDataSource(this.playerList);
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
  public downloadAsPDF() {
    var doc = new jsPDF()

    doc.setFontSize(18);
    doc.text("Round's Report Detail:", 15, 15);
    doc.setFontSize(11);
    doc.setTextColor(100);

    // From HTML
    doc.autoTable({ 
      html: '#playerTable', 
      startY: 25,
      theme: 'grid',
      useCss: false,
    });
  
    // Open PDF document in new tab
    doc.output('dataurlnewwindow');

    // Download PDF document  
    //doc.save('flights.pdf');
  }


  onNoClick(): void {
    this.dialogRef.close();
  }
}
