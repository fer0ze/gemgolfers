import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClubsService  } from '../services/clubs.service'

import { FacadeService } from '../services/facade.service'

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers:[
    ClubsService,
    
    FacadeService
  ]
})
export class ServicesModule { }
