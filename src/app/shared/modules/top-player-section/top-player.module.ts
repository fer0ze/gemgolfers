import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatCardModule } from "@angular/material/card";
import { MatGridListModule} from "@angular/material/grid-list";
import { TopPlayerSectionComponent } from "./top-player-section.component";
import { MatIconModule } from "@angular/material/icon";

@NgModule({
  imports: [CommonModule, MatCardModule, MatGridListModule, MatIconModule],
  declarations: [TopPlayerSectionComponent],
  exports: [TopPlayerSectionComponent],
})
export class TopPlayerModule {}
