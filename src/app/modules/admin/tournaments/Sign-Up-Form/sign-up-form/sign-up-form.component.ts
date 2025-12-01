import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {
    General,
    generateGemId,
    UniqueIdGenerator,
} from 'app/shared/classes/general';
import { Club } from 'app/shared/models/club.model';
import { PlayerCategory } from 'app/shared/models/player.model';
import { TournamentMember } from 'app/shared/models/tournament.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FacadeService } from 'app/shared/services/facade.service';
import { generate, map, Observable, startWith } from 'rxjs';
import { FuseAlertType } from '@fuse/components/alert';

@Component({
    selector: 'app-sign-up-form',
    templateUrl: './sign-up-form.component.html',
    styleUrls: ['./sign-up-form.component.scss'],
})
export class SignUpFormComponent implements OnInit {
    signUpForm: FormGroup;
    alert: { type: FuseAlertType; message: string } = {
        type: 'success',
        message: 'You are successfully added as a Tournament Member',
    };
    showAlert: boolean = false;
    showClub: boolean = false;
    tournamentQL: any;
    private tournamentID: string;
    playerCategories: PlayerCategory[] = [];
    filteredClubOptions: Observable<Club[]>;
    golfClubs: Club[] = [];
    duplicatePlayers: any[] = [];
    constructor(
        private _facadeService: FacadeService,
        private route: ActivatedRoute,
        public snackBar: MatSnackBar
    ) { }

    async ngOnInit() {
        this.route.paramMap.subscribe((params) => {
            this.tournamentID = params.get('id');
        });

        this.createForm();
        let data = await this._facadeService.getTournamentByID(
            this.tournamentID
        );
        console.log(data);
        this.tournamentQL = data.tournament[0];
        //this.playerCategories = this._facadeService.getPlayerCategories();
        let dataClubs = await this._facadeService.getClubList();
        this.golfClubs = dataClubs.club;
        if (this.tournamentQL.clubId) {
            this.showClub = true;
        } else {
            this.signUpForm.get('club').removeValidators([Validators.required]);
            this.signUpForm.get('club').updateValueAndValidity();
        }

        this.filteredClubOptions = this.signUpForm
            .get('club')!
            .valueChanges.pipe(
                startWith(''),
                map((value) =>
                    typeof value === 'string' ? value : value ? value.name : ''
                ),
                map((name) => (name ? this._filter(name) : this.golfClubs))
            );

        if (this.tournamentQL['CategoriesQL'].length > 0) {
            for (let obj of this.tournamentQL['CategoriesQL']) {
                let obja = {
                    id: 1,
                    name: obj.category,
                };
                this.playerCategories.push(obja);
            }
        }
        //console.log(this.playerCategories);
    }
    createForm() {
        this.signUpForm = new FormGroup({
            firstName: new FormControl('', [Validators.required]),
            lastName: new FormControl('', [Validators.required]),
            email: new FormControl('', [Validators.required]),
            phone: new FormControl(''),
            membership: new FormControl(''),
            category: new FormControl('', [Validators.required]),
            handicap: new FormControl('0', [Validators.required]),
            club: new FormControl('', [Validators.required]),
        });
    }
    displayFn(club: Club): string {
        return typeof club === 'string' ? club : club ? club.name : '';
    }
    private _filter(value: string): Club[] {
        if (value) {
            const filterValue = value.toLowerCase();

            return this.golfClubs.filter(
                (option) => option.name.toLowerCase().indexOf(filterValue) === 0
            );
        }

        return this.golfClubs;
    }
    public hasError = (controlName: string, errorName: string) => {
        return this.signUpForm.controls[controlName].hasError(errorName);
    };
    async signUp() {
        let exist: any = [];
        let clubMember: any[] = [];
        let signUpPerson = this.signUpForm.getRawValue();
        if (signUpPerson.membership) {
            exist = await this._facadeService.getPlayerByMembershipNumber(
                signUpPerson.membership.toString()
            );
        }

        if (signUpPerson.phone && exist.length == 0) {
            // this.logger.log(signUpPerson.phone);
            //console.log(signUpPerson.phone);
            let phone = General.getPhonePrefix(signUpPerson.phone.trim());
            //console.log(phone);

            exist = await this._facadeService.getPlayerByPhone(phone);
        }

        if (signUpPerson.email && exist.length == 0) {
            exist = await this._facadeService.getPlayerByEmail(
                signUpPerson.email.toString()
            );
        }
        let UniqueId: string;

        if (exist && exist.length > 0) {
            UniqueId = exist[0].id;
        } else if (exist && exist.player != undefined) {
            UniqueId = exist.player[0].id;
        } else {
            UniqueId = UniqueIdGenerator.generate();
        }
        if (exist && exist.length > 0) {
            let find = this.tournamentQL.members.find((a) => {
                return a.playerId == exist[0].id;
            });
            //console.log(find);
            if ((find == undefined || Object.keys(find).length === 0) && this.showClub) {
                let member: any = {
                    tournamentId: this.tournamentID,
                    playerId: exist[0].id,
                    status: true,
                };
                this.saveMembers(member);
            } else {
                this.alert = {
                    type: 'warn',
                    message:
                        'You are alredy added as a Tournament Member!',
                };
                this.showAlert = true;
            }
        } else {
            // let players: any[] =
            //     await this._facadeService.getallPlayersforGGid();
            // var sortarray = players['player'];
            // sortarray.sort(this.Comparator);
            //console.log(sortarray);
            // let member: any = {
            //     clubId: signUpPerson.club.id,
            //     //clubId: "-KpFBx3dRDXWh7ZoK9vG",
            // };
            // clubMember.push(member);
            let player: any = {
                id: UniqueId,
                adminClubId: null,
                firebaseUid: null,
                fcmToken: null,
                gemId: null,
                addedBy: this.tournamentQL.adminId,
                firstName: signUpPerson.firstName,
                lastName: signUpPerson.lastName,
                gender: signUpPerson.gender ? signUpPerson.gender : null,
                dob: signUpPerson.dob ? signUpPerson.dob : null,
                picture: signUpPerson.picture ? signUpPerson.picture : null,
                email: signUpPerson.email ? signUpPerson.email : null,
                phone: signUpPerson.phone
                    ? General.getPhonePrefix(signUpPerson.phone.trim())
                    : null,
                playerCategory: signUpPerson.category
                    ? signUpPerson.category
                    : null,
                handicap: signUpPerson.handicap ? signUpPerson.handicap : 0,
                online: false,
                countryCode: signUpPerson.code ? signUpPerson.code : null,
                extraData: signUpPerson.extra ? signUpPerson.extra : null,
                membershipNumber: signUpPerson?.membershipNumber
                    ? signUpPerson?.membershipNumber.toString()
                    : null,
                userRole: 10,
                // membership: member,
            };

            let password = Math.random().toString(36).slice(-8);
            await this._facadeService.updateAccountInFirebase(player.email, password).subscribe(async (re) => {

                if (re) {
                    this._facadeService.sendTransactionalEmail(player.email, player.firstName, password).subscribe();
                    let status = await this._facadeService.AddPlayer(player);
                    if (status) {
                        // let member: any = {
                        //     tournamentId: this.tournamentID,
                        //     playerId: UniqueId,
                        //     status: true,
                        // };
                        // this.saveMembers(member);
                        this.alert = {
                            type: 'success',
                            message:
                                'You are successfully added as a Member.',
                        };
                        this.showAlert = true;
                    } else {
                        this.snackBar.open('Something went wrong!', 'x', {
                            duration: 5000,
                        });
                    }

                }
            });
        }
    }
    public Comparator(a, b) {
        let gemIDA = parseInt(a['gemId'].slice(2));
        let gemIDB = parseInt(b['gemId'].slice(2));
        if (gemIDA < gemIDB) return 1;
        if (gemIDA > gemIDB) return -1;

        return 0;
    }
    async saveMembers(tournamentMember: TournamentMember[]) {
        let result = <any>(
            await this._facadeService.insertTournamentMember(tournamentMember)
        );

        if (result) {
            // Set the alert
            this.alert = {
                type: 'success',
                message:
                    'You are successfully added as a Tournament Member.',
            };
            this.showAlert = true;

            this.snackBar.open('Member Added', 'x', {
                duration: 1000,
            });
        }
    }
}
