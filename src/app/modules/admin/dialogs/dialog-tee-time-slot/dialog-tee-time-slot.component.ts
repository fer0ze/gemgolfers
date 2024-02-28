import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-dialog-tee-time-slot',
  templateUrl: './dialog-tee-time-slot.component.html',
  styleUrls: ['./dialog-tee-time-slot.component.scss']
})
export class DialogTeeTimeSlotComponent implements OnInit {

  dataSource: MatTableDataSource<any>;
  displayedColumns = ['slotTime', 'joined', 'members', 'status'];
  public response: any;
  slotList: any[] = [];
  panelOpenState = false;
  isLoading: boolean = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
      public dialogRef: MatDialogRef<DialogTeeTimeSlotComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any) {}

      ngOnInit() {
        //console.log(this.data);
        this.slotList = this.data.slots;
    
        for(let item of this.slotList)
          item["name"] = (item.PlayerQL)? item.PlayerQL.firstName + " " + item.PlayerQL.lastName : "";
    
        this.dataSource = new MatTableDataSource(this.slotList);
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
    
      onNoClick(): void {
          this.dialogRef.close();
      }

}
