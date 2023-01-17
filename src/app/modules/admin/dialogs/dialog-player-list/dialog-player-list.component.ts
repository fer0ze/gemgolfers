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
import { SelectionModel } from "@angular/cdk/collections";
import { TournamentMember } from "app/shared/models/tournament.model";
import { FacadeService } from "app/shared/services/facade.service";
@Component({
  selector: "app-dialog-player-list",
  templateUrl: "./dialog-player-list.component.html",
  styleUrls: ["./dialog-player-list.component.scss"],
})
export class DialogPlayerListComponent implements OnInit {
  dataSource: MatTableDataSource<Player>;
  displayedColumns = ["id", "membershipNumber", "name", "handicap", "email","select"];
  public response: any;
  playerList: Player[] = [];
  selection = new SelectionModel<Player>(true, []);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    public dialogRef: MatDialogRef<DialogPlayerListComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private facadeService: FacadeService,
    public snackBar: MatSnackBar,
  ) {}

  ngOnInit() {
    console.log(this.data);
    
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

  isAllSelected() {
    //console.log(this.dataSource);
    if (this.dataSource) {
      const numSelected = this.selection.selected.length;
      const numRows = this.dataSource.data.length;
      return numSelected === numRows;
    }
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    console.log(this.selection);
    console.log(this.selection.selected.length);
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach((row) => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: Player): string {
    if (!row) {
      return `${this.isAllSelected() ? "select" : "deselect"} all`;
    }
    return `${this.selection.isSelected(row) ? "deselect" : "select"} player ${
      row.firstName
    } ${row.lastName}`;
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

  async saveTournamentMembers() {
    let tournamentMember: TournamentMember[] = [];
    let counter: number;
    let DelplayerIndex: any;
    let DelplayerInfo: any;
    let selectionArray = Object.assign({}, this.selection.selected);

    for (var index in selectionArray) {
      if (selectionArray[index]) {
        // let founded = this.tournamentMembers.filter((a) => {
        //   return a.id == selectionArray[index].id;
        // });

        // if (founded.length == 0)
        //   this.tournamentMembers.push(selectionArray[index]);

        let member: any = {
          tournamentId: this.data.tournamentID ,
          playerId: selectionArray[index].id,
          status: true,
        };
        tournamentMember.push(member);
        counter = parseInt(index) + 1;
        console.log(counter);

        console.log(selectionArray);
      }
    }
    //this.showCategory = false;
    //console.log(this.categoryCounts[0]);

    //this.categoryCounts[0].value = this.categoryCounts[0].value - counter;
    //console.log(this.categoryCounts[0].value);

    console.log(tournamentMember);

    let result = <any>(
      await this.facadeService.insertTournamentMember(tournamentMember)
    );

    if (result) {
      this.snackBar.open("Tournament members have been saved.", "x", {
        duration: 3000,
      });
      this.dialogRef.close();
    }
  }
}
