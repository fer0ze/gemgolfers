import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ClubMembership, Player } from '../../../../shared/models/player.model';
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';
import { SelectionModel } from '@angular/cdk/collections';
import { TournamentMember } from 'app/shared/models/tournament.model';
import { FacadeService } from 'app/shared/services/facade.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Constants, General, UniqueIdGenerator, generateGemId } from 'app/shared/classes/general';
import { Club } from 'app/shared/models/club.model';
import { LocalStorageService } from 'app/shared/services/localStorage';
@Component({
    selector: 'app-dialog-player-list',
    templateUrl: './dialog-player-list.component.html',
    styleUrls: ['./dialog-player-list.component.scss'],
})
export class DialogPlayerListComponent implements OnInit {
    dataSource: MatTableDataSource<Player>;
    public playerForm: FormGroup;
    show: boolean = true;
    golfClubs: Club[] = [];
    displayedColumns = [
        'name',
        'handicap',
        'membershipNumber',
        'cat',
        'email',
        'select',
    ];
    loggedInuser: any;
    public response: any;
    playerCategories: any[] = [];
    playerList: Player[] = [];
    selection = new SelectionModel<Player>(true, []);
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    constructor(
        public dialogRef: MatDialogRef<DialogPlayerListComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private facadeService: FacadeService,
        public snackBar: MatSnackBar, private _localStorage: LocalStorageService
    ) { }

    async ngOnInit() {
        this.loggedInuser = this._localStorage.get(Constants.LOGGED_IN_USER);
        this.playerCategories = this.facadeService.getPlayerCategories();
        console.log(this.data);
        let dataClubs = await this.facadeService.getClubList();
        this.golfClubs = dataClubs.club;

        this.playerList = this.data.players;

        this.dataSource = new MatTableDataSource(this.playerList);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    applyFilter(filterValue: string) {
        filterValue = filterValue.trim(); // Remove whitespace
        filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
        this.dataSource.filter = filterValue;

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    isAllSelected() {
        ////console.log(this.dataSource);
        if (this.dataSource) {
            const numSelected = this.selection.selected.length;
            const numRows = this.dataSource.data.length;
            return numSelected === numRows;
        }
    }

    /** Selects all rows if they are not all selected; otherwise clear selection. */
    masterToggle() {
        //console.log(this.selection);
        //console.log(this.selection.selected.length);
        this.isAllSelected()
            ? this.selection.clear()
            : this.dataSource.data.forEach((row) => this.selection.select(row));
    }

    /** The label for the checkbox on the passed row */
    checkboxLabel(row?: Player): string {
        if (!row) {
            return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
        }
        return `${this.selection.isSelected(row) ? 'deselect' : 'select'
            } player ${row.firstName} ${row.lastName}`;
    }
    public downloadAsPDF() {
        var doc = new jsPDF();

        doc.setFontSize(18);
        doc.text("Round's Report Detail:", 15, 15);
        doc.setFontSize(11);
        doc.setTextColor(100);

        // From HTML
        doc.autoTable({
            html: '#playerTable',
            startY: 25,
            theme: 'grid',
            useCss: false,
        });

        // Open PDF document in new tab
        doc.output('dataurlnewwindow');

        // Download PDF document
        //doc.save('flights.pdf');
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    async saveTournamentMembers() {
        let tournamentMember: TournamentMember[] = [];
        let counter: number;
        let DelplayerIndex: any;
        let DelplayerInfo: any;
        let selectionArray = Object.assign({}, this.selection.selected);

        // for (var index in selectionArray) {
        //     if (selectionArray[index]) {
        //         // let founded = this.tournamentMembers.filter((a) => {
        //         //   return a.id == selectionArray[index].id;
        //         // });

        //         // if (founded.length == 0)
        //         //   this.tournamentMembers.push(selectionArray[index]);

        //         let member: any = {
        //             tournamentId: this.data.tournamentID,
        //             playerId: selectionArray[index].id,
        //             status: true,
        //         };
        //         if (this.data.subTournamentID !== undefined && this.data.subTournamentID !== "") {
        //             let member: any = {
        //                 tournamentId: this.data.subTournamentID,
        //                 playerId: selectionArray[index].id,
        //                 status: true,
        //             };
        //             tournamentMember.push(member);
        //         }
        //         tournamentMember.push(member);
        //         counter = parseInt(index) + 1;
        //         //console.log(counter);

        //         //console.log(selectionArray);
        //     }
        // }
        //this.showCategory = false;
        ////console.log(this.categoryCounts[0]);

        //this.categoryCounts[0].value = this.categoryCounts[0].value - counter;
        ////console.log(this.categoryCounts[0].value);

        //console.log(tournamentMember);

        // let result = <any>(
        //     await this.facadeService.insertFl(tournamentMember)
        // );

        // if (result) {
        //     this.snackBar.open('Flight members have been saved.', 'x', {
        //         duration: 3000,
        //     });
        this.dialogRef.close(selectionArray);
        // }
    }
    async getPlayerInformationByName() {
        let fullName: string = (<HTMLInputElement>(
            document.getElementById('fullName')
        )).value;
        // let lastName: string = (<HTMLInputElement>(
        //   document.getElementById("lastName")
        // )).value;
        let handicap: string = (<HTMLInputElement>(
            document.getElementById('handicap')
        )).value;
        let text1 = '%';
        let text4 = '%';
        let result = text1.concat(fullName, text4);
        //console.log('====================================');
        //console.log(fullName);
        //console.log('====================================');
        //console.log(result);
        if (fullName) {
            if (!fullName) fullName = 'NOTHING';
            //console.log('====================================');
            //console.log(handicap);
            //console.log('====================================');
            let lowerHandicap = handicap ? Number(handicap) - 1 : 70;
            let upperHandicap = handicap ? Number(handicap) + 1 : 70;

            //console.log(lowerHandicap);
            //console.log(upperHandicap);

            let matchingList = <Player>(
                await this.facadeService.searchPlayerForTournament(
                    result,
                    lowerHandicap,
                    upperHandicap
                )
            );
            // this.player = matchingList['Result'];
            //console.log(matchingList['Result']);

            this.setDataSource(matchingList['Result']);

            // if (this.player[0]) {
            //   this.response = {
            //     player: this.player[0],
            //     flight: Number(this.selectedFlight) - 1,
            //   };
            // } else {
            //   this.response = null;
            // }
        }
    }
    setDataSource(dataSource) {
        this.dataSource = new MatTableDataSource(dataSource);

        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }
    close() {
        this.dialogRef.close();
    }
    addNewPlayer() {
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
            dob: new FormControl('', [Validators.required]),
            playerCategory: new FormControl('', [Validators.required]),
            handicap: new FormControl('', [Validators.required]),

            playerClubMember: new FormControl(
                this.loggedInuser ? this.loggedInuser.adminClubId : '',
                [Validators.required]
            ),
            membershipNumber: new FormControl(''),
        });
        this.show = false;
    }

    public createPlayer = (playerFormValue: any) => {
        if (this.playerForm.valid) {
            this.executePlayerCreation(playerFormValue);
        }
    };
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

        ////console.log(checkEmail);
        if (checkEmail.length > 0) emailPlayerId = checkEmail[0].id;

        if (checkPhone.length > 0) phonePlayerId = checkPhone[0].id;

        if (
            checkEmail.length > 0) {
            this.snackBar.open('Email already exist.', 'x', {
                duration: 5000,
            });

            return;
        } else if (
            checkPhone.length > 0
        ) {
            this.snackBar.open('Phone number already exist.', 'x', {
                duration: 5000,
            });

            return;
        } else if (checkEmail.length > 0 || checkPhone.length > 0) {
            newFlag = false;
        } else {
        }

        let clubMember: ClubMembership[] = [];

        let UniqueId: string = '';
        let GEMId: string = '';

        let member: any = {
            clubId: playerFormValue.playerClubMember,
        };

        clubMember.push(member);
        // let players: any[] = await this.facadeService.getallPlayersforGGid();
        // var sortarray = players['player'];
        // sortarray.sort(this.Comparator);
        //console.log(sortarray);
        UniqueId = UniqueIdGenerator.generate();
        // GEMId = generateGemId.generate(sortarray[0].gemId);

        ////console.log(playerFormValue.isClubAdmin);
        const player: Player = {
            id: UniqueId,
            adminClubId:
                playerFormValue.isClubAdmin == true
                    ? playerFormValue.playerClubMember
                    : null,
            firebaseUid: null,

            fcmToken: null,

            gemId: null,
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

        if (newFlag) {
            ////console.log("Going to add new player");
            const isSuccess = <boolean>(
                await this.facadeService.AddPlayer(player)
            );
            ////console.log(isSuccess);
            if (isSuccess) {
                this.snackBar.open('Player has been created.', 'x', {
                    duration: 5000,
                });
                // this.reset();
                //this.router.navigate(['/players']);
            }
        }

        this.response = player;
        this.dialogRef.close(this.response);
        //console.log(this.response);
    }
    public hasError = (controlName: string, errorName: string) => {
        return this.playerForm.controls[controlName].hasError(errorName);
    };

    public reset() {
        this.playerForm.reset();
    }


    public Comparator(a, b) {
        let gemIDA = parseInt(a['gemId'].slice(2));
        let gemIDB = parseInt(b['gemId'].slice(2));
        if (gemIDA < gemIDB) return 1;
        if (gemIDA > gemIDB) return -1;

        return 0;
    }
}
