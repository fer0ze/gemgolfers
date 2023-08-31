import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    OnDestroy,
    OnInit,
    Renderer2,
    TemplateRef,
    ViewChild,
    ViewContainerRef,
    ViewEncapsulation,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
    UntypedFormArray,
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
    FormControl,
    FormGroup,
} from '@angular/forms';
import { TemplatePortal } from '@angular/cdk/portal';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatDrawer, MatDrawerToggleResult } from '@angular/material/sidenav';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
    debounceTime,
    map,
    Observable,
    startWith,
    Subject,
    takeUntil,
} from 'rxjs';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { FacadeService } from 'app/shared/services/facade.service';
import {
    ClubMembership,
    handicap_change_log,
    Player,
    PlayerCategory,
} from 'app/shared/models/player.model';
import {
    Constants,
    General,
    generateGemId,
    UniqueIdGenerator,
} from 'app/shared/classes/general';
import { DatePipe } from '@angular/common';
import { RequireMatch } from 'app/shared/classes/CustomValidator';
import { FuseConfirmationSuccessService } from '@fuse/services/confirmation/confirmationsucces';
import { Club } from 'app/shared/models/club.model';
import { HandicapService } from 'app/shared/services/handicap.service';
import { LocalStorageService } from 'app/shared/services/localStorage';

@Component({
    selector: 'contacts-details',
    templateUrl: './details.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactsDetailsComponent implements OnInit {
    drawerMode: 'over' | 'side' = 'side';
    @ViewChild('avatarFileInput') private _avatarFileInput: ElementRef;
    @ViewChild('tagsPanel') private _tagsPanel: TemplateRef<any>;
    @ViewChild('tagsPanelOrigin') private _tagsPanelOrigin: ElementRef;
    clubTitle: string;
    editMode: boolean = false;
    save: boolean = false;
    golfClubs: Club[] = [];
    tagsEditMode: boolean = false;
    playerCategories: PlayerCategory[] = [];
    contact: any;
    contactForm: FormGroup;
    hideClubs: boolean = true;
    contacts: any[];
    countries: any[];
    playerID: any;
    cardsrc = 'assets/images/cards/01-320x200.png';
    avatarsrc = 'assets/images/avatars/male-04.jpg';
    private _tagsPanelOverlayRef: OverlayRef;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    currentPlayer: any = [];
    tournamentId: any;
    public handicapsWhs: any[] = [];
    loggedInuser: any;
    handicapIndex: number = 0;
    filteredClubOptions: Observable<Club[]>;
    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseConfirmationService: FuseConfirmationService,
        private _fuseConfirmationSuccessService: FuseConfirmationSuccessService,
        private _renderer2: Renderer2,
        private _facadeService: FacadeService,
        private handicapService: HandicapService,
        public snackBar: MatSnackBar,
        private _router: Router,
        private datepipe: DatePipe,
        private _overlay: Overlay,
        private _viewContainerRef: ViewContainerRef,
        private _localStorage: LocalStorageService
    ) { }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    async ngOnInit() {
        this._activatedRoute.paramMap.subscribe(async (params) => {
            this.playerID = params.get('id');
        });
        this.loggedInuser = this._localStorage.get(Constants.LOGGED_IN_USER);
        let dataClubs: any;
        if (this.loggedInuser) {
            let clubInfo: any =
                this.loggedInuser.membership.length > 0
                    ? this.loggedInuser.membership[0].club
                    : null;

            this.hideClubs = this.loggedInuser.userRole > 1 ? true : false;
            this.clubTitle = clubInfo ? clubInfo.name : '';
        }
        this.contactForm = new FormGroup({
            firstName: new FormControl('', [Validators.required]),
            lastName: new FormControl('', [Validators.required]),
            gender: new FormControl('male'),
            email: new FormControl(''),
            phoneNumbers: new FormControl('', [Validators.required]),
            dateOfBirth: new FormControl(''),
            category: new FormControl('', [Validators.required]),
            handicap: new FormControl('0', [Validators.required]),
            handicapWhsIndex: new FormControl('0'),
            handicapWHS: new FormControl('0', [Validators.required]),
            club: new FormControl(
                this.loggedInuser.userRole > 1 ? this.clubTitle : '',
                [Validators.required]
            ),
            country: new FormControl('Pakistan'),
            isClubAdmin: new FormControl('3'),
            membershipNo: new FormControl(''),
            status: new FormControl('false', [Validators.required]),
            notes: new FormControl(''),
        });
        this.playerCategories = this._facadeService.getPlayerCategories();
        if (this.loggedInuser.userRole > 1) {
            dataClubs = await this._facadeService.getClubByID(
                this.loggedInuser.adminClubId
            );
        } else {
            dataClubs = await this._facadeService.getClubList();
        }
        this.golfClubs = dataClubs.club;
        console.log(this.playerCategories);
        if (this.playerID) {
            await this.fetchData();
        }
        this.filteredClubOptions = this.contactForm
            .get('club')!
            .valueChanges.pipe(
                startWith(''),
                map((value) =>
                    typeof value === 'string' ? value : value ? value.name : ''
                ),
                map((name) => (name ? this._filter(name) : this.golfClubs))
            );
        console.log(this.filteredClubOptions);

        if (this.loggedInuser.userRole > 1) {
            this.contactForm.get('club').clearValidators();
            //this.contactForm.get('club').updateValueAndValidity();
        }

        console.log(this.contact);
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

    changeHandicap(item) {
        if (
            item != null &&
            this.playerID &&
            this.currentPlayer.player[0].handicap !==
            this.contactForm.get('handicap').value
        ) {
            document.getElementById('comment').classList.remove('hidden');
            this.contactForm.get('notes').addValidators([Validators.required]);
            this.contactForm.get('notes').updateValueAndValidity();
        } else if (
            this.playerID &&
            this.currentPlayer.player[0].handicap ==
            this.contactForm.get('handicap').value
        ) {
            document.getElementById('comment').classList.add('hidden');
            this.contactForm.get('notes').clearValidators();
            this.contactForm.get('notes').updateValueAndValidity();
        }
    }
    changeHandicapWHS(item) {
        if (
            item != null &&
            this.playerID &&
            this.currentPlayer.player[0].handicapWhsIndex !==
            this.contactForm.get('handicapWhsIndex').value
        ) {
            document.getElementById('comment').classList.remove('hidden');
            this.contactForm.get('notes').addValidators([Validators.required]);
            this.contactForm.get('notes').updateValueAndValidity();
        } else if (
            this.playerID &&
            this.currentPlayer.player[0].handicapWhsIndex ==
            this.contactForm.get('handicapWhsIndex').value
        ) {
            document.getElementById('comment').classList.add('hidden');
            this.contactForm.get('notes').clearValidators();
            this.contactForm.get('notes').updateValueAndValidity();
        }
    }
    changeHandicapWHSDiff(item) {
        if (
            item != null &&
            this.playerID &&
            this.handicapIndex !== this.contactForm.get('handicapWHS').value
        ) {
            document.getElementById('comment').classList.remove('hidden');
            this.contactForm.get('notes').addValidators([Validators.required]);
            this.contactForm.get('notes').updateValueAndValidity();
        } else if (
            this.playerID &&
            this.handicapIndex == this.contactForm.get('handicapWHS').value
        ) {
            document.getElementById('comment').classList.add('hidden');
            this.contactForm.get('notes').clearValidators();
            this.contactForm.get('notes').updateValueAndValidity();
        }
    }

    displayFn(club: Club): string {
        return typeof club === 'string' ? club : club ? club.name : '';
    }
    /**
     * Update the contact
     */
    async updateContact() {
        // console.log(this.handicapIndex);
        // console.log(this.contactForm.get('handicapWHS').value);
        if (this.handicapIndex != this.contactForm.get('handicapWHS').value) {
            this.changeWHSHandicap();
        }
        let newFlag = true;
        let checkEmail: any = [];
        let checkPhone: any = [];
        let emailPlayerId: string = '';
        let phonePlayerId: string = '';

        let Hdate = new Date();

        let latest_date: any = this.datepipe.transform(
            Hdate,
            'yyyy-MM-ddThh:mm:ss.SSSSSS+00:00'
        );
        // Get the contact object

        const contact = this.contactForm.getRawValue();
        if (this.contactForm.valid) {
            if (contact.email)
                checkEmail = <Player>(
                    await this._facadeService.getPlayerByEmail(contact.email)
                );

            if (contact.phoneNumbers)
                checkPhone = <Player>(
                    await this._facadeService.getPlayerByPhone(
                        contact.phoneNumbers
                    )
                );

            console.log(checkEmail);
            if (checkEmail.length > 0) emailPlayerId = checkEmail[0].id;

            if (checkPhone.length > 0) phonePlayerId = checkPhone[0].id;

            if (
                checkEmail.length > 0 &&
                emailPlayerId !== '' &&
                emailPlayerId !== this.playerID
            ) {
                const confirmation = this._fuseConfirmationService.open({
                    title: 'Duplicate Email',
                    message: 'Email alreday exist!',
                    actions: {
                        confirm: {
                            label: 'Close',
                        },
                    },
                });

                return;
            } else if (
                checkPhone.length > 0 &&
                phonePlayerId !== '' &&
                phonePlayerId !== this.playerID
            ) {
                const confirmation = this._fuseConfirmationService.open({
                    title: 'Duplicate Number',
                    message: 'Number alreday exist!',
                    actions: {
                        confirm: {
                            label: 'Close',
                        },
                    },
                });

                return;
            } else if (
                (checkEmail.length > 0 && this.playerID) ||
                (checkPhone.length > 0 && this.playerID)
            ) {
                newFlag = false;
            } else {
            }
        }
        let clubMember: ClubMembership[] = [];
        let UniqueId: string = '';
        let GEMId: string = '';
        let players: any[] = await this._facadeService.getallPlayersforGGid();
        var sortarray = players['player'];
        sortarray.sort(this.Comparator);
        console.log(sortarray);

        this.playerID
            ? (UniqueId = this.playerID)
            : (UniqueId = UniqueIdGenerator.generate());
        this.playerID
            ? (GEMId = this.currentPlayer.player[0].gemId)
            : (GEMId = generateGemId.generate(sortarray[0].gemId));
        console.log(GEMId);

        //console.log(playerFormValue.playerClubMember);
        let member: any = {
            clubId:
                typeof contact.club === 'string'
                    ? this.loggedInuser.adminClubId
                    : contact.club
                        ? contact.club.id
                        : '',
            suspended: this.contactForm.get('status').value,
        };
        console.log(member);
        clubMember.push(member);
        const player: Player = {
            id: UniqueId,
            adminClubId: null,
            firebaseUid: this.playerID
                ? this.currentPlayer.player[0].firebaseUid
                : null,
            fcmToken: this.playerID
                ? this.currentPlayer.player[0].fcmToken
                : null,
            gemId: GEMId,
            firstName: contact.firstName,
            lastName: contact.lastName,
            gender: contact.gender,
            dob: General.parseToDate(contact.dateOfBirth),
            picture: null,
            email: contact.email,
            phone: contact.phoneNumbers,
            playerCategory: contact.category,
            handicapWhsIndex: contact.handicapWhsIndex,
            handicap: contact.handicap,
            online: false,
            countryCode: contact.country,
            extraData: contact.notes,
            userRole: 3,
            membership: clubMember,
            membershipNumber: contact.membershipNo,
        };
        console.log(contact);

        if (!this.editMode) {
            const isSuccess = <boolean>(
                await this._facadeService.AddPlayer(player)
            );
            if (isSuccess) {
                this.save = true;
                this.snackBar.open('Player has been created.', 'x', {
                    duration: 1000,
                });
                this.reset();
                this._router.navigate(['/players']);
            }
        } else {
            const isSuccess = <boolean>(
                await this._facadeService.updatePlayer(player)
            );

            if (this.currentPlayer.player[0].handicap !== contact.handicap) {
                console.log(this.tournamentId);

                const handicap_change_log: handicap_change_log = {
                    id: UniqueIdGenerator.generate(),
                    playerId: this.currentPlayer.player[0].id
                        ? this.currentPlayer.player[0].id
                        : null,
                    newHandicap: contact.handicap ? contact.handicap : 0,
                    oldHandicap: this.currentPlayer.player[0].handicap
                        ? this.currentPlayer.player[0].handicap
                        : 0,
                    whs: false,
                    dateTime: latest_date,
                    remarks: this.contactForm.get('notes').value,
                    tournamentId: null,
                    updaterId: this.loggedInuser.id,
                };

                console.log(handicap_change_log);
                //this.handicapLog = handicap_change_log;

                const remarksAdded = <boolean>(
                    await this._facadeService.AddHandicapRemarks(
                        handicap_change_log
                    )
                );
                let response = await this._facadeService.updateConguHandicap(
                    this.playerID,
                    contact.handicap ? contact.handicap : 0,
                    this.tournamentId
                );
                console.log(remarksAdded);
            } else if (
                this.currentPlayer.player[0].handicapWhsIndex !==
                contact.handicapWhsIndex
            ) {
                const handicap_change_log: handicap_change_log = {
                    id: UniqueIdGenerator.generate(),
                    playerId: this.currentPlayer.player[0].id
                        ? this.currentPlayer.player[0].id
                        : null,
                    newHandicap: contact.handicapWhsIndex
                        ? contact.handicapWhsIndex
                        : 0,
                    oldHandicap: this.currentPlayer.player[0].handicapWhsIndex
                        ? this.currentPlayer.player[0].handicapWhsIndex
                        : 0,
                    whs: false,
                    dateTime: latest_date,
                    remarks: this.contactForm.get('notes').value,
                    tournamentId: null,
                    updaterId: this.loggedInuser.id,
                };

                console.log(handicap_change_log);
                //this.handicapLog = handicap_change_log;

                const remarksAdded = <boolean>(
                    await this._facadeService.AddHandicapRemarks(
                        handicap_change_log
                    )
                );
                console.log(remarksAdded);
            }

            if (
                this.handicapIndex != this.contactForm.get('handicapWHS').value
            ) {
                const handicap_change_log: handicap_change_log = {
                    id: UniqueIdGenerator.generate(),
                    playerId: this.currentPlayer.player[0].id
                        ? this.currentPlayer.player[0].id
                        : null,
                    newHandicap: contact.handicap ? contact.handicap : 0,
                    oldHandicap: this.currentPlayer.player[0].handicap
                        ? this.currentPlayer.player[0].handicap
                        : 0,
                    whs: false,
                    dateTime: latest_date,
                    remarks: this.contactForm.get('notes').value,
                    tournamentId: null,
                    updaterId: this.loggedInuser.id,
                };

                console.log(handicap_change_log);
                //this.handicapLog = handicap_change_log;

                const remarksAdded = <boolean>(
                    await this._facadeService.AddHandicapRemarks(
                        handicap_change_log
                    )
                );
                console.log(remarksAdded);
            }

            //console.log(isSuccess);
            if (isSuccess) {
                this.save = true;
                this.snackBar.open('Player has been updated.', 'x', {
                    duration: 1000,
                });
                //this._router.navigate(['/players']);
            }
        }
    }

    public Comparator(a, b) {
        console.log(a);
        console.log(b);
        
        try {
            if (a['gemId']?.trim() !== '' && b['gemId']?.trim() !== '') {
                let gemIDA = parseInt(a['gemId'].slice(2));
                let gemIDB = parseInt(b['gemId'].slice(2));
                if (gemIDA < gemIDB) return 1;
                if (gemIDA > gemIDB) return -1;

                return 0;
            }
        } catch (error) {
            console.log(error);
        }

    }

    public reset() {
        // if (this.loggedInuser.userRole > 1) {
        //   this.playerForm.get("playerClubMember").setValue(this.clubTitle);
        // }

        this.contactForm.get('firstName').setValue('');
        this.contactForm.get('lastName').setValue('');
        this.contactForm.get('email').setValue('');
        this.contactForm.get('phoneNumbers').setValue('');
        this.contactForm.get('dateOfBirth').setValue('');
        this.contactForm.get('category').setValue('');
        this.contactForm.get('handicap').setValue('');
        this.contactForm.get('membershipNo').setValue('');
        this.contactForm.get('notes').setValue('');
        this.contactForm.get('notes').clearValidators();
        this.contactForm.get('notes').updateValueAndValidity();
    }
    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any {
        return item.id || index;
    }
    cancel() {
        console.log(this.contactForm.value);

        // this._router.navigate(['/players'], {
        //     relativeTo: this._activatedRoute,
        // });
    }

    /**
     * Delete the contact
     */
    deleteContact(): void {
        // Open the confirmation dialog
        const confirmation = this._fuseConfirmationService.open({
            title: 'Delete contact',
            message:
                'Are you sure you want to delete this contact? This action cannot be undone!',
            actions: {
                confirm: {
                    label: 'Delete',
                },
            },
        });

        // Subscribe to the confirmation dialog closed action
        confirmation.afterClosed().subscribe((result) => {
            // If the confirm button pressed...
            if (result === 'confirmed') {
                // Get the current contact's id
                // const id = this.contact.id;

                // // Get the next/previous contact's id
                // const currentContactIndex = this.contacts.findIndex(
                //     (item) => item.id === id
                // );
                // const nextContactIndex =
                //     currentContactIndex +
                //     (currentContactIndex === this.contacts.length - 1 ? -1 : 1);
                // const nextContactId =
                //     this.contacts.length === 1 && this.contacts[0].id === id
                //         ? null
                //         : this.contacts[nextContactIndex].id;

                // Delete the contact
                // this._contactsService.deleteContact(id)
                //     .subscribe((isDeleted) => {

                //         // Return if the contact wasn't deleted...
                //         if ( !isDeleted )
                //         {
                //             return;
                //         }

                //         // Navigate to the next contact if available
                //         if ( nextContactId )
                //         {
                //             this._router.navigate(['../', nextContactId], {relativeTo: this._activatedRoute});
                //         }
                //         // Otherwise, navigate to the parent
                //         else
                //         {
                //             this._router.navigate(['../'], {relativeTo: this._activatedRoute});
                //         }

                //         // Toggle the edit mode off
                //         this.toggleEditMode(false);
                //     });

                // Mark for check
                this._changeDetectorRef.markForCheck();
            }
        });
    }

    async fetchData() {
        if (this.playerID) {
            this.currentPlayer =
                await this._facadeService.getPlayerByIDDetailForm(
                    this.playerID
                );

            console.log(this.currentPlayer);
            this.tournamentId =
                this.currentPlayer.player[0].handicap_history !== undefined &&
                    this.currentPlayer.player[0].handicap_history.length > 0
                    ? this.currentPlayer.player[0].handicap_history[0]
                        .tournamentId
                    : null;

            // let whsHandicaps = await this._facadeService.getPlayerWHS(
            //     this.playerID
            // );
            // let whshandicap = whsHandicaps['PlayerQL'].HandicapHistoryWhsQL;
            // console.log(whshandicap);
        }
        if (this.currentPlayer.player.length > 0) {
            this.handicapsWhs = this.currentPlayer.player[0].handicapWhsIndex;
            this.editMode = true;
            this.contactForm.setValue({
                firstName: this.currentPlayer.player[0].firstName,
                lastName: this.currentPlayer.player[0].lastName,
                gender: this.currentPlayer.player[0].gender,
                email: this.currentPlayer.player[0].email,
                phoneNumbers: this.currentPlayer.player[0].phone,
                dateOfBirth: this.currentPlayer.player[0].dob,
                category: this.currentPlayer.player[0].playerCategory,
                handicap: this.currentPlayer.player[0].handicap,
                handicapWhsIndex: this.currentPlayer.player[0].handicapWhsIndex,
                handicapWHS: 0,
                country: this.currentPlayer.player[0].countryCode,
                notes: '',
                membershipNo: this.currentPlayer.player[0].membershipNumber,
                club: this.currentPlayer.player[0].membership[0]
                    ? this.currentPlayer.player[0].membership[0].club
                    : '',
                isClubAdmin: this.currentPlayer.player[0].adminClubId
                    ? '1'
                    : '0',
                status:
                    this.currentPlayer.player[0].membership[0] &&
                        this.currentPlayer.player[0].membership[0].suspended
                        ? 'true'
                        : 'false',
            });
        }
        // this.editMode=false;
        this._changeDetectorRef.markForCheck();
    }

    async changeWHSHandicap() {
        let newHandicapDifferentils = this.contactForm.get('handicapWHS').value;
        let obj = {
            playerId: this.playerID,
            count: 40,
            diffChange: newHandicapDifferentils,
        };
        await this.handicapService
            .adjustHandicapWHS(obj)
            .then((response) => {
                console.log(response);
            })
            .catch((err) => {
                console.log('error' + err);
                this.snackBar.open('Error!.', 'x', {
                    duration: 5000,
                });
            });
    }
}
