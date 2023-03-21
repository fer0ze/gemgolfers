import { Component, OnInit } from '@angular/core';
import { FacadeService } from 'app/shared/services/facade.service';

@Component({
  selector: 'app-league-leaderboard',
  templateUrl: './league-leaderboard.component.html',
  styleUrls: ['./league-leaderboard.component.scss']
})
export class LeagueLeaderboardComponent implements OnInit {
  Leaders:any[]=[];
  isLoading:boolean=true;
  constructor(

    private facadeService:FacadeService
  ) { }

  ngOnInit(): void {
    this.fetchData();
    this.isLoading=true;
  }

  async fetchData(){
    

  }
}
