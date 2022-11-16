import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlockWhiteComponent } from './block-white.component';
import { MatCardModule } from '@angular/material';
import { MatGridListModule, MatIconModule } from '@angular/material';

@NgModule({
  imports: [CommonModule, MatCardModule, MatGridListModule, MatIconModule],
  declarations: [BlockWhiteComponent],
  exports: [BlockWhiteComponent]
})
export class BlockWhiteModule { }
