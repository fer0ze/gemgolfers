import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatCardModule } from "@angular/material";
import { MatGridListModule, MatIconModule } from "@angular/material";
import { TopPlayerSectionComponent } from "./top-player-section.component";

@NgModule({
  imports: [CommonModule, MatCardModule, MatGridListModule, MatIconModule],
  declarations: [TopPlayerSectionComponent],
  exports: [TopPlayerSectionComponent],
})
export class TopPlayerModule {}
