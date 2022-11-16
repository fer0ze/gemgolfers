import { Component, OnInit,Input } from '@angular/core';

@Component({
  selector: 'app-block-white-section',
  templateUrl: './block-white-section.component.html',
  styleUrls: ['./block-white-section.component.scss']
})
export class BlockWhiteSectionComponent implements OnInit {
  @Input() icon: string;
  @Input() label: string;
  @Input() data: number;

  constructor() { }

  ngOnInit() {
  }

}
