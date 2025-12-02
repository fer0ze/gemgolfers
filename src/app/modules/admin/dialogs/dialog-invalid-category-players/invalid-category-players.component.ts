import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';

@Component({
    selector: 'app-invalid-category-players',
    templateUrl: './invalid-category-players.component.html',
})
export class InvalidCategoryPlayersComponent {

    displayedColumns: string[] = [
        'firstName',
        'lastName',
        'email',
        'playerCategory'
    ];
    dataSource = new MatTableDataSource<any>([]);

    constructor(
        private dialogRef: MatDialogRef<InvalidCategoryPlayersComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        console.log(data);

        this.dataSource.data = data.players;
    }

    close() {
        this.dialogRef.close();
    }
}
