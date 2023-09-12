import { Injectable } from '@angular/core';
//import { environment } from '../../../environments/environment';
import { Apollo } from 'apollo-angular';
import * as Query from '../GraphQL/log.gql';
@Injectable({
  providedIn: 'root',
})

export class LogsService {
  constructor(private apollo: Apollo) { }
  log(msg: any, level: any, body: any) {
    console.log(msg);

    this.apollo.query({
      query: Query.LogQL,
      variables: {
        request: {
          name: "Actify-Leads-Angular",
          message: msg,
          level: level,
          body: {
            username: body.username,
            userid: body.userid,
            firebaseUid: body.firebaseUid,
            additionalData: body.additionalData,
          }
        }
      }
    }).subscribe();
  }

  logObject(object: any) {
    // if(environment.debugging) {
    //   console.log(new Date() + ": ");
    //   console.log(object);
    // }
  }
}