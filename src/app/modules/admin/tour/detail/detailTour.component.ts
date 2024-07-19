import { Component, OnInit } from '@angular/core';
import { TourService } from '../tour.service';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { LocalStorageService } from 'app/shared/services/localStorage';
import { Constants } from 'app/shared/classes/general';

@Component({
  selector: 'app-_detailtour',
  templateUrl: './detailTour.component.html',
  styleUrls: ['./detailTour.component.scss']
})
export class DetailTourComponent implements OnInit {

  private tourId: string;
  constructor(private router: ActivatedRoute, private route: Router, private _tourService: TourService, private _localStorage: LocalStorageService) { }

  ngOnInit(): void {
    this.router.paramMap.subscribe((params) => {
      this.tourId = params.get('id');
    });
  }
  viewTournaments() {
    this._localStorage.set(Constants.TOUR_ID, this.tourId);
    this._localStorage.set(Constants.STATE, Constants.TOUR);
    this.route.navigate(['/tournaments/']);
  }
  viewMembers() {
    this._localStorage.set(Constants.TOUR_ID, this.tourId);
    this._localStorage.set(Constants.STATE, Constants.TOUR);
    this.route.navigate(['/players/']);
  }
  viewGuides() {
    this._localStorage.set(Constants.TOUR_ID, this.tourId);
    this._localStorage.set(Constants.STATE, Constants.TOUR);
    this.route.navigate(['/tours/guides/', this.tourId]);
  }
}
