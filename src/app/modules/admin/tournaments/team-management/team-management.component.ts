import {
    ChangeDetectorRef,
    Component,
    Input,
    OnInit,
    ViewChild,
    OnChanges,
    SimpleChange,
    SimpleChanges,
} from '@angular/core';
import {
    AbstractControl,
    FormBuilder,
    FormGroup,
    FormControl,
    FormArray,
    Validators,
} from '@angular/forms';
import { read, utils } from 'xlsx';
import { Router, ActivatedRoute } from '@angular/router';
import { FacadeService } from '../../../../shared/services/facade.service';
import { Club } from '../../../../shared/models/club.model';
import { Course, CourseHoles } from '../../../../shared/models/course.model';
import {
    Tournament,
    TournamentRounds,
    TournamentMember,
    matchFormat,
    TournamentCategory,
} from '../../../../shared/models/tournament.model';
import {
    Player,
    PlayerCategory,
    Marshal,
} from '../../../../shared/models/player.model';
import { Flight, FlightMembers } from '../../../../shared/models/flight.model';
import {
    UniqueIdGenerator,
    passwordGenerator,
    Constants,
    General,
} from '../../../../shared/classes/general';
import { SelectionModel } from '@angular/cdk/collections';
import { of } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
    CdkDragDrop,
    moveItemInArray,
    transferArrayItem,
} from '@angular/cdk/drag-drop';
import { DialogAddPlayerComponent } from '../../dialogs/dialog-add-player/dialog-add-player.component';
import { DialogPlayerComponent } from '../../dialogs/dialog-player/dialog-player.component';
import { DialogPlayerListComponent } from '../../dialogs/dialog-player-list/dialog-player-list.component';
import { DialogOverviewComponent } from '../../dialogs/dialog-overview/dialog-overview.component';
import { DialogMoveFlightComponent } from '../../dialogs/dialog-move-flight/dialog-move-flight.component';
import { ViewTournamentComponent } from '../view-tournament/view-tournament.component';
import { isNumber } from 'lodash';
import { MatDrawer } from '@angular/material/sidenav';
import { DialogAddMemberComponent } from '../../dialogs/dialog-add-member/dialog-add-member.component';
import { DialogCloseRoundComponent } from '../../dialogs/dialog-close-round/dialog-close-round.component';
import { LocalStorageService } from 'app/shared/services/localStorage';
import { LogsService } from 'app/shared/services/logs.service';

@Component({
    selector: 'app-team-management',
    templateUrl: './team-management.component.html',
    styleUrls: ['./team-management.component.scss'],
})
export class TeamManagementComponent implements OnInit {
    @Input()
    tournamentID: string;
    index = 0;
    selectedTeams1: any[][] = [];
    loggedInuser: Player;
    selectedTeams2: any[][] = [];
    teamMembersToSave: any[] = [];
    tournamentMembers: any[] = [];
    selectPlayer: any;
    currentTournament: any;
    constructor(
        private _localStorage: LocalStorageService,
        private logger: LogsService,
        private route?: ActivatedRoute,
        private router?: Router,
        public snackBar?: MatSnackBar,
        public dialog?: MatDialog,
        private facadeService?: FacadeService,
        public changeDetection?: ChangeDetectorRef,
    ) { }

    async ngOnInit() {
        this.loggedInuser = this._localStorage.get(Constants.LOGGED_IN_USER);
        this.route.paramMap.subscribe((params) => {
            this.tournamentID = params.get('id');
        });
        console.log(this.tournamentID);

        let tournamentInfo = await this.facadeService.getTournamentsTeams(
            this.tournamentID
        );
        this.logger.log('Admin comes to View Teams on Tournament Page', "info", this.tournamentID.toString());
        this.logger.log('Getting View Teams on Tournament Page', "info", this.tournamentID.toString());
        this.currentTournament =
            tournamentInfo.tournament.length > 0
                ? tournamentInfo.tournament[0]
                : [];
        if (this.currentTournament.teamMatch) {
            this.index = this.currentTournament.teams.length;
            this.selectedTeams1[0] = [];
            this.selectedTeams2[0] = [];
            this.selectedTeams1[this.selectedTeams1.length - 1]['id'] = this.currentTournament.teams[0].id;
            this.selectedTeams1[this.selectedTeams1.length - 1]['name'] = this.currentTournament.teams[0].name;
            this.selectedTeams1[this.selectedTeams1.length - 1]['color'] = this.currentTournament.teams[0].color;
            this.selectedTeams2[this.selectedTeams2.length - 1]['id'] = this.currentTournament.teams[1].id;
            this.selectedTeams2[this.selectedTeams2.length - 1]['name'] = this.currentTournament.teams[1].name;
            this.selectedTeams2[this.selectedTeams2.length - 1]['color'] = this.currentTournament.teams[1].color;
        }
        if (this.currentTournament.members)
            for (let p of this.currentTournament.members)
                this.tournamentMembers.push(p.player);
        console.log(this.tournamentMembers);
        for (let obj of this.tournamentMembers) {
            if (this.currentTournament.opponents.length > 0) {
                for (let objA of this.currentTournament.opponents) {
                    if (objA.team1MemberId == obj.id
                        && objA.team1Id == this.selectedTeams1[0]['id']) {
                        this.selectedTeams1[0].push(obj);
                    }
                    if (objA.team2MemberId == obj.id
                        && objA.team2Id == this.selectedTeams2[0]['id']) {
                        this.selectedTeams2[0].push(obj);
                    }
                }
            }
        }
        console.log(this.selectedTeams1);
        

    }

    onColorChange(event: Event, index: any) {
        const inputElement = event.target as HTMLInputElement;
        if (index == 1) {
            this.selectedTeams1[this.selectedTeams1.length - 1]['color'] = inputElement.value;
        } else {
            this.selectedTeams2[this.selectedTeams2.length - 1]['color'] = inputElement.value;
        }
        // this.teamA['color'] = inputElement.value;
    }
    removeTeamPlayer(temaId: string, index, teamNumber) {
        console.log(this.selectedTeams1);
        console.log(this.selectedTeams2);

        console.log(temaId);
        console.log(index);
        if (teamNumber == 1) {
            this.selectedTeams1[temaId].splice(index, 1);
        } else {
            this.selectedTeams2[temaId].splice(index, 1);

        }


    }
    editTeam(id, index) {
        console.log(index);
        try {
            this.logger.log('Add New member to Team', "info", id);

            let TM = [];
            for (let obj of this.tournamentMembers) {
                let play = {
                    id: obj.id,
                    firstName: obj.firstName,
                    lastName: obj.lastName,
                    handicap: obj.handicap,
                    playerCategory: obj.playerCategory,
                    membershipNumber: obj.membershipNumber,
                    email: obj.email,
                }
                TM.push(play);
            }

            const dialogRef = this.dialog.open(DialogAddMemberComponent, {
                data: {
                    id: id,
                    members: TM,
                },
            });

            dialogRef.afterClosed().subscribe((result) => {
                if (result.length > 0) {
                    for (let obj of result) {
                        let exist1 = this.selectedTeams1.find((item) =>
                            item.some((f) => f.id == obj.id)
                        );
                        let exist2 = this.selectedTeams2.find((item) =>
                            item.some((f) => f.id == obj.id)
                        );
                        if (exist1 || exist2) {
                            this.snackBar.open(
                                'Player already exist in the list.',
                                'x',
                                {
                                    duration: 5000,
                                }
                            );

                            return;
                        } else {
                            if (index == 1) {
                                this.selectedTeams1[0].push(obj);
                            } else {
                                this.selectedTeams2[0].push(obj);

                            }
                        }
                    }
                }
            });
        } catch (error) {
            this.logger.log('Getting Tournaments DataAdd New member to flight Failed', "error", error.toString());
        }
    }
    async saveTournamentTeams() {
        let tournamentMember: any[] = [];
        let counter: number;
        let DelplayerIndex: any;
        let DelplayerInfo: any;
        this.teamMembersToSave = [];
        let teamsToSave: any[] = [];
        // let selectionArray = Object.assign({}, this.selection.selected);
        let flag: boolean = true;
        if (this.selectedTeams1[0].length !== this.selectedTeams2[0].length) {
            this.snackBar.open('Teams Members are not equal.', 'x', {
                duration: 2000,
            });
            return;
        }
        for (let index in this.selectedTeams1) {
            if (flag == true) {
                for (let index2 in this.selectedTeams1[index]) {
                    if (Number.isInteger(Number(index2))) {
                        let FM: any = {
                            id: UniqueIdGenerator.generate(),
                            team1Id: this.selectedTeams1[index]['id'],
                            team2Id: this.selectedTeams2[index]['id'],
                            team1MemberId: this.selectedTeams1[index][index2]['id'],
                            team2MemberId: this.selectedTeams2[index][index2]['id'],
                            tournamentId: this.tournamentID,
                            flightId: null,
                        };
                        this.teamMembersToSave.push(FM);
                    }
                }
                flag = false;
            }

            let nameA: string = (<HTMLInputElement>(
                document.getElementById(
                    'teamA_' + index + '_name'
                )
            )).value;

            let colorA: string = (<HTMLInputElement>(
                document.getElementById(
                    'teamA_' + index + '_color'
                )
            )).value;
            let nameB: string = (<HTMLInputElement>(
                document.getElementById(
                    'items_' + index + '_name'
                )
            )).value;

            let colorB: string = (<HTMLInputElement>(
                document.getElementById(
                    'items_' + index + '_color'
                )
            )).value;
            this.selectedTeams1[index]['name'] = nameA;
            this.selectedTeams1[index]['color'] = colorA;
            this.selectedTeams2[index]['name'] = nameB;
            this.selectedTeams2[index]['color'] = colorB;
            let teamA: any = {
                tournamentId: this.tournamentID,
                adminId: this.loggedInuser.id,
                id: this.selectedTeams1[index]['id'],
                name: nameA,
                color: colorA,
            };
            teamsToSave.push(teamA);
            let teamB: any = {
                tournamentId: this.tournamentID,
                adminId: this.loggedInuser.id,
                id: this.selectedTeams2[index]['id'],
                name: nameB,
                color: colorB,
            };
            teamsToSave.push(teamB);
        }
        console.log(teamsToSave);
        console.log(this.teamMembersToSave);
        let result = <any>(
            await this.facadeService.insertTournamentTeam(teamsToSave,this.tournamentID)
        );

        if (result) {
            this.snackBar.open('Tournament Teams have been saved.', 'x', {
                duration: 2000,
            });
        } else {
            this.snackBar.open('Error!.Try Again', 'x', {
                duration: 2000,
            });
        }
    }
}
