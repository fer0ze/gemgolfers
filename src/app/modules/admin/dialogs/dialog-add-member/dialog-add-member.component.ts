import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import {
    MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA,
    MatLegacyDialogRef as MatDialogRef,
    MatLegacyDialogClose as MatDialogClose,
} from '@angular/material/legacy-dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar';
import { Club } from '../../../../shared/models/club.model';
import {
    Player,
    PlayerCategory,
    ClubMembership,
} from '../../../../shared/models/player.model';
import { FacadeService } from '../../../../shared/services/facade.service';
import {
    UniqueIdGenerator,
    generateGemId,
    Constants,
    General,
} from '../../../../shared/classes/general';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSort } from '@angular/material/sort';
import { MatLegacyPaginator as MatPaginator } from '@angular/material/legacy-paginator';
@Component({
    selector: 'app-dialog-add-member',
    templateUrl: './dialog-add-member.component.html',
    styleUrls: ['./dialog-add-member.component.scss'],
})
export class DialogAddMemberComponent implements OnInit {
    displayedColumns: string[] = [
        'firstName',
        'handicap',
        'playerCategory',
        'membershipNumber',
        'email',
        'select',
    ];
    tournamentMember = [];
    refresh: boolean = false;
    dataSource: MatTableDataSource<Player>;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    selection = new SelectionModel<Player>(true, []);
    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialogRef: MatDialogRef<DialogAddMemberComponent>
    ) { }

    ngOnInit(): void {
        //console.log(this.data);

        this.dataSource = new MatTableDataSource(this.data.members);
        // CUSTOM FILTER PREDICATE FOR FULL NAME SEARCH
        this.dataSource.filterPredicate = (data: any, filter: string) => {
            const first = (data.firstName || "").toLowerCase();
            const last = (data.lastName || "").toLowerCase();
            const full = `${first} ${last}`.trim();

            filter = filter.toLowerCase();

            return first.includes(filter) ||
                last.includes(filter) ||
                full.includes(filter);
        };
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
    }
    applyFilter(filterValue: string) {
        filterValue = filterValue.trim(); // Remove whitespace
        filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
        //console.log(this.dataSource);
        this.dataSource.filter = filterValue;

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }
    isAllSelected() {
        ////console.log(this.dataSource);
        if (this.dataSource) {
            const numSelected = this.selection.selected.length;
            const numRows = this.dataSource.data.length;
            return numSelected === numRows;
        }
    }

    /** Selects all rows if they are not all selected; otherwise clear selection. */
    masterToggle() {
        //console.log(this.selection);
        //console.log(this.selection.selected.length);
        this.isAllSelected()
            ? this.selection.clear()
            : this.dataSource.data.forEach((row) => this.selection.select(row));
    }

    /** The label for the checkbox on the passed row */
    checkboxLabel(row?: Player): string {
        if (!row) {
            return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
        }
        return `${this.selection.isSelected(row) ? 'deselect' : 'select'
            } player ${row.firstName} ${row.lastName}`;
    }

    onNoClick(): void {
        this.dialogRef.close();
    }
    onSubmit() {
        let selectionArray = Object.assign({}, this.selection.selected);
        for (var index in selectionArray) {
            if (selectionArray[index]) {

                this.tournamentMember.push(selectionArray[index]);

            }
        }
        this.refresh = true;
    }
}
