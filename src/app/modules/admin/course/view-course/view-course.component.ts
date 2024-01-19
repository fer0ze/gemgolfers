import { DatePipe } from '@angular/common';
import { Component, OnInit,ViewChild } from '@angular/core';
import { async } from '@angular/core/testing';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatDrawer } from '@angular/material/sidenav';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatStepper } from '@angular/material/stepper';
import { ActivatedRoute, Router } from '@angular/router';
import { Country } from 'app/shared/classes/country';
import { General, UniqueIdGenerator } from 'app/shared/classes/general';
import { FacadeService } from 'app/shared/services/facade.service';

@Component({
    selector: 'app-view-course',
    templateUrl: './view-course.component.html',
    styleUrls: ['./view-course.component.scss'],
})
export class ViewCourseComponent implements OnInit {
    @ViewChild('drawer') drawer: MatDrawer;
    drawerMode: 'over' | 'side' = 'side';
    drawerOpened: boolean = true;
    panels: any[] = [];
    selectedPanel :string= 'a';
    valid1 = new FormControl('');
    valid2 = new FormControl('');
    valid3 = new FormControl('');
    valid4 = new FormControl('');
    valid5 = new FormControl('');
    courseID: any;
    courseData: any;
    courseTitle: any;
    listCountries: any[] = [];
    countryName: any;
    cityName: any;
    NoOfHoles: any;
    url: string;
    Tee = [];
    id = [];
    Hole = [];
    TEES = ['AMATEURS', 'LADIES', 'SENIORS', 'PROFESSIONAL', 'VETERANS'];
    holeSetfor9 = [];
    coursRating = [];
    coursRatingfor18 = [];
    coursRatingfor27 = [];
    coursRatingfor36 = [];
    stepTitle: string = 'Course Setup Form';
    coursRatingHeader = [];
    showCourseTees = [];
    holeSetfor18 = [];
    holeSetforSelect = [];
    showholeSetfor18: boolean = false;
    holeSetfor27 = [];
    showholeSetfor27: boolean = false;
    holeSetfor36 = [];
    showholeSetfor36: boolean = false;
    holeMeta = [];
    holeMetafor18 = [];
    holeMetaforSelect = [];
    showholeMetafor18: boolean = false;
    holeMetafor27 = [];
    showholeMetafor27: boolean = false;
    holeMetafor36 = [];
    showholeMetafor36: boolean = false;
    showTees = [];
    showholeindexforWomen: boolean = false;
    isLoading: boolean = false;
    setName9: string;
    setName18: string;
    setName27: string;
    setName36: string;
    tees: any;
    courseHoleSet: any;
    showratingforwomen: boolean = false;
    tee: any;
    deleteTsee: any[];
    teeRemove: any[] = [];
    holes: any;
    constructor(
        // private datePipe: DatePipe,
        // private router: Router,

        private route: ActivatedRoute,
        // private location: Location,
        public snackBar: MatSnackBar,
        public dialog: MatDialog,
        public facadeService: FacadeService // private storage: AngularFireStorage
    ) {
        this.setState(this.valid1, true);
        this.setState(this.valid2, true);
        this.setState(this.valid3, true);
        this.setState(this.valid4, true);
        this.setState(this.valid5, true);
    }

    async ngOnInit() {
        console.log(this.selectedPanel);
        
        this.panels = [
            {
                id: 'a',
                icon: 'heroicons_outline:user-circle',
                title: 'Tees',
                description:
                    'Manage your course tees, their names and colors',
            },
            {
                id: 'b',
                icon: 'heroicons_outline:lock-closed',
                title: 'Holes',
                description:
                    'Manage your course holes , par and index',
            },
            {
                id: 'c',
                icon: 'heroicons_outline:credit-card',
                title: 'Hole-Set',
                description:
                    'Manage your course hole-sets by combining hole-sets',
            },
            {
                id: 'd',
                icon: 'heroicons_outline:bell',
                title: 'Course Rating',
                description: "Manage your course ratings and slope ratings",
            },
            {
                id: 'e',
                icon: 'heroicons_outline:user-group',
                title: 'Tee Meta',
                description:
                    'Manage your course lat, long and dist',
            },
        ];

        this.route.paramMap.subscribe((params) => {
            this.courseID = params.get('id');
        });

        if (this.courseID) {
            this.courseData = await this.facadeService.getCourseByID(
                this.courseID
            );
            console.log(this.courseData);
            this.courseTitle = this.courseData['course'][0].name;
            this.countryName = this.courseData['course'][0].country;
            this.cityName = this.courseData['course'][0].city;
            this.NoOfHoles = this.courseData['course'][0].noOfHoles;
            this.url = 'golfcourse.jpg';
            // this.setHoles(this.NoOfHoles);

            let tee = await this.facadeService.getTeesOfCourse(this.courseID);
            console.log(tee);

            if (tee['course_tees'].length > 0) {
                for (let obj of tee['course_tees']) {
                    let tee = {
                        id: UniqueIdGenerator.generate(),
                        name_by_club: obj.name_by_club,
                        color: obj.color,
                        tee_id: obj['tee_name'].key,
                    };
                    this.Tee.push(tee);
                }
                this.setState(this.valid1, false);
                this.setState(this.valid2, false);
                this.setState(this.valid3, false);
                this.setState(this.valid4, false);
                this.setState(this.valid5, false);
                this.tees = [];
                this.tees =
                    await this.facadeService.getCourseInformationForForm(
                        this.courseID
                    );
                this.showTees = [];
                let item = this.tees['course'][0]['TeesQL'];
                for (let obj of item) {
                    item = {
                        name: obj.name_by_club,
                        id: obj.tee_id,
                    };
                    this.showTees.push(item);
                }
            } else {
                this.addIntialsTees();
            }
            this.isLoading=true;
        } else {
            alert('Course Does Not Exist.');
        }
    }
    ////*******************************************************************TEE COLOR SAVE**************************************************************************************** */

    /**
   * tabClicked
event   */
    public onStepChange(event) {
        console.log(event);
        if (event.selectedIndex == 1) {
            this.setHoles(this.NoOfHoles);
        } else if (event.selectedIndex == 2) {
            this.getCourseHoleSets();
            // this.setCoursRating();
            // this.getTeeMeta();
            // this.showTees = [];
        } else if (event.selectedIndex == 3) {
            this.setCoursRating();
        } else if (event.selectedIndex == 4) {
            this.getTeeMeta();
        }
    }
    /**
     * addIntialsTees
     */
    public addIntialsTees() {
        for (let index = 0; index <= 3; index++) {
            this.Tee[this.Tee.length] = [];
            this.Tee[this.Tee.length - 1]['id'] = UniqueIdGenerator.generate();
            this.Tee[this.Tee.length - 1]['tee_id'] = '';
            this.Tee[this.Tee.length - 1]['name_by_club'] = '';
            this.Tee[this.Tee.length - 1]['color'] = '';
        }
    }
    /**
     * onTeeAddChange
     */
    addNewTee() {
        this.Tee[this.Tee.length] = [];
        this.Tee[this.Tee.length - 1]['id'] = UniqueIdGenerator.generate();
        this.Tee[this.Tee.length - 1]['tee_id'] = '';
        this.Tee[this.Tee.length - 1]['name_by_club'] = '';
        this.Tee[this.Tee.length - 1]['color'] = '';
        console.log(this.Tee);
    }
    /**
     * onTeeColorChange
     */
    public onTeeColor(val, teeID) {
        let index = 0;
        for (let obj of this.Tee) {
            if (obj.id == teeID) {
                this.Tee[index]['color'] = val;
            }
            index++;
        }
    }
    /**
     * onTeeNameChange
     */
    public onTeeName(val, teeID) {
        let index = 0;
        for (let obj of this.Tee) {
            if (obj.id == teeID) {
                this.Tee[index]['name_by_club'] = val;
            }
            index++;
        }
    }
    /**
     * onTeeSelectionChange
     */
    public teeChange(event, teeID) {
        let index = 0;
        for (let obj of this.Tee) {
            if (obj.id == teeID) {
                this.Tee[index]['tee_id'] = event.value;
            }
            index++;
        }
    }
    /**
     * deleteTee
     */
    public deleteTee(teeID) {
        this.deleteTsee = this.Tee.filter((a) => a.id != teeID);
        let deletedTee = this.Tee.filter((a) => a.id == teeID);
        this.teeRemove.push(deletedTee[0]);
        console.log(this.teeRemove);
        console.log(this.deleteTsee);
        console.log(this.Tee);

        this.Tee = this.deleteTsee;
    }
    /**
     * SaveAllTees
     */
    public saveTees = async (control: FormControl, state: boolean) => {
        let today: Date = new Date();
        let teeObj = [];
        let teeObjtoDelete = [];

        console.log(this.teeRemove);
        console.log(this.deleteTsee);
        console.log(this.Tee);

        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();
        let todayDate: Date = General.parseToDate(mm + '/' + dd + '/' + yyyy);

        for (let obj of this.Tee) {
            let roundTeeId: any = General.getPlayersTe(obj.tee_id);
            let tee = {
                course_id: this.courseID,
                tee_id: roundTeeId.id,
                color: obj.color ? obj.color : '#ffffff',
                name_by_club: obj.name_by_club,
                created_at: General.parseToDate(todayDate.toDateString()),
            };
            teeObj.push(tee);
        }
        if (this.teeRemove) {
            for (let obj of this.teeRemove) {
                let roundTeeId: any = General.getPlayersTe(
                    obj.tee_id ? obj.tee_id : 'Amateurs'
                );
                // let tee = {
                //   tee_id: roundTeeId.id,
                // };
                teeObjtoDelete.push(roundTeeId.id);
            }
        }

        console.log(teeObjtoDelete);
        console.log(teeObj);

        let saveTeeColor = <boolean>(
            await this.facadeService.saveTeeColor(teeObj)
        );
        if (teeObjtoDelete.length > 0) {
            let deleteTeeColor = <boolean>(
                await this.facadeService.deleteTeeColor(
                    this.courseID,
                    teeObjtoDelete
                )
            );
        }
        if (saveTeeColor) {
            this.snackBar.open('Tees Color has been Saved!', 'x', {
                duration: 5000,
            });
            if (state) {
                control.setErrors({ required: true });
            } else {
                control.reset();
            }
        } else {
            this.snackBar.open('Tees Color has not Saved!', 'x', {
                duration: 5000,
            });
        }
    };
    ////*******************************************************************TEE COLOR SAVE**************************************************************************************** */
    ////*******************************************************************TEE HOLES SAVE**************************************************************************************** */

    async setHoles(Number: number) {
        console.log(Number);
        let holes = await this.facadeService.getCourseHole(this.courseID);
        console.log(holes['HolesQL']);

        if (holes['HolesQL'].length > 0) {
            let holeCount = holes['HolesQL'][0].holes;
            if (this.NoOfHoles > 8) {
                this.holeSetfor9 = [];
                for (let index = 0; index <= 8; index++) {
                    let hole: any = {
                        displayName: holes['HolesQL'][0].displayName,
                        id: holeCount[index].id,
                        holeNo: holeCount[index].holeNo,
                        par: holeCount[index].par,
                        index: holeCount[index].index,
                        holeSetId: holeCount[index].holeSetId,
                    };

                    this.holeSetfor9.push(hole);
                }
            }
            if (this.NoOfHoles > 9) {
                let holeCount = holes['HolesQL'][1].holes;
                this.showholeSetfor18 = true;
                this.holeSetfor18 = [];
                for (let index = 0; index <= 8; index++) {
                    let hole: any = {
                        displayName: holes['HolesQL'][1].displayName,
                        id: holeCount[index].id,
                        holeNo: holeCount[index].holeNo,
                        par: holeCount[index].par,
                        index: holeCount[index].index,
                        holeSetId: holeCount[index].holeSetId,
                    };

                    this.holeSetfor18.push(hole);
                }
            }
            if (this.NoOfHoles > 18) {
                let holeCount = holes['HolesQL'][2].holes;
                this.showholeSetfor27 = true;
                this.holeSetfor27 = [];
                for (let index = 0; index <= 8; index++) {
                    let hole: any = {
                        displayName: holes['HolesQL'][2].displayName,
                        id: holeCount[index].id,
                        holeNo: holeCount[index].holeNo,
                        par: holeCount[index].par,
                        index: holeCount[index].index,
                        holeSetId: holeCount[index].holeSetId,
                    };

                    this.holeSetfor27.push(hole);
                }
            }
            if (this.NoOfHoles > 27) {
                let holeCount = holes['HolesQL'][3].holes;
                this.showholeSetfor36 = true;
                this.holeSetfor36 = [];
                for (let index = 0; index <= 8; index++) {
                    let hole: any = {
                        displayName: holes['HolesQL'][3].displayName,
                        id: holeCount[index].id,
                        holeNo: holeCount[index].holeNo,
                        par: holeCount[index].par,
                        index: holeCount[index].index,
                        holeSetId: holeCount[index].holeSetId,
                    };

                    this.holeSetfor36.push(hole);
                }
            }
        } else {
            if (Number > 8) {
                this.holeSetfor9 = [];
                for (let index = 1; index <= 9; index++) {
                    let hole: any = {
                        id: UniqueIdGenerator.generate(),
                        holeNo: index,
                        displayName: null,
                        par: null,
                        index: null,
                    };

                    this.holeSetfor9.push(hole);
                }
            }
            if (Number > 9) {
                this.showholeSetfor18 = true;
                this.holeSetfor18 = [];
                for (let index = 10; index <= 18; index++) {
                    let hole: any = {
                        id: UniqueIdGenerator.generate(),
                        holeNo: index,
                        displayName: null,
                        par: null,
                        index: null,
                    };

                    this.holeSetfor18.push(hole);
                }
            }
            if (Number > 18) {
                this.showholeSetfor27 = true;
                this.holeSetfor27 = [];
                for (let index = 19; index <= 27; index++) {
                    let hole: any = {
                        id: UniqueIdGenerator.generate(),
                        holeNo: index,
                        displayName: null,
                        par: null,
                        index: null,
                    };

                    this.holeSetfor27.push(hole);
                }
            }
            if (Number > 27) {
                this.showholeSetfor36 = true;
                this.holeSetfor36 = [];
                for (let index = 28; index <= 36; index++) {
                    let hole: any = {
                        id: UniqueIdGenerator.generate(),
                        holeNo: index,
                        displayName: null,
                        par: null,
                        index: null,
                    };

                    this.holeSetfor36.push(hole);
                }
            }
        }
    }
    /**
     * onParInput
     */
    public onParInput(par: any, holeNo: any) {
        console.log(holeNo);
        let index = 0;
        if (holeNo <= 9) {
            for (let obj of this.holeSetfor9) {
                if (holeNo == obj.holeNo) {
                    this.holeSetfor9[index]['par'] = par;
                    break;
                }
                index++;
            }
        } else if (holeNo <= 18) {
            for (let obj of this.holeSetfor18) {
                if (holeNo == obj.holeNo) {
                    this.holeSetfor18[index]['par'] = par;
                    break;
                }
                index++;
            }
        } else if (holeNo <= 27) {
            for (let obj of this.holeSetfor27) {
                if (holeNo == obj.holeNo) {
                    this.holeSetfor27[index]['par'] = par;
                    break;
                }
                index++;
            }
        } else if (holeNo <= 36) {
            for (let obj of this.holeSetfor36) {
                if (holeNo == obj.holeNo) {
                    this.holeSetfor36[index]['par'] = par;
                    break;
                }
                index++;
            }
        }
    }
    /**
     * onIndexInput
     */
    public onIndexInput(val: any, holeNo: any) {
        console.log(holeNo);

        let index = 0;
        if (holeNo <= 9) {
            for (let obj of this.holeSetfor9) {
                if (holeNo == obj.holeNo) {
                    this.holeSetfor9[index]['index'] = val;
                    break;
                }
                index++;
            }
        } else if (holeNo <= 18) {
            for (let obj of this.holeSetfor18) {
                if (holeNo == obj.holeNo) {
                    this.holeSetfor18[index]['index'] = val;
                    break;
                }
                index++;
            }
        } else if (holeNo <= 27) {
            for (let obj of this.holeSetfor27) {
                if (holeNo == obj.holeNo) {
                    this.holeSetfor27[index]['index'] = val;
                    break;
                }
                index++;
            }
        } else if (holeNo <= 36) {
            for (let obj of this.holeSetfor36) {
                if (holeNo == obj.holeNo) {
                    this.holeSetfor36[index]['index'] = val;
                    break;
                }
                index++;
            }
        }
    }
    /**
     * onIndexInputForWomen
     */
    public onIndexInputForWomen(val: any, holeNo: any) {
        console.log(holeNo);

        let index = 0;
        if (holeNo <= 9) {
            for (let obj of this.holeSetfor9) {
                if (holeNo == obj.holeNo) {
                    this.holeSetfor9[index]['indexForW'] = val;
                    break;
                }
                index++;
            }
        } else if (holeNo <= 18) {
            for (let obj of this.holeSetfor18) {
                if (holeNo == obj.holeNo) {
                    this.holeSetfor18[index]['indexForW'] = val;
                    break;
                }
                index++;
            }
        } else if (holeNo <= 27) {
            for (let obj of this.holeSetfor27) {
                if (holeNo == obj.holeNo) {
                    this.holeSetfor27[index]['indexForW'] = val;
                    break;
                }
                index++;
            }
        } else if (holeNo <= 36) {
            for (let obj of this.holeSetfor36) {
                if (holeNo == obj.holeNo) {
                    this.holeSetfor36[index]['indexForW'] = val;
                    break;
                }
                index++;
            }
        }
    }
    /**
   * selectionChange
event   */
    public selectionChange(event) {
        if (event == 1) {
            this.showholeindexforWomen = true;
            this.holeSetfor9.forEach(function (element) {
                element['indexForW'] = null;
            });
            this.holeSetfor18.forEach(function (element) {
                element['indexForW'] = null;
            });
            this.holeSetfor27.forEach(function (element) {
                element['indexForW'] = null;
            });
            this.holeSetfor36.forEach(function (element) {
                element['indexForW'] = null;
            });
            console.log(this.holeSetfor9);
        } else {
            this.showholeindexforWomen = false;
            this.holeSetfor9.forEach(function (element) {
                delete element['indexForW'];
            });
            this.holeSetfor18.forEach(function (element) {
                delete element['indexForW'];
            });
            this.holeSetfor27.forEach(function (element) {
                delete element['indexForW'];
            });
            this.holeSetfor36.forEach(function (element) {
                delete element['indexForW'];
            });
            console.log(this.holeSetfor9);
        }
    }
    /**
     * tableNameInput
     */
    public tableNameInput(val: any, tableindex: any) {
        if (tableindex == 1) {
            this.setName9 = val;
        } else if (tableindex == 10) {
            this.setName18 = val;
        } else if (tableindex == 19) {
            this.setName27 = val;
        } else {
            this.setName36 = val;
        }
    }
    /**
     * saveHoles
     */
    public saveHoles = async (control: FormControl, state: boolean) => {
        let holeObj = [];
        let holesToSave = [];
        let holesSet = [];
        if (this.NoOfHoles == 18) {
            holeObj = this.holeSetfor9.concat(this.holeSetfor18);
        } else if (this.NoOfHoles == 27) {
            holeObj = this.holeSetfor9.concat(
                this.holeSetfor18,
                this.holeSetfor27
            );
        } else if (this.NoOfHoles == 36) {
            holeObj = this.holeSetfor9.concat(
                this.holeSetfor18,
                this.holeSetfor27,
                this.holeSetfor36
            );
        } else {
            holeObj = this.holeSetfor9;
        }

        if (this.showholeindexforWomen == false) {
            let count = holeObj.length / 9;
            let set = 1;
            this.id = [];
            let name = this.setName9;
            for (let index = 1; index <= count; index++) {
                if (index == 2) {
                    set = 2;
                    name = this.setName18;
                } else if (index == 3) {
                    set = 4;
                    name = this.setName27;
                } else if (index == 4) {
                    set = 8;
                    name = this.setName36;
                }
                var ids = General.generateUUID();
                this.id.push(ids);
                let holeSet = {
                    id: ids,
                    holeSets: set,
                    courseId: this.courseID,
                    inverted: false,
                    noOfHoles: 9,
                    displayName: name,
                    frontId: set,
                    backId: null,
                };
                holesSet.push(holeSet);
            }
            let number = 0;
            let counter = 0;
            for (let obj of holeObj) {
                // let roundTeeId: any = General.getPlayersTe(obj.Tee);
                let tee = {
                    id: obj.id,
                    courseId: this.courseID,
                    holeNo: obj.holeNo,
                    teeDistances: {},
                    teeLatLongs: {},
                    indexWomen: null,
                    par: obj.par ? obj.par : 0,
                    index: obj.index ? obj.index : 0,
                    holeSetId: this.id[counter],
                };
                number++;
                if (number % 9 == 0) {
                    counter++;
                }
                holesToSave.push(tee);
            }
        } else {
            let count = holeObj.length / 9;
            let set = 1;
            this.id = [];
            let name = this.setName9;
            for (let index = 1; index <= count; index++) {
                if (index == 2) {
                    set = 2;
                    name = this.setName18;
                } else if (index == 3) {
                    set = 4;
                    name = this.setName27;
                } else if (index == 4) {
                    set = 8;
                    name = this.setName36;
                }
                var ids = General.generateUUID();
                this.id.push(ids);
                let holeSet = {
                    id: ids,
                    holeSets: set,
                    courseId: this.courseID,
                    inverted: false,
                    noOfHoles: 9,
                    displayName: name,
                    frontId: set,
                    backId: null,
                };
                holesSet.push(holeSet);
            }
            let number = 0;
            let counter = 0;
            for (let obj of holeObj) {
                // let roundTeeId: any = General.getPlayersTe(obj.Tee);
                let tee = {
                    id: obj.id,
                    courseId: this.courseID,
                    holeNo: obj.holeNo,
                    teeDistances: {},
                    teeLatLongs: {},
                    indexWomen: obj.indexForW,
                    par: obj.par ? obj.par : 0,
                    index: obj.index ? obj.index : 0,
                    holeSetId: this.id[counter],
                };
                number++;
                if (number % 9 == 0) {
                    counter++;
                }
                holesToSave.push(tee);
            }
        }
        console.log(holesToSave);
        console.log(holesSet);

        let succees = <boolean>(
            await this.facadeService.saveCourseHoles(holesToSave, holesSet)
        );
        if (succees) {
            this.snackBar.open('Course Holes are Saves!', 'x', {
                duration: 2000,
            });
            if (state) {
                control.setErrors({ required: true });
            } else {
                control.reset();
            }
        } else {
            this.snackBar.open('Course Holes has not Saved!', 'x', {
                duration: 5000,
            });
        }
    };
    ///*******************************************************************TEE HOLES SAVE**************************************************************************************** */
    ///*******************************************************************TEE HOLES-SETS SAVE**************************************************************************************** */

    /**
     * getCourseHolsSets
     */
    async getCourseHoleSets() {
        this.Hole = [];
        this.courseHoleSet =
            await this.facadeService.getCourseHoleSetsForCourse(this.courseID);
        this.holeSetforSelect = [];

        let HolesSet = this.courseHoleSet['course_hole_sets'];
        if (HolesSet && HolesSet.length > 0) {
            for (let obj of HolesSet) {
                if (obj.noOfHoles == 9) {
                    let hole = {
                        id: obj.holeSets,
                        displayName: obj.displayName,
                    };
                    this.holeSetforSelect.push(hole);
                } else {
                    let backId = this.holeSetforSelect.find(
                        (a) => a.id == obj.backId
                    );
                    let frontId = this.holeSetforSelect.find(
                        (a) => a.id == obj.frontId
                    );
                    //console.log(id);

                    let holes = {
                        id: obj.holeSets,
                        displayName: obj.displayName,
                        backId: backId.id,
                        frontId: frontId.id,
                    };
                    this.Hole.push(holes);
                }
            }
        } else {
            for (let index = 0; index < 2; index++) {
                this.Hole[this.Hole.length] = [];
                this.Hole[this.Hole.length - 1]['id'] =
                    UniqueIdGenerator.generate();
                this.Hole[this.Hole.length - 1]['displayName'] = '';
                this.Hole[this.Hole.length - 1]['frontId'] = '';
                this.Hole[this.Hole.length - 1]['backId'] = '';
            }
        }

        console.log(this.holeSetforSelect);
        console.log(this.Hole);
    }
    /**
     * onTeeAddChange
     */
    addNewHoleSet() {
        this.Hole[this.Hole.length] = [];
        this.Hole[this.Hole.length - 1]['id'] = UniqueIdGenerator.generate();
        this.Hole[this.Hole.length - 1]['displayName'] = '';
        this.Hole[this.Hole.length - 1]['frontId'] = '';
        this.Hole[this.Hole.length - 1]['backId'] = '';
        console.log(this.Hole);
    }
    /**
     * onDisplayNameChange
     */
    public onDisplayNameChange(event, id) {
        let index = 0;
        for (let obj of this.Hole) {
            if (obj.id == id) {
                this.Hole[index]['displayName'] = event;
            }
            index++;
        }
    }
    /**
     * onfrontID
     */
    public onfrontID(event, id) {
        let index = 0;
        for (let obj of this.Hole) {
            if (obj.id == id) {
                this.Hole[index]['frontId'] = event.value;
            }
            index++;
        }
    }
    /**
     * onbackID
     */
    public onbackID(event, id) {
        let index = 0;
        for (let obj of this.Hole) {
            if (obj.id == id) {
                this.Hole[index]['backId'] = event.value;
            }
            index++;
        }
    }
    async saveHoleSets(
        control: FormControl,
        control1: FormControl,
        control2: FormControl,
        state: boolean
    ) {
        console.log(this.Hole);
        let HoleSetObj = [];
        for (let obj of this.Hole) {
            var holesSet = obj.frontId + obj.backId;
            let hole = {
                courseId: this.courseID,
                holeSets: holesSet,
                inverted: obj.frontId > obj.backId ? true : false,
                noOfHoles: 18,
                displayName: obj.displayName,
                frontId: obj.frontId,
                backId: obj.backId,
            };
            HoleSetObj.push(hole);
        }
        console.log(HoleSetObj);
        let saveTeeColor = <boolean>(
            await this.facadeService.saveCourseHolesSet(HoleSetObj)
        );
        if (saveTeeColor) {
            this.snackBar.open('Course HoleSets has been Saved!', 'x', {
                duration: 5000,
            });
            if (state) {
                control.setErrors({ required: true });
            } else {
                control.reset();
                control1.reset();
                control2.reset();
            }
        } else {
            this.snackBar.open('Course HolesSet has not Saved!', 'x', {
                duration: 5000,
            });
        }
    }
    ///*******************************************************************TEE HOLES-SETS SAVE**************************************************************************************** */
    ///*******************************************************************TEE HOLES-META SAVE**************************************************************************************** */
    addNewTeeMeta() {
        this.holeMeta[this.holeMeta.length] = [];
        this.holeMeta[this.holeMeta.length - 1]['id'] =
            UniqueIdGenerator.generate();
        this.holeMeta[this.holeMeta.length - 1]['hole_id'] = '';
        this.holeMeta[this.holeMeta.length - 1]['tee_distances'] = '';
        this.holeMeta[this.holeMeta.length - 1]['tee_lat'] = '';
        this.holeMeta[this.holeMeta.length - 1]['tee_long'] = '';
        this.holeMeta[this.holeMeta.length - 1]['tee_id'] = '';
        console.log(this.holeMeta);
    }
    async getTeeMeta() {
        this.holes = this.tees['course'][0]['HolesQL'];
        let teesMeta = await this.facadeService.getCourseTeeMeta(this.courseID);
        console.log(teesMeta);
        console.log(teesMeta['hole_tee_meta']);
        console.log(this.holes);

        if (teesMeta['hole_tee_meta'] && teesMeta['hole_tee_meta'].length > 0) {
            this.holeMeta = [];
            for (let obj of teesMeta['hole_tee_meta']) {
                let tee = {
                    id: UniqueIdGenerator.generate(),

                    hole_id: obj.hole_id,
                    tee_id: obj.tee_id,
                    tee_distances: obj.tee_distance,
                    tee_lat: obj.tee_lat,
                    tee_long: obj.tee_long,
                };
                this.holeMeta.push(tee);
            }
        }
    }
    HolechangeForMeta(val, teeID) {
        let index = 0;
        for (let obj of this.holeMeta) {
            if (obj.id == teeID) {
                this.holeMeta[index]['hole_id'] = val;
            }
            index++;
        }
    }
    teechangeforMeta(val, teeID) {
        let index = 0;
        for (let obj of this.holeMeta) {
            if (obj.id == teeID) {
                this.holeMeta[index]['tee_id'] = val.value;
            }
            index++;
        }
    }
    distanceChange(val, teeID) {
        let index = 0;
        for (let obj of this.holeMeta) {
            if (obj.id == teeID) {
                this.holeMeta[index]['tee_distances'] = val;
            }
            index++;
        }
    }
    LatChange(val, teeID) {
        let index = 0;
        for (let obj of this.holeMeta) {
            if (obj.id == teeID) {
                this.holeMeta[index]['tee_lat'] = val;
            }
            index++;
        }
    }
    LongChange(val, teeID) {
        let index = 0;
        for (let obj of this.holeMeta) {
            if (obj.id == teeID) {
                this.holeMeta[index]['tee_long'] = val;
            }
            index++;
        }
    }

    async saveTeeMeta() {
        let today: Date = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();
        let todayDate: Date = General.parseToDate(mm + '/' + dd + '/' + yyyy);
        let teeObj = [];
        console.log(this.holeMeta);
        for (let obj of this.holeMeta) {
            let tee = {
                course_id: this.courseID,
                created_at: General.parseToDate(todayDate.toDateString()),
                hole_id: obj.hole_id,
                tee_id: obj.tee_id,
                tee_distance: obj.tee_distances,
                tee_lat: obj.tee_lat,
                tee_long: obj.tee_long,
            };
            teeObj.push(tee);
        }
        console.log(teeObj);
        let saveTeeColor = <boolean>(
            await this.facadeService.saveCourseMetaSet(teeObj)
        );
        if (saveTeeColor) {
            this.snackBar.open('Hole Meta has been Saved!', 'x', {
                duration: 5000,
            });
        } else {
            this.snackBar.open('Hole Meta has not Saved!', 'x', {
                duration: 5000,
            });
        }
    }

    ///*******************************************************************TEE HOLES-META SAVE**************************************************************************************** */
    ///*******************************************************************TEE HOLES-Rating SAVE**************************************************************************************** */

    addNewCourseRating() {
        this.coursRating[this.coursRating.length] = [];
        this.coursRating[this.coursRating.length - 1]['id'] =
            UniqueIdGenerator.generate();
        this.coursRating[this.coursRating.length - 1]['courseHoleSets'] = '';
        this.coursRating[this.coursRating.length - 1]['tee'] = '';
        this.coursRating[this.coursRating.length - 1]['tee_id'] = '';
        this.coursRating[this.coursRating.length - 1]['slopeRating'] = '';
        this.coursRating[this.coursRating.length - 1]['courseRating'] = '';
        this.coursRating[this.coursRating.length - 1]['coursePar'] = '';
        this.coursRating[this.coursRating.length - 1]['gender_id'] = '';
        console.log(this.coursRating);
    }
    public slopeRating(val, teeID) {
        let index = 0;
        for (let obj of this.coursRating) {
            if (obj.id == teeID) {
                this.coursRating[index]['slopeRating'] = val;
            }
            index++;
        }
    }
    public teechange(val, teeID) {
        let index = 0;
        for (let obj of this.coursRating) {
            if (obj.id == teeID) {
                this.coursRating[index]['tee_id'] = val.value;
                for (let indexa in this.showTees) {
                    if (this.showTees[indexa].id == val.value) {
                        this.coursRating[index]['tee'] =
                            this.showTees[indexa].name;
                        break;
                    }
                }
            }
            index++;
        }
    }
    /**
     * onTeeNameChange
     */
    public courseRating(val, teeID) {
        let index = 0;
        for (let obj of this.coursRating) {
            if (obj.id == teeID) {
                this.coursRating[index]['courseRating'] = val;
            }
            index++;
        }
    }
    /**
     * onTeeSelectionChange
     */
    public coursePar(event, teeID) {
        let index = 0;
        for (let obj of this.coursRating) {
            if (obj.id == teeID) {
                this.coursRating[index]['coursePar'] = event;
            }
            index++;
        }
    }
    /**
     * onTeeSelectionChange
     */
    public courseHoleSets(event, teeID) {
        let index = 0;
        for (let obj of this.coursRating) {
            if (obj.id == teeID) {
                this.coursRating[index]['courseHoleSets'] = event;
            }
            index++;
        }
    }
    /**
     * onTeeSelectionChange
     */
    public gender_id(event, teeID) {
        console.log(event);

        let index = 0;
        for (let obj of this.coursRating) {
            if (obj.id == teeID) {
                this.coursRating[index]['gender_id'] = event.value;
            }
            index++;
        }
    }
    async setCoursRating() {
        this.tees = [];
        this.tees = await this.facadeService.getCourseInformationForForm(
            this.courseID
        );
        let rating = await this.facadeService.getCourseRating(this.courseID);
        console.log(rating);
        console.log(this.tees);

        this.coursRating = [];
        if (rating && rating['course_rating'].length > 0) {
            for (let obj of rating['course_rating']) {
                let tee = {
                    id: UniqueIdGenerator.generate(),
                    courseHoleSets: obj.courseHoleSets,
                    tee: obj.tee,
                    tee_id: obj.tee_id,
                    slopeRating: obj.slopeRating,
                    courseRating: obj.courseRating,
                    coursePar: obj.coursePar,
                    gender_id: obj.gender_id,
                };
                this.coursRating.push(tee);
            }
        }
        console.log(this.coursRating);

        this.showTees = [];
        let tee = this.tees['course'][0]['TeesQL'];
        for (let obj of tee) {
            tee = {
                name: obj.name_by_club,
                id: obj.tee_id,
            };
            this.showTees.push(tee);
        }
        console.log(this.showTees);

        let HolesSet = this.courseHoleSet['course_hole_sets'];
        this.holeSetforSelect = [];
        for (let index1 in HolesSet) {
            let hole = {
                id: HolesSet[index1]['holeSets'],
                displayName: HolesSet[index1]['displayName'],
            };
            this.holeSetforSelect.push(hole);
        }
        console.log(this.holeSetforSelect);
    }

    async savecoureRating() {
        let teeObj = [];
        console.log(this.coursRating);
        for (let obj of this.coursRating) {
            let tee = {
                courseId: this.courseID,
                courseHoleSets: obj.courseHoleSets,
                tee: obj.tee,
                tee_id: obj.tee_id,
                slopeRating: obj.slopeRating,
                courseRating: obj.courseRating,
                coursePar: obj.coursePar,
                gender_id: obj.gender_id,
            };
            teeObj.push(tee);
        }
        console.log(teeObj);

        let saveCourseRating = <boolean>(
            await this.facadeService.saveCourseRating(teeObj)
        );
        if (saveCourseRating) {
            this.snackBar.open('Course-Rating has been Saved!', 'x', {
                duration: 5000,
            });
        } else {
            this.snackBar.open('Course-Rating has not Saved!', 'x', {
                duration: 5000,
            });
        }
    }

    ///*******************************************************************TEE HOLES-Rating SAVE**************************************************************************************** */
    async getFormData(stepper: MatStepper, action: string) {
        if (action === 'next') stepper.next();
        else if (action === 'back') stepper.previous();
        else {
        }
    }
    tournamentSetup() {
        this.stepTitle = 'Tournament Setup Form';
    }
    setState(control: FormControl, state: boolean) {
        if (state) {
            control.setErrors({ required: true });
        } else {
            control.reset();
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

     /**
     * Get the details of the panel
     *
     * @param id
     */
     getPanelInfo(id: string): any
     {
        
         return this.panels.find(panel => panel.id === id);
     }

      /**
     * Navigate to the panel
     *
     * @param panel
     */
    goToPanel(panel: string): void
    {
        this.selectedPanel = panel;
        if (panel == 'b') {
            this.setHoles(this.NoOfHoles);
        } else if (panel == 'c') {
            //this.setCoursRating();
            this.getCourseHoleSets();
            // this.getTeeMeta();
            // this.showTees = [];
        } else if (panel == 'd') {
            this.setCoursRating();
        } else if (panel =='e') {
            this.getTeeMeta();
        }
        // Close the drawer on 'over' mode
        if ( this.drawerMode === 'over' )
        {
            this.drawer.close();
        }
    }
}
