import { Component, OnInit } from '@angular/core';
import { TourService } from '../tour.service';
import { ActivatedRoute, Route, Router } from '@angular/router';

@Component({
  selector: 'app-_detailtour',
  templateUrl: './detailTour.component.html',
  styleUrls: ['./detailTour.component.scss']
})
export class DetailTourComponent implements OnInit {

  private tourId: string;
  constructor(private router: ActivatedRoute, private route: Router, private _tourService: TourService) { }

  ngOnInit(): void {
    this.router.paramMap.subscribe((params) => {
      this.tourId = params.get('id');
    });
  }
  viewTournaments() {
    this._tourService.setData(this.tourId);
    this.route.navigate(['/tournaments/']);

  }
}
