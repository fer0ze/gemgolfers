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
import { MatDrawerToggleResult } from '@angular/material/sidenav';
import { debounceTime, Subject, takeUntil } from 'rxjs';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import {
    Contact,
    Country,
    Tag,
} from 'app/modules/admin/players/player/player.types';
import { PlayerComponent } from '../player/player.component';
import { FacadeService } from 'app/shared/services/facade.service';
import { Player, PlayerCategory } from 'app/shared/models/player.model';

@Component({
    selector: 'contacts-details',
    templateUrl: './details.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactsDetailsComponent implements OnInit, OnDestroy {
    @ViewChild('avatarFileInput') private _avatarFileInput: ElementRef;
    @ViewChild('tagsPanel') private _tagsPanel: TemplateRef<any>;
    @ViewChild('tagsPanelOrigin') private _tagsPanelOrigin: ElementRef;

    editMode: boolean = false;
    tags: Tag[];
    tagsEditMode: boolean = false;
    filteredTags: Tag[];
    playerCategories: PlayerCategory[] = [];
    contact: Contact;
    contactForm: FormGroup;
    contacts: Contact[];
    countries: Country[];
    playerID: any;
    cardsrc = 'assets/images/cards/14-640x480.jpg';
    avatarsrc = 'assets/images/avatars/male-01.jpg';
    private _tagsPanelOverlayRef: OverlayRef;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    currentPlayer: any = [];

    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _changeDetectorRef: ChangeDetectorRef,
        private _contactsListComponent: PlayerComponent,
        private _formBuilder: UntypedFormBuilder,
        private _fuseConfirmationService: FuseConfirmationService,
        private _renderer2: Renderer2,
        private _facadeService: FacadeService,
        private _router: Router,
        private _overlay: Overlay,
        private _viewContainerRef: ViewContainerRef
    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this._contactsListComponent.matDrawer.open();
        this.playerCategories = this._facadeService.getPlayerCategories();
        console.log(this.playerCategories);

        this._activatedRoute.paramMap.subscribe((params) => {
            this.playerID = params.get('id');
        });
        this.fetchData();
        this.contactForm = new FormGroup({
            firstName: new FormControl('', [Validators.required]),
            lastName: new FormControl('', [Validators.required]),
            gender: new FormControl('', [Validators.required]),
            email: new FormControl('', [Validators.required]),
            phoneNumbers: new FormControl('', [Validators.required]),
            dateOfBirth: new FormControl('', [Validators.required]),
            category: new FormControl(' ', [Validators.required]),
            handicap: new FormControl('', [Validators.required]),
            club: new FormControl('KGC', [Validators.required]),
            country: new FormControl('', [Validators.required]),
            membershipNo: new FormControl('', [Validators.required]),
            status: new FormControl('', [Validators.required]),
            notes: new FormControl('', [Validators.required]),
        });
        this._contactsListComponent.matDrawer.open();
        this.contact = {
            id: this.playerID,
            firstName: 'New Contact',
            lastName: '',
            gender: '',
            email: '',
            phoneNumbers: '',
            dateOfBirth: '',
            category: '',
            handicap: '',
            club: '',
            country: '',
            membershipNo: '',
            notes: '',
            status: true,
        };
        console.log(this.contact);
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();

        // Dispose the overlays if they are still on the DOM
        if (this._tagsPanelOverlayRef) {
            this._tagsPanelOverlayRef.dispose();
        }
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Close the drawer
     */
    closeDrawer(): Promise<MatDrawerToggleResult> {
        return this._contactsListComponent.matDrawer.close();
    }

    /**
     * Toggle edit mode
     *
     * @param editMode
     */
    toggleEditMode(editMode: boolean | null = null): void {
        if (editMode === null) {
            this.editMode = !this.editMode;
        } else {
            this.editMode = editMode;
        }

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Update the contact
     */
    updateContact(): void {
        // Get the contact object
        const contact = this.contactForm.getRawValue();

        // Go through the contact object and clear empty values
        contact.emails = contact.emails.filter((email) => email.email);

        contact.phoneNumbers = contact.phoneNumbers.filter(
            (phoneNumber) => phoneNumber.phoneNumber
        );

        // Update the contact on the server
        //this._contactsService.updateContact(contact.id, contact).subscribe(() => {

        // Toggle the edit mode off
        //this.toggleEditMode(false);
        // });
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
                const id = this.contact.id;

                // Get the next/previous contact's id
                const currentContactIndex = this.contacts.findIndex(
                    (item) => item.id === id
                );
                const nextContactIndex =
                    currentContactIndex +
                    (currentContactIndex === this.contacts.length - 1 ? -1 : 1);
                const nextContactId =
                    this.contacts.length === 1 && this.contacts[0].id === id
                        ? null
                        : this.contacts[nextContactIndex].id;

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
        this.currentPlayer = <Player>(
            await this._facadeService.getPlayerByID(this.playerID)
        );
        console.log(this.currentPlayer);
        
    }
}
