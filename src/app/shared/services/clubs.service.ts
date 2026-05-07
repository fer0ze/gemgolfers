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
  constructor(private apollo: Apollo) { }

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
            ////console.log(data.club);
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
            ////console.log(data.club);
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
  // ── Club Management ───────────────────────────────────────────────────────

  getClubAdmins(clubId: string): Promise<any> {
    return new Promise((resolve) => {
      this.apollo
        .watchQuery<any>({
          query: Query.GetClubAdmins,
          variables: { clubId },
          fetchPolicy: 'network-only',
        })
        .valueChanges.subscribe(({ data }) => resolve(data));
    });
  }

  getAllRoles(): Promise<any> {
    return new Promise((resolve) => {
      this.apollo
        .watchQuery<any>({
          query: Query.GetAllRoles,
          fetchPolicy: 'network-only',
        })
        .valueChanges.subscribe(({ data }) => resolve(data));
    });
  }

  searchPlayerByEmail(email: string): Promise<any> {
    return new Promise((resolve) => {
      this.apollo
        .watchQuery<any>({
          query: Query.SearchPlayerByEmail,
          variables: { email: `%${email}%` },
          fetchPolicy: 'network-only',
        })
        .valueChanges.subscribe(({ data }) => resolve(data));
    });
  }

  setPlayerAdminClub(playerId: string, adminClubId: string | null): Promise<boolean> {
    return new Promise((resolve) => {
      this.apollo
        .mutate<any>({
          mutation: Query.SetPlayerAdminClub,
          variables: { playerId, adminClubId },
        })
        .subscribe(
          () => resolve(true),
          () => resolve(false),
        );
    });
  }

  insertUserRole(userId: string, roleId: number): Promise<boolean> {
    return new Promise((resolve) => {
      this.apollo
        .mutate<any>({
          mutation: Query.InsertUserRole,
          variables: { userId, roleId },
        })
        .subscribe(
          () => resolve(true),
          () => resolve(false),
        );
    });
  }

  removeUserRoles(userId: string): Promise<boolean> {
    return new Promise((resolve) => {
      this.apollo
        .mutate<any>({
          mutation: Query.RemoveUserRoles,
          variables: { userId },
        })
        .subscribe(
          () => resolve(true),
          () => resolve(false),
        );
    });
  }

  getClubsPaginated(limit: number, offset: number, search: string): Promise<any> {
    const s = search ? `%${search}%` : '%';
    return new Promise((resolve) => {
      this.apollo
        .watchQuery<any>({
          query: Query.GetClubsPaginated,
          variables: { limit, offset, search: s },
          fetchPolicy: 'network-only',
        })
        .valueChanges.subscribe(({ data }) => {
          resolve(data);
        });
    });
  }

  // ── Club Stats & Pagination ───────────────────────────────────────────────

  getClubStatsByClubId(clubId: string): Promise<any> {
    return new Promise((resolve) => {
      this.apollo
        .watchQuery<any>({
          query: Query.GetClubStatsByClubId,
          variables: { clubId },
          fetchPolicy: 'network-only',
        })
        .valueChanges.subscribe(({ data }) => {
          resolve(data);
        });
    });
  }

  getClubTournamentsPaginated(clubId: string, limit: number, offset: number): Promise<any> {
    return new Promise((resolve) => {
      this.apollo
        .watchQuery<any>({
          query: Query.GetClubTournamentsPaginated,
          variables: { clubId, limit, offset },
          fetchPolicy: 'network-only',
        })
        .valueChanges.subscribe(({ data }) => {
          resolve(data);
        });
    });
  }

  getClubDailyRoundsPaginated(clubId: string, limit: number, offset: number): Promise<any> {
    return new Promise((resolve) => {
      this.apollo
        .watchQuery<any>({
          query: Query.GetClubDailyRoundsPaginated,
          variables: { clubId, limit, offset },
          fetchPolicy: 'network-only',
        })
        .valueChanges.subscribe(({ data }) => {
          resolve(data);
        });
    });
  }

  getClubMembersPaginated(clubId: string, limit: number, offset: number, search?: string): Promise<any> {
    const where: any = {
      membership: { clubId: { _eq: clubId } },
    };
    if (search && search.trim()) {
      const s = `%${search.trim()}%`;
      where._or = [
        { firstName: { _ilike: s } },
        { lastName: { _ilike: s } },
        { email: { _ilike: s } },
        { membershipNumber: { _ilike: s } },
      ];
    }
    return new Promise((resolve) => {
      this.apollo
        .watchQuery<any>({
          query: Query.GetClubMembersPaginated,
          variables: { where, limit, offset },
          fetchPolicy: 'network-only',
        })
        .valueChanges.subscribe(({ data }) => {
          resolve(data);
        });
    });
  }

  getClubMemberAggregateByCategroyDashBoardAll(): Promise<any> {
    return new Promise((resolve) => {
      this.apollo
        .watchQuery<any>({
          query: Query.getClubMemberAggregateByCategroyDashBoardAll,

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
            //console.log("Could not add due to " + error);
          }
        );
    });
  }

  public addFeedback(feedback): Promise<boolean> {
    return new Promise((resolve) => {
      this.apollo
        .mutate<any>({
          mutation: Query.addFeedback,
          variables: {
            objects: [
              {
                id: feedback.id,
                type: feedback.type,
                message: feedback.message,
                userId: feedback.userId,
                name: feedback.name,
                contact: feedback.contact,
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
            //console.log("Could not add due to " + error);
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
            //console.log("Could not add due to " + error);
          }
        );
    });
  }

  updateClub(club: Club): Promise<boolean> {
    //console.log(club.id);
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
            //console.log("Could update add due to " + error);
          }
        );
    });
  }

  deleteClub(id: string): Promise<boolean> {
    //console.log(id);
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
            //console.log(data);
            resolve(true);
          },
          (error) => {
            resolve(false);
            //console.log("Could delete add due to " + error);
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
            ////console.log(data.club);
            resolve(data);
          }
        });
    });
  }
  public getAllFeedbackByUserId(userId: string): Promise<any> {
    return new Promise((resolve) => {
      this.apollo
        .subscribe({
          query: Query.getAllFeedbackByUserId,
          variables: {
            where: {
              userId: {
                _eq: userId,
              },
            },
          },
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
  public updateFeedbackStatus(id: string, status: string): Promise<boolean> {
    return new Promise((resolve) => {
      this.apollo
        .mutate<any>({
          mutation: Query.UpdateFeedbackStatus,
          variables: { id, status },
        })
        .subscribe(
          () => resolve(true),
          () => resolve(false),
        );
    });
  }

  public updateAllFeedbackStatus(status: string): Promise<boolean> {
    return new Promise((resolve) => {
      this.apollo
        .mutate<any>({
          mutation: Query.UpdateAllFeedbackStatus,
          variables: { status },
        })
        .subscribe(
          () => resolve(true),
          () => resolve(false),
        );
    });
  }

  public getAllCoursesRequest(): Promise<any> {
    return new Promise((resolve) => {
      this.apollo
        .subscribe({
          query: Query.getAllCoursesRequest,
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

  public searchClubsByName(name: string): Observable<any[]> {
    return this.apollo
      .subscribe({
        query: Query.SearchClubsByName,
        variables: { name: `%${name}%` },
      })
      .pipe(map((res: any) => res.data?.club || []));
  }
}
