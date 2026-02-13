import { Component, Inject, OnInit, ViewChild } from "@angular/core";

import { MatLegacyPaginator as MatPaginator } from '@angular/material/legacy-paginator';
import { MatSort } from '@angular/material/sort';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import { MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar';
import { Player } from "app/shared/models/player.model";
import { of } from "rxjs";
import { FacadeService } from "app/shared/services/facade.service";

@Component({
  selector: "app-dialog-playing-category",
  templateUrl: "./dialog-playing-category.component.html",
  styleUrls: ["./dialog-playing-category.component.scss"],
})
export class DialogPlayingCategoryComponent implements OnInit {
  Player: Player[] = [];
  Players: Player[] = [];
  dataSource: MatTableDataSource<Player>;
  displayedColumns = [
    "id",
    "name",
    "phone",
    "email",
    "membershipNumber",
    "category",
    "club",
    "handicap",
  ];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  category: any[] = [];
  dataFullTournament: any;
  fullTournament: any;
  tournamnet: any;
  dates:boolean=true;
  constructor(
    public dialogRef: MatDialogRef<DialogPlayingCategoryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private facadeService: FacadeService
  ) {}

  async ngOnInit() {
    //console.log(this.data);

    this.dataFullTournament = await this.facadeService.LeaderboardSubscriptions(
      this.data.tournament,
      this.data["cat"].title
    );
    //console.log(this.dataFullTournament);

    let dataPlayers: any;
    dataPlayers =
      await this.facadeService.getPlayersListByTournamentAndCategory(
        this.data.tournament,
        this.data["cat"].title
      );
    this.Player = dataPlayers.tournament_member;
    this.dataSource = new MatTableDataSource(this.Player);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    // for (let i of this.dataFullTournament["tournament_member_category"]) {
    //   //console.log(i["flightSettings"]);
      
    // }
    //console.log(this.dataFullTournament["tournament_member_category"][0].flightSettings);
    ////console.log(this.dataFullTournament["tournament_member_category"]["flightSettings"]);
    
    
    for (let index = 0; index < this.dataFullTournament["tournament_member_category"][0].flightSettings.length; index++) {
      this.dates=true;
      let obj=this.dataFullTournament["tournament_member_category"][0].flightSettings[index];
      //console.log(this.dataFullTournament["tournament_member_category"][0].flightSettings[index]);
      this.category.push(obj)

    }
    //console.log(this.category);
  }
}
