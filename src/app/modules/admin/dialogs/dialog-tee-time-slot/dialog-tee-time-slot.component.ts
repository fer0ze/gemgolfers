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
  displayedColumns = [
    'firstName',
    'lastName',
    'email',
    'handicap',
    'action',
  ];
  public response: any;
  slotList: any[] = [];
  panelOpenState = false;
  isLoading: boolean = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  openedPanel: any = null;
  constructor(
    public dialogRef: MatDialogRef<DialogTeeTimeSlotComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    console.log(this.data);
    this.slotList = this.data.slots;

    for (let item of this.slotList)
      item["name"] = (item.PlayerQL) ? item.PlayerQL.firstName + " " + item.PlayerQL.lastName : "";


  }

  isPanelOpened(item: any): boolean {
    // Check if the given item is the opened panel
    return this.openedPanel === item;
  }
  onPanelOpened(item: any) {
    // Set the openedPanel to the currently opened panel
    let members = [];
    this.dataSource = null;
    this.openedPanel = item;
    if (this.openedPanel.flight) {
      if (this.openedPanel.flight.MembersQL.length > 0) {
        this.openedPanel.flight.MembersQL.forEach(member => {
          let mem = {
            id: member.playerId,
            firstName: member.PlayerQL.firstName,
            lastName: member.PlayerQL.lastName,
            email: member.PlayerQL.email,
            handicap: member.PlayerQL.handicap,
          }
          members.push(mem)
        });
        this.dataSource = new MatTableDataSource(members);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }

    }
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
