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
    ViewEncapsulation,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { FlightScores } from '../../../../shared/classes/FlightScores';
import "jspdf-autotable";
import * as jsPDF from "jspdf";
import {
    Constants,
    General,
    handicapAllocation,
} from '../../../../shared/classes/general';

import {
    Player,
    PlayerWHSHanidcap,
} from '../../../../shared/models/player.model';
import { Score } from '../../../../shared/classes/score';
import { FacadeService } from '../../../../shared/services/facade.service';
import { Flight } from '../../../../shared/models/flight.model';
import { formatDate, Location } from '@angular/common';
import { EMLINK } from 'constants';
import { TemplatePortal } from '@angular/cdk/portal';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { MatDrawerToggleResult } from '@angular/material/sidenav';
import { debounceTime, Subject, takeUntil } from 'rxjs';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { HandicapsComponent } from '../WHS/handicaps.component';
@Component({
    selector: 'app-player-handicap',
    templateUrl: './player-handicaps.component.html',
})
export class PlayerHandicapComponent implements OnInit {
    cardsrc = 'assets/images/cards/01-320x200.png';
    WHSSource: MatTableDataSource<any>;
    WHSColumns = [
        'id',
        'playedAt',
        /* "round", */
        'score',
        'adjustedScore',
        'handicapDifferential',
        'handicapIndex',
    ];
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    clubTitle: any;
    handicapsToUse: number;
    private _tagsPanelOverlayRef: OverlayRef;
    private playerID: string;
    loggedInuser: Player;
    currentPlayer: Player;
    playerFlightScores: FlightScores[] = [];
    isLoading: boolean = true;
    redTeeHI: number;
    blueTeeHI: number;
    whiteTeeHI: number;
    blackTeeHI: number;
    playerHandiData: any;
    handicapHistory: any[] = [];
    handicapHistoryDate: any[] = [];
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    currentPlayerHandicap: any;
    length: any;
    personLeads: any;
    memerbershipNumber: any;
    showTable: Promise<any>;
    fullName: string;
    playerWHSRound: any;
    playerWHS: PlayerWHSHanidcap;
    playerWHSHistory: any;
    palyerWHSHandDif: number;
    topDiff: any;
    bottomDiff: any;
    topDiff20: any;
    bottomDiff20: any;
    playerHandicapWhsList: any[] = [];
    usedForHandicap = [];
    handicapsAvailable: number;
    constructor(
        private location: Location,
        public snackBar: MatSnackBar,
        public dialog: MatDialog,
        private _activatedRoute: ActivatedRoute,
        private _changeDetectorRef: ChangeDetectorRef,
        private _handicapComponent: HandicapsComponent,
        private _facadeService: FacadeService,
        private _router: Router
    ) {}

    async ngOnInit() {
        this.loggedInuser = JSON.parse(
            localStorage.getItem(Constants.LOGGED_IN_USER)
        );

        this._activatedRoute.paramMap.subscribe((params) => {
            this.showTable = Promise.resolve(false);
            this.playerID = params.get('id');
            this.fecthData();
        });
    }

    async fecthData() {
        if (this.loggedInuser) {
            let clubInfo: any =
                this.loggedInuser.membership.length > 0
                    ? this.loggedInuser.membership[0].club
                    : null;

            console.log(clubInfo);

            this.clubTitle = clubInfo ? clubInfo.name : '';
        }

        if (this.playerID) {
            this._handicapComponent.matDrawer.open();
            // this.currentPlayerHandicap = <Player>(
            //   await this.facadeService.getPlayerByID(this.playerID)
            // );
            // console.log(this.currentPlayerHandicap);
            let club: any = this.loggedInuser.membership[0].club;
            let courseID =
                club.courses.length > 0
                    ? club.courses[0].id
                    : '-LUFS3FCQKOGpJ2IEHmf';
            let courseRating: any = {
                courseId: courseID,
                courseHoleSets: 3,
            };
            let playerscore=<Player> await this._facadeService
                .getPlayerByID(this.playerID)
            console.log(playerscore);

            this.playerWHS = await this._facadeService.getPlayerWHS(
                this.playerID
            );
            console.log(this.playerWHS);
            this.currentPlayer = playerscore['player'];
           
            this.playerWHSHistory =
                this.playerWHS['PlayerQL'].HandicapHistoryWhsQL;
            console.log(this.playerWHSHistory);

            this.usedForHandicap =
                this.playerWHSHistory &&
                this.playerWHSHistory.length > 0 &&
                this.playerWHSHistory[0]
                    ? this.playerWHSHistory[0].used_handicaps
                    : [];

            this.playerHandicapWhsList = this.playerWHSHistory.slice(0, 40);
            this.topDiff20 =
                this.playerHandicapWhsList.length > 0
                    ? this.playerHandicapWhsList[0].handicapDifferential
                    : null;
            console.log('Lowest Handicap=' + this.topDiff20);

            this.topDiff = this.playerHandicapWhsList.sort(
                this.ComparatorHandicapDifferentialAsc
            );

            this.handicapsAvailable = this.playerHandicapWhsList.length;

            switch (this.handicapsAvailable) {
                case 20:
                    this.handicapsToUse = 8;
                    break;
                case 19:
                    this.handicapsToUse = 7;
                    break;
                case 18:
                case 17:
                    this.handicapsToUse = 6;
                    break;
                case 16:
                case 15:
                    this.handicapsToUse = 5;
                    break;
                case 14:
                case 13:
                case 12:
                    this.handicapsToUse = 4;
                    break;
                case 11:
                case 10:
                case 9:
                    this.handicapsToUse = 3;
                    break;
                case 8:
                case 7:
                case 6:
                    this.handicapsToUse = 2;
                    break;
                case 5:
                case 4:
                case 3:
                    this.handicapsToUse = 1;
                    break;
                default:
                    this.handicapsToUse = 0;
                    break;
            }
            this.topDiff =
                this.topDiff.length > this.handicapsToUse
                    ? this.topDiff[this.handicapsToUse].handicapDifferential
                    : 0;
            // console.log('TopDiffer' + this.topDiff);
            // console.log('Available Handicaps' + this.playerHandicapWhsList);
            // console.log('Available Handicaps' + this.handicapsAvailable);
            // console.log('Available Handicaps' + this.handicapsToUse);
            console.log(this.playerWHSHistory);
            // let slicedWhs = this.playerWHSHistory.slice(0, 20);
            let slicedWhs = [];
            let count = 0;
            this.memerbershipNumber =
                this.playerWHS['PlayerQL'].membershipNumber;
            this.fullName =
                this.playerWHS['PlayerQL'].firstName +
                ' ' +
                this.playerWHS['PlayerQL'].lastName;
            for (let obj of this.playerWHSHistory) {
                count++;
                console.log(obj);

                if (count <= 20) {
                    slicedWhs.push(obj);
                }
                if (count == 20) {
                    break;
                }
            }
            console.log(slicedWhs);
            for (let whsItem in slicedWhs) {
                if (slicedWhs[+whsItem].combined_handicap) {
                    slicedWhs.splice(
                        +whsItem + 1,
                        0,
                        slicedWhs[whsItem].combined_handicap
                    );
                    slicedWhs[+whsItem].combined_handicap = null;
                    slicedWhs[+whsItem].noBorder = true;
                    slicedWhs[+whsItem].highlight = true;
                    slicedWhs[+whsItem + 1].highlight = true;
                }

                // if(slicedWhs[+whsItem].is_combined)
                //   slicedWhs.splice(+whsItem, 1);
            }
            console.log(slicedWhs);
            this.length = slicedWhs.length;

            this.personLeads = slicedWhs.filter(function (a) {
                return !a.is_combined;
            }, 0);
            console.log(this.personLeads);

            this.WHSSource = new MatTableDataSource(this.personLeads);

            this.WHSSource.paginator = this.paginator;
            this.WHSSource.sort = this.sort;
            this.isLoading = false;
            this.playerWHSRound = await this._facadeService.getPlayerWHSRound(
                courseRating
            );
          
            console.log(this.playerWHS);
            console.log(this.playerWHSRound);
            let handicapIndex = this.currentPlayer[0]['handicapWhsIndex'];
            let rating = this.playerWHSRound['course_rating'];
            for (let item of rating) {
                let slopeRating = item['slopeRating'];
                let courseRating = item['courseRating'];
                let coursePar = item['coursePar'];
                if (item['tee'] == 'WHITE') {
                    this.whiteTeeHI =
                        (handicapIndex * (slopeRating / 113.0) +
                            (courseRating - coursePar)) *
                        0.95;
                    this.whiteTeeHI = Math.round(this.whiteTeeHI);
                } else if (item['tee'] == 'BLACK') {
                    this.blackTeeHI =
                        (handicapIndex * (slopeRating / 113.0) +
                            (courseRating - coursePar)) *
                        0.95;
                    this.blackTeeHI = Math.round(this.blackTeeHI);
                } else if (item['tee'] == 'BLUE') {
                    this.blueTeeHI =
                        (handicapIndex * (slopeRating / 113.0) +
                            (courseRating - coursePar)) *
                        0.95;
                    this.blueTeeHI = Math.round(this.blueTeeHI);
                } else if (item['tee'] == 'RED') {
                    this.redTeeHI =
                        (handicapIndex * (slopeRating / 113.0) +
                            (courseRating - coursePar)) *
                        0.95;
                    this.redTeeHI = Math.round(this.redTeeHI);
                }
            }
            console.log(this.redTeeHI);
            console.log(this.blackTeeHI);
            console.log(this.whiteTeeHI);
            console.log(this.blueTeeHI);
            this.showTable = Promise.resolve(true);
            let newScores: any[] = [];

            let flag: boolean = false;
        } else {
            this.location.back();
        }
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();

        //Dispose the overlays if they are still on the DOM
        if (this._tagsPanelOverlayRef) {
            this._tagsPanelOverlayRef.dispose();
        }
    }
    /**
     * Close the drawer
     */
    closeDrawer(): Promise<MatDrawerToggleResult> {
        return this._handicapComponent.matDrawer.close();
    }
    ComparatorHandicapDifferentialAsc(a, b) {
        if (a['handicapDifferential'] < b['handicapDifferential']) return -1;
        if (a['handicapDifferential'] > b['handicapDifferential']) return 1;
        return 0;
    }
    isHandicapUsed(id: string) {
        //console.log(this.usedForHandicap);
        let used: boolean = this.usedForHandicap.some((handicap) => {
            return (
                handicap.used_handicap_id == id ||
                handicap.combine_handicap_id == id
            );
        });
        return used;
    }
    cancel() {
        this._router.navigate(['../'], { relativeTo: this._activatedRoute });
    }
   
    public downloadAsPDFWHS() {
        var doc = new jsPDF();
        var col = [
            'Sr.',
            'Mem.No',
            'Date',
            'Score',
            'Adj.Score',
            'h/diff',
            'h/index',
        ];
        var rows = [];
        var rows = [];
        doc.setFontSize(17);
        doc.text(
            'WHS-Handicap Change-Log of ' +
                this.currentPlayer[0].firstName +
                ' ' +
                this.currentPlayer[0].lastName,
            14,
            15
        );
        doc.setFontSize(18);
        // doc.setTextColor(100);

        let count = 0;
        this.personLeads.forEach((element) => {
            count++;
            // let flag = true;
            // if (element.combined_handicap_id) {

            //   for (let index in this.personLeads) {
            //     if (this.personLeads[index].Handicap_id==element.combined_handicap_id) {
            //       this.personLeads[index].noBorder=false;
            //       element.noBorder=false;
            //       break;
            //     }
            //   }

            // }
            let used: boolean = this.usedForHandicap.some((handicap) => {
                return (
                    handicap.used_handicap_id == element.Handicap_id ||
                    handicap.combine_handicap_id == element.Handicap_id
                );
            });

            var temp = [
                count,
                this.currentPlayer[0].membershipNumber,
                formatDate(
                    element.tournamentQL.startDate,
                    'mediumDate',
                    'en-US'
                ),
                element.score,
                element.adjustedScore,
                Math.round(element.handicapDifferential * 10) / 10,
                Math.round(element.handicapIndex * 10) / 10,
                element.highlight,
                used,
            ];
            rows.push(temp);
        });
        // From HTML
        let a = 1;
        doc.autoTable(col, rows, {
            startY: 25,
            theme: 'grid',
            didParseCell: function (data) {
                if (data.row.raw[7] == true) {
                    data.cell.styles.fillColor = [195, 249, 230];
                }
                a++;
                if (data.row.raw[8] == true && a == 5) {
                    data.cell.styles.fillColor = [249, 187, 147];
                    //console.log(1);
                    //a=false;
                }
                if (data.row.index == 1) {
                    //console.log('assssssssssss');
                }
                console.log(data.row.index);

                //console.log(a);
            },
        });
        // doc.autoTable({
        //   html: "#pdfTable",
        //   startY: 25,
        //   theme: "grid",
        // });
        // Open PDF document in new tab
        doc.output('dataurlnewwindow');

        // Download PDF document
        //doc.save('flights.pdf');
    }
}
