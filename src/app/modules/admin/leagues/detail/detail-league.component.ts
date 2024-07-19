import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Constants } from 'app/shared/classes/general';
import { LocalStorageService } from 'app/shared/services/localStorage';


@Component({
  selector: 'app-add-league',
  templateUrl: './detail-league.component.html',
  styleUrls: ['./detail-league.component.scss']
})
export class DetailLeagueComponent implements OnInit {

  private leagueId: string;
  constructor(private router: ActivatedRoute, private route: Router,private _localStorage: LocalStorageService) { }

  ngOnInit(): void {
    this.router.paramMap.subscribe((params) => {
      this.leagueId = params.get('id');
    });
  }
  viewTournaments() {
    this._localStorage.set(Constants.LEAGUE_ID, this.leagueId);
    this._localStorage.set(Constants.STATE, Constants.LEAGUE);
    this.route.navigate(['/tournaments/']);
  }
  viewMembers() {
    this._localStorage.set(Constants.LEAGUE_ID, this.leagueId);
    this._localStorage.set(Constants.STATE, Constants.LEAGUE);
    this.route.navigate(['/players/']);
  }
}
