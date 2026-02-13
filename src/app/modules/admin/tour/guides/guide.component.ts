import { Component, OnInit, ViewChild } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { FacadeService } from 'app/shared/services/facade.service';
import { Constants, General, UniqueIdGenerator } from 'app/shared/classes/general';
import { Player } from 'app/shared/models/player.model';
import { LocalStorageService } from 'app/shared/services/localStorage';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, UntypedFormArray, Validators } from '@angular/forms';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar';
import { MatExpansionPanel } from '@angular/material/expansion';

@Component({
    selector: 'app-tour-guide',
    templateUrl: './guide.component.html'
})
export class TourGuideComponent implements OnInit {

    private _unsubscribeAll: Subject<any> = new Subject<any>();
    file: any;
    guides: any[];
    tourID: string = '';
    loggedInuser: Player;
    guideForm: FormGroup;
    @ViewChild('myPanel') myPanel: MatExpansionPanel;

    // quillModules: any = {
    //     toolbar: [
    //         ['bold', 'italic', 'underline'],
    //         [{ align: [] }, { list: 'ordered' }, { list: 'bullet' }],
    //         ['clean']
    //     ]
    // };

    constructor(
        private router: ActivatedRoute,
        private _formBuilder: FormBuilder,
        private facadeService: FacadeService,
        private snackBar: MatSnackBar,
        private _localStorage: LocalStorageService,
        private _fuseConfirmationService: FuseConfirmationService,
    ) { }

    ngOnInit(): void {
        this.router.paramMap.subscribe((params) => {
            this.tourID = params.get('id');
        });
        this.guideForm = this._formBuilder.group({
            title: [''],
            script: [''],
            date: [''],
            bg_image: ['']
        });
        if (this.tourID) {
            this.facadeService.getTourGuide(this.tourID).then((res) => {
                console.log(res);
                this.guides = res['tour_guide'];

            })
            //console.log(guides['tour_guide']);

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
    save(id) {
        let guide = this.guides.find(a => a.id === id);
        let newGuide = [];
        let obj = {
            id: id,
            tourId: this.tourID,
            date: General.parseToDate(this.guideForm.get('date').getRawValue()),
            details: this.guideForm.get('script').getRawValue() ?? '',
            title: this.guideForm.get('title').getRawValue(),
            bg_image: guide.bg_image,
        }
        newGuide.push(obj);
        this.facadeService.insertTourGuide(newGuide, this.file).subscribe((response) => {
            if (response) {
                this.snackBar.open('Guide is added.', 'x', {
                    duration: 2000,
                });

                guide.title = obj.title;
                guide.details = obj.details;
                guide.date = obj.date;
                this.myPanel.close();
                // this.file = null;
            }
        })

    }
    onPanelOpened(id: string) {
        let guide = this.guides.find(a => a.id === id);
        if (guide) {
            this.file = null;
            this.guideForm.patchValue({
                title: guide?.title,
                script: guide?.details,
                date: guide?.date,
            });
        }
    }
    addNewGuide() {
        this.guides.push({ id: UniqueIdGenerator.generate() })
    }

    removeImage(guide: any): void {
        guide.bg_image = null;
    }
    /**
    * Upload image to given note
    *
    * @param note
    * @param fileList
    */
    uploadImage(id: any, fileList: FileList): void {
        let guide = this.guides.find(a => a.id === id);
        // Return if canceled
        if (!fileList.length) {
            return;
        }

        const allowedTypes = ['image/jpeg', 'image/png'];
        this.file = fileList[0];

        // Return if the file is not allowed
        if (!allowedTypes.includes(this.file.type)) {
            return;
        }

        this._readAsDataURL(this.file).then((data) => {

            // Update the image
            guide.bg_image = data;
            guide.file = this.file;

            // Update the note
            //   this.noteChanged.next(note);
        });
    }
    private _readAsDataURL(file: File): Promise<any> {
        // Return a new promise
        return new Promise((resolve, reject) => {

            // Create a new reader
            const reader = new FileReader();

            // Resolve the promise on success
            reader.onload = (): void => {
                resolve(reader.result);
            };

            // Reject the promise on error
            reader.onerror = (e): void => {
                reject(e);
            };

            // Read the file as the
            reader.readAsDataURL(file);
        });
    }

}
