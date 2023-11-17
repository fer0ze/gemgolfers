import { Component, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { FacadeService } from 'app/shared/services/facade.service';
import { Constants, UniqueIdGenerator } from 'app/shared/classes/general';
import { Player } from 'app/shared/models/player.model';
import { LocalStorageService } from 'app/shared/services/localStorage';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, UntypedFormArray, Validators } from '@angular/forms';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'app-tour-guide',
    templateUrl: './guide.component.html'
})
export class TourGuideComponent implements OnInit {

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    guides: any[];
    tourID: string = '';
    loggedInuser: Player;
    guideForm: FormGroup;

    quillModules: any = {
        toolbar: [
            ['bold', 'italic', 'underline'],
            [{ align: [] }, { list: 'ordered' }, { list: 'bullet' }],
            ['clean']
        ]
    };

    constructor(
        private router: ActivatedRoute,
        private _formBuilder: FormBuilder,
        private facadeService: FacadeService,
        public snackBar: MatSnackBar,
        private _localStorage: LocalStorageService,
        private _fuseConfirmationService: FuseConfirmationService,
    ) { }

    async ngOnInit() {
        this.router.paramMap.subscribe((params) => {
            this.tourID = params.get('id');
        });
        this.guideForm = this._formBuilder.group({
            script: ['', Validators.maxLength(250)],
        });
        if (this.tourID) {
            let guides = await this.facadeService.getTourGuide(this.tourID);
            console.log(guides['tour_guide']);
            this.guides = guides['tour_guide'];

        }
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
    delete(id) {
        const confirmation = this._fuseConfirmationService.open({
            title: 'Delete contact',
            message: 'Are you sure you want to delete this guide? This action cannot be undone!',
            actions: {
                confirm: {
                    label: 'Delete'
                }
            }
        });

        // Subscribe to the confirmation dialog closed action
        confirmation.afterClosed().subscribe(async (result) => {

            if (result === 'confirmed') {
                let response = await this.facadeService.deleteTourGuide(id);
                if (response) {
                    this.guides = this.guides.filter(a => a.id !== id);
                }
            }
        })
    }
    async save(id) {

        let newGuide = [];
        let obj = {
            id: id,
            tourId: this.tourID,
            date: new Date().toISOString(),
            details: this.guideForm.get('script').getRawValue(),
        }
        newGuide.push(obj);
        let response = await this.facadeService.insertTourGuide(newGuide);
        if (response) {
            this.snackBar.open('Guide is added.', 'x', {
                duration: 2000,
            });
        }

    }
    onPanelOpened(id) {
        console.log(id);
        let guide = this.guides.find(a => { return a.id == id });
        if (guide) {
            this.guideForm.get('script').setValue(guide.details);
        }
    }
    addNewGuide() {
        this.guides.push({ id: UniqueIdGenerator.generate() })
    }

}
