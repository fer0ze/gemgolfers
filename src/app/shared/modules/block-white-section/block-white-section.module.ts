import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlockWhiteSectionComponent } from './block-white-section.component';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';

@NgModule({
  imports: [CommonModule, MatCardModule, MatGridListModule, MatIconModule],
  declarations: [BlockWhiteSectionComponent],
  exports: [
    BlockWhiteSectionComponent
  ]
})
export class BlockWhiteSectionModule { }
