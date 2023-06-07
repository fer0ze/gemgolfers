import { Injectable, Injector } from "@angular/core";
import { ClubsService } from "../../shared/services/clubs.service";
import { CoursesService } from "../../shared/services/courses.service";
import { PlayersService } from "../../shared/services/players.service";
import { FlightsService } from "../../shared/services/flights.service";
import { MatchplayService } from "../../shared/services/matchplay.service";
import { TournamentsService } from "../../shared/services/tournaments.service";
import { TeamsLeaderboardService } from "../../shared/services/teams-leaderboard.service";
import { TeeTimeService } from "../../shared/services/teetime.service";
import { PlayerHandicapWhsService } from "../../shared/services/player-handicap-whs.service";

import { Club, ClubSchedule } from "../../shared/models/club.model";
import {
  Player,
  PlayerHanidcap,
  Marshal,
  ClubMembership,
  handicap_change_log,
} from "../../shared/models/player.model";
import {
  AddDailyRound,
  Tournament,
  TournamentCategory,
  TournamentMember,
} from "../../shared/models/tournament.model";
import { Score } from "../../shared/models/score.model";
import { Flight, FlightMembers } from "../models/flight.model";
import { TeeTime } from "../models/teetime.model";
import { TournamentOpponentQL } from "../fragments/tournament.fragment";

@Injectable({
  providedIn: "root",
})
export class FacadeService {
  constructor(private injector: Injector) {}

  private _clubService: ClubsService;

  public get clubService(): ClubsService {
    if (!this._clubService) {
      this._clubService = this.injector.get(ClubsService);
    }
    return this._clubService;
  }

  getClubList() {
    return this.clubService.getClubsList();
  }
  getPGFClubList(id: string) {
    return this.clubService.getPGFClubsList(id);
  }

  AddClub(club: Club) {
    return this.clubService.AddClub(club);
  }

  AddClubSchedule(schedule: ClubSchedule) {
    return this.clubService.AddClubSchedule(schedule);
  }
  getAllFeedback() {
    return this.clubService.getAllFeedback();
  }
  updateClub(club: Club) {
    return this.clubService.updateClub(club);
  }

  deleteClub(id: string) {
    return this.clubService.deleteClub(id);
  }

  getClubByID(id: string) {
    return this.clubService.getClubByID(id);
  }

  getScheduleList(clubId: string) {
    return this.clubService.getScheduleList(clubId);
  }

  findOne(id: string) {
    return this.clubService.findOne(id);
  }

  getClubMemberAggregateByCategroy(id: string) {
    return this.clubService.getClubMemberAggregateByCategroy(id);
  }
  getClubMemberAggregateByCategroyDashBoard(id: string) {
    return this.clubService.getClubMemberAggregateByCategroyDashBoard(id);
  }
  getClubMemberAggregateByCategroyDashBoardAll() {
    return this.clubService.getClubMemberAggregateByCategroyDashBoardAll();
  }

  private _courseService: CoursesService;

  public get courseService(): CoursesService {
    if (!this._courseService) {
      this._courseService = this.injector.get(CoursesService);
    }
    return this._courseService;
  }

  getCoursesList() {
    return this.courseService.getCoursesList();
  }

  getCourseByID(id: string) {
    return this.courseService.getCourseByID(id);
  }
  getCourseByIDForForm(id: string) {
    return this.courseService.getCourseByIDForForm(id);
  }

  getCourseByClub(id: string) {
    return this.courseService.getCourseByClub(id);
  }

  getCourseInformation(id: string) {
    return this.courseService.getCourseInformation(id);
  }
  getCourseTeeMeta(id: string) {
    return this.courseService.getCourseTeeMeta(id);
  }

  getCourseInformationForForm(id: string) {
    return this.courseService.getCourseInformationForForm(id);
  }
  getCourseRating(id: string) {
    return this.courseService.getCourseRating(id);
  }

  getCourseHoles(id: string) {
    return this.courseService.getCourseHoles(id);
  }

  getCourseHoleSets(id: string) {
    return this.courseService.getCourseHoleSets(id);
  }
  // getCourseHoleSetsSimple(id: string) {
  //   return this.courseService.getCourseHoleSetsForCourse(id);
  // }
  getCourseHoleSetsForCourse(id: string) {
    return this.courseService.getCourseHoleSetsForCourse(id);
  }
  getCourseHoleSetsForCourseForm(id: string) {
    return this.courseService.getCourseHoleSetsForCourseForm(id);
  }

  AddCourse(course) {
    return this.courseService.AddCourse(course);
  }
  updateCourse(course: any, holesToSave: any) {
    return this.courseService.updateCourse(course, holesToSave);
  }

  saveTeeColor(tee: any[]) {
    return this.courseService.saveTeeColor(tee);
  }
  deleteTeeColor(courseID:any,tee: any[]) {
    return this.courseService.deleteTeeColor(courseID,tee);
  }

  saveCourseHoles(holes: any[], holeSets: any[]) {
    return this.courseService.saveHolesANDholeSets(holes, holeSets);
  }
  saveCourseHolesSet(holeSets: any[]) {
    return this.courseService.saveholeSets(holeSets);
  }
  saveCourseMetaSet(holeSets: any[]) {
    return this.courseService.saveCourseMetaSet(holeSets);
  }
  saveCourseRating(holeSets: any[]) {
    return this.courseService.saveCourseRating(holeSets);
  }
  getTeesOfCourse(courseId: any) {
    return this.courseService.getTeesOfCourse(courseId);
  }
  getCourseHole(courseId: any) {
    return this.courseService.getCourseHole(courseId);
  }

  private _playerService: PlayersService;

  public get playerService(): PlayersService {
    if (!this._playerService) {
      this._playerService = this.injector.get(PlayersService);
    }
    return this._playerService;
  }

  getPlayersList() {
    return this.playerService.getPlayersList();
  }
  getPlayersListReport() {
    return this.playerService.getPlayersListReport();
  }
  getPlayersListByAdminCONGU() {
    return this.playerService.getPlayersListByAdminCONGU();
  }
  getPlayersListMerge() {
    return this.playerService.getPlayersListMerge();
  }

  getPlayersListByClub(id: string) {
    return this.playerService.getPlayersListByClub(id);
  }
  getPlayersListForTournament(id: string) {
    return this.playerService.getPlayersListForTournament(id);
  }
  getPlayersListByClubCONGU(id: string) {
    return this.playerService.getPlayersListByClubCONGU(id);
  }
  getPlayersListByClubOnlyWHS(id: string) {
    return this.playerService.getPlayersListByClubOnlyWHS(id);
  }
  getTotalPlayers(id: string) {
    return this.playerService.getTotalPlayers(id);
  }
  getTotalPlayersAll() {
    return this.playerService.getTotalPlayersAll();
  }
  getallPlayersforGGid() {
    return this.playerService.getallPlayersforGGid();
  }

  mergePlayers(oldPlayerId:string,newPlayerId:string){
    return this.playerService.mergeProfiles(oldPlayerId,newPlayerId)
  }

  getPlayerHandicapListByPlayer(
    playerId: string,
    fromDate: string,
    toDate: string
  ) {
    return this.playerService.getPlayerHandicapListByPlayerId(
      playerId,
      fromDate,
      toDate
    );
  }

  getPlayersListByClubAndCategory(id: string, category: string) {
    return this.playerService.getPlayersListByClubAndCategory(id, category);
  }

  getPlayerByID(id: string) {
    return this.playerService.getPlayerByID(id);
  }
  getPlayerByIDDetailForm(id: string) {
    return this.playerService.getPlayerByIDDetailForm(id);
  }

  getPlayerByGEMID(GEMID: string) {
    return this.playerService.getPlayerByGEMID(GEMID);
  }

  getPlayerByPhone(phone: string) {
    return this.playerService.getPlayerByPhone(phone);
  }

  getPlayerByEmail(email: string) {
    return this.playerService.getPlayerByEmail(email);
  }
  getPlayerByEmailLogin(email: string) {
    return this.playerService.getPlayerByEmailLogin(email);
  }

  getPlayerByMembershipNumberForSearch(
    clubID: string,
    membershipNumber: string
  ) {
    return this.playerService.getPlayerByMembershipNumberForSearch(
      clubID,
      membershipNumber
    );
  }
  getPlayerByMembershipNumber(membershipNumber: any) {
    return this.playerService.getPlayerByMembershipNumber(membershipNumber);
  }

  getPlayerByCategory(category: string) {
    return this.playerService.getPlayerByCategory(category);
  }

  getPlayerByClub(clubId: string) {
    return this.playerService.getPlayerByClub(clubId);
  }

  AddPlayer(club: Player) {
    return this.playerService.AddPlayer(club);
  }

  AddHandicapRemarks(handicap_change_log: handicap_change_log) {
    return this.playerService.AddHandicapRemarks(handicap_change_log);
  }

  importPlayerList(players: any[], clubMembers: any[]) {
    return this.playerService.importPlayerList(players, clubMembers);
  }

  updatePlayer(club: Player) {
    return this.playerService.updatePlayer(club);
  }
  getTotalFlightPlayed(club: any, fromDate: string, toDate: string) {
    return this.playerService.getTotalFlightPlayed(club, fromDate, toDate);
  }

  getTotalFlightsPlayedByPlayer(id: string) {
    return this.playerService.getTotalFlightsPlayedByPlayer(id);
  }
  getTotalFlightPlayedAdmin( fromDate: string, toDate: string) {
    return this.playerService.getTotalFlightPlayedAdmin( fromDate, toDate);
  }

  deletePlayer(clubId: string, playerId: string) {
    return this.playerService.deletePlayer(clubId, playerId);
  }

  getPlayerCategories() {
    return this.playerService.getPlayerCategories();
  }

  getPlayerFlightScores(id: string) {
    return this.playerService.getPlayerFlightScores(id);
  }

  getAllPlayersByCategory() {
    return this.playerService.getAllPlayersByCategory();
  }

  getPlayerHandicapListByClub(clubId: string) {
    return this.playerService.getPlayerHandicapListByClub(clubId);
  }

  createTournamentMarshals(marshals: Marshal[]) {
    return this.playerService.createTournamentMarshals(marshals);
  }

  playerUpdatedHandicapReport(
    clubId: string,
    fromDate: string,
    toDate: string
  ) {
    return this.playerService.playerUpdatedHandicapReport(
      clubId,
      fromDate,
      toDate
    );
  }
 
  playerUpdatedHandicapWHSReport(
    clubId: string,
    fromDate: string,
    toDate: string
  ) {
    return this.playerService.playerUpdatedHandicapWHSReport(
      clubId,
      fromDate,
      toDate
    );
  }
  playerUpdatedHandicapWHSReportAdmin(
   
    fromDate: string,
    toDate: string
  ) {
    return this.playerService.playerUpdatedHandicapWHSReportAdmin(
      
      fromDate,
      toDate
    );
  }

  searchPlayer(
    firstName: string,
    lastName: string,
    category: string,
    lowerHandicap: number,
    upperHandicap: number
  ) {
    return this.playerService.searchPlayer(
      firstName,
      lastName,
      category,
      lowerHandicap,
      upperHandicap
    );
  }
  searchPlayerForTournament(
    fullName: string,
    lowerHandicap: number,
    upperHandicap: number
  ) {
    return this.playerService.searchPlayerForTournament(
      fullName,
      lowerHandicap,
      upperHandicap
    );
  }
  private _tournamentService: TournamentsService;

  public get tournamentService(): TournamentsService {
    if (!this._tournamentService) {
      this._tournamentService = this.injector.get(TournamentsService);
    }
    return this._tournamentService;
  }

  getTournamentsListForCompleted(endDate: Date) {
    return this.tournamentService.getTournamentsListForCompleted(endDate);
  }

  getLeagues() {
    return this.tournamentService.getLeagues();
  }

  getTournamentsListForLiveByAdmin(endDate: Date) {
    return this.tournamentService.getTournamentsListForLiveByAdmin(endDate);
  }
  getTournamentsListForSheduleByAdmin(endDate: Date) {
    return this.tournamentService.getTournamentsListForSheduleByAdmin(endDate);
  }
  getTournamentsListForIncompleteByAdmin(endDate: Date) {
    return this.tournamentService.getTournamentsListForIncompleteByAdmin(
      endDate
    );
  }
  getTournamentsListByClub(endDate: Date, clubId: string) {
    return this.tournamentService.getTournamentsListByClub(endDate, clubId);
  }
  getTournamentsListByClubForCompleted(endDate: Date, clubId: string) {
    return this.tournamentService.getTournamentsListByClubForCompleted(
      endDate,
      clubId
    );
  }

  getTournamentsListByClubForLive(endDate: Date, clubId: string) {
    return this.tournamentService.getTournamentsListForLive(endDate, clubId);
  }

  getTournamentsListByClubForSchedule(endDate: Date, clubId: string) {
    return this.tournamentService.getTournamentsListByClubForSchedule(
      endDate,
      clubId
    );
  }
  getTournamentsListByClubForIncompelete(endDate: Date, clubId: string) {
    return this.tournamentService.getTournamentsListByClubForIncompelete(
      endDate,
      clubId
    );
  }

  getActiveTournamentsList(todayDate: string) {
    return this.tournamentService.getActiveTournamentsList(todayDate);
  }

  getClubActiveTournamentsList(todayDate: string, clubId: string) {
    return this.tournamentService.getClubActiveTournamentsList(
      todayDate,
      clubId
    );
  }

  getPlayersListByTournamentAndCategory(id: string, category: string) {
    return this.tournamentService.getPlayersListByTournamentAndCategory(
      id,
      category
    );
  }

  getClubDashboardStats(todayDate: string, clubId: string) {
    return this.tournamentService.getClubDashboardStats(todayDate, clubId);
  }
  getClubDashboardStatsForAdmin(todayDate: string) {
    return this.tournamentService.getClubDashboardStatsForAdmin(todayDate);
  }
  
  getTournamentCountsByClub(clubId:string){
    return this.tournamentService.getTournamentCountsByClub(clubId);
  }
  getTournamentCountsByClubAll(){
    return this.tournamentService.getTournamentCountsByClubAll();
  }
  
  LeaderboardOneTimeDataQuery(tournamentId: string, playerId: string) {
    return this.tournamentService.LeaderboardOneTimeDataQuery(
      tournamentId,
      playerId
    );
  }

  LeaderRoundsSubscription(tournamentId: string, activeRound: number) {
    return this.tournamentService.LeaderRoundsSubscription(
      tournamentId,
      activeRound
    );
  }

  LeaderRoundQuery(tournamentId: string, round: number) {
    return this.tournamentService.LeaderRoundQuery(tournamentId, round);
  }

  LeaderboardSubscription(id: string) {
    return this.tournamentService.LeaderboardSubscription(id);
  }
  tournamentDashBoard(id: string) {
    return this.tournamentService.tournamentDashBoard(id);
  }

  LeaderboardSubscriptions(id: string, cat: any) {
    return this.tournamentService.LeaderboardSubscriptions(id, cat);
  }

  deleteTournamentMember(tournamentId: string, playerId: string) {
    return this.tournamentService.deleteTournamentMember(
      tournamentId,
      playerId
    );
  }

  tournamentScoreLoader(id: string) {
    return this.tournamentService.tournamentScoreLoader(id);
  }
  

  savePlayerHandicaps(
    handicap: PlayerHanidcap[],
    player: Player[],
    handicapChange: handicap_change_log[]
  ) {
    return this.tournamentService.savePlayerHandicaps(
      handicap,
      player,
      handicapChange
    );
  }

  getTournamentByID(id: string) {
    return this.tournamentService.getTournamentByID(id);
  }

  addTournament(tournament: any) {
    return this.tournamentService.addTournament(tournament);
  }
  addSubTournament(obj: any) {
    return this.tournamentService.addSubTournament(obj);
  }

  updateFlightSettings(
    tournamentId: string,
    category: string,
    flightSettings: JSON
  ) {
    return this.tournamentService.updateFlightSettings(
      tournamentId,
      category,
      flightSettings
    );
  }

  checkPrefix(prefix: string) {
    return this.tournamentService.checkPrefix(prefix);
  }
  editTournament(tournament: any, category: any, marshals: any) {
    return this.tournamentService.editTournament(
      tournament,
      category,
      marshals
    );
  }

  getFlightSettings(tournamentId: string, category: string) {
    return this.tournamentService.getFlightSettings(tournamentId, category);
  }

  UndoTournamentRound(
    tournamentId: string,
    flightRound: number,
    resetRound: number,
    cut: any
  ) {
    return this.tournamentService.UndoTournamentRound(
      tournamentId,
      flightRound,
      resetRound,
      cut
    );
  }

  getsuperAdminStats() {
    return this.tournamentService.getsuperAdminStats();
  }

  getTournamentMembers(tournamentId: string) {
    return this.tournamentService.getTournamentMembers(tournamentId);
  }

  markActiveTournamentMembers(
    tournamentId: string,
    tournamentMembers: TournamentMember[]
  ) {
    return this.tournamentService.markActiveTournamentMembers(
      tournamentId,
      tournamentMembers
    );
  }

  insertTournamentMember(tournamentMembers: TournamentMember[]) {
    return this.tournamentService.insertTournamentMember(tournamentMembers);
  }
  insertTournamentMemberStatus(tournamentMemberStatus) {
    return this.tournamentService.insertTournamentMemberStatus(tournamentMemberStatus);
  }

  // insertClubMember(clubId: string, playerId: string) {
  //   return this.tournamentService.insertClubMember(clubId, playerId);
  // }
  getLeageLeaderBoards(id:string)
  {
    return this.tournamentService.getLeageLeaderBoards(id);
  }
  getLeagueName(id:string)
  {
    return this.tournamentService.getLeagueName(id);
  }
  setScoreUpdateTime(tournamentId: string, date: string) {
    return this.tournamentService.setScoreUpdateTime(tournamentId, date);
  }

  leaderAllRoundData(tournamentId: string) {
    return this.tournamentService.leaderAllRoundData(tournamentId);
  }

  eliminateRound(oldFlightId: string, newFlightId: string, playerId: string) {
    return this.tournamentService.eliminateRound(
      oldFlightId,
      newFlightId,
      playerId
    );
  }

  private _teamsLeaderboardService: TeamsLeaderboardService;

  public get teamsLeaderboardService(): TeamsLeaderboardService {
    if (!this._teamsLeaderboardService) {
      this._teamsLeaderboardService = this.injector.get(
        TeamsLeaderboardService
      );
    }
    return this._teamsLeaderboardService;
  }

  LeaderboardTeamSubscription(tournamentId: string, playerId: string) {
    return this.teamsLeaderboardService.LeaderboardTeamSubscription(
      tournamentId,
      playerId
    );
  }

  private _matchplayService: MatchplayService;

  public get matchplayService(): MatchplayService {
    if (!this._matchplayService) {
      this._matchplayService = this.injector.get(MatchplayService);
    }
    return this._matchplayService;
  }

  MatchPlayDataQuery(playerId: string, flightId: string) {
    return this.matchplayService.MatchPlayDataQuery(playerId, flightId);
  }

  SaveScoresMutation(scores: Score[]) {
    return this.matchplayService.SaveScoresMutation(scores);
  }

  getPlayerTournamentScore(tournamentId: string, playerId: string) {
    return this.matchplayService.getPlayerTournamentScore(
      tournamentId,
      playerId
    );
  }

  private _flightService: FlightsService;

  public get flightsService(): FlightsService {
    if (!this._flightService) {
      this._flightService = this.injector.get(FlightsService);
    }
    return this._flightService;
  }

  SaveTournamentFlights(
    tournamentId: string,
    flightsToSave: any,
    flightMembersToSave: any
  ) {
    return this.flightsService.SaveTournamentFlights(
      tournamentId,
      flightsToSave,
      flightMembersToSave
    );
  }
  SaveTournamentFlightforTaxes(
    tournamentId: string,
    flightName: any,
    flightsToSave: any,
    flightMembersToSave: any
  ) {
    return this.flightsService.SaveTournamentFlightfortaxes(
      tournamentId,
      flightName,
      flightsToSave,
      flightMembersToSave
    );
  }

  SaveTournamentFlight(
    tournamentId: string,
    flightsToSave: any,
    flightMembersToSave: any
  ) {
    return this.flightsService.SaveTournamentFlight(
      tournamentId,
      flightsToSave,
      flightMembersToSave
    );
  }
  SaveRoundFlight(
   
    flightsToSave: any,

  ) {
    return this.flightsService.SaveRoundFlight(
    
      flightsToSave
    );
  }
  saveFlightMembers(
    flightId:string,
    flightMembersToSave: any
  ) {
    return this.flightsService.saveFlightMembers(
      flightId,
      flightMembersToSave
    );
  }
  createNextRoundFlights(flights: Flight[]) {
    return this.flightsService.createNextRoundFlights(flights);
  }
  addFlightName(flights: any) {
    return this.flightsService.addFlightName(flights);
  }

  copyPlayerScore(playerId: string, fromFlight: string, toFlight: string) {
    return this.flightsService.copyPlayerScore(playerId, fromFlight, toFlight);
  }

  getTotalFlights(clubId: string) {
    return this.flightsService.getTotalFlights(clubId);
  }
  getTotalFlightsAll() {
    return this.flightsService.getTotalFlightsAll();
  }

  DeleteFlightsAndMembers(
    flightIdsToRemove: string[],
    membersFromFlightToRemove: string[],
    flightMembersToRemove: string[]
  ) {
    return this.flightsService.DeleteFlightsAndMembers(
      flightIdsToRemove,
      membersFromFlightToRemove,
      flightMembersToRemove
    );
  }

  moveFlightsPlayer(flightMembersToSave: any) {
    return this.flightsService.moveFlightsPlayer(flightMembersToSave);
  }

  DeleteFlightMembers(flightid:any,flightMembersToRemove: any) {
    return this.flightsService.DeleteFlightMembers(flightid,flightMembersToRemove);
  }

  getTournamentsFlights( tournamentId: string) {
    return this.flightsService.getTournamentsFlights( tournamentId);
  }

  markPlayerAttendance(flightId: string, playerId: string, status: boolean) {
    return this.flightsService.markPlayerAttendance(flightId, playerId, status);
  }

  closeActiveRound(tournamentId: string, round: number, cutOffCriteria: any) {
    return this.flightsService.closeActiveRound(
      tournamentId,
      round,
      cutOffCriteria
    );
  }

  singleRoundFlightsQuery(flightId: string) {
    return this.flightsService.singleRoundFlightsQuery(flightId);
  }

  singleRoundFlightQuery(flightId: string) {
    return this.flightsService.singleRoundFlightQuery(flightId);
  }
  deletePlayerHandiCal(tournamnetId: string,PlayersIds:any[]) {
    return this.flightsService.deletePlayerHandiCal(tournamnetId,PlayersIds);
  }
  undoFlightHandicap(flightId: string,playerId:string) {
    return this.flightsService.undoFlightHandicap(flightId,playerId);
  }
  undoHandicapPlayer(flightId: string,playerId:string) {
    return this.flightsService.undoHandicapPlayer(flightId,playerId);
  }
  markPlayerPanelty(tournamentId:string,flightId: string,playerId:string) {
    return this.flightsService.markPlayerPanelty(tournamentId,flightId,playerId);
  }
  private _teeTimeService: TeeTimeService;

  public get TeeTimeService(): TeeTimeService {
    if (!this._teeTimeService) {
      this._teeTimeService = this.injector.get(TeeTimeService);
    }
    return this._teeTimeService;
  }

  getClubTeeTimeBooking(clubId: string) {
    return this.TeeTimeService.getClubTeeTimeBooking(clubId);
  }

  getPlayerWHS(playerId: string) {
    return this.playerService.getPlayerWHS(playerId);
  }
  getPlayerWHSRound(courseRating: string) {
    return this.playerService.getPlayerWHSRound(courseRating);
  }

  getDailyRounds(clubId: string, fromDate: string, toDate: string) {
    return this.tournamentService.getDailyRounds(clubId, fromDate, toDate);
  }
  getDailyRoundsSingle(clubId: string, fromDate: string, toDate: string) {
    return this.tournamentService.getDailyRoundsSingle(
      clubId,
      fromDate,
      toDate
    );
  }
  getDailyRoundsSingleAdmin(fromDate: string, toDate: string) {
    return this.tournamentService.getDailyRoundsSingleAdmin(
      
      fromDate,
      toDate
    );
  }
  getDailyRoundsStat(clubId: string, fromDate: string, toDate: string) {
    return this.tournamentService.getDailyRoundsStat(
      clubId,
      fromDate,
      toDate
    );
  }
  getDailyRoundsStatAdmin( fromDate: string, toDate: string) {
    return this.tournamentService.getDailyRoundsStatAdmin(
     
      fromDate,
      toDate
    );
  }
  getDailyRoundsSingleDashboard(clubId: string, fromDate: string, toDate: string) {
    return this.tournamentService.getDailyRoundsSingleDashboard(
      clubId,
      fromDate,
      toDate
    );
  }
  getAll(clubId: string, fromDate: string, toDate: string) {
    return this.tournamentService.getAll(
      clubId,
      fromDate,
      toDate
    );
  }
  getAllAdmin( fromDate: string, toDate: string) {
    return this.tournamentService.getAllAdmin(
      fromDate,
      toDate
    );
  }
  getDailyRoundsSingleDashboardAll( fromDate: string, toDate: string) {
    return this.tournamentService.getDailyRoundsSingleDashboardAll(
      
      fromDate,
      toDate
    );
  }
  getSingleDailyRound(clubId: string, Date: string) {
    return this.tournamentService.getSingleDailyRound(clubId, Date);
  }
  getSingleDailyRoundAdmin( Date: string) {
    return this.tournamentService.getSingleDailyRoundAdmin( Date);
  }
  getRoundScore(Id: any) {
    return this.tournamentService.getRoundScore(Id);
  }

  isTeeTimeDateExist(clubId: string, selectedDate: Date) {
    return this.TeeTimeService.isTeeTimeDateExist(clubId, selectedDate);
  }

  AddTeeTimeSchedule(teeTime: TeeTime) {
    return this.TeeTimeService.AddTeeTimeSchedule(teeTime);
  }

  getPlayerlistbyName(FirstName: string, LastName: string) {
    return this.playerService.getPlayerlistbyName(FirstName, LastName);
  }
  getPlayerByMembershipNumberClubwise(
    clubId: string,
    FirstName: string,
    LastName: string
  ) {
    return this.playerService.getPlayerlistbyNameClubWise(
      clubId,
      FirstName,
      LastName
    );
  }

  getPlayerTodayRound(playerId: string, Date: string) {
    return this.playerService.getPlayerTodayRound(playerId, Date);
  }

  private _playerHandicapWhsService: PlayerHandicapWhsService;

  public get playerHandicapWhsService(): PlayerHandicapWhsService {
    if (!this._playerHandicapWhsService) {
      this._playerHandicapWhsService = this.injector.get(
        PlayerHandicapWhsService
      );
    }
    return this._playerHandicapWhsService;
  }

  getTorunamentScoreQuery(tournamentId: string) {
    return this.playerHandicapWhsService.getTorunamentScoreQuery(tournamentId);
  }

  getPlayersHandicapWhsHistory(playerIds: string[], playingDate: Date) {
    return this.playerHandicapWhsService.getPlayersHandicapWhsHistory(
      playerIds,
      playingDate
    );
  }
  getPlayersHandicapWhsHistoryAboveDate(playerIds: string, playingDate: Date) {
    return this.playerHandicapWhsService.getPlayersHandicapWhsHistoryAboveDate(
      playerIds,
      playingDate
    );
  }

  savePlayerWhsHandicapsForRound(handicapWhsInputs) {
    return this.playerHandicapWhsService.savePlayerWhsHandicapsForRound(
      handicapWhsInputs
    );
  }

  savePlayersHandicapWhsIndex(playersList, changeLogs) {
    return this.playerHandicapWhsService.savePlayersHandicapWhsIndex(
      playersList,
      changeLogs
    );
  }

  savePlayerHandicapWhsIndex(handicapWhsInputs) {
    return this.playerHandicapWhsService.savePlayerHandicapWhsIndex(
      handicapWhsInputs
    );
  }
  updatePlayerHandicapWhsDifferential(handicapWhsInputs) {
    return this.playerHandicapWhsService.updatePlayerHandicapWhsDifferential(
      handicapWhsInputs
    );
  }

  updateDailyRoundCourseHoleset(
    tournamentId: string,
    courseHolset: number,
    courseHoleSetsInverted: boolean,
    deleteAndInsertScores: boolean,
    scoreDetailsDelete: string[],
    scoreFlightIdsToRemove: string[],
    scorePlayerIdsToRemove: string[],
    scoresToInsert: any,
    tee: any,
    time: any,
    flightMembers: any[],
    deleteMember: any[],
    flightId: string
  ) {
    return this.flightsService.updateDailyRoundCourseHoleset(
      tournamentId,
      courseHolset,
      courseHoleSetsInverted,
      deleteAndInsertScores,
      scoreDetailsDelete,
      scoreFlightIdsToRemove,
      scorePlayerIdsToRemove,
      scoresToInsert,
      tee,
      time,
      flightMembers,
      deleteMember,
      flightId
    );
  }
}
