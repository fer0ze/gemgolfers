import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlockWhiteSectionComponent } from './block-white-section.component';
import { MatCardModule } from '@angular/material/card';

import { FlexLayoutModule } from '@angular/flex-layout';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';

@NgModule({
  imports: [CommonModule, MatCardModule, MatGridListModule, MatIconModule,FlexLayoutModule],
  declarations: [BlockWhiteSectionComponent],
  exports: [
    BlockWhiteSectionComponent
  ]
})
export class BlockWhiteSectionModule { }
