import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.prod';

@Injectable({
  providedIn: 'root',
})

export class LogsService {
    
  log(msg: any) {
    if(environment.debugging) {
      console.log(new Date() + ": " + JSON.stringify(msg));
    }
  }

  logObject(object: any) {
    if(environment.debugging) {
      console.log(new Date() + ": ");
      console.log(object);
    }
  }
}