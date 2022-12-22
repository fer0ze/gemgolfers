import { Injectable } from "@angular/core";
import { Apollo } from "apollo-angular";
import { Observable } from "rxjs";
import { Club, ClubSchedule } from "../models/club.model";
import * as Query from "../GraphQL/clubs.gql";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class ClubsService {
  constructor(private apollo: Apollo) {}

  public getClubsList(): Promise<any> {
    return new Promise((resolve) => {
      this.apollo
        .subscribe({
          query: Query.GetClubs,
        })
        .subscribe(({ data }) => {
          if (!data) {
            resolve(null);
          } else {
            //console.log(data.club);
            resolve(data);
          }
        });
    });
  }

  public getPGFClubsList(id: string): Promise<any> {
    return new Promise((resolve) => {
      this.apollo
        .subscribe({
          query: Query.GetPGFClubs,
          variables: {
            where: {
              mainClub: {
                _eq: id,
              },
            },
          },
        })
        .subscribe(({ data }) => {
          if (!data) {
            resolve(null);
          } else {
            //console.log(data.club);
            resolve(data);
          }
        });
    });
  }

  findAll(): Observable<any> {
    return this.apollo
      .query<any>({ query: Query.GetClubs })
      .pipe(map((res) => res.data));
  }

  findOne(id: string): Observable<any> {
    return this.apollo
      .query<any>({
        query: Query.GetClubByID,
        variables: {
          where: {
            id: {
              _eq: id,
            },
          },
        },
      })
      .pipe(map((res) => res.data));
  }

  getClubByID(id: string): Promise<any> {
    return new Promise((resolve) => {
      this.apollo
        .watchQuery<any>({
          query: Query.GetClubByID,
          variables: {
            where: {
              id: {
                _eq: id,
              },
            },
          },
        })
        .valueChanges.subscribe(({ data }) => {
          resolve(data.club);
        });
    });
  }

  getClubMemberAggregateByCategroy(id: string): Promise<any> {
    return new Promise((resolve) => {
      this.apollo
        .watchQuery<any>({
          query: Query.getClubMemberAggregateByCategroy,
          variables: {
            where: {
              id: {
                _eq: id,
              },
            },
          },
        })
        .valueChanges.subscribe(({ data }) => {
          resolve(data);
        });
    });
  }
  getClubMemberAggregateByCategroyDashBoard(id: string): Promise<any> {
    return new Promise((resolve) => {
      this.apollo
        .watchQuery<any>({
          query: Query.getClubMemberAggregateByCategroyDashBoard,
          variables: {
            where: {
              id: {
                _eq: id,
              },
            },
          },
        })
        .valueChanges.subscribe(({ data }) => {
          resolve(data);
        });
    });
  }

  public AddClub(club: Club): Promise<boolean> {
    return new Promise((resolve) => {
      this.apollo
        .mutate<any>({
          mutation: Query.AddMutation,
          variables: {
            objects: [
              {
                id: club.id,
                name: club.name,
                address: club.address,
                email: club.email,
                phone: club.phone,
              },
            ],
          },
        })
        .subscribe(
          ({ data }) => {
            resolve(true);
          },
          (error) => {
            resolve(false);
            console.log("Could not add due to " + error);
          }
        );
    });
  }

  public AddClubSchedule(schedule: ClubSchedule): Promise<boolean> {
    return new Promise((resolve) => {
      this.apollo
        .mutate<any>({
          mutation: Query.AddScheduleMutation,
          variables: {
            objects: [
              {
                id: schedule.id,
                clubId: schedule.clubId,
                courseId: schedule.courseId,
                tournamentTitle: schedule.tournamentTitle,
                date: schedule.date,
                matchFormat: schedule.matchFormat,
                description: schedule.description,
              },
            ],
          },
        })
        .subscribe(
          ({ data }) => {
            resolve(true);
          },
          (error) => {
            resolve(false);
            console.log("Could not add due to " + error);
          }
        );
    });
  }

  updateClub(club: Club): Promise<boolean> {
    console.log(club.id);
    return new Promise((resolve) => {
      this.apollo
        .mutate<any>({
          mutation: Query.UpdateMutation,
          variables: {
            where: {
              id: {
                _eq: club.id,
              },
            },
            set: {
              name: club.name,
              address: club.address,
              email: club.email,
              phone: club.phone,
            },
          },
        })
        .subscribe(
          ({ data }) => {
            resolve(true);
          },
          (error) => {
            resolve(false);
            console.log("Could update add due to " + error);
          }
        );
    });
  }

  deleteClub(id: string): Promise<boolean> {
    console.log(id);
    return new Promise((resolve) => {
      this.apollo
        .mutate<any>({
          mutation: Query.DeleteClub,
          variables: {
            where: {
              id: {
                _eq: id,
              },
            },
          },
        })
        .subscribe(
          ({ data }) => {
            console.log(data);
            resolve(true);
          },
          (error) => {
            resolve(false);
            console.log("Could delete add due to " + error);
          }
        );
    });
  }

  public getScheduleList(clubId: string): Promise<any> {
    return new Promise((resolve) => {
      this.apollo
        .subscribe({
          query: Query.GetSchedule,
          variables: {
            where: {
              clubId: {
                _eq: clubId,
              },
            },
          },
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
  public getAllFeedback(): Promise<any> {
    return new Promise((resolve) => {
      this.apollo
        .subscribe({
          query: Query.Getfeedbacks,
        })
        .subscribe(({ data }) => {
          if (!data) {
            resolve(null);
          } else {
            //console.log(data.club);
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
