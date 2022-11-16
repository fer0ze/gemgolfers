import { Component, Input, OnInit } from "@angular/core";

@Component({
  selector: "app-top-player-section",
  templateUrl: "./top-player-section.component.html",
  styleUrls: ["./top-player-section.component.scss"],
})
export class TopPlayerSectionComponent implements OnInit {
  @Input() bgClass: string;
  @Input() icon: string;
  @Input() count: number;
  @Input() label: string;
  @Input() cat: string;
  @Input() data: number;
  @Input() detail: boolean;
  @Input() link: string;
  constructor() {}

  ngOnInit() {}
}
