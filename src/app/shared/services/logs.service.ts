import { Injectable } from '@angular/core';
//import { environment } from '../../../environments/environment';
import { Apollo } from 'apollo-angular';
import * as Query from '../GraphQL/log.gql';
import { LocalStorageService } from './localStorage';
import { Constants } from '../classes/general';
import { add } from 'lodash';
import { environment } from 'environments/environment';
@Injectable({
  providedIn: 'root',
})
export class LogsService {
  loggedInuser: any;
  constructor(
    private apollo: Apollo,
    private _localStorage: LocalStorageService,
  ) { }
  log(msg: any, level: any, additionalData: any = "") {
    this.loggedInuser = this._localStorage.get(Constants.LOGGED_IN_USER);
    // console.log(msg);
    // console.log(level);
    // console.log(additionalData);

    this.apollo
      .query({
        query: Query.LogQL,
        variables: {
          request: {
            name: environment.logName,
            message: msg,
            level: level,
            body: {
              userId: this.loggedInuser && this.loggedInuser.id ? this.loggedInuser.id : '',
              email: this.loggedInuser && this.loggedInuser.email ? this.loggedInuser.email : '',
              additionalData: additionalData != null ? additionalData : '',
              clientSideData: navigator.userAgent,
            },
          },
        },
      })
      .subscribe();
  }

  logObject(object: any) {
    // if(environment.debugging) {
    //   console.log(new Date() + ": ");
    //   console.log(object);
    // }
  }
}
