
import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute} from '@angular/router'

@Component({
  selector: 'app-white-section',
  templateUrl: './white-section.component.html',
  styleUrls: ['./white-section.component.scss']
})
export class WhiteSectionComponent implements OnInit {
  @Input() bgClass: string;
  @Input() icon: string;
  @Input() count: number;
  @Input() label: string;
  @Input() data: number;
  @Input() detail: boolean;
  @Input() link: string;



  constructor() { }

  ngOnInit() {
  }

}
