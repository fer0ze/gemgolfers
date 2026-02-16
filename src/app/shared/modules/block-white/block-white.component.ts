import { Component, OnInit, Input } from '@angular/core';

@Component({
    standalone: false,
  selector: 'app-block-white',
  templateUrl: './block-white.component.html',
  styleUrls: ['./block-white.component.scss']
})
export class BlockWhiteComponent implements OnInit {
    @Input() icon: string;
    @Input() label: string;
    @Input() data: number;
    
  constructor() { }

  ngOnInit() {
  }

}
