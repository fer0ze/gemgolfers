import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { Player } from '../../../../shared/models/player.model';
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';
import { SelectionModel } from '@angular/cdk/collections';
import { TournamentMember } from 'app/shared/models/tournament.model';
import { FacadeService } from 'app/shared/services/facade.service';
@Component({
    selector: 'app-tournament-dailog',
    templateUrl: './dialog-tournament.component.html',
    styleUrls: ['./dialog-tournament.component.scss'],
})
export class DialogTournamentComponent implements OnInit {
    dataSource: MatTableDataSource<Player>;
    displayedColumns = ['select', 'name', 'date', 'noOfRounds', 'noOfFlights', 'matchFormat', 'startDate', 'endDate', 'owner'];
    monthName = [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday',
    ];
    public response: any;
    playerList: Player[] = [];
    selection = new SelectionModel<Player>(true, []);
    @ViewChild('MatPaginatorA') paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;


    constructor(
        public dialogRef: MatDialogRef<DialogTournamentComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private facadeService: FacadeService,

    ) { }

    ngOnInit() {
        //console.log(this.data);

        this.playerList = this.data.tournaments;

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
        var doc = new jsPDF();
        let date = new Date(this.data.date).getDate() + '/' + (new Date(this.data.date).getMonth() + 1) + '/' + new Date(this.data.date).getFullYear();
        var day = new Date(this.data.date).getDay() - 1;
        // day=this.monthName[day];
        doc.setFontSize(18);
        if (this.data.key == 'non') {
            doc.text("Date: " + date + "-" + this.monthName[day], 74, 15);
            doc.text("Round's Non-Submitted Cards Detail:", 54, 23);
        } else if (this.data.key == 'all') {
            doc.text("Date: " + date + "-" + this.monthName[day], 74, 15);
            doc.text("All Players Detail:", 68, 23);
        } else {
            doc.text("Date: " + date + "-" + this.monthName[day], 74, 15);
            doc.text("Round's Submitted Cards Detail:", 62, 23);
        }
        doc.setFontSize(11);
        doc.setTextColor(100);

        // From HTML
        doc.autoTable({
            html: '#playerTables',
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


    close() {
        this.dialogRef.close();
    }

    isAllSelected() {
        ////console.log(this.dataSource);
        if (this.dataSource) {
            // //console.log(this.selection);
            const numSelected = this.selection.selected.length;
            // //console.log(numSelected);
            // this.selectPlayer(this.selection.selected);
            const numRows = this.dataSource.data.length;
            //console.log(this.dataSource.data);

            // //console.log(numRows);

            return numSelected === numRows;
        }
    }

    /** The label for the checkbox on the passed row */
    checkboxLabel(row?: any): string {
        return `${this.selection.isSelected(row) ? 'deselect' : 'select'} player ${row.firstName} ${row.lastName}`;
    }

    // Function to handle single selection
    selectSingle(row: any): void {
        this.selection.clear(); // Deselect any previously selected row
        this.selection.select(row); // Select the current row
    }

    save() {
        this.dialogRef.close(this.selection.selected);
    }
}
