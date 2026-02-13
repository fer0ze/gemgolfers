import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { Player } from '../../../../shared/models/player.model';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { SelectionModel } from '@angular/cdk/collections';
import { TournamentMember } from 'app/shared/models/tournament.model';
import { FacadeService } from 'app/shared/services/facade.service';
import * as XLSX from 'xlsx';
import { read, utils } from 'xlsx';
@Component({
    selector: 'app-uncompleted',
    templateUrl: './dialog-user-activity.component.html',
    styleUrls: ['./dialog-user-activity.component.scss'],
})
export class DialogUserActivityComponent implements OnInit {
    dataSource: MatTableDataSource<any>;
    displayedColumns = [
        'Sr',
        'date',
        'desc',

    ];
    @ViewChild('MatPaginatorA') paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    playerList: any;
    constructor(
        public dialogRef: MatDialogRef<DialogUserActivityComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,

    ) { }

    ngOnInit() {
        //console.log(this.data);

        this.playerList = this.data.activities;

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

    extractId(description: string): string {
        const match = description.match(/\((-Y[A-Za-z0-9_]+)\)/);
        return match ? match[1] : '';
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    close() {
        this.dialogRef.close();
    }

}
