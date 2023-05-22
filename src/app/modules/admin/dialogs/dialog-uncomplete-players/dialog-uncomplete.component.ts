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
    selector: 'app-uncompleted',
    templateUrl: './dialog-uncomplete.component.html',
    styleUrls: ['./dialog-uncomplete.component.scss'],
})
export class DialogUncompletedComponent implements OnInit {
    dataSource: MatTableDataSource<Player>;
    displayedColumns = [
        'name',
        'handicap',
        'membershipNumber',
        'cat',
        'email',
       
    ];
    public response: any;
    playerList: Player[] = [];
    selection = new SelectionModel<Player>(true, []);
    @ViewChild('MatPaginatorA') paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    constructor(
        public dialogRef: MatDialogRef<DialogUncompletedComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private facadeService: FacadeService,
      
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

    public downloadAsPDF() {
        var doc = new jsPDF();

        doc.setFontSize(18);
        if(this.data.key=='non'){
            doc.text("Round's Non-Submitted Cards Detail:", 15, 15);
        }else if(this.data.key=='all'){
            doc.text("Round's All Players Detail:", 15, 15);
        }else{
            doc.text("Round's Submitted Cards Detail:", 15, 15);
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
}
