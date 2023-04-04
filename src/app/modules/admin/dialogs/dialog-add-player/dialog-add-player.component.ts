import { Component, Inject, OnInit } from '@angular/core';
import {
    MAT_DIALOG_DATA,
    MatDialogRef,
    MatDialogClose,
} from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Club } from '../../../../shared/models/club.model';
import {
    Player,
    PlayerCategory,
    ClubMembership,
} from '../../../../shared/models/player.model';
import { FacadeService } from '../../../../shared/services/facade.service';
import {
    UniqueIdGenerator,
    generateGemId,
    Constants,
    General,
} from '../../../../shared/classes/general';

@Component({
    selector: 'app-dialog-add-player',
    templateUrl: './dialog-add-player.component.html',
    styleUrls: ['./dialog-add-player.component.scss'],
})
export class DialogAddPlayerComponent implements OnInit {
    public response: Player;
    public player: Player;

    public playerForm: FormGroup;
    public frmTitle: string;
    private playerID: string;
    currentPlayer: any = [];
    playerCategories: PlayerCategory[] = [];
    golfClubs: Club[] = [];
    listCountries: any[] = [];
    loggedInuser: Player;

    constructor(
        public dialogRef: MatDialogRef<DialogAddPlayerComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private router: Router,
        private route: ActivatedRoute,
        private location: Location,
        public snackBar: MatSnackBar,
        public facadeService: FacadeService
    ) {}

    async ngOnInit() {
        //console.log(this.route.snapshot.paramMap.get("id"));

        this.route.paramMap.subscribe((params) => {
            this.playerID = params.get('id');
        });

        this.loggedInuser = JSON.parse(
            localStorage.getItem(Constants.LOGGED_IN_USER)
        );

        this.playerForm = new FormGroup({
            firstName: new FormControl('', [
                Validators.required,
                Validators.maxLength(60),
            ]),
            lastName: new FormControl('', [
                Validators.required,
                Validators.maxLength(60),
            ]),

            email: new FormControl('', [Validators.email]),
            phone: new FormControl('', [Validators.required]),
            playerCategory: new FormControl('', [Validators.required]),
            handicap: new FormControl('', [Validators.required]),

            playerClubMember: new FormControl(
                this.loggedInuser ? this.loggedInuser.adminClubId : '',
                [Validators.required]
            ),
            membershipNumber: new FormControl(''),
        });

        this.playerCategories = this.facadeService.getPlayerCategories();

        let dataClubs = await this.facadeService.getClubList();
        this.golfClubs = dataClubs.club;

        this.listCountries = General.getCountries();

        if (this.playerID) {
            this.frmTitle = 'Update Player Form';
            //this.facadeService.findOne(this.playerID).subscribe(result => this.currentPlayer = result.player);
            this.currentPlayer = <Player>(
                await this.facadeService.getPlayerByID(this.playerID)
            );

            console.log(this.currentPlayer);

            this.playerForm.setValue({
                firstName: this.currentPlayer[0].firstName,
                lastName: this.currentPlayer[0].lastName,
                gender: this.currentPlayer[0].gender,
                email: this.currentPlayer[0].email,
                phone: this.currentPlayer[0].phone,
                dob: this.currentPlayer[0].dob,
                picture: this.currentPlayer[0].picture,
                playerCategory: this.currentPlayer[0].playerCategory,
                handicap: this.currentPlayer[0].handicap,

                playerClubMember: this.loggedInuser
                    ? this.loggedInuser.adminClubId
                    : '',

                membershipNumber: this.currentPlayer[0].membershipNumber,
            });
        } else {
            this.frmTitle = 'Create Player Form';
        }
    }

    public hasError = (controlName: string, errorName: string) => {
        return this.playerForm.controls[controlName].hasError(errorName);
    };

    public reset() {
        this.playerForm.reset();
    }

    public onCancel = () => {
        this.location.back();
    };

    public createPlayer = (playerFormValue: any) => {
        if (this.playerForm.valid) {
            this.executePlayerCreation(playerFormValue);
        }
    };

    async isEmailExist() {
        let flag = false;

        let checkEmail = <Player>(
            await this.facadeService.getPlayerByEmail(
                this.playerForm.get('email').value
            )
        );
        //console.log(checkEmail);
        if (checkEmail) flag = true;

        return flag;
    }

    async isPhoneExist() {
        let flag = false;

        let checkEmail = <Player>(
            await this.facadeService.getPlayerByPhone(
                this.playerForm.get('phone').value
            )
        );
        //console.log(checkEmail);
        if (checkEmail) flag = true;

        return flag;
    }

    async executePlayerCreation(playerFormValue: any) {
        let newFlag = true;
        let checkEmail: any = [];
        let checkPhone: any = [];
        let emailPlayerId: string = '';
        let phonePlayerId: string = '';

        if (this.playerForm.get('email').value)
            checkEmail = <Player>(
                await this.facadeService.getPlayerByEmail(
                    this.playerForm.get('email').value
                )
            );

        if (this.playerForm.get('phone').value)
            checkPhone = <Player>(
                await this.facadeService.getPlayerByPhone(
                    this.playerForm.get('phone').value
                )
            );

        //console.log(checkEmail);
        if (checkEmail.length > 0) emailPlayerId = checkEmail[0].id;

        if (checkPhone.length > 0) phonePlayerId = checkPhone[0].id;

        if (
            (checkEmail.length > 0 && !this.playerID) ||
            (emailPlayerId !== '' && emailPlayerId !== this.playerID)
        ) {
            this.snackBar.open('Email already exist.', 'x', {
                duration: 5000,
            });

            return;
        } else if (
            (checkPhone.length > 0 && !this.playerID) ||
            (phonePlayerId !== '' && phonePlayerId !== this.playerID)
        ) {
            this.snackBar.open('Phone number already exist.', 'x', {
                duration: 5000,
            });

            return;
        } else if (
            (checkEmail.length > 0 && this.playerID) ||
            (checkPhone.length > 0 && this.playerID)
        ) {
            newFlag = false;
        } else {
        }

        let clubMember: ClubMembership[] = [];
        this.loggedInuser = JSON.parse(
            localStorage.getItem(Constants.LOGGED_IN_USER)
        );
        let UniqueId: string = '';
        let GEMId: string = '';

        let member: any = {
            clubId: playerFormValue.playerClubMember,
        };

        clubMember.push(member);
        let players:any[] = await this.facadeService.getallPlayersforGGid();
        var sortarray = players['player'];
        sortarray.sort(this.Comparator);
        console.log(sortarray);
        this.playerID
            ? (UniqueId = this.playerID)
            : (UniqueId = UniqueIdGenerator.generate());
        this.currentPlayer.length > 0
            ? (GEMId = this.currentPlayer.gemId)
            : (GEMId = generateGemId.generate(sortarray[0].gemId));

        //console.log(playerFormValue.isClubAdmin);
        const player: Player = {
            id: UniqueId,
            adminClubId:
                playerFormValue.isClubAdmin == true
                    ? playerFormValue.playerClubMember
                    : null,
            firebaseUid:
                this.currentPlayer.length > 0
                    ? this.currentPlayer.firebaseUid
                    : null,
            fcmToken:
                this.currentPlayer.length > 0
                    ? this.currentPlayer.fcmToken
                    : null,
            gemId: GEMId,
            firstName: playerFormValue.firstName,
            lastName: playerFormValue.lastName,
            gender: playerFormValue.gender,
            dob: General.parseToDate(playerFormValue.dob),
            picture: playerFormValue.picture,
            email: playerFormValue.email,
            phone: playerFormValue.phone,
            playerCategory: playerFormValue.playerCategory,
            handicap: playerFormValue.handicap,
            online: false,
            countryCode: playerFormValue.countryCode,
            extraData: playerFormValue.extraData,
            userRole: playerFormValue.isClubAdmin == true ? 2 : 3,
            membership: clubMember,
            membershipNumber: playerFormValue.membershipNumber,
        };

        if (newFlag && !this.playerID) {
            //console.log("Going to add new player");
            const isSuccess = <boolean>(
                await this.facadeService.AddPlayer(player)
            );
            //console.log(isSuccess);
            if (isSuccess) {
                this.snackBar.open('Player has been created.', 'x', {
                    duration: 5000,
                });
                this.reset();
                //this.router.navigate(['/players']);
            }
        }

        this.response = player;
        this.dialogRef.close(this.response);
        console.log(this.response);
    }

    public Comparator(a, b) {
        let gemIDA=parseInt(a['gemId'].slice(2));
        let gemIDB=parseInt(b['gemId'].slice(2));
        if (gemIDA < gemIDB) return 1;
        if (gemIDA > gemIDB) return -1;

        return 0;
    }

    onNoClick(): void {
        this.dialogRef.close();
    }
}
