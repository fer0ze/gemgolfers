import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { async } from '@angular/core/testing';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatDrawer } from '@angular/material/sidenav';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatStepper } from '@angular/material/stepper';
import { ActivatedRoute, Router } from '@angular/router';
import { countries, getCity } from 'app/shared/classes/country';
import { Constants, General, UniqueIdGenerator } from 'app/shared/classes/general';
import { FacadeService } from 'app/shared/services/facade.service';
import { HandicapService } from 'app/shared/services/handicap.service';
import { LocalStorageService } from 'app/shared/services/localStorage';
import e from 'express';
import { Observable, map, startWith } from 'rxjs';

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
    selectedPanel: string = '0';
    courseID: any;
    courseData: any;
    courseTitle: any;

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
    nineHoleTotalPar: number = 0;
    eighteenHoleTotalPar: number = 0;
    twentysevenHoleTotalPar: number = 0;
    thirtySixHoleTotalPar: number = 0;
    loggedInuser: any;
    public courseForm: FormGroup;
    countries: any;
    cities: any;
    listCountries: Observable<any[]>;
    listCity: Observable<any[]>;
    constructor(
        // private datePipe: DatePipe,
        private router: Router,
        private _localStorage: LocalStorageService,
        private route: ActivatedRoute,
        private _cityService: HandicapService,
        public snackBar: MatSnackBar,
        public dialog: MatDialog,
        public facadeService: FacadeService // private storage: AngularFireStorage
    ) {

    }

    async ngOnInit() {
        this.countries = countries;
        //console.log(this.listCountries);
        this.route.paramMap.subscribe((params) => {
            this.courseID = params.get("id");
        });
        //console.log(this.courseID);
        this.courseForm = new FormGroup({
            courseName: new FormControl("", [
                Validators.required,
                Validators.maxLength(60),
            ]),
            country: new FormControl("", [
                Validators.required,
                Validators.maxLength(30),
            ]),
            city: new FormControl("", [
                Validators.required,
                Validators.maxLength(30),
            ]),
            noOfHoles: new FormControl("", [Validators.required]),
        });

        this.loggedInuser = this._localStorage.get(Constants.LOGGED_IN_USER);
        this.panels = [
            {
                id: '0',
                icon: 'heroicons_outline:star',
                title: 'Add Course',
                description:
                    'Create you courses by adding them',
            },


        ];

        if (this.courseID) {
            this.courseData = await this.facadeService.getCourseByID(
                this.courseID
            );
            //console.log(this.courseData);
            this.courseTitle = this.courseData['course'][0].name;
            this.countryName = this.courseData['course'][0].country;
            this.cityName = this.courseData['course'][0].city;
            this.NoOfHoles = this.courseData['course'][0].noOfHoles;
            this.courseForm.get('courseName').setValue(this.courseTitle);
            this.courseForm.get('country').setValue(this.countryName);
            this.countrySelected(this.countryName);
            this.courseForm.get('city').setValue(this.cityName);
            this.courseForm.get('noOfHoles').setValue(this.NoOfHoles.toString());

            this.url = 'golfcourse.jpg';
            // this.setHoles(this.NoOfHoles);
            this.panels = (General.getGolfCourseFeatures(this.loggedInuser.userRole));
            //console.log(this.panels);


        } else {

        }

        this.listCountries = this.courseForm
            .get('country')!
            .valueChanges.pipe(
                startWith(''),
                map((value) =>
                    typeof value === 'string' ? value : value ? value.name : ''
                ),
                map((name) => (name ? this._filter(name) : this.countries.slice()))
            );

    }
    ////*******************************************************************COURSE CREATE**************************************************************************************** */
    countrySelected(event) {
        // let obj = Country.getCity(event);

        const city = new getCity().getCity(event?.name || event);
        if (city) {
            for (let objs of city['cities']) {
                this.cities = objs.split("|");
            }
            // this.courseForm.get('city').setValue(this.cities[1]);
            console.log(this.cities);
            this.listCity = this.courseForm
                .get('city')!
                .valueChanges.pipe(
                    startWith(''),
                    map((value) =>
                        typeof value === 'string' ? value : value ? value.name : ''
                    ),
                    map((name) => (name ? this._filterCity(name) : this.cities.slice()))
                );
        } else {
            this.courseForm.get('city').setValue(event?.name || event);
        }
    }

    private _filter(value: string) {
        if (value) {
            const filterValue = value.toLowerCase();
            return this.countries.filter(
                (option) => option.name.toLowerCase().indexOf(filterValue) === 0
            );
        }
        return this.countries;
    }

    private _filterCity(value: string) {
        if (value) {
            const filterValue = value.toLowerCase();
            return this.cities.filter(
                (option) => option.toLowerCase().indexOf(filterValue) === 0
            );
        }
        return this.cities;
    }

    displayFn(country): string {
        return typeof country === 'string' ? country : country ? country.name : '';
    }
    displayCity(city): string {
        return typeof city === 'string' ? city : city ? city : '';
    }

    public createCourse = async (playerFormValue: any) => {
        let course = {
            id: UniqueIdGenerator.generate(),
            clubId: this.loggedInuser.userRole > 1 ? this.loggedInuser.adminClubId : null,
            name: playerFormValue.courseName,
            country: playerFormValue.country.name || playerFormValue.country,
            noOfHoles: playerFormValue.noOfHoles,
            teeDistanceUnit: "YARDS",
            par: "72",
            city: playerFormValue.city,
            createdBy: this.loggedInuser?.id,
            status: 'In Review',
        };
        if (this.courseID) {
            let courses = {
                id: this.courseID,
                clubId: this.loggedInuser.userRole > 1 ? this.loggedInuser.adminClubId : null,
                name: playerFormValue.courseName,
                country: playerFormValue.country.name || playerFormValue.country,
                noOfHoles: playerFormValue.noOfHoles,
                teeDistanceUnit: "YARDS",
                par: '72',
                countryGeonameId: 565656,
                cityGeonameId: 787878,
                city: playerFormValue.city,
                createdBy: this.loggedInuser?.id,

            };

            const isSuccess = <boolean>(
                await this.facadeService.updateCourse(courses, []));
            if (isSuccess) {
                this.snackBar.open("Course has been Updated.", "x", {
                    duration: 5000,
                });
                this.goToPanel('1');
            } else {
                this.snackBar.open("Course Not Updated!", "x", {
                    duration: 5000,
                });
            }
        } else {
            const isSuccess = <boolean>await this.facadeService.AddCourse(course);
            if (isSuccess) {
                this.courseID = course.id;
                this.snackBar.open("Course has been created.", "x", {
                    duration: 5000,
                });
                this.panels = (General.getGolfCourseFeatures(course.noOfHoles));
                // if (course.noOfHoles <= 18) {
                //     this.panels = this.panels.filter(panel => panel.id !== '3');
                // }
                //this.addIntialsTees();
                this.NoOfHoles = course.noOfHoles;
                this.goToPanel('1');
                // this.router.navigate(["/courses/view/" + this.courseID]);
            } else {
                this.snackBar.open("Error! Please try again later.", "x", {
                    duration: 5000,
                });
            }
        }
        // }
    };
    ////*******************************************************************TEE COLOR SAVE**************************************************************************************** */

    get courseName() {
        return this.courseForm.get("courseName");
    }
    get country() {
        return this.courseForm.get("country");
    }
    get city() {
        return this.courseForm.get("city");
    }
    /**
     * addIntialsTees
     */
    async addIntialsTees() {
        let tee = await this.facadeService.getTeesOfCourse(this.courseID);
        //console.log(tee);

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
            console.log(this.Tee);

            this.tees = [];
            this.tees =
                await this.facadeService.getCourseInformationForForm(
                    this.courseID
                );
            this.showTees = [];
            let item = this.tees['course'][0]['TeesQL'];
            for (let obj of item) {
                item = {
                    name_by_club: obj.name_by_club,
                    id: obj.tee_id,
                };
                this.showTees.push(item);
            }
        } else {
            for (let index = 0; index <= 4; index++) {
                let tee: any = General.getCourseTee(index);
                this.Tee[this.Tee.length] = [];
                this.Tee[this.Tee.length - 1]['id'] = UniqueIdGenerator.generate();
                this.Tee[this.Tee.length - 1]['tee_id'] = tee.tee_id;
                this.Tee[this.Tee.length - 1]['name_by_club'] = tee.name;
                this.Tee[this.Tee.length - 1]['color'] = tee.color;
            }

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
        //console.log(this.Tee);
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
        //console.log(this.teeRemove);
        //console.log(this.deleteTsee);
        //console.log(this.Tee);

        this.Tee = this.deleteTsee;
    }
    /**
     * SaveAllTees
     */
    public saveTees = async (control: FormControl, state: boolean) => {
        let today: Date = new Date();
        let teeObj = [];
        let teeObjtoDelete = [];

        //console.log(this.teeRemove);
        //console.log(this.deleteTsee);
        //console.log(this.Tee);

        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();
        let todayDate: Date = General.parseToDate(mm + '/' + dd + '/' + yyyy);

        this.Tee.forEach((obj, index) => {
            let roundTeeId: any = General.getPlayersTe(obj.tee_id);
            let tee = {
                tee_order: index + 1,
                course_id: this.courseID,
                tee_id: roundTeeId.id,
                color: obj.color ? obj.color : '#ffffff',
                name_by_club: obj.name_by_club,
                created_at: General.parseToDate(todayDate.toDateString())
            };
            teeObj.push(tee);
        });
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

        //console.log(teeObjtoDelete);
        //console.log(teeObj);

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
            this.goToPanel('2');
            // if (state) {
            //     control.setErrors({ required: true });
            // } else {
            //     control.reset();
            // }
        } else {
            this.snackBar.open('Tees Color has not Saved!', 'x', {
                duration: 5000,
            });
        }
    };
    ////*******************************************************************TEE COLOR SAVE**************************************************************************************** */
    ////*******************************************************************TEE HOLES SAVE**************************************************************************************** */

    async setHoles(Number: number) {
        //console.log(Number);
        let holes = await this.facadeService.getCourseHole(this.courseID);
        console.log(holes['HolesQL']);

        if (holes['HolesQL'].length > 0) {
            let holeCount = holes['HolesQL'][0].holes;
            if (this.NoOfHoles > 8) {
                this.holeSetfor9 = [];
                this.setName9 = holes['HolesQL'][0].displayName;
                for (let index = 0; index <= 8; index++) {
                    let hole: any = {
                        displayName: holes['HolesQL'][0].displayName,
                        id: holeCount[index].id,
                        holeNo: holeCount[index].holeNo,
                        par: holeCount[index].par,
                        index: holeCount[index].index,
                        holeSetId: holeCount[index].holeSetId,
                        teeDistances: {}
                    };
                    for (let meta of holes['HolesQL'][0]['holes'][index].meta) {
                        hole.teeDistances[(meta['tee_name'].name).toUpperCase()] = meta.tee_distance;
                    }
                    this.nineHoleTotalPar += parseInt(hole.par);
                    this.holeSetfor9.push(hole);
                }
            }
            if (this.NoOfHoles > 9) {
                this.setName18 = holes['HolesQL'][1].displayName
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
                        teeDistances: {}
                    };
                    for (let meta of holes['HolesQL'][1]['holes'][index].meta) {
                        hole.teeDistances[(meta['tee_name'].name).toUpperCase()] = meta.tee_distance;
                    }
                    this.eighteenHoleTotalPar += parseInt(hole.par);
                    this.holeSetfor18.push(hole);
                }
            }
            if (this.NoOfHoles > 18) {
                this.setName27 = holes['HolesQL'][2].displayName
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
                        teeDistances: {}
                    };
                    for (let meta of holes['HolesQL'][2]['holes'][index].meta) {
                        hole.teeDistances[(meta['tee_name'].name).toUpperCase()] = meta.tee_distance;
                    }
                    this.twentysevenHoleTotalPar += parseInt(hole.par);
                    this.holeSetfor27.push(hole);
                }
            }
            if (this.NoOfHoles > 27) {
                this.setName36 = holes['HolesQL'][3].displayName
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
                        teeDistances: {}
                    };
                    for (let meta of holes['HolesQL'][3]['holes'][index].meta) {
                        hole.teeDistances[(meta['tee_name'].name).toUpperCase()] = meta.tee_distance;
                    }
                    this.thirtySixHoleTotalPar += parseInt(hole.par);

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
                        displayName: 'Front-9',
                        par: null,
                        index: null,
                        teeDistances: {}
                    };

                    this.holeSetfor9.push(hole);
                }
                this.setName9 = 'Front-9';
            }
            if (Number > 9) {
                this.showholeSetfor18 = true;
                this.holeSetfor18 = [];
                for (let index = 10; index <= 18; index++) {
                    let hole: any = {
                        id: UniqueIdGenerator.generate(),
                        holeNo: index,
                        displayName: 'Back-9',
                        par: null,
                        index: null,
                        teeDistances: {}
                    };

                    this.holeSetfor18.push(hole);
                }
                this.setName18 = 'Back-9';
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
                        teeDistances: {}
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
                        teeDistances: {}
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
        //console.log(holeNo);
        par = par != '' ? par : 0;
        let index = 0;
        if (holeNo <= 9) {
            this.nineHoleTotalPar = 0;
            for (let obj of this.holeSetfor9) {
                if (holeNo == obj.holeNo) {
                    this.holeSetfor9[index]['par'] = par;
                }
                this.nineHoleTotalPar += parseInt(this.holeSetfor9[index]['par'] || 0)
                index++;
            }
        } else if (holeNo <= 18) {
            this.eighteenHoleTotalPar = 0;
            for (let obj of this.holeSetfor18) {
                if (holeNo == obj.holeNo) {
                    this.holeSetfor18[index]['par'] = par;
                }
                this.eighteenHoleTotalPar += parseInt(this.holeSetfor18[index]['par'] || 0)
                index++;
            }
        } else if (holeNo <= 27) {
            this.twentysevenHoleTotalPar = 0;
            for (let obj of this.holeSetfor27) {
                if (holeNo == obj.holeNo) {
                    this.holeSetfor27[index]['par'] = par;
                }
                this.twentysevenHoleTotalPar += parseInt(this.holeSetfor27[index]['par'] || 0)
                index++;
            }
        } else if (holeNo <= 36) {
            this.thirtySixHoleTotalPar = 0;
            for (let obj of this.holeSetfor36) {
                if (holeNo == obj.holeNo) {
                    this.holeSetfor36[index]['par'] = par;
                }
                this.thirtySixHoleTotalPar += parseInt(this.holeSetfor36[index]['par'] || 0)
                index++;
            }
        }
    }
    /**
     * onTeeInput
     */
    public onTeeInput(dist: any, tee_id: any, hole_id: any, holeSet: any) {

        if (holeSet == 9) {
            let hole = this.holeSetfor9.filter((hole) => { return hole.id == hole_id.id });
            hole[0]['teeDistances'][tee_id] = dist;
        } else if (holeSet == 18) {
            let hole = this.holeSetfor18.filter((hole) => { return hole.id == hole_id.id });
            hole[0]['teeDistances'][tee_id] = dist;
        } else if (holeSet == 27) {
            let hole = this.holeSetfor27.filter((hole) => { return hole.id == hole_id.id });
            hole[0]['teeDistances'][tee_id] = dist;
        } else if (holeSet == 36) {
            let hole = this.holeSetfor36.filter((hole) => { return hole.id == hole_id.id });
            hole[0]['teeDistances'][tee_id] = dist;
        }
    }
    private isIndexUnique(val: any, holes): boolean {
        // Extract index values from holeSetfor9
        const indexValues = holes.map(obj => obj['index']);

        // Check if the input value is unique
        return indexValues.indexOf(Number(val)) === indexValues.lastIndexOf(val);
    }
    private areIndexesUnique(...holeSets: any[][]): boolean {
        // Check uniqueness for each set of holes
        for (const holeSet of holeSets) {
            // Extract index values from the current holeSet
            const indexValues = holeSet.map(obj => Number(obj['index']));

            // Check if all index values are unique
            if (indexValues.length !== new Set(indexValues).size) {
                return false; // Return false if duplicates found
            }
        }

        // If all sets of holes have unique indexes, return true
        return true;
    }
    /**
     * onIndexInput
     */
    public onIndexInput(val: any, holeNo: any) {
        //console.log(holeNo);
        let index = 0;
        if (holeNo <= 9) {
            const isUnique = this.isIndexUnique(val, this.holeSetfor9);
            const spanElement = document.getElementById(`index_${holeNo}`);
            if (!isUnique && spanElement) {
                spanElement.style.backgroundColor = isUnique ? 'white' : 'red';
            }
            for (let obj of this.holeSetfor9) {
                if (holeNo == obj.holeNo) {
                    this.holeSetfor9[index]['index'] = val;
                    break;
                }
                index++;
            }

        } else if (holeNo <= 18) {
            const isUnique = this.isIndexUnique(val, this.holeSetfor18);
            const spanElement = document.getElementById(`index_${holeNo}`);
            if (!isUnique && spanElement) {
                spanElement.style.backgroundColor = isUnique ? 'white' : 'red';
            }
            for (let obj of this.holeSetfor18) {
                if (holeNo == obj.holeNo) {
                    this.holeSetfor18[index]['index'] = val;
                    break;
                }
                index++;
            }

        } else if (holeNo <= 27) {
            const isUnique = this.isIndexUnique(val, this.holeSetfor27);
            const spanElement = document.getElementById(`index_${holeNo}`);
            if (!isUnique && spanElement) {
                spanElement.style.backgroundColor = isUnique ? 'white' : 'red';
            }
            for (let obj of this.holeSetfor27) {
                if (holeNo == obj.holeNo) {
                    this.holeSetfor27[index]['index'] = val;
                    break;
                }
                index++;
            }

        } else if (holeNo <= 36) {
            const isUnique = this.isIndexUnique(val, this.holeSetfor36);
            const spanElement = document.getElementById(`index_${holeNo}`);
            if (!isUnique && spanElement) {
                spanElement.style.backgroundColor = isUnique ? 'white' : 'red';
            }
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
        //console.log(holeNo);

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
            //console.log(this.holeSetfor9);
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
            //console.log(this.holeSetfor9);
        }
    }
    selectionChangeDistance(event) {
        //console.log(event);

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
        let holesYardageToSave = [];
        let holesSet = [];
        const holeSets = [this.holeSetfor9, this.holeSetfor18, this.holeSetfor27, this.holeSetfor36];
        const isUnique = this.areIndexesUnique(...holeSets);
        if (isUnique) {
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
            console.log(holeObj);

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
                    let holeYards: any = General.getTeeYards(obj.teeDistances, this.Tee, this.courseID, obj.id)
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
                        // meta: { data: General.getTeeYards(obj.teeDistances, this.Tee,this.courseID) }
                    };

                    number++;
                    if (number % 9 == 0) {
                        counter++;
                    }
                    holesToSave.push(tee);
                    holesYardageToSave.push(holeYards);
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
            //console.log(holesToSave);
            //console.log(holesSet);
            console.log(holesYardageToSave);
            const mergedArray = [].concat(...holesYardageToSave);

            // Output the merged array
            console.log(mergedArray);

            let succees = <boolean>(
                await this.facadeService.saveCourseHoles(holesToSave, holesSet, mergedArray)
            );
            if (succees) {
                this.snackBar.open('Course Holes are Saves!', 'x', {
                    duration: 2000,
                });
                this.goToPanel('3')
                // if (this.NoOfHoles <= 18) {
                //     this.goToPanel('4')
                // } else {
                //     this.goToPanel('3')
                // }
            } else {
                this.snackBar.open('Course Holes has not Saved!', 'x', {
                    duration: 5000,
                });
            }
        } else {
            this.snackBar.open('Index duplicates!', 'x', {
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
                    ////console.log(id);

                    let holes = {
                        id: obj.holeSets,
                        displayName: obj.displayName,
                        backId: backId.id,
                        frontId: frontId.id,
                    };
                    this.Hole.push(holes);
                }
            }
            if (this.Hole.length == 0) {
                this.initializeHoleSet();
            }
        } else {
            for (let index = 0; index < 1; index++) {
                this.Hole[this.Hole.length] = [];
                this.Hole[this.Hole.length - 1]['id'] =
                    UniqueIdGenerator.generate();
                this.Hole[this.Hole.length - 1]['displayName'] = '';
                this.Hole[this.Hole.length - 1]['frontId'] = '';
                this.Hole[this.Hole.length - 1]['backId'] = '';
            }
        }

        //console.log(this.holeSetforSelect);
        //console.log(this.Hole);
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
        //console.log(this.Hole);
    }
    initializeHoleSet() {
        this.Hole[this.Hole.length] = [];
        this.Hole[this.Hole.length - 1]['id'] = UniqueIdGenerator.generate();
        this.Hole[this.Hole.length - 1]['displayName'] = 'Front-9 - Back-9';
        this.Hole[this.Hole.length - 1]['frontId'] = 1;
        this.Hole[this.Hole.length - 1]['backId'] = 2;
        //console.log(this.Hole);
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
        //console.log(this.Hole);
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
        //console.log(HoleSetObj);
        let saveTeeColor = <boolean>(
            await this.facadeService.saveCourseHolesSet(HoleSetObj)
        );
        if (saveTeeColor) {
            this.snackBar.open('Course HoleSets has been Saved!', 'x', {
                duration: 5000,
            });
            // 
            this.goToPanel('4');
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
        //console.log(this.holeMeta);
    }
    async getTeeMeta() {
        this.holes = this.tees['course'][0]['HolesQL'];
        let teesMeta = await this.facadeService.getCourseTeeMeta(this.courseID);
        //console.log(teesMeta);
        //console.log(teesMeta['hole_tee_meta']);
        //console.log(this.holes);

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
        //console.log(this.holeMeta);
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
        //console.log(teeObj);
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
        //console.log(this.coursRating);
    }

    deleteRating(id) {
        this.coursRating = this.coursRating.filter((rating) => rating.id !== id);
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
        //console.log(event);

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
        //console.log(rating);
        //console.log(this.tees);
        this.coursRating = [];
        this.showTees = [];
        let tee = this.tees['course'][0]['TeesQL'];
        for (let obj of tee) {
            let teeObj = {
                name: obj.name_by_club,
                id: obj.tee_id,
            };
            this.showTees.push(teeObj);
        }
        //console.log(this.showTees);

        let HolesSet = this.courseHoleSet['course_hole_sets'];
        this.holeSetforSelect = [];
        for (let index1 in HolesSet) {
            let hole = {
                id: HolesSet[index1]['holeSets'],
                displayName: HolesSet[index1]['displayName'],
            };
            this.holeSetforSelect.push(hole);
        }
        //console.log(this.holeSetforSelect);
        if (rating && rating['course_rating'].length > 0) {
            for (let obj of rating['course_rating']) {
                let teeObj = {
                    id: UniqueIdGenerator.generate(),
                    courseHoleSets: obj.courseHoleSets,
                    tee: obj.tee,
                    tee_id: obj.tee_id,
                    slopeRating: obj.slopeRating,
                    courseRating: obj.courseRating,
                    coursePar: obj.coursePar,
                    gender_id: obj.gender_id,
                };
                this.coursRating.push(teeObj);
            }
        } else {
            this.coursRating = this.populateRatings(tee, HolesSet)
        }
        //console.log(this.coursRating);


    }

    async savecoureRating() {
        let teeObj = [];
        //console.log(this.coursRating);
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
        //console.log(teeObj);

        let saveCourseRating = <boolean>(
            await this.facadeService.saveCourseRating(teeObj)
        );
        if (saveCourseRating) {
            this.snackBar.open('Course-Rating has been Saved!', 'x', {
                duration: 5000,
            });
            if (this.loggedInuser.userRole == 1) {
                this.goToPanel('5')
            } else {
                this.router.navigateByUrl('/courses');
            }
        } else {
            this.snackBar.open('Course-Rating has not Saved!', 'x', {
                duration: 5000,
            });
        }
    }

    populateRatings(tees, holeSets) {
        let finalArray = [];
        for (const tee of tees) {
            for (const holeSet of holeSets) {
                let mergedObj = {
                    id: UniqueIdGenerator.generate(),
                    courseHoleSets: holeSet.holeSets,
                    tee: tee.name_by_club,
                    tee_id: tee.tee_id,
                    slopeRating: 0,
                    courseRating: 0,
                    coursePar: 0,
                    gender_id: 'COMMON  ',
                };
                finalArray.push(mergedObj);
            }
        }

        return finalArray;
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
    getPanelInfo(id: string): any {

        return this.panels.find(panel => panel.id === id);
    }

    /**
   * Navigate to the panel
   *
   * @param panel
   */
    goToPanel(panel: string): void {
        this.nineHoleTotalPar = 0
        this.eighteenHoleTotalPar = 0
        this.twentysevenHoleTotalPar = 0
        this.thirtySixHoleTotalPar = 0
        this.selectedPanel = panel;
        if (panel == '1') {
            this.Tee = [];
            this.addIntialsTees();
        } else if (panel == '2') {
            this.setHoles(this.NoOfHoles);
        } else if (panel == '3') {
            //this.setCoursRating();
            this.getCourseHoleSets();
            // this.getTeeMeta();
            // this.showTees = [];
        } else if (panel == '4') {
            this.getCourseHoleSets();
            this.setCoursRating();
        } else if (panel == '5') {
            this.getTeeMeta();
        }
        // Close the drawer on 'over' mode
        if (this.drawerMode === 'over') {
            this.drawer.close();
        }
    }
}
