import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-move-flight',
  templateUrl: './dialog-move-flight.component.html',
  styleUrls: ['./dialog-move-flight.component.scss']
})
export class DialogMoveFlightComponent implements OnInit {
  selectedFlight: number;
  private totalFlights: any[] = [];

  constructor(
    public dialogRef: MatDialogRef<DialogMoveFlightComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any
    ) {}

    ngOnInit() {
      for(let flight=1; flight <= this.data.flights; flight++)
      {
        let r: any = {
          Text: "Flight " + flight,
          Value: flight
        }
        this.totalFlights.push(r);
      }

      if(this.data.flights > 0)
        this.selectedFlight = 1;
  }

  changeFlight(item) {
    console.log("Selected value: " + item.value);
    this.selectedFlight = item.value;
  }

  onNoClick(): void {
    this.dialogRef.close();
}

}
