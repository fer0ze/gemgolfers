import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlockWhiteComponent } from './block-white.component';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';

@NgModule({
  imports: [CommonModule, MatCardModule, MatGridListModule, MatIconModule],
  declarations: [BlockWhiteComponent],
  exports: [BlockWhiteComponent]
})
export class BlockWhiteModule { }
