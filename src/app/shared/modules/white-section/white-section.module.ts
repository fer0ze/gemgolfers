import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WhiteSectionComponent } from './white-section.component';
import { MatCardModule } from '@angular/material';
import { MatGridListModule, MatIconModule } from '@angular/material';

@NgModule({
 
  imports: [CommonModule, MatCardModule, MatGridListModule, MatIconModule],
  declarations: [WhiteSectionComponent],
  exports: [WhiteSectionComponent]
})
export class WhiteSectionModule { }
