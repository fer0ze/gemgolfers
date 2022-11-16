import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlockWhiteSectionComponent } from './block-white-section.component';
import { MatCardModule } from '@angular/material';
import { MatGridListModule, MatIconModule } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
  imports: [CommonModule, MatCardModule, MatGridListModule, MatIconModule,FlexLayoutModule],
  declarations: [BlockWhiteSectionComponent],
  exports: [
    BlockWhiteSectionComponent
  ]
})
export class BlockWhiteSectionModule { }
