import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
    Player,
    IPlayerHandicapWhs,
    PlayerHanidcap,
    handicap_change_log,
} from '../../../../shared/models/player.model';
import { Flight } from '../../../../shared/models/flight.model';
import { Score } from '../../../../shared/models/score.model';
import { Hole } from '../../../../shared/models/hole.model';
import { CourseRating } from '../../../../shared/classes/course-rating';
import { Tournament } from '../../../../shared/models/tournament.model';
import { TournamentRoundScoresLoader } from '../../../../shared/helper/TournamentRoundScoresLoader';
import { PlayersWhsHandicapHistoryLoader } from '../../../../shared/helper/PlayersWhsHandicapHistoryLoader';
import { PlayerHandicapsMutation } from '../../../../shared/helper/PlayerHandicapsMutation';
import { PlayerHandicapWhsAllRounds } from '../../../../shared/classes/player-hanidcap-whs-all-rounds';
import { PlayerHandicapWhs } from '../../../../shared/classes/player-hanidcap-whs';
import { HandicapChangeLog } from '../../../../shared/classes/HandicapChangeLog';
import { FacadeService } from '../../../../shared/services/facade.service';
import {
    Constants,
    General,
    UniqueIdGenerator,
} from '../../../../shared/classes/general';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { of } from 'rxjs';

@Component({
    selector: 'app-handicap-calculation-whs',
    templateUrl: './handicap-calculation-whs.component.html',
    styleUrls: ['./handicap-calculation-whs.component.scss'],
})
export class HandicapCalculationWhsComponent implements OnInit {
    public tournament: Tournament;

    public handicapsWhs: PlayerHandicapWhsAllRounds[] = [];

    //private handicapsWhsRounds: any[] = []; //private SparseArray<ArrayList<PlayerHandicapWhs>> handicapsWhsRounds;
    private handicapsWhsRounds: Map<number, PlayerHandicapWhs[]> = new Map<
        number,
        PlayerHandicapWhs[]
    >();

    private playerHandicapIndices: Map<string, number>;

    private front9sOfPlayers: Map<string, PlayerHandicapWhs[]>;
    private back9sOfPlayers: Map<String, PlayerHandicapWhs[]>;

    private tournamentScoresLoader: TournamentRoundScoresLoader;
    private playersWhsHandicapHistoryLoader: PlayersWhsHandicapHistoryLoader;
    private playerHandicapsMutation: PlayerHandicapsMutation;

    private whsCalculatingRound: number;
    private scoresQuery: TournamentRoundScoresLoader;

    private Holes1to9: number = 1 << 0;
    private Holes10to18: number = 1 << 1;
    private Holes19to27: number = 1 << 2;
    private Holes28to36: number = 1 << 3;
    loggedInuser: Player;
    isLoading: boolean = true;
    isUpdated: boolean = false;
    tournamentRounds: number = 1;
    courseRatingDisplay: number = 0;
    slopeRatingDisplay: number = 0;
    selected: string = 'whs';
    handicapUpdated: boolean = true;

    // CONGU HANDICAP VARIABLES
    protected playerList: any[] = [];
    protected roundPlayerScores: any[] = [];
    private playerHandicapList: PlayerHanidcap[] = [];
    private handicapChangelogList: handicap_change_log[] = [];
    tournamentData: any;
    private playersCongu: Player[] = [];

    dataSource: MatTableDataSource<any>;
    dataSourceAllRounds: MatTableDataSource<any>;
    displayedColumns = [
        'id',
        'name',
        'oldhandicap',
        'scores',
        'adjustedScores',
        'handicapDifferential',
    ];
    displayedColumnsAllRounds = [
        'id',
        'name',
        'Round1',
        'Round2',
        'Round3',
        'Round4',
        'index',
    ];

    @ViewChild('paginatorLegal') paginator: MatPaginator;
    @ViewChild('dsort') sort: MatSort;

    @ViewChild('paginatorGSTN') Mempaginator: MatPaginator;
    @ViewChild('msort') Memsort: MatSort;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        public snackBar: MatSnackBar,
        public dialog: MatDialog,
        public facadeService: FacadeService
    ) {}

    applyFilter(filterValue: string) {
        filterValue = filterValue.trim(); // Remove whitespace
        filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
        this.dataSource.filter = filterValue;

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }
    applyFilterALLRound(filterValue: string) {
        filterValue = filterValue.trim(); // Remove whitespace
        filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
        this.dataSourceAllRounds.filter = filterValue;

        if (this.dataSourceAllRounds.paginator) {
            this.dataSourceAllRounds.paginator.firstPage();
        }
    }

    async ngOnInit() {
        let tournamentId: string;
        this.route.paramMap.subscribe((params) => {
            tournamentId = params.get('id');
        });

        this.loggedInuser = JSON.parse(
            localStorage.getItem(Constants.LOGGED_IN_USER)
        );

        //console.log(tournamentId);
        const tournamentInfo = await this.facadeService.getTournamentByID(
            tournamentId
        );
        //console.log(tournamentInfo.tournament[0]);

        this.tournamentScoresLoader = new TournamentRoundScoresLoader(
            tournamentInfo.tournament[0],
            this.facadeService
        );

        await this.tournamentScoresLoader.fetchTournamentScores();

        this.scoresQuery = this.tournamentScoresLoader;
        this.tournament = this.scoresQuery.getTournament();
        //console.log(this.scoresQuery);

        this.updateData();
    }

    private updateData(): void {
        let tournament: Tournament = this.tournament;
        //console.log(tournament);

        if (tournament['CourseQL']) {
            this.courseRatingDisplay = tournament['CourseQL'].courseRating;
            this.slopeRatingDisplay = tournament['CourseQL'].slopeRating;
        }
        let startDate: Date = tournament.startDate;
        let missingHoles: Map<string, Hole> = new Map<string, Hole>();

        let players: Map<string, Player> = this.scoresQuery.getPlayers();
        //console.log(players);
        let playerEntries = players.values();
        //console.log(playerEntries);
        let dateUpdate: Date = null;
        let noOfRounds: number = (this.tournamentRounds =
            tournament.noOfRounds);
        //if(tournament.id == "-MPnPjUzO1NvK0zK8DKu") noOfRounds = 2;
        // Calendar calendar = Calendar.getInstance();
        // calendar.setTime(startDate);
        let roundDate: Date;
        for (let round: number = 1; round <= noOfRounds; round++) {
            if (round > 1) {
                //calendar.add(Calendar.DATE, 1);
                //console.log(startDate);
                var d = new Date(startDate);
                d.setDate(d.getDate() + 1);
                startDate = d;
            }
            //console.log(startDate);
            roundDate = startDate; //calendar.getTime();

            let playerScores: Map<string, Score[]> =
                this.scoresQuery.getPlayerScores(round);
            //console.log(playerScores.size);
            if (playerScores.size == 0 && round == 1) {
                playerScores = this.scoresQuery.getPlayerScores(round - 1);
            }
            // console.log(round);
            // console.log(playerScores);

            let playerHandicapsWhs: Map<string, PlayerHandicapWhs> =
                this.scoresQuery.getPlayerHandicapsWhs(round);
            //console.log(playerHandicapsWhs);
            playerEntries = players.values();

            for (let playerEntry of Array.from(playerEntries)) {
                //console.log(playerEntry);
                let playerId: string = playerEntry.id; //playerEntry.getKey();
                let player = playerEntry; //playerEntry.getValue();
                let playerCategoryLowerCased: string =
                    player.playerCategory.toLowerCase();
                //console.log(player.playerCategory.toLocaleLowerCase());
                if (playerCategoryLowerCased.includes('professional')) {
                    // no handicap change for professionals
                    continue;
                }
                //console.log(playerScores);

                //console.log(round + " <---> " + playerId);
                //console.log(playerScores.size);
                //console.log(playerScores.get(playerId));
                let scoresList: Score[] =
                    playerScores.size > 0 && playerScores.get(playerId)
                        ? playerScores.get(playerId)
                        : [];
                //console.log(scoresList);
                if (scoresList == null || scoresList.length < 7) {
                    continue;
                }

                let playerName: string =
                    player.firstName + ' ' + player.lastName;

                let holes: Hole[] = this.scoresQuery.getHolesCopy();
                //console.log(holes);

                this.removeExtraHoleSetsForPlayer(playerId, round, holes);
                //console.log(holes);

                let holesPlayed: number = scoresList.length;
                let holesSize: number = holes.length;
                let hole9Set: number = 0;
                if (holesPlayed < 14 && holesSize > 9) {
                    // consider 9 holes played, must remove extra holes
                    hole9Set = this.adjustHolesAndScoresFor9HolesPlay(
                        holes,
                        scoresList
                    );
                    holesPlayed = scoresList.length;
                }
                //console.log(hole9Set);
                missingHoles.clear();
                for (let hole of holes) {
                    missingHoles.set(hole.id, hole);
                }

                let grossScores: number = 0;
                let adjustedScores: number = 0;
                let handicap: number = 0;
                //console.log(missingHoles);

                if (scoresList.length > 0) {
                    // holesPlayed = scoresList.length;
                    for (let score of scoresList) {
                        grossScores += score.grossScore;

                        adjustedScores +=
                            holesPlayed <= 9
                                ? this.getWhsAdjustedGrossScoreFor9Holes(
                                      score.playerHandicap,
                                      score.grossScore,
                                      score['HoleIPQL'].par,
                                      score['HoleIPQL'].index
                                  )
                                : this.getWhsAdjustedGrossScoreFor18Holes(
                                      score.playerHandicap,
                                      score.grossScore,
                                      score['HoleIPQL'].par,
                                      score['HoleIPQL'].index
                                  );
                        //console.log(adjustedScores);
                        handicap += score.playerHandicap;
                        //console.log(score.holeId + " removed from missing holes.");
                        missingHoles.delete(score.holeId);
                    }
                    handicap /= holesPlayed;
                    if (missingHoles.size > 0) {
                        let missingHolesValues = missingHoles.values();
                        for (let hole of Array.from(missingHolesValues)) {
                            // holes not played to be marked as net par
                            let strokes: number = this.getPlayerStrokes(
                                handicap,
                                hole.index
                            );
                            adjustedScores += hole.par + strokes;
                        }
                    }
                }
                //console.log(adjustedScores);
                //console.log(playerHandicapsWhs);
                let playerHandicapWhs: PlayerHandicapWhs =
                    playerHandicapsWhs.get(playerId);
                //console.log(playerHandicapWhs);

                if (playerHandicapWhs == null) {
                    //playerHandicapWhs = new PlayerHandicapWhs(playerId, playerName, player.handicap, -1, null, roundDate, grossScores, adjustedScores);
                    playerHandicapWhs = new PlayerHandicapWhs(
                        playerId,
                        playerName,
                        player.handicap,
                        -1,
                        null,
                        roundDate,
                        grossScores,
                        adjustedScores,
                        hole9Set == 1,
                        hole9Set == 2,
                        0
                    );
                    playerHandicapsWhs.set(playerId, playerHandicapWhs);
                    this.handicapUpdated = false;
                } else {
                    playerHandicapWhs.setScores(grossScores);
                    playerHandicapWhs.setAdjustedScores(adjustedScores);
                    if (dateUpdate == null) {
                        dateUpdate = playerHandicapWhs.getUpdatedAt();
                    }
                    playerHandicapsWhs.set(playerId, playerHandicapWhs);
                }
                // if(playerId === "-L7jCtTtLYs08sisy5lT")
                //     return;
            }
            //console.log(playerHandicapsWhs);
            //console.log(this.handicapsWhsRounds);

            let handicapWhsRound: PlayerHandicapWhs[] =
                this.handicapsWhsRounds.get(round);

            // for(let hWhsRound of Array.from(playerHandicapsWhs.values())) {
            //     handicapWhsRound.push(hWhsRound);
            // }

            //console.log(handicapWhsRound);
            // if (handicapWhsRound == null) {
            //     handicapWhsRound = []; //handicapWhsRound = new ArrayList<>();
            //     this.handicapsWhsRounds.set(round, handicapWhsRound);
            // }
            handicapWhsRound = [];
            handicapWhsRound = Array.from(playerHandicapsWhs.values());

            this.handicapsWhsRounds.set(round, handicapWhsRound);
        }

        //console.log(this.handicapsWhsRounds);

        let playerHandicapsWhsMapTemp: Map<String, PlayerHandicapWhsAllRounds> =
            new Map<String, PlayerHandicapWhsAllRounds>();
        for (let round = 1; round <= noOfRounds; round++) {
            let handicapWhsRound: PlayerHandicapWhs[] =
                this.handicapsWhsRounds.get(round);
            for (let playerHandicapWhs of handicapWhsRound) {
                //console.log(playerHandicapWhs);
                let playerId: string = playerHandicapWhs.getPlayerId();
                let playerHandicapWhsAllRounds: PlayerHandicapWhsAllRounds =
                    playerHandicapsWhsMapTemp.get(playerId);
                if (playerHandicapWhsAllRounds == null) {
                    playerHandicapWhsAllRounds = new PlayerHandicapWhsAllRounds(
                        playerId,
                        playerHandicapWhs.getName(),
                        playerHandicapWhs.getOldHandicap(),
                        noOfRounds
                    );
                    playerHandicapsWhsMapTemp.set(
                        playerId,
                        playerHandicapWhsAllRounds
                    );
                } else {
                    if (round == 2) {
                        console.log(
                            playerHandicapWhsAllRounds.getAdjustedScores(
                                round - 1
                            )
                        );
                        console.log(
                            playerHandicapWhsAllRounds.getAdjustedScores(round)
                        );
                    }
                }
                playerHandicapWhsAllRounds.setScore(
                    playerHandicapWhs.getScores(),
                    round
                );
                playerHandicapWhsAllRounds.setAdjustedScores(
                    playerHandicapWhs.getAdjustedScores(),
                    round
                );
                playerHandicapWhsAllRounds.setHandicapDifferential(
                    playerHandicapWhs.getHandicapDifferential()
                );
                playerHandicapWhsAllRounds.setHandicapIndex(
                    playerHandicapWhs.getHandicapIndex()
                );
            }
        }
        this.handicapsWhs = [];
        this.handicapsWhs = Array.from(playerHandicapsWhsMapTemp.values());
        //console.log(this.handicapsWhs);

        this.handicapsWhs.sort(this.ComparatorName);

        this.dataSourceAllRounds = new MatTableDataSource(this.handicapsWhs);
        this.dataSourceAllRounds.paginator = this.Mempaginator;
        this.dataSourceAllRounds.sort = this.Memsort;

        this.dataSource = new MatTableDataSource(this.handicapsWhs);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

        this.isLoading = false;
    }

    public removeExtraHoleSetsForPlayer(
        playerId: string,
        round: number,
        holes: Hole[]
    ): void {
        let flight: any = this.scoresQuery.getPlayerFlight(playerId, round);

        if (!flight && round == 1) {
            flight = this.scoresQuery.getPlayerFlight(playerId, round - 1);
        }

        if (flight == null || flight.courseHoleSets <= 0) {
            return;
        }
        let holes1to9: boolean = this.hasHoleSet1to9(flight);
        let holes10to18: boolean = this.hasHoleSet10to18(flight);
        let holes19to27: boolean = this.hasHoleSet19to27(flight);
        let holes28to36: boolean = this.hasHoleSet28to36(flight);
        for (let i = 0; i < holes.length; i++) {
            let holeNo: number = holes[i].holeNo;
            if (holeNo >= 1 && holeNo <= 9) {
                if (!holes1to9) {
                    holes.splice(i, 1); //holes.delete(hole[0]);
                    i--;
                }
            } else if (holeNo >= 10 && holeNo <= 18) {
                if (!holes10to18) {
                    holes.splice(i, 1);
                    i--;
                } else if (!holes1to9) {
                    holes[i].holeNo = holeNo - 9; //holes.get(hole[0]).setHoleNo(holeNo - 9);
                }
            } else if (holeNo >= 19 && holeNo <= 27) {
                if (!holes19to27) {
                    holes.splice(i, 1); //holes.delete(hole[0]);
                    i--;
                } else {
                    let setsToRemove: number =
                        (holes1to9 ? 0 : 1) + (holes10to18 ? 0 : 1);
                    if (setsToRemove > 0) {
                        holes[i].holeNo = holeNo - 9 * setsToRemove; //holes.get(hole[0]).setHoleNo(holeNo - 9 * setsToRemove);
                    }
                }
            } else if (holeNo >= 28 && holeNo <= 36) {
                if (!holes28to36) {
                    holes.splice(i, 1);
                    i--;
                } else {
                    let setsToRemove: number =
                        (holes1to9 ? 0 : 1) +
                        (holes10to18 ? 0 : 1) +
                        (holes19to27 ? 0 : 1);
                    if (setsToRemove > 0) {
                        holes[i].holeNo = holeNo - 9 * setsToRemove;
                    }
                }
            }
        }

        let holesCount = holes.length;
        if (holesCount == 9) {
            //Collections.sort(holes, (hole1, hole2) -> hole1.getIndex() - hole2.getIndex());
            holes = holes.sort(this.ComparatorHoleIndex);
            for (let i: number = 0; i < holesCount; i++) {
                holes[i].index = i + 1;
            }
            holes.sort(this.ComparatorHoles);
        } else if (holesCount == 18 && flight.courseHoleSetsInverted) {
            let holesToMove: number = 9;
            while (holesToMove > 0) {
                //holes.add(0, holes.remove(holesCount - 1));
                let removedHole = holes.splice(holesCount - 1, 1);
                holes.unshift(removedHole[0]);
                holesToMove -= 1;
            }

            for (let h of holes) {
                if (h.holeNo < 10) h.holeNo = h.holeNo + 9;
                else h.holeNo = h.holeNo - 9;
            }
        }
    }

    private adjustHolesAndScoresFor9HolesPlay(
        holes: Hole[],
        scoresList: Score[]
    ): number {
        let holesSize: number = holes.length;
        let holesCompleted: boolean[] = new Array(holesSize);

        for (var i = 0; i < holesCompleted.length; i++)
            holesCompleted[i] = false;

        for (let score of scoresList) {
            let holeId: string = score.holeId;
            for (let i: number = 0; i < holesSize; i++) {
                if (holes[i].id === holeId) {
                    holesCompleted[i] = true;
                    break;
                }
            }
        }
        let holeSet: number = 0;
        let completedFront9: boolean = true;
        for (let i: number = 0; i < 9 && i < holesSize; i++) {
            if (!holesCompleted[i]) {
                completedFront9 = false;
                break;
            }
        }
        let removedHoles: boolean = false;
        if (completedFront9) {
            holeSet = 1;
            while (holes.length > 9) {
                holes.splice(holes.length - 1, 1); //holes.remove(holes.size() - 1);
                removedHoles = true;
            }
        } else {
            let completedBack9: boolean = true;
            for (let i: number = 9; i < 18 && i < holesSize; i++) {
                if (!holesCompleted[i]) {
                    completedBack9 = false;
                    break;
                }
            }
            if (completedBack9) {
                holeSet = 2;
                while (holes.length > 9) {
                    holes.splice(0, 1); //holes.remove(0);
                    removedHoles = true;
                }
            }
        }
        if (removedHoles) {
            holesSize = holes.length;
            loop: for (let i: number = 0; i < scoresList.length; i++) {
                let holeId: string = scoresList[i].holeId;
                for (let j: number = 0; j < holesSize; j++) {
                    if (holes[j].id === holeId) {
                        continue loop;
                    }
                }
                scoresList.splice(i, 1); //scoresList.remove(i);
                i--;
            }
        }
        return holeSet;
    }

    private getPlayerStrokes(playerHandicap: number, holeIndex: number) {
        let strokes: number = Math.floor(playerHandicap / 18);
        let mod: number = Math.floor(playerHandicap % 18);
        if (mod >= holeIndex) {
            strokes += 1;
        }
        return strokes;
    }

    public getWhsAdjustedGrossScoreFor18Holes(
        playerHandicap: number,
        playerScore: number,
        holePar: number,
        holeIndex: number
    ): number {
        let handicap: number = playerHandicap;
        let score: number = playerScore;
        let par: number = holePar;

        if (score <= 0) {
            // holes not played to be marked as net par
            let strokes: number = this.getPlayerStrokes(handicap, holeIndex);
            return par + strokes;
        }
        if (handicap <= 9) {
            return Math.min(score, par + 2);
        } else if (handicap <= 19) {
            return Math.min(score, 7);
        } else if (handicap <= 29) {
            return Math.min(score, 8);
        } else if (handicap <= 39) {
            return Math.min(score, 9);
        } else {
            return Math.min(score, 10);
        }
    }

    public getWhsAdjustedGrossScoreFor9Holes(
        playerHandicap: number,
        playerScore: number,
        holePar: number,
        holeIndex: number
    ): number {
        let handicap: number = playerHandicap;
        let score: number = playerScore;
        let par: number = holePar;
        if (score <= 0) {
            // holes not played to be marked as net par
            let strokes: number = this.getPlayerStrokes(handicap, holeIndex);
            return par + strokes;
        }
        if (handicap <= 4) {
            return Math.min(score, par + 2);
        } else if (handicap <= 9) {
            return Math.min(score, 7);
        } else if (handicap <= 14) {
            return Math.min(score, 8);
        } else if (handicap <= 19) {
            return Math.min(score, 9);
        } else {
            return Math.min(score, 10);
        }
    }

    calculateHandicap(): void {
        this.whsCalculatingRound = 1;
        this.playerHandicapIndices = new Map<string, number>();
        this.updateWhsHandicaps();
        this.setupCONGUHandicap();
    }

    private updateWhsHandicaps(): void {
        if (this.whsCalculatingRound > this.tournament.noOfRounds) {
            this.updatedWhHandicaps();
            return;
        }
        let handicapsWhsRound: PlayerHandicapWhs[] =
            this.handicapsWhsRounds.get(this.whsCalculatingRound);
        //console.log(handicapsWhsRound);
        if (handicapsWhsRound == null) {
            this.updatedWhHandicaps();
            return;
        }
        let date: Date = this.getTodayDate();
        let courseRating: number = 72.6; //this.scoresQuery.getCourseRating();
        let coursePar: number = 72; //this.scoresQuery.getCoursePar();
        let slopeRating: number = 131; //this.scoresQuery.getSlopeRating();
        // Handicap Differential = (Adjusted Gross Score - Course Rating) X 113 รท Slope Rating
        for (let playerHandicapWhs of handicapsWhsRound) {
            if (playerHandicapWhs.getScores() <= 0) {
                continue;
            }
            let flight: Flight = this.scoresQuery.getPlayerFlight(
                playerHandicapWhs.getPlayerId(),
                this.whsCalculatingRound
            );
            if (!flight && this.whsCalculatingRound == 1) {
                flight = this.scoresQuery.getPlayerFlight(
                    playerHandicapWhs.getPlayerId(),
                    this.whsCalculatingRound - 1
                );
            }

            let rating: CourseRating =
                this.scoresQuery.getCourseRatingByFlight(flight);
            console.log('rating');
            console.log(rating);
            if (rating == null) {
                if (flight == null) {
                    rating = new CourseRating(
                        this.tournament.courseId,
                        Constants.DEFAULT_TEE,
                        0,
                        courseRating,
                        slopeRating,
                        coursePar
                    );
                } else {
                    rating = new CourseRating(
                        this.tournament.courseId,
                        flight.tee,
                        flight.courseHoleSets,
                        courseRating,
                        slopeRating,
                        coursePar
                    );
                }
            }
            let handicapDifferential: number =
                (playerHandicapWhs.getAdjustedScores() -
                    rating.getCourseRating()) *
                (113.0 / rating.getSlopeRating());
            handicapDifferential = General.truncateDecimals(
                handicapDifferential,
                2
            );

            playerHandicapWhs.setHandicapDifferential(
                Number(handicapDifferential)
            );
            playerHandicapWhs.setUpdatedAt(date);
            console.log(playerHandicapWhs);
        }

        //mutation().savePlayerWhsHandicapsForRound(tournament.getId(), handicapsWhsRound, whsCalculatingRound, mutationResponseSavePlayerWhsHandicaps);

        //if(this.tournament && (this.tournament.clubId == "-MX5z42VVuYx0cV1CmOX" || this.tournament.clubId == "-MX62FWAPOgTOm0CCgA3" || this.tournament.clubId == "-LXJoCjyCi2CCRohUB5z" || this.tournament.clubId == "-L6W3NMaquXx0dJougVv" || this.tournament.clubId == "-LUFS3FAg4OEhIiK0vgY")) {
        this.savePlayerWhsHandicapsForRound(
            this.tournament.id,
            handicapsWhsRound,
            this.whsCalculatingRound
        );
        //}

        this.loadWhsHandicapHistory();
    }

    savePlayerWhsHandicapsForRound(
        tournamentId: string,
        handicapsWhs: PlayerHandicapWhs[],
        round: number
    ) {
        console.log(handicapsWhs);

        let handicapWhsInputs: any[] = [];

        for (let handicap of handicapsWhs) {
            if (handicap.getScores() <= 0) {
                continue;
            }

            let handicapWhsInput = {
                playerId: handicap.getPlayerId(),
                tournamentId: tournamentId,
                round: round,
                handicapDifferential: handicap.getHandicapDifferential(),
                updatedAt: handicap.getUpdatedAt(),
                playedAt: handicap.getPlayedAt(),
                score: handicap.getScores(),
                adjustedScore: handicap.getAdjustedScores(),
                front9: false,
                back9: false,
                handicapIndex: handicap.getHandicapIndex()
                    ? handicap.getHandicapIndex()
                    : 0,
                exceptionalScore: 0,
            };
            handicapWhsInputs.push(handicapWhsInput);
        }

        this.facadeService.savePlayerWhsHandicapsForRound(handicapWhsInputs);
    }

    private async loadWhsHandicapHistory() {
        if (this.whsCalculatingRound > this.tournament.noOfRounds) {
            this.updatedWhHandicaps();
            return;
        }
        //console.log(this.handicapsWhsRounds);
        let handicapsWhsRound: PlayerHandicapWhs[] =
            this.handicapsWhsRounds.get(this.whsCalculatingRound);
        //console.log(handicapsWhsRound);
        if (handicapsWhsRound == null) {
            this.updatedWhHandicaps();
            return;
        }
        let playerIds: string[] = [];
        for (let playerHandicapWhs of handicapsWhsRound) {
            if (playerHandicapWhs.getUpdatedAt() == null) {
                continue;
            }
            playerIds.push(playerHandicapWhs.getPlayerId());
        }
        let playingDate: Date = this.tournament.startDate;
        if (this.whsCalculatingRound > 1) {
            // Calendar calendar = Calendar.getInstance();
            // calendar.setTime(playingDate);
            // calendar.add(Calendar.DATE, whsCalculatingRound - 1);
            //playingDate = calendar.getTime();
            var d = new Date(playingDate);
            d.setDate(d.getDate() + (this.whsCalculatingRound - 1));
            playingDate = d;
        }
        // leagueHandicapHistoryQuery().resetParams();
        // leagueHandicapHistoryQuery().setParams(playerIds, playingDate);
        // leagueHandicapHistoryQuery().addListener(getClass().getSimpleName(), queryListenerWhsHandicapHistory);

        this.playersWhsHandicapHistoryLoader =
            new PlayersWhsHandicapHistoryLoader(this.facadeService);
        await this.playersWhsHandicapHistoryLoader.resetParams();

        await this.playersWhsHandicapHistoryLoader.setParams(
            playerIds,
            playingDate
        );

        this.loadedWhsHandicapHistory();
    }

    private loadedWhsHandicapHistory(): void {
        if (this.whsCalculatingRound > this.tournament.noOfRounds) {
            this.updatedWhHandicaps();
            return;
        }
        let playerHandicapsWhs: PlayerHandicapWhs[] =
            this.handicapsWhsRounds.get(this.whsCalculatingRound);
        //console.log(playerHandicapsWhs);
        if (playerHandicapsWhs == null) {
            this.updatedWhHandicaps();
            return;
        }
        if (this.playerHandicapIndices == null) {
            this.playerHandicapIndices = new Map<string, number>();
        }
        if (this.front9sOfPlayers != null) {
            this.front9sOfPlayers.clear();
        }
        if (this.back9sOfPlayers != null) {
            this.back9sOfPlayers.clear();
        }
        for (let handicapWhs of playerHandicapsWhs) {
            //console.log(handicapWhs.getUpdatedAt());
            if (handicapWhs.getUpdatedAt() == null) {
                continue;
            }
            let playerId: string = handicapWhs.getPlayerId();
            //console.log(playerId);
            let mapPlayerWhsHandicapHistory =
                this.playersWhsHandicapHistoryLoader.getPlayerWhsHandicapHistory(
                    playerId
                );
            //console.log(mapPlayerWhsHandicapHistory);
            let playerWhsHandicapHistory: PlayerHandicapWhs[] = [];

            for (let hWhsRound of mapPlayerWhsHandicapHistory
                ? Array.from(mapPlayerWhsHandicapHistory.values())
                : []) {
                playerWhsHandicapHistory.push(hWhsRound);
            }

            if (
                playerWhsHandicapHistory == null ||
                playerWhsHandicapHistory.length < 1
            ) {
                continue;
            }
            this.combine9HoleScorecards(playerWhsHandicapHistory, playerId);
            //List<PlayerHandicapWhs> playerHandicapWhsList = playerWhsHandicapHistory.subList(0, Math.min(20, handicapsCount));
            let playerHandicapWhsList: PlayerHandicapWhs[] =
                playerWhsHandicapHistory.slice(0, 20);
            let handicapsAvailable: number = playerHandicapWhsList.length;
            let handicapsToUse: number;
            switch (handicapsAvailable) {
                // Original Table before change
                // case 20: handicapsToUse = 10; break;
                // case 19: handicapsToUse = 9; break;
                // case 18: handicapsToUse = 8; break;
                // case 17: handicapsToUse = 7; break;
                // case 16: case 15: handicapsToUse = 6; break;
                // case 14: case 13: handicapsToUse = 5; break;
                // case 12: case 11: handicapsToUse = 4; break;
                // case 10: case 9: handicapsToUse = 3; break;
                // case 8: case 7: handicapsToUse = 2; break;
                // default: handicapsToUse = 1; break;
                case 20:
                    handicapsToUse = 8;
                    break;
                case 19:
                    handicapsToUse = 7;
                    break;
                case 18:
                case 17:
                    handicapsToUse = 6;
                    break;
                case 16:
                case 15:
                    handicapsToUse = 5;
                    break;
                case 14:
                case 13:
                case 12:
                    handicapsToUse = 4;
                    break;
                case 11:
                case 10:
                case 9:
                    handicapsToUse = 3;
                    break;
                case 8:
                case 7:
                case 6:
                    handicapsToUse = 2;
                    break;
                default:
                    handicapsToUse = 1;
                    break;
            }

            // // Sort by handicap differential asc
            // Collections.sort(playerHandicapWhsList, (playerHandicapWhs1, playerHandicapWhs2) -> {
            //     double difference = playerHandicapWhs1.getHandicapDifferential() - playerHandicapWhs2.getHandicapDifferential();
            //     return difference < 0 ? -1 : difference > 0 ? 1 : 0;
            // });
            playerHandicapWhsList = playerHandicapWhsList.sort(this.Comparator);
            let sumOfLowestHandicaps: number = 0;
            for (let i = 0; i < handicapsToUse; i++) {
                let playerHandicapWhs: PlayerHandicapWhs =
                    playerHandicapWhsList[i]; //playerHandicapWhsList.get(i);
                sumOfLowestHandicaps +=
                    playerHandicapWhs.getHandicapDifferential();
            }
            let averageOfLowestHandicaps: number =
                sumOfLowestHandicaps / handicapsToUse;

            // It was happening as per old formula
            //let fractionOfAverage: number = averageOfLowestHandicaps * 0.96;
            //let truncatedToTenthDecimal: number = (fractionOfAverage * 10) / 10;

            let truncatedToTenthDecimal: number =
                (averageOfLowestHandicaps * 10) / 10;
            let handicapIndex: number = Math.max(0, truncatedToTenthDecimal);
            this.playerHandicapIndices.set(playerId, handicapIndex);
        }
        let handicapWhsInputs: any[] = [];
        for (let playerHandicap of this.handicapsWhs) {
            //Double handicapIndex = leagueMemberHandicapIndices.get(playerHandicap.getPlayerId());
            let handicapIndex: number = this.playerHandicapIndices.get(
                playerHandicap.getPlayerId()
            );
            if (handicapIndex != null) {
                playerHandicap.setHandicapIndex(handicapIndex);

                let handicapWhsInput = {
                    playerId: playerHandicap.getPlayerId(),
                    tournamentId: this.tournament.id,
                    round: this.whsCalculatingRound,
                    handicapDifferential:
                        playerHandicap.getHandicapDifferential(),
                    updatedAt: '2021-05-05',
                    playedAt: '2021-05-05',
                    score: playerHandicap.getScore(this.whsCalculatingRound),
                    adjustedScore: playerHandicap.getAdjustedScores(
                        this.whsCalculatingRound
                    ),
                    front9: false,
                    back9: false,
                    handicapIndex: handicapIndex ? handicapIndex : 0,
                    exceptionalScore: 0,
                };
                handicapWhsInputs.push(handicapWhsInput);
            }
        }

        if (handicapWhsInputs.length > 0)
            this.facadeService.savePlayerHandicapWhsIndex(handicapWhsInputs);

        if (this.whsCalculatingRound < this.tournament.noOfRounds) {
            this.updateWhsScores();
        } else {
            let players: Map<string, Player> = this.scoresQuery.getPlayers();
            let playersList: Player[] = [];
            let changeLogs: HandicapChangeLog[] = [];
            let changeLogRemarks: string = 'Handicap Calculation from Web';
            let tournamentId: string = this.tournament.id;
            let updaterId: string = this.loggedInuser.id;
            //Set<Map.Entry<String, Double>> entries = playerHandicapIndices.entrySet();
            //console.log(this.playerHandicapIndices);
            let entries = this.playerHandicapIndices.entries();
            //console.log(entries);
            for (let entry of Array.from(entries)) {
                let player: Player = players.get(entry[0]);
                if (player != null) {
                    let handicapWhsIndexOld: number = player.handicapWhsIndex;
                    let handicapWhsIndex: number = entry[1]; //entry.getValue();
                    player.handicapWhsIndex = handicapWhsIndex;

                    let clonePlayer: any = Object.assign({}, player);
                    delete clonePlayer.membership;
                    delete clonePlayer.__typename;
                    delete clonePlayer.handicapQL;

                    playersList.push(clonePlayer);
                    let handicapOld: number = 0;
                    if (handicapWhsIndexOld != null) {
                        handicapOld = handicapWhsIndexOld;
                    }
                    let handicap: number = 0;
                    if (handicapWhsIndex != null) {
                        handicap = handicapWhsIndex;
                    }
                    if (handicapOld != handicap) {
                        changeLogs.push(
                            new HandicapChangeLog(
                                UniqueIdGenerator.generate(),
                                player.id,
                                handicapOld,
                                handicap,
                                true,
                                changeLogRemarks,
                                tournamentId,
                                updaterId
                            )
                        );
                    }
                }
            }
            //console.log(playersList);
            //console.log(changeLogs);
            //mutation().savePlayersHandicapWhsIndex(playersList, changeLogs, mutationResponseSaveWhsHandicaps);
            //if(this.tournament && (this.tournament.clubId == "-MX5z42VVuYx0cV1CmOX" || this.tournament.clubId == "-MX62FWAPOgTOm0CCgA3" || this.tournament.clubId == "-LXJoCjyCi2CCRohUB5z" || this.tournament.clubId == "-L6W3NMaquXx0dJougVv" || this.tournament.clubId == "-LUFS3FAg4OEhIiK0vgY")) {
            this.facadeService.savePlayersHandicapWhsIndex(
                playersList,
                changeLogs
            );
            //}
            this.updatedWhHandicaps();
            //window.location.reload();
        }
    }

    private combine9HoleScorecards(
        playerWhsHandicapHistory: Array<PlayerHandicapWhs>,
        playerId: string
    ) {
        //console.log(playerWhsHandicapHistory);
        for (let i: number = playerWhsHandicapHistory.length; i >= 0; i--) {
            let playerHandicapWhs: PlayerHandicapWhs =
                playerWhsHandicapHistory[i - 1];
            //console.log(playerHandicapWhs);
            let courseId: string = playerHandicapWhs
                ? playerHandicapWhs.getCourseId()
                : '';
            console.log(courseId);
            if (!courseId) return;
            if (playerHandicapWhs.isFront9()) {
                let back9s: Array<PlayerHandicapWhs> = this.back9sOfPlayers.get(
                    playerId + courseId
                );
                if (back9s == null || back9s.length == 0) {
                    let front9s: Array<PlayerHandicapWhs> =
                        this.front9sOfPlayers.get(playerId + courseId);
                    if (front9s == null) {
                        front9s = [];
                        this.front9sOfPlayers.set(playerId + courseId, front9s);
                    }

                    //front9s.push(playerWhsHandicapHistory.remove(i - 1));
                    let getRemovedElement: any =
                        playerWhsHandicapHistory.splice(i - 1, 1); // need to debug
                    front9s.push(getRemovedElement);
                    continue;
                }
                let back9: PlayerHandicapWhs[] = back9s.splice(0, 1); //back9s.remove(0); need to debug
                if (back9) {
                    playerHandicapWhs.addScores(back9[0].getScores());
                    playerHandicapWhs.addAdjustedScores(
                        back9[0].getAdjustedScores()
                    );
                }

                let rating: CourseRating = playerHandicapWhs.getCourseRating();
                let handicapDifferential: number;
                if (rating != null) {
                    handicapDifferential =
                        (playerHandicapWhs.getAdjustedScores() -
                            rating.getCourseRating()) *
                        (113.0 / rating.getSlopeRating());
                } else {
                    handicapDifferential =
                        playerHandicapWhs.getAdjustedScores() - 72;
                }
                handicapDifferential = General.precisionRound(
                    handicapDifferential,
                    2
                );
                playerHandicapWhs.setHandicapDifferential(handicapDifferential);
            }
            if (playerHandicapWhs.isBack9()) {
                let front9s: Array<PlayerHandicapWhs> =
                    this.front9sOfPlayers.get(playerId + courseId);
                if (front9s == null || front9s.length == 0) {
                    let back9s: Array<PlayerHandicapWhs> =
                        this.back9sOfPlayers.get(playerId + courseId);
                    if (back9s == null) {
                        back9s = [];
                        this.back9sOfPlayers.set(playerId + courseId, back9s);
                    }
                    //back9s.push(playerWhsHandicapHistory.remove(i - 1));
                    let getRemovedElement: any =
                        playerWhsHandicapHistory.splice(i - 1, 1); // need to debug
                    back9s.push(getRemovedElement);
                    continue;
                }
                //let front9 = front9s.remove(0);
                //playerHandicapWhs.addScores(front9.getScores());
                let front9: PlayerHandicapWhs[] = front9s.splice(0, 1); //back9s.remove(0); need to debug
                if (front9.length > 0) {
                    playerHandicapWhs.addScores(front9[0].getScores());
                    playerHandicapWhs.addAdjustedScores(
                        front9[0].getAdjustedScores()
                    );
                }

                let rating: CourseRating = playerHandicapWhs.getCourseRating();
                let handicapDifferential: number;
                if (rating != null) {
                    handicapDifferential =
                        (playerHandicapWhs.getAdjustedScores() -
                            rating.getCourseRating()) *
                        (113.0 / rating.getSlopeRating());
                } else {
                    handicapDifferential =
                        playerHandicapWhs.getAdjustedScores() - 72;
                }
                handicapDifferential = General.precisionRound(
                    handicapDifferential,
                    2
                );
                playerHandicapWhs.setHandicapDifferential(handicapDifferential);
            }
        }
    }

    private updateWhsScores() {
        if (this.whsCalculatingRound >= this.tournament.noOfRounds) {
            this.updatedWhHandicaps();
            return;
        }
        let tournament: Tournament = this.scoresQuery.getTournament();
        if (tournament == null) {
            return;
        }
        let round: number = this.whsCalculatingRound + 1;

        let startDate: Date = tournament.startDate;
        // Calendar calendar = Calendar.getInstance();
        // calendar.setTime(startDate);
        // calendar.add(Calendar.DATE, whsCalculatingRound);
        // Date roundDate = calendar.getTime();
        var d = new Date(startDate);
        d.setDate(d.getDate() + Number(this.whsCalculatingRound));
        startDate = d;
        //startDate.setDate(startDate.getDate() + this.whsCalculatingRound);
        let roundDate: Date = startDate;

        let missingHoles: Map<string, any> = new Map<string, any>();

        let players: Map<string, Player> = this.scoresQuery.getPlayers();
        let playerEntries = players.values();
        let playerScores: Map<string, Score[]> =
            this.scoresQuery.getPlayerScores(round);
        let handicapsWhsRound: PlayerHandicapWhs[] =
            this.handicapsWhsRounds.get(round);
        let handicapsWhsRoundMapTemp: Map<string, PlayerHandicapWhs> = new Map<
            string,
            PlayerHandicapWhs
        >();
        for (let playerHandicapWhs of handicapsWhsRound) {
            handicapsWhsRoundMapTemp.set(
                playerHandicapWhs.getPlayerId(),
                playerHandicapWhs
            );
        }

        let courseRating: number = this.scoresQuery.getCourseRating();
        let coursePar: number = this.scoresQuery.getCoursePar();
        let slopeRating: number = this.scoresQuery.getSlopeRating();

        for (let entry of Array.from(playerEntries)) {
            let playerId: string = entry.id;
            let player: Player = entry;
            let playerCategoryLowerCased: string =
                player.playerCategory.toLowerCase();
            if (playerCategoryLowerCased.includes('professional')) {
                // no handicap change for professionals
                continue;
            }

            //let scoresList: Score[] = Array.from(playerScores.get(playerId));
            let scoresList: Score[] =
                playerScores.size > 0 && playerScores.get(playerId)
                    ? playerScores.get(playerId)
                    : [];

            //console.log(scoresList);
            if (scoresList == null || scoresList.length < 7) {
                continue;
            }

            let playerName: string = player.firstName + ' ' + player.lastName;

            let holes: Hole[] = this.scoresQuery.getHolesCopy();
            this.removeExtraHoleSetsForPlayer(playerId, round, holes);

            let holesPlayed: number = scoresList.length;
            let holesSize: number = holes.length;
            let hole9Set: number = 0;
            if (holesPlayed < 14 && holesSize > 9) {
                // consider 9 holes played, must remove extra holes
                hole9Set = this.adjustHolesAndScoresFor9HolesPlay(
                    holes,
                    scoresList
                );
                holesPlayed = scoresList.length;
            }

            missingHoles.clear();

            for (let hole of holes) {
                missingHoles.set(hole.id, hole);
            }

            let handicapPlaying: number = -1;
            let handicapIndexCalculated: number =
                this.playerHandicapIndices.get(playerId);

            if (handicapIndexCalculated != null) {
                let newHandicap: number;
                let flight: Flight = this.scoresQuery.getPlayerFlight(
                    playerId,
                    this.whsCalculatingRound
                );

                let rating: CourseRating =
                    this.scoresQuery.getCourseRatingByFlight(flight);
                if (rating != null) {
                    newHandicap =
                        handicapIndexCalculated *
                            (rating.getSlopeRating() / 113.0) +
                        (rating.getCourseRating() - rating.getCoursePar());
                } else {
                    newHandicap =
                        handicapIndexCalculated * (slopeRating / 113.0) +
                        (courseRating - coursePar);
                }
                handicapPlaying = Math.round(newHandicap);
            }

            let grossScores: number = 0;
            let adjustedScores: number = 0;
            let handicap: number = 0;
            for (let score of scoresList) {
                if (handicapPlaying >= 0) {
                    score.playerHandicap = handicapPlaying;
                }
                grossScores += score.grossScore;
                adjustedScores +=
                    holesPlayed <= 9
                        ? this.getWhsAdjustedGrossScoreFor9Holes(
                              score.playerHandicap,
                              score.grossScore,
                              score['HoleIPQL'].par,
                              score['HoleIPQL'].index
                          )
                        : this.getWhsAdjustedGrossScoreFor18Holes(
                              score.playerHandicap,
                              score.grossScore,
                              score['HoleIPQL'].par,
                              score['HoleIPQL'].index
                          );
                handicap += score.playerHandicap;
                missingHoles.delete(score.holeId);
            }
            handicap /= holesPlayed;

            if (missingHoles.size > 0) {
                let missingHolesValues = missingHoles.values();
                for (let hole of Array.from(missingHolesValues)) {
                    // holes not played to be marked as net par
                    let strokes: number = this.getPlayerStrokes(
                        handicap,
                        hole.index
                    );
                    adjustedScores += hole.par + strokes;
                }
            }

            let playerHandicapWhs: PlayerHandicapWhs =
                handicapsWhsRoundMapTemp.get(playerId);
            if (playerHandicapWhs == null) {
                playerHandicapWhs = new PlayerHandicapWhs(
                    playerId,
                    playerName,
                    player.handicap,
                    -1,
                    null,
                    roundDate,
                    grossScores,
                    adjustedScores,
                    hole9Set == 1,
                    hole9Set == 2
                );
                handicapsWhsRoundMapTemp.set(playerId, playerHandicapWhs);
            } else {
                playerHandicapWhs.setScores(grossScores);
                playerHandicapWhs.setAdjustedScores(adjustedScores);
            }
        }

        handicapsWhsRound = [];
        handicapsWhsRound = Array.from(handicapsWhsRoundMapTemp.values());

        for (let playerHandicapWhs of handicapsWhsRound) {
            let playerId: string = playerHandicapWhs.getPlayerId();
            for (let playerHandicapWhsAllRounds of this.handicapsWhs) {
                if (playerHandicapWhsAllRounds.getPlayerId() !== playerId) {
                    continue;
                }
                playerHandicapWhsAllRounds.setScore(
                    playerHandicapWhs.getScores(),
                    round
                );
                playerHandicapWhsAllRounds.setAdjustedScores(
                    playerHandicapWhs.getAdjustedScores(),
                    round
                );
                break;
            }
        }
        //Collections.sort(handicapsWhs); // need discussion
        this.handicapsWhs.sort(this.ComparatorName);
        this.whsCalculatingRound += 1;
        this.updateWhsHandicaps();
    }

    private updatedWhHandicaps(): void {
        let dateUpdate: Date = null;
        let noOfRounds = this.tournament.noOfRounds;
        for (let round = 1; round <= noOfRounds; round++) {
            let playerHandicapsWhs: PlayerHandicapWhs[] =
                this.handicapsWhsRounds.get(round);
            for (let handicap of playerHandicapsWhs) {
                dateUpdate = handicap.getUpdatedAt();
                if (dateUpdate != null) {
                    return;
                }
            }
        }
        //setUpdatedAt(dateUpdate);
    }

    private getTodayDate(): Date {
        let today: Date = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();

        let todayDate: Date = General.parseToDate(mm + '/' + dd + '/' + yyyy);
        return todayDate;
    }

    Comparator(playerHandicapWhs1, playerHandicapWhs2) {
        let difference: number =
            playerHandicapWhs1.getHandicapDifferential() -
            playerHandicapWhs2.getHandicapDifferential();
        return difference < 0 ? -1 : difference > 0 ? 1 : 0;
    }

    ComparatorName(a, b) {
        if (a.name < b.name) return -1;
        if (a.name > b.name) return 1;
        return 0;
    }

    public hasHoleSet1to9(flight: Flight): boolean {
        return (
            flight.courseHoleSets > 0 &&
            (flight.courseHoleSets & this.Holes1to9) != 0
        );
    }

    public hasHoleSet10to18(flight: Flight): boolean {
        return (
            flight.courseHoleSets > 0 &&
            (flight.courseHoleSets & this.Holes10to18) != 0
        );
    }

    public hasHoleSet19to27(flight: Flight): boolean {
        return (
            flight.courseHoleSets > 0 &&
            (flight.courseHoleSets & this.Holes19to27) != 0
        );
    }

    public hasHoleSet28to36(flight: Flight): boolean {
        return (
            flight.courseHoleSets > 0 &&
            (flight.courseHoleSets & this.Holes28to36) != 0
        );
    }

    switchHandicapSystem(item) {
        //this.router.navigate(['/tournaments/handicap/' + this.tournament.id]);
        window.location.href = '/tournaments/handicap/' + this.tournament.id;
    }

    setupCONGUHandicap() {
        let tournamentId = '';
        this.route.paramMap.subscribe((params) => {
            tournamentId = params.get('id');
        });

        console.log(tournamentId);
        if (tournamentId) {
            of(this.tournamentData)
                .pipe()
                .subscribe(async (data) => {
                    let dataFullTournament =
                        await this.facadeService.tournamentScoreLoader(
                            tournamentId
                        );

                    console.log(dataFullTournament);

                    if (dataFullTournament.TournamentQL) {
                        this.tournamentData = dataFullTournament.TournamentQL;
                        this.isLoading = false;

                        let noOfRounds = this.tournamentData.noOfRounds;

                        for (let i = 1; i <= noOfRounds; i++) {
                            this.parseTournamentScores(i);
                        }

                        if (this.roundPlayerScores.length > 0)
                            this.calculateCONGUHandicap();

                        //this.dataSource = new MatTableDataSource(this.playerList);
                        //this.dataSource.paginator = this.paginator;
                        //this.dataSource.sort = this.sort;
                    }

                    console.log(this.tournamentData);
                });
        }
    }

    parseTournamentScores(round: number) {
        let flightsQLs = this.tournamentData.FlightsQL;

        let roundFlights = flightsQLs.filter((a) => {
            return a.flightRound == round;
        });

        if (this.tournamentData.singleRound && roundFlights.length == 0) {
            roundFlights = flightsQLs.filter((a) => {
                return a.flightRound == round - 1;
            });
        }

        let roundList: any = [];

        for (let flightsQL of roundFlights) {
            let membersQLs: any = flightsQL.MembersQL;
            for (let membersQL of membersQLs) {
                let playerId: string = membersQL.playerId;

                let exist = roundList.find((p) => {
                    return p.id == playerId;
                });

                //console.log(exist);
                if (exist) continue;

                let playerQL: Player = membersQL.PlayerQL;

                // sum of scores and par of played holes
                let scores: number = 0;
                let par: number = 0;
                let oldHandicap: number = -1;
                let latestHandicap: number = -1;
                let dateUpdate: Date;
                let scoresList: any[] = membersQL.ScoresQL;
                let holesPlayed: number =
                    scoresList && scoresList.length > 0 ? scoresList.length : 0;

                let playerCategoryLowerCased: string =
                    playerQL.playerCategory.toLowerCase();
                if (playerCategoryLowerCased.includes('professional')) {
                    // no handicap change for professionals
                    continue;
                }

                if (scoresList == null || scoresList.length == 0) {
                    continue;
                }

                if (scoresList != null) {
                    for (let score of scoresList) {
                        scores += score.grossScore;
                        par += score.HoleIPQL.par;
                    }
                }

                // get existing player handicap object of this player...
                let playerHandicapQL: any =
                    this.tournamentData.PlayerHandicapsQL;

                if (playerHandicapQL.length > 0) {
                    console.log(playerHandicapQL);

                    let currentHandicapList = playerHandicapQL.filter((a) => {
                        return a.playerId == playerId;
                    });

                    for (let handicap of currentHandicapList) {
                        console.log(handicap);
                        dateUpdate = handicap.updatedAt;
                        latestHandicap = handicap.handicap;
                        oldHandicap = handicap.oldHandicap;
                    }

                    this.isUpdated = true;
                } else this.isUpdated = false;

                console.log(this.isUpdated);

                // set sum of scores and par in player handicap object of this player
                let hanidcapList: any = {
                    id: playerId,
                    name: playerQL.firstName + ' ' + playerQL.lastName,
                    oldhandicap:
                        oldHandicap == -1 ? playerQL.handicap : oldHandicap,
                    handicap: latestHandicap,
                    updatedAt: dateUpdate
                        ? General.parseToDate(dateUpdate.toString())
                        : '',
                    scores: scores,
                    par: par,
                    player: playerQL,
                    holesPlayed: holesPlayed,
                    isCompleted: holesPlayed == 18 ? true : false,
                };
                // playerHandicap.setScores(scores);
                // playerHandicap.setPar(par);

                let found = this.playerList.find((p) => {
                    return p.id == playerId;
                });

                if (!found) this.playerList.push(hanidcapList);

                roundList.push(hanidcapList);
            }
        }

        if (roundList.length > 0) this.roundPlayerScores.push(roundList);
        console.log(this.roundPlayerScores);
    }

    calculateCONGUHandicap() {
        let date: Date = new Date();
        //let players: Hash<String, Player> = scoresQuery().getPlayers();
        let tournamentId = '';
        this.route.paramMap.subscribe((params) => {
            tournamentId = params.get('id');
        });

        let changeLogs: Array<handicap_change_log> =
            new Array<handicap_change_log>();
        let changeLogRemarks: string = 'Handicap Calculation from Web';

        this.loggedInuser = JSON.parse(
            localStorage.getItem(Constants.LOGGED_IN_USER)
        );

        let updaterId: string = this.loggedInuser.id;

        // Formula CONGO
        // 1. Get Buffer and Multiplier according to handicap zone
        // Zone 1: Handicap between 0 - 4.4, Buffer = 1, Multiplier = 0.1
        // Zone 2: Handicap between 4.5 - 9.4, Buffer = 2, Multiplier = 0.2
        // Zone 3: Handicap between 9.5 - 18.4, Buffer = 3, Multiplier = 0.3
        // Zone 4: Handicap between 18.5 - 36.4, Buffer = 5, Multiplier = 0.5
        // 2. Find score difference between player total net score and course par
        // ScoreDiff = NetScore - CoursePar
        // 3. If ScoreDiff > Buffer, then
        // NewHandicap = OldHandicap + 0.1
        // 4. Else if ScoreDiff < 0, then
        // NewHandicap = OldHandicap + (ScoreDiff * Multiplier)

        // Zone 1: 0 - 4.4, above buffer 1 (+0.1), below par (-0.1 x scoreDiff)
        // Zone 2: 4.5 - 9.4, above buffer 2 (+0.1), below par (-0.2 x scoreDiff)
        // Zone 3: 9.5 - 18.4, above buffer 3 (+0.1), below par (-0.3 x scoreDiff)
        // Zone 4: 18.5 - 36.4, above buffer 5 (+0.1), below par (-0.5 x scoreDiff)

        let bdIncrement: number = 0.1;
        let bdDecrementZone1: number = 0.1;
        let bdDecrementZone2: number = 0.2;
        let bdDecrementZone3: number = 0.3;
        let bdDecrementZone4: number = 0.5;
        let bdDecrement: number;
        let noOfRounds: number = this.tournamentData.noOfRounds;

        for (let playerHandicapList of this.playerList) {
            let handicap: number = playerHandicapList.oldhandicap;
            let netScore: number = 0;
            for (let i = 1; i <= noOfRounds; i++) {
                let roundPlyerList = this.roundPlayerScores[i - 1];

                if (!roundPlyerList) {
                    continue;
                }

                let playerHandicap = roundPlyerList.find((a) => {
                    return a.id == playerHandicapList.id;
                });
                if (!playerHandicap || !playerHandicap.isCompleted) {
                    continue;
                }

                let veteran9Holes: boolean = false;
                if (
                    playerHandicap.holesPlayed == 9 &&
                    playerHandicap.player.playerCategory
                        .toLowerCase()
                        .search('veteran') != -1
                )
                    veteran9Holes = true;

                let zoneHandicap: number = handicap;
                if (veteran9Holes) {
                    zoneHandicap *= 0.5; // use half handicap
                    if (playerHandicap.holesPlayed < 9) {
                        if (zoneHandicap == 4.5) {
                            zoneHandicap = 4;
                        } else if (zoneHandicap == 9.5) {
                            zoneHandicap = 9;
                        } else if (zoneHandicap == 18.5) {
                            zoneHandicap = 18;
                        }
                    }
                }
                let netTotal =
                    playerHandicap.scores - General.precisionRound(handicap, 0);
                let scoreDiff: number = netTotal - playerHandicap.par;
                if (scoreDiff >= 0) {
                    let buffer: number;
                    if (zoneHandicap < 4.5) {
                        // Zone 1
                        buffer = 1;
                    } else if (zoneHandicap < 9.5) {
                        // Zone 2
                        buffer = 2;
                        if (veteran9Holes) {
                            buffer = 1; // use half buffer
                        }
                    } else if (zoneHandicap < 18.5) {
                        // Zone 3
                        buffer = 3;
                        if (veteran9Holes) {
                            buffer = 2; // use half buffer
                        }
                    } else {
                        // Zone 4
                        buffer = 5;
                        if (veteran9Holes) {
                            buffer = 3; // use half buffer
                        }
                    }
                    if (scoreDiff > buffer) {
                        handicap = handicap + bdIncrement;
                    }
                } else {
                    while (scoreDiff < 0) {
                        // must do this in loop as zone could change during the calculation
                        if (zoneHandicap < 4.5) {
                            // Zone 1
                            bdDecrement = bdDecrementZone1;
                        } else if (zoneHandicap < 9.5) {
                            // Zone 2
                            bdDecrement = bdDecrementZone2;
                        } else if (zoneHandicap < 18.5) {
                            // Zone 3
                            bdDecrement = bdDecrementZone3;
                        } else {
                            // Zone 4
                            bdDecrement = bdDecrementZone4;
                        }
                        handicap = handicap - bdDecrement;

                        zoneHandicap = General.truncateDecimals(handicap, 2);
                        scoreDiff += 1;
                    }
                }
                playerHandicap.handicap = General.precisionRound(handicap, 1);
                netScore = netScore + netTotal;
            }
            playerHandicapList.handicap =
                handicap < 0 ? 0 : General.precisionRound(handicap, 1);
            playerHandicapList.updatedAt = General.parseToDate(
                date.toDateString()
            );

            //playerHandicap.player.handicap = Math.round(handicap);
            playerHandicapList.player.handicap = General.precisionRound(
                handicap,
                1
            );
            delete playerHandicapList.player.membership;
            delete playerHandicapList.player.__typename;

            let handicaps: PlayerHanidcap = {
                playerId: playerHandicapList.id,
                tournamentId: tournamentId,
                handicap: playerHandicapList.handicap,
                oldHandicap: playerHandicapList.oldhandicap,
                updatedAt: playerHandicapList.updatedAt,
                score: netScore,
            };

            let handicaplog: handicap_change_log = {
                id: UniqueIdGenerator.generate(),
                playerId: playerHandicapList.id,
                tournamentId: tournamentId,
                newHandicap: playerHandicapList.handicap,
                oldHandicap: playerHandicapList.oldhandicap,
                dateTime: playerHandicapList.updatedAt,
                whs: false,
                remarks: 'CONGU handicap updated',
                updaterId: this.loggedInuser.id,
            };

            let clonePlayer = Object.assign({}, playerHandicapList.player);
            delete clonePlayer.handicapQL;
            console.log(clonePlayer);
            this.handicapChangelogList.push(handicaplog);
            this.playersCongu.push(clonePlayer);

            this.playerHandicapList.push(handicaps);
        }

        console.log(this.playersCongu);
        console.log(this.playerHandicapList);
        this.facadeService.savePlayerHandicaps(
            this.playerHandicapList,
            this.playersCongu,
            this.handicapChangelogList
        );
        this.isUpdated = true;
    }

    ComparatorHoleIndex(hole1, hole2) {
        return hole1.index - hole2.index;
    }

    ComparatorHoles(a, b) {
        if (a['holeNo'] < b['holeNo']) return -1;
        if (a['holeNo'] > b['holeNo']) return 1;
        return 0;
    }
}
