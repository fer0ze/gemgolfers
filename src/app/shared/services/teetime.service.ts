import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs';
import { Club, ClubSchedule } from '../models/club.model';
import { TeeTime } from '../models/teetime.model';
import * as Query from '../GraphQL/clubs.gql';
import { map } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class TeeTimeService {

  constructor(private apollo: Apollo) { }

  public getClubsList(): Promise<any> {
    return new Promise(resolve => {
      this.apollo.subscribe({
        query: Query.GetClubs
      })
        .subscribe(({ data }) => {
          if (!data) {
            resolve(null);
          } else {
            ////console.log(data.club);
            resolve(data);
          }
        });
    });
  }

  findAll(): Observable<any> {
    return this.apollo
      .query<any>({ query: Query.GetClubs })
      .pipe(map(res => res.data));
  }

  findOne(id: string): Observable<any> {
    return this.apollo
      .query<any>({
        query: Query.GetClubByID, variables: {
          'where': {
            'id': {
              '_eq': id
            }
          }
        }
      }).pipe(map(res => res.data));
  }

  getClubByID(id: string): Promise<any> {
    return new Promise(resolve => {
      this.apollo.watchQuery<any>({
        query: Query.GetClubByID,
        variables: {
          'where': {
            'id': {
              '_eq': id
            }
          }
        }
      }).valueChanges
        .subscribe(({ data }) => {
          resolve(data.club);
        });
    });
  }

  public getClubTeeTimeBooking(clubId: string): Promise<any> {
    return new Promise(resolve => {
      this.apollo.subscribe<any>({
        query: Query.GetTeeTimeBookingQL,
        variables: {
          'where': {
            'clubId': {
              '_eq': clubId
            }
          }
        }
      }).subscribe(({ data }) => {
        resolve(data);
      });
    });
  }

  public deleteTeeTime(id: string): Promise<boolean> {
    return new Promise(resolve => {
      this.apollo.mutate<any>({
        mutation: Query.DeleteTeeTimeQL,
        variables: {
          'where': {
            'id': {
              '_eq': id
            }
          }
        }
      }).subscribe(({ data }) => {
        resolve(true);
      }, (error) => {
        resolve(false);
        //console.log('Could not delete due to ' + error);
      });
    });
  }

  public getClubTeeTimeBookingForSuperAdmin(): Promise<any> {
    return new Promise(resolve => {
      this.apollo.subscribe<any>({
        query: Query.GetTeeTimeBookingSuperAdminQL,
      }).subscribe(({ data }) => {
        resolve(data);
      });
    });
  }

  public isTeeTimeDateExist(clubId: string, selectedDate: Date): Promise<TeeTime[]> {
    return new Promise(resolve => {
      this.apollo.subscribe<any>({
        query: Query.GetTeeTimeBookingQL,
        variables: {
          'where': {
            "_and": [
              {
                'clubId': {
                  '_eq': clubId
                }
              },
              {
                'teeDate': {
                  '_eq': selectedDate
                }
              }]
          }
        }
      }).subscribe(({ data }) => {
        resolve(data);
      });
    });
  }

  public AddTeeTimeSchedule(teeTime: TeeTime): Promise<boolean> {
    return new Promise(resolve => {
      this.apollo.mutate<any>({
        mutation: Query.AddTeeTimeQL,
        variables: {
          'objects': [{
            'id': teeTime.id,
            'clubId': teeTime.clubId,
            'courseId': teeTime.courseId,
            'bookingDate': teeTime.bookingDate,
            'teeDate': teeTime.teeDate,
            'startTime': teeTime.startTime,
            'endTime': teeTime.endTime,
            'interval': teeTime.interval,
            'noOfPlayers': teeTime.noOfPlayers,
            'allowNineHole': teeTime.allowNineHole,
            'bookingTime': teeTime.bookingTime,
            'slots': {
              'data': teeTime.teeTimeSlot
            }
          }]
        }
      }).subscribe(({ data }) => {
        resolve(true);
      }, (error) => {
        resolve(false);
        //console.log('Could not add due to ' + error);
      });

    });
  }


  updateClub(club: Club): Promise<boolean> {
    //console.log(club.id);
    return new Promise(resolve => {
      this.apollo.mutate<any>({
        mutation: Query.UpdateMutation,
        variables: {
          'where': {
            'id': {
              '_eq': club.id
            }
          },
          'set':
          {
            'name': club.name,
            'address': club.address,
            'email': club.email,
            'phone': club.phone
          }
        }
      }).subscribe(({ data }) => {
        resolve(true);
      }, (error) => {
        resolve(false);
        //console.log('Could update add due to ' + error);
      });
    });
  }

  deleteClub(id: string): Promise<boolean> {
    //console.log(id);
    return new Promise(resolve => {
      this.apollo.mutate<any>({
        mutation: Query.DeleteClub,
        variables: {
          'where': {
            'id': {
              '_eq': id
            }
          }
        }
      }).subscribe(({ data }) => {
        //console.log(data);
        resolve(true);
      }, (error) => {
        resolve(false);
        //console.log('Could delete add due to ' + error);
      });
    });
  }

  public getScheduleList(clubId: string): Promise<any> {
    return new Promise(resolve => {
      this.apollo.subscribe({
        query: Query.GetSchedule,
        variables: {
          'where': {
            'clubId': {
              '_eq': clubId
            }
          }
        }
      })
        .subscribe(({ data }) => {
          if (!data) {
            resolve(null);
          } else {
            resolve(data);
          }
        });
    });
  }

  /*
  public getClubsList(): any {
    const clubsObservable = new Observable(observer => {
           
               observer.next(this.apollo.watchQuery<any>({
                query: Query.GetClubs
                })
                .valueChanges
                .subscribe(({ data }) => {
                    return data;
                }));
           
    });

    return clubsObservable;
} */

}
