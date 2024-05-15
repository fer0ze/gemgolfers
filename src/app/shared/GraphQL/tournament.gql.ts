import gql from 'graphql-tag';
import {
    TournamentQL,
    TournamentMemberCategoryQL,
    TournamentMemberStatusQL,
    TournamentPairQL,
    TournamentRoleManagerQL,
    LeaderboardAdQL,
    TournamentTeamQL,
    LeaderQL,
    LeaderAllRoundQL,
} from '../fragments/tournament.fragment';
import {
    FlightsQL,
    FlightManagerTeamQL,
    FlightManagerQL,
} from '../fragments/flight.fragment';
import { ScoreQL, ScoreDetailQL, HoleQL } from '../fragments/score.fragment';
import { CourseQL, CourseHoleSetsQL } from '../fragments/course.fragment';
import {
    PlayerQL,
    PlayerHandicapQL,
    PlayerHandicapWhsQL,
    PlayerHandicapLogQL,
} from '../fragments/player.fragment';

export const LeaderboardSubscription = gql`
    query LeaderboardSimpleSubscription($tournamentPrefix: String!) {
        LeaderBoardQL: leaderboard_score(
            where: {
                _or: [
                    { prefix: { _eq: $tournamentPrefix } }
                    { tournamentId: { _eq: $tournamentPrefix } }
                ]
            }
        ) {
            playerId
            handicap
            underGross
            underGross1
            underGross2
            underGross3
            underGross4
            playingRound
            name
            scoreR1
            scoreR2
            scoreR3
            scoreR4
            holesPlayedR1
            holesPlayedR2
            holesPlayedR3
            holesPlayedR4
            status
            category
            netScoreR1
            netScoreR2
            netScoreR3
            netScoreR4
            underNet
            underNet1
            underNet2
            underNet3
            underNet4
            holeScoreLast9
            holeScoreLast6
            holeScoreLast3
            holeScoreLast1
            holeScoreLast9Net
            holeScoreLast6Net
            holeScoreLast3Net
            holeScoreLast1Net
            pointsRound1
            pointsRound2
            pointsRound3
            pointsRound4
            activeRound
            completed1
            completed2
            completed3
            completed4
        }
        TournamentQL: tournament(
            where: {
                _or: [
                    { id: { _eq: $tournamentPrefix } }
                    { prefix: { _eq: $tournamentPrefix } }
                ]
            }
        ) {
            id
            courseId
            courseHoleSets
            courseHoleSetsInverted
            cutOffCriteria
            activeRound
            handicapAllocations
            noOfRounds
            webLogoUrl
            title
            matchFormat
            CategoriesQL: categories {
                ...TournamentMemberCategoryQL
            }
            TeamQL: teams {
                id
                tournamentId
                name
                color
                OpponentsQL: opponentsTeam1 {
                    id
                    team1Id
                    team2Id
                    team1MemberId
                    team2MemberId
                    tournamentId
                    playerTeam1 {
                        firstName
                        lastName
                        handicap
                    }
                    playerTeam2 {
                        firstName
                        lastName
                        handicap
                    }
                }
            }
            TeamResultQL: team_match_result_singles {
                tournamentId
                teamOpponentId
                finalResult
                upScore
                remainingHoles
            }
            TeamResultDoublesQL: team_match_result_doubles {
                tournamentId
                finalResult
                upScore
                remainingHoles
                round
            }
        }
    }
    ${TournamentMemberCategoryQL}
`;

export const tournamentDashBoard = gql`
    query LeaderboardSimpleSubscription($tournamentPrefix: String!) {
        TournamentQL: tournament(
            where: {
                _or: [
                    { id: { _eq: $tournamentPrefix } }
                    { prefix: { _eq: $tournamentPrefix } }
                ]
            }
        ) {
            id
            courseId
            leagueId
            title
            noOfRounds
            matchFormat
            members
            cutOffCriteria
            activeRound
            webLogoUrl
            startDate
            endDate
            handicapAllocations
            adminId
            courseHoleSets
            courseHoleSetsInverted
            prefix
            members {
                playerId
                tournamentId
                PlayerQL: player {
                    id
                    playerCategory
                    firstName
                    lastName
                    handicap
                }
            }
            FlightsQL: flights(
                order_by: [{ flightRound: asc }, { flightNo: asc }]
            ) {
                id
                flightRound
                time
                flightNo
                name {
                    flightId
                    name
                }
                MembersQL: members(order_by: { playerId: asc }) {
                    flightId
                    playerId
                    PlayerQL: player {
                        id
                        playerCategory
                        firstName
                        lastName
                        handicap
                        membership {
                            clubId
                            playerId
                            club {
                                id
                                name
                            }
                        }
                    }
                    ScoresQL: scores(where: { grossScore: { _gt: 0 } }) {
                        holeId
                        flightId
                        grossScore
                        playerId
                        playerHandicap
                        hole {
                            id
                            courseId
                            holeNo
                            index
                            par
                        }
                    }
                }
            }
            MarshalQL: marshals {
                id
                email
                password
            }
            CourseQL: course {
                id
                picture
                par
                noOfHoles
                city
                clubId
                country
                courseRating
                name
                noOfHoles
                slopeRating
            }
            CategoriesQL: categories {
                ...TournamentMemberCategoryQL
            }
            MemberStatusesQL: member_statuses {
                ...TournamentMemberStatusQL
            }
            CoursesQL:tournament_round_courses{
                tournamentId
                round
                courseId
                courseHoleSets
                inverted
                course {
                    ...CourseQL
                HolesQL: holes {
                    ...HoleQL
                    HoleMetaQL:meta{
                        hole_id
                        tee_distance
                        tee_id
                    }
                }}
            }
        }
        SubTournamentQL: sub_tournament(
            where: { tournamentId: { _eq: $tournamentPrefix } }
        ) {
            tournamentId
            subTournamentId
        }
    }
    ${TournamentMemberStatusQL}
    ${TournamentMemberCategoryQL}
    ${CourseQL}${HoleQL}
`;

export const LeaderboardSubscriptions = gql`
    query LeaderboardSimpleSubscription(
        $where: tournament_member_category_bool_exp!
    ) {
        tournament_member_category(where: $where) {
            ...TournamentMemberCategoryQL
        }
    }
    ${TournamentMemberCategoryQL}
`;
export const getTourGuides = gql`
    query getGuides($tourId: String!) {
        tour_guide(
            where: { tourId: { _eq: $tourId } }
            order_by: { date: asc }
        ) {
            id
            tourId
            date
            details
        }
    }
`;
export const getLeagues = gql`
    query getLeagues {
        league( order_by: { dateCreated: desc }) {
            id
            name
            dateCreated
            members {
                playerId
            }
            tournaments {
                id
            }
            admin{
                firstName
                lastName
                email
            }
        }
    }
`;
export const getLeaguesListByDate = gql`
    query getLeaguesListByDate($fromDate: date!, $toDate: date!) {
        league(
            where: {
                _and: [
                    { dateCreated: { _lte: $toDate } }
                    { dateCreated: { _gt: $fromDate } }
                ]
            }){
            id
            name
            dateCreated
            members {
                playerId
            }
            tournaments {
                id
            }
            admin{
                firstName
                lastName
                email
            }
        }
    }
`;
export const getLeaguesByClub = gql`
    query getLeagues($adminId: String!) {
        league(where: { adminId: { _eq: $adminId } }) {
            id
            name
            dateCreated
            members {
                playerId
            }
            tournaments {
                id
            }
        }
    }
`;
export const getLeaguesMembers = gql`
    query getLeaguesMembers($adminId: String!) {
        league(where: { id:{ _eq: $adminId } }) {
            id
            name
            dateCreated
            members {
                playerId
                player{
                    id
                    firstName
                    lastName
                    email
                }
            }
        }
    }
`;
export const getTourMembers = gql`
    query getTourMembers($adminId: String!) {
        tour(where: { id:{ _eq: $adminId } }) {
            id
            
            members {
                playerId
                player{
                    id
                    firstName
                    lastName
                    email
                }
            }
        }
    }
`;
export const getLeageLeaderBoards = gql`
    query getLeagues($leagueId: String!) {
        LeaderBoardQL: mvp_leaderboard(
            where: { leagueId: { _eq: $leagueId } }
        ) {
            id
            name
            points {
                leaderboardId
                tournamentId
                entityId
                name
                points
            }
        }
    }
`;
export const getLeagueName = gql`
    query getLeagues($leagueId: String!) {
        LeaderBoardQL: league(where: { id: { _eq: $leagueId } }) {
            id
            name
            members {
                playerId
                player {
                    handicap
                }
            }
        }
    }
`;

export const GetTournamentsForAdminCompeleted = gql`
    query PostsGetQuery($endDate: date!) {
        CompletedRecently: tournament(
            where: {
                _and: [
                    { endDate: { _lt: $endDate }, singleRound: { _eq: false } }
                ]
            }
            order_by: { endDate: desc }
        ) {
            id
            title
            startDate
            endDate
            noOfRounds
            matchFormat
            admin {
                firstName
                lastName
            }
            HandicapCalculated: player_handicaps(limit: 1) {
                playerId
                tournamentId
            }
        }
    }
`;

export const GetTournamentsReport = gql`
    query GetTournamentsReport {
        tournament(
            where: { singleRound: { _eq: false } }
            order_by: { createdAt: desc }) {
            id
            title
            startDate
            endDate
            noOfRounds
            matchFormat
            createdAt
            admin {
                firstName
                lastName
                email
            }
            flights_aggregate{
                aggregate{count}
            }
            members_aggregate{
                aggregate{count}
            }

        }
    }
`;
export const GetTournamentsReportByDate = gql`
    query GetTournamentsReportByDate($fromDate: timestamptz!, $toDate: timestamptz!) {
        tournament(
            where: {
                _and: [
                    { createdAt: { _lte: $toDate } }
                    { createdAt: { _gt: $fromDate } }
                    { singleRound: { _eq: false } }
                ]
            }
            order_by: { createdAt: desc }) {
            id
            title
            startDate
            endDate
            noOfRounds
            matchFormat
            createdAt
            admin {
                firstName
                lastName
                email
            }
            flights_aggregate{
                aggregate{count}
            }
            members_aggregate{
                aggregate{count}
            }
        }
    }
`;
export const GetTournamnetListForLiveByAdmin = gql`
    query PostsGetQuery($endDate: date!) {
        ActiveTournaments: tournament(
            where: {
                _and: [
                    { endDate: { _gte: $endDate }, singleRound: { _eq: false } }
                ]
            }
        ) {
            id
            title
            startDate
            endDate
            noOfRounds
            admin {
                firstName
                lastName
            }
        }
    }
`;

export const GetTournamnetListForScheduleByAdmin = gql`
    query PostsGetQuery($endDate: date!) {
        Scheduled: club_schedule(
            where: { _and: [{ date: { _gt: $endDate } }] }
            order_by: { date: desc }
        ) {
            id
            clubId
            courseId
            tournamentTitle
            date
            admin {
                firstName
                lastName
            }
            course {
                name
            }
        }
    }
`;
export const GetTournamnetListForIncompleteByAdmin = gql`
    query PostsGetQuery($endDate: date!) {
        Scheduled: club_schedule(
            where: { _and: [{ date: { _gt: $endDate } }] }
            order_by: { date: desc }
        ) {
            id
            tournamentTitle

            date
            admin {
                firstName
                lastName
            }
        }
    }
`;

export const DeleteLiveTournament = gql`
    mutation ($where: club_member_bool_exp!) {
        delete_club_member(where: $where) {
            affected_rows
        }
    }
`;

export const GetTournementByFilter = gql`
    query PostsGetQuery($where: tournament_bool_exp!) {
        tournament(where: $where) {
            ...TournamentQL
        }
    }

    ${TournamentQL}
`;
export const GetTournamnetListForCompleted = gql`
    query PostsGetQuery($endDate: date!, $clubId: String!) {
        CompletedRecently: tournament(
            where: {
                _and: [
                    {
                        endDate: { _lt: $endDate }
                        clubId: { _eq: $clubId }
                        singleRound: { _eq: false }
                    }
                ]
            }
            order_by: { endDate: desc }
        ) {
            id
            title
            startDate
            endDate
            matchFormat
            noOfRounds
            admin {
                firstName
                lastName
            }
            HandicapCalculated: player_handicaps(limit: 1) {
                playerId
                tournamentId
            }
        }
    }
`;
export const getTournamentsListByTourForCompleted = gql`
    query PostsGetQuery($tourId: String!) {
        CompletedRecently: tour(where: { id: { _eq: $tourId } }) {
            id
            tournaments {
                id
                title
                startDate
                endDate
                matchFormat
                noOfRounds
                admin {
                    firstName
                    lastName
                }
                HandicapCalculated: player_handicaps(limit: 1) {
                    playerId
                    tournamentId
                }
            }
        }
    }
`;
export const GetTournamnetListForLive = gql`
    query PostsGetQuery($endDate: date!, $clubId: String!) {
        ActiveTournaments: tournament(
            where: {
                _and: [
                    {
                        endDate: { _gte: $endDate }
                        clubId: { _eq: $clubId }
                        singleRound: { _eq: false }
                    }
                ]
            }
        ) {
            id
            title
            startDate
            endDate
            noOfRounds
            matchFormat
            admin {
                firstName
                lastName
            }
            HandicapCalculated: player_handicaps {
                handicap
                oldHandicap
                updatedAt
                player {
                    firstName
                    lastName
                }
            }
        }
    }
`;
export const GetTournamnetListForSchedule = gql`
    query PostsGetQuery($endDate: date!, $clubId: String!) {
        Scheduled: tournament(
            where: {
                _and: [
                    {
                        startDate: { _gte: $endDate }
                        clubId: { _eq: $clubId }
                        singleRound: { _eq: false }
                    }
                ]
            }
        ) {
            id
            title
            startDate
            endDate
            noOfRounds
            matchFormat
            admin {
                firstName
                lastName
            }
            HandicapCalculated: player_handicaps {
                handicap
                oldHandicap
                updatedAt
                player {
                    firstName
                    lastName
                }
            }
        }
    }
`;
export const GetTournamnetListForIncomplete = gql`
    query PostsGetQuery($endDate: date!, $clubId: String!) {
        Incomplete: club_schedule(
            where: {
                _and: [{ date: { _gt: $endDate }, clubId: { _eq: $clubId } }]
            }
            order_by: { date: desc }
        ) {
            id
            tournamentTitle
            startDate
            endDate
            noOfRounds
            matchFormat
        }
    }
`;

export const GetTournamentsByClub = gql`
    query PostsGetQuery($endDate: date!, $clubId: String!) {
        ActiveTournaments: tournament(
            where: {
                _and: [
                    {
                        endDate: { _gte: $endDate }
                        clubId: { _eq: $clubId }
                        singleRound: { _eq: false }
                    }
                ]
            }
        ) {
            id
        }
        CompletedRecently: tournament(
            where: {
                _and: [
                    {
                        endDate: { _lt: $endDate }
                        clubId: { _eq: $clubId }
                        singleRound: { _eq: false }
                    }
                ]
            }
            order_by: { endDate: desc }
        ) {
            id
            startDate
            endDate
            noOfRounds
            HandicapCalculated: player_handicaps {
                name
                handicap
                oldhandicap
                updatedAt
            }
            PlayerHandicapWhs: player_handicaps_whs {
                name
                round
                score
                adjustedScore
                handicapDifferential
                handicapWhsIndex
                updatedAt
            }
        }

        HandicapCalculated: tournament(
            limit: 3
            where: {
                _not: { player_handicaps: {} }
                clubId: { _eq: $clubId }
                singleRound: { _eq: false }
                endDate: { _lt: $endDate }
            }
            order_by: { endDate: desc }
        ) {
            ...TournamentQL
        }
        Scheduled: club_schedule(
            where: {
                _and: [{ date: { _gt: $endDate }, clubId: { _eq: $clubId } }]
            }
            order_by: { date: desc }
        ) {
            id
            clubId
            courseId
            tournamentTitle
            date
            course {
                name
            }
        }
    }
    ${TournamentQL}
`;

export const getActiveTournamentsList = gql`
    query PostsGetQuery($where: tournament_bool_exp!) {
        tournament(where: $where) {
            ...TournamentQL
        }
    }
    ${TournamentQL}
`;

export const GetUpCommingTournamentsByClub = gql`
    query PostsGetQuery($where: tournament_bool_exp!) {
        ActiveTournaments: tournament(where: $where) {
            ...TournamentQL
        }
    }
    ${TournamentQL}
`;

export const GetTournamentByID = gql`
    query PostsGetQuery($where: tournament_bool_exp!) {
        tournament(where: $where) {
            ...TournamentQL
            categories {
                id
                tournamentId
                category
                flightSettings
            }
            teams {
                id
                adminId
                tournamentId
                name
                color
                membersQL {
                    teamId
                    playerId
                    player {
                        id
                        firstName
                        lastName
                        handicap
                        playerCategory
                        membershipNumber
                    }
                }
            }
            opponents {
                id
                team1Id
                team2Id
                team1MemberId
                team2MemberId
            }
            CoursesQL:tournament_round_courses{
                tournamentId
                round
                courseId
                courseHoleSets
                inverted
                course {
                    ...CourseQL
                HolesQL: holes {
                    ...HoleQL
                    HoleMetaQL:meta{
                        hole_id
                        tee_distance
                        tee_id
                    }
                }}
            }
        }
    }
    ${TournamentQL} ${CourseQL}${HoleQL}
`;

export const GetFlightSettings = gql`
    query PostsGetQuery($where: tournament_member_category_bool_exp!) {
        tournament_member_category(where: $where) {
            tournamentId
            category
            flightSettings
        }
    }
    ${TournamentQL}
`;

export const AddMutation = gql`
    mutation insert_tournament(
        $objects: [tournament_insert_input!]!
        $flightId: String!
        $slotId: String!
        $count: Int!
    ) {
        insert_tournament(objects: $objects) {
            returning {
                id
                clubId
                leagueId
                courseId
                adminId
                title
                categories {
                    id
                    category
                }
            }
        }
        update_tee_time_booking_slot(
            where: { id: { _eq: $slotId } }
            _set: { flightId: $flightId, joinedMembers: $count }
        ) {
            returning {
                id
            }
        }
    }
`;
export const AddSubTournamentMutation = gql`
    mutation insert_sub_tournament(
        $subTournaments: [sub_tournament_insert_input!]!
    ) {
        insert_sub_tournament(objects: $subTournaments) {
            returning {
                tournamentId
            }
        }
    }
`;

export const UpdateMutation = gql`
    mutation updateMutation(
        $tournament: [tournament_insert_input!]!
        $category: [tournament_member_category_insert_input!]!
        $marshals: [marshal_insert_input!]!
    ) {
        tournamentUpdateQli: insert_tournament(
            objects: $tournament
            on_conflict: {
                constraint: tournament_pkey
                update_columns: [
                    title
                    prefix
                    leagueId
                    courseHoleSets
                    courseId
                    noOfRounds
                    activeRound
                    matchFormat
                    tee
                    scoreManagement
                    startDate
                    endDate
                    marshalsStartWith
                    noOfMarshals
                ]
            }
        ) {
            AffectedRowsQLi: affected_rows
        }
        CategoryToUpdateQLi: insert_tournament_member_category(
            objects: $category
            on_conflict: {
                constraint: tournament_member_category_pkey
                update_columns: [
                    category
                    handicapLimits
                    prizeInformation
                    flightSettings
                ]
            }
        ) {
            AffectedRowsQLi: affected_rows
        }
        MarshalsToUpdateQLi: insert_marshal(
            objects: $marshals
            on_conflict: {
                constraint: marshal_pkey
                update_columns: [id, tournamentId, email, password]
            }
        ) {
            AffectedRowsQLi: affected_rows
        }
    }
`;

export const GetPlayersByClub = gql`
    query PostsGetQuery($where: tournament_member_bool_exp!) {
        tournament_member(where: $where) {
            player {
                ...PlayerQL
            }
        }
    }
    ${PlayerQL}
`;

export const DeleteClub = gql`
    mutation DeleteTournament($where: tournament_bool_exp!) {
        delete_tournament(where: $where) {
            affected_rows
            returning {
                id
            }
        }
    }
`;

export const TournamentScoresQuery = gql`
    query TournamentScoresQuery($tournamentId: String!) {
        TournamentQL: tournament_by_pk(id: $tournamentId) {
            ...TournamentQL
            FlightsQL: flights {
                ...FlightQL
                MembersQL: members(order_by: { player: { firstName: asc } }) {
                    playerId
                    PlayerQL: player {
                        ...PlayerQL
                    }
                    ScoresQL: scores(where: { grossScore: { _gt: 0 } }) {
                        ...ScoreQL
                    }
                }
            }
            PlayerHandicapsQL: player_handicaps {
                ...PlayerHandicapQL
            }
        }
    }
    ${TournamentQL}
    ${FlightsQL}
    ${PlayerQL}
    ${ScoreQL}
    ${PlayerHandicapQL}
`;

export const SavePlayerHandicapsMutation = gql`
    mutation SavePlayerHandicapsMutation(
        $handicaps: [player_handicap_insert_input!]!
        $players: [player_insert_input!]!
        $handicapChangeLog: [handicap_change_log_insert_input!]!
    ) {
        HandicapEntryQL: insert_player_handicap(
            objects: $handicaps
            on_conflict: {
                constraint: player_handicap_pkey
                update_columns: [handicap, oldHandicap, updatedAt]
            }
        ) {
            AffectedRowsQL: affected_rows
        }
        PlayerEntryQL: insert_player(
            objects: $players
            on_conflict: { constraint: player_pkey, update_columns: [handicap] }
        ) {
            AffectedRowsQL: affected_rows
        }

        HandicapHistoryEntryQL: insert_handicap_change_log(
            objects: $handicapChangeLog
            on_conflict: {
                constraint: handicap_change_log_pkey
                update_columns: [newHandicap]
            }
        ) {
            AffectedRowsQL: affected_rows
        }
    }
    ${PlayerQL}
    ${ScoreQL}
    ${PlayerHandicapQL}
    ${PlayerHandicapLogQL}
`;

export const UndoTournamentRoundMutation = gql`
    mutation undoTournamentRondMutation(
        $tournamentId: String!
        $flightRound: Int!
        $resetRound: Int!
        $cut: json!
    ) {
        undoFlightRoundQL: delete_flight(
            where: {
                tournamentId: { _eq: $tournamentId }
                flightRound: { _eq: $flightRound }
            }
        ) {
            AffectedRowsQL: affected_rows
        }
        undoTournamentRoundQL: update_tournament(
            where: { id: { _eq: $tournamentId } }
            _set: { activeRound: $resetRound, cutOffCriteria: $cut }
        ) {
            AffectedRowsQL: affected_rows
        }
        update_flight(
            where: { 
                _and: [
                    {
                        tournamentId: { _eq: $tournamentId } 
                        flightRound: { _eq: $resetRound }
                    }
                ]            
            },_set: {closed:false }
        ) {
            AffectedRowsQLi: affected_rows
        }
    }
`;

export const TournamentMembersQL = gql`
    query TournamentMembersQL($where: tournament_member_bool_exp!) {
        TournamentMemberQL: tournament_member(where: $where) {
            tournamentId
            playerId
            player {
                id
                firstName
                lastName
                handicap
                playerCategory
                email
                membershipNumber
            }
        }
    }
    ${TournamentQL}
`;

export const DeleteTournamentMember = gql`
    mutation DeleteTournamentMember($where: tournament_member_bool_exp!) {
        delete_tournament_member(where: $where) {
            affected_rows
        }
    }
`;
export const DeleteTournaments = gql`
    mutation DeleteTournaments($where: tournament_bool_exp!) {
        delete_tournament(where: $where) {
            affected_rows
        }
    }
`;
export const DeleteLeagues = gql`
    mutation DeleteLeagues($where: league_bool_exp!) {
        delete_league(where: $where) {
            affected_rows
        }
    }
`;
export const DeleteTour = gql`
    mutation DeleteTour($where: tour_bool_exp!) {
        delete_tour(where: $where) {
            affected_rows
        }
    }
`;
export const DeleteTourGuide = gql`
    mutation DeleteTournamentMember($where: tour_guide_bool_exp!) {
        delete_tour_guide(where: $where) {
            affected_rows
        }
    }
`;

export const markActiveTournamentMemberQL = gql`
    mutation markActiveTournamentMemberQL(
        $tournamentId: String!
        $tournamentMembers: [tournament_member_insert_input!]!
    ) {
        markInactiveMembers: update_tournament_member(
            where: { tournamentId: { _eq: $tournamentId } }
            _set: { status: false }
        ) {
            AffectedRowsQL: affected_rows
        }
        markActiveMembers: insert_tournament_member(
            objects: $tournamentMembers
            on_conflict: {
                constraint: tournament_member_pkey
                update_columns: [status]
            }
        ) {
            AffectedRowsQL: affected_rows
        }
    }
`;

export const insertTournamentMemberQL = gql`
    mutation insertTournamentMemberQL(
        $tournamentMembers: [tournament_member_insert_input!]!
    ) {
        insert_tournament_member(
            objects: $tournamentMembers
            on_conflict: {
                constraint: tournament_member_pkey
                update_columns: [status]
            }
        ) {
            AffectedRowsQL: affected_rows
        }
    }
`;
export const insertTourGuideQL = gql`
    mutation insertTournamentMemberQL($tourGuide: [tour_guide_insert_input!]!) {
        insert_tour_guide(
            objects: $tourGuide
            on_conflict: {
                constraint: tour_guide_pkey
                update_columns: [details]
            }
        ) {
            AffectedRowsQL: affected_rows
        }
    }
`;
export const insertTournamentTeamQL = gql`
    mutation insertTournamentTeamQL(
        $teamsToSave: [tournament_team_insert_input!]!
        $teamsMembersToRemove: [String!]!
    ) {
        delete_team_member(where: { teamId: { _in: $teamsMembersToRemove } }) {
            AffectedRowsQL: affected_rows
        }

        insert_tournament_team(
            objects: $teamsToSave
            on_conflict: {
                constraint: tournament_team_pkey
                update_columns: [name, color]
            }
        ) {
            AffectedRowsQL: affected_rows
        }
    }
`;
export const insertTournamentMemberStatusQL = gql`
    mutation insertTournamentMemberStatusQL(
        $tournamentMembers: [tournament_member_status_insert_input!]!
    ) {
        insert_tournament_member_status(
            objects: $tournamentMembers
            on_conflict: {
                constraint: tournament_member_status_pkey
                update_columns: [status]
            }
        ) {
            AffectedRowsQL: affected_rows
        }
    }
`;

export const insertClubMemberQL = gql`
    mutation insertClubMemberQL($objects: [club_member_insert_input!]!) {
        insert_club_member(
            objects: $objects
            on_conflict: {
                constraint: club_member_pkey
                update_columns: [playerId]
            }
        ) {
            AffectedRowsQL: affected_rows
        }
    }
`;
export const insertTourQL = gql`
    mutation insertTourQL($tour: [tour_insert_input!]!) {
        insert_tour(
            objects: $tour
            on_conflict: { constraint: tour_pkey, update_columns: [name] }
        ) {
            AffectedRowsQL: affected_rows
        }
    }
`;

export const DailyRoundsStatQueryQLs = gql`
    query ClubSingleRoundFlightsQuery(
        $clubId: String!
        $fromDate: date!
        $toDate: date!
    ) {
        FlightsQL: flight(
            where: {
                _and: [
                    { adminId: { _eq: $clubId } }
                    { date: { _gte: $toDate } }
                    { date: { _lte: $fromDate } }
                ]
            }
            order_by: { date: asc }
        ) {
            id
            date
            courseHoleSets
            courseHoleSetsInverted
            MembersQL: members {
                flightId
                playerId
                PlayerQL: player {
                    id
                    playerCategory
                }
            }
        }
    }
`;
export const DailyRoundsSecateryQuery = gql`
    query ClubSingleRoundFlightsQuery(
        $courseId: String!
        $fromDate: date!
        $toDate: date!
    ) {
        FlightsQL: flight(
            where: {
                _and: [
                    { courseId: { _eq: $courseId } }
                    { date: { _gte: $fromDate } }
                    { date: { _lte: $toDate } }
                ]
            }
            order_by: { date: asc }
        ) {
            id
            courseHoleSets
            courseHoleSetsInverted
            date
            time
            MembersQL: members {
                flightId
                playerId
                playingTee
                PlayerQL: player {
                    id
                    fullName
                    playerCategory
                    membershipNumber
                }
            }
        }
    }
`;
export const DailyRoundsStatQueryAdminQLs = gql`
    query ClubSingleRoundFlightsQuery($fromDate: date!, $toDate: date!) {
        FlightsQL: flight(
            where: {
                _and: [
                    { date: { _gte: $toDate } }
                    { date: { _lte: $fromDate } }
                ]
            }
            order_by: { date: asc }
        ) {
            id
            date
            courseHoleSets
            courseHoleSetsInverted
            MembersQL: members {
                flightId
                playerId
                PlayerQL: player {
                    id
                    playerCategory
                }
            }
        }
    }
`;
export const ClubSingleRoundFlightsQueryQLs = gql`
    query ClubSingleRoundFlightsQuery(
        $clubId: String!
        $fromDate: date!
        $toDate: date!
    ) {
        FlightsQL: flight(
            where: {
                _and: [
                    { adminId: { _eq: $clubId } }
                    { flightRound: { _eq: 0 } }
                    { date: { _lte: $fromDate } }
                    { date: { _gte: $toDate } }
                ]
            }
        ) {
            id
            date
            MembersQL: members {
                flightId
                playerId
            }
        }
    }
`;
export const ClubSingleRoundFlightsAdminQueryQLs = gql`
    query ClubSingleRoundFlightsQuery($fromDate: date!, $toDate: date!) {
        FlightsQL: flight(
            where: {
                flightRound: { _eq: 0 }
                _and: [
                    { date: { _gte: $toDate } }
                    { date: { _lte: $fromDate } }
                ]
            }
        ) {
            id
            date
            MembersQL: members {
                flightId
                playerId
            }
        }
    }
`;
export const getDailyCardSingle = gql`
    query ClubSingleRoundFlightsQuery(
        $clubId: String!
        $fromDate: date!
        $toDate: date!
    ) {
        TournamentsQL: tournament(
            where: {
                clubId: { _eq: $clubId }
                singleRound: { _eq: true }
                _and: [
                    { startDate: { _gte: $toDate } }
                    { endDate: { _lte: $fromDate } }
                ]
            }
        ) {
            id
            startDate

            FlightsQL: flights {
                id
                ended
                courseHoleSets
                courseHoleSetsInverted
                MembersQL: members {
                    flightId
                    playerId
                    ScoresQL: scores {
                        flightId
                    }
                    PlayerQL: player {
                        id
                        playerCategory
                        firstName
                        lastName
                        handicap
                        handicapWhsIndex
                        membershipNumber
                        email
                    }
                }
            }
        }
    }
`;
export const getDailyTeeTimeReportClub = gql`
    query getDailyTeeTimeReportClub(
        $clubId: String!
        $fromDate: date!
        $toDate: date!
    ) {
        TournamentsQL:tee_time_booking(
            where: {
                clubId: { _eq: $clubId }
                _and: [
                    { teeDate: { _gte: $toDate } }
                    { teeDate: { _lte: $fromDate } }
                ]
            }
        ) {
            id
            teeDate
            slots {
                id
                FlightsQL: flight {
                    id
                    ended
                    courseHoleSets
                    courseHoleSetsInverted
                    MembersQL: members {
                        flightId
                        playerId
                        ScoresQL: scores {
                            flightId
                        }
                        PlayerQL: player {
                            id
                            playerCategory
                            firstName
                            lastName
                            handicap
                            membershipNumber
                            email
                        }
                    }
                }
            }
        }
    }
`;
export const getDailyTeeTimeReportAdmin = gql`
    query getDailyTeeTimeReportClub(
        $fromDate: date!
        $toDate: date!
    ) {
        TournamentsQL:tee_time_booking(
            where: {
                _and: [
                    { teeDate: { _gte: $toDate } }
                    { teeDate: { _lte: $fromDate } }
                ]
            }
        ) {
            id
            teeDate
            slots {
                id
                FlightsQL: flight {
                    id
                    ended
                    courseHoleSets
                    courseHoleSetsInverted
                    MembersQL: members {
                        flightId
                        playerId
                        ScoresQL: scores {
                            flightId
                        }
                        PlayerQL: player {
                            id
                            playerCategory
                            firstName
                            lastName
                            handicap
                            membershipNumber
                            email
                        }
                    }
                }
            }
        }
    }
`;
export const getDailyCardSingleAdmin = gql`
    query ClubSingleRoundFlightsQuery($fromDate: date!, $toDate: date!) {
        TournamentsQL: tournament(
            where: {
                singleRound: { _eq: true }
                _and: [
                    { startDate: { _gte: $toDate } }
                    { endDate: { _lte: $fromDate } }
                ]
            }
        ) {
            id
            startDate
            FlightsQL: flights {
                id
                ended
                courseHoleSets
                courseHoleSetsInverted
                MembersQL: members {
                    flightId
                    playerId
                    ScoresQL: scores {
                        flightId
                    }
                    PlayerQL: player {
                        id
                        playerCategory
                        firstName
                        lastName
                        handicap
                        handicapWhsIndex
                        membershipNumber
                        email
                        membership{
                            club{
                                id
                                name
                            }
                        }
                    }
                }
            }
        }
    }
`;
export const DailyRoundsSingleDashboardQueryQLsAll = gql`
    query ClubSingleRoundFlightsQuery($fromDate: date!, $toDate: date!) {
        TournamentsQL: tournament(
            where: {
                singleRound: { _eq: true }
                _and: [
                    { startDate: { _gte: $toDate } }
                    { endDate: { _lte: $fromDate } }
                ]
            }
        ) {
            startDate
            FlightsQL: flights {
                ended
                MembersQL: members {
                    attendance
                }
            }
        }
    }
`;
export const DailyRoundsSingleDashboardQueryQLs = gql`
    query ClubSingleRoundFlightsQuery(
        $clubId: String!
        $fromDate: date!
        $toDate: date!
    ) {
        TournamentsQL: tournament(
            where: {
                clubId: { _eq: $clubId }
                singleRound: { _eq: true }
                _and: [
                    { startDate: { _gte: $toDate } }
                    { endDate: { _lte: $fromDate } }
                ]
            }
        ) {
            startDate
            FlightsQL: flights {
                ended
                MembersQL: members {
                    attendance
                }
            }
        }
    }
`;
export const ClubSingleRoundFlightsQueryQL = gql`
    query ClubSingleRoundFlightsQuery(
        $clubId: String!
        $fromDate: date!
        $toDate: date!
    ) {
        TournamentsQL: tournament(
            where: {
                clubId: { _eq: $clubId }
                singleRound: { _eq: true }
                _and: [
                    { startDate: { _gte: $toDate } }
                    { endDate: { _lte: $fromDate } }
                ]
            }
        ) {
            ...TournamentQL
            FlightsQL: flights {
                ...FlightQL
                MembersQL: members {
                    flightId
                    playerId
                    attendance
                    guest
                    playingTee
                    playingHandicap
                    playingHandicapWhs

                    PlayerQL: player {
                        ...PlayerQL
                    }
                    ScoresQL: scores(order_by: { hole: { holeNo: asc } }) {
                        ...ScoreQL
                        DetailQL: detail {
                            ...ScoreDetailQL
                        }
                    }
                }
                CourseQL: course {
                    ...CourseQL
                    CourseHoleSetsQL: holeSets {
                        ...CourseHoleSetsQL
                    }
                }
            }
            CourseQL: course {
                ...CourseQL
                CourseHoleSetsQL: holeSets {
                    ...CourseHoleSetsQL
                }
                HolesQL: holes {
                    ...HoleQL
                }
            }
            HandicapQL: player_handicaps {
                ...PlayerHandicapQL
            }
        }
    }
    ${PlayerQL}
    ${TournamentQL}
    ${FlightsQL}
    ${ScoreQL}
    ${ScoreDetailQL}
    ${CourseQL}
    ${CourseHoleSetsQL}
    ${HoleQL}
    ${TournamentRoleManagerQL}
    ${PlayerHandicapQL}
`;
export const ClubSingleRoundFlightsQueryQLA = gql`
    query ClubSingleRoundFlightsQuery($clubId: String!, $toDate: date!) {
        TournamentsQL: tournament(
            where: { clubId: { _eq: $clubId }, startDate: { _eq: $toDate } }
        ) {
            id
            noOfRounds
            playingOnWhs
            adminId
            createdAt

            FlightsQL: flights {
                id
                courseId
                courseHoleSets
                courseHoleSetsInverted
                tournamentId
                date
                ended
                tee
                categoryRound
                tee_id
                time
                flightNo
                MembersQL: members {
                    flightId
                    playerId
                    attendance
                    guest
                    playingTee
                    playingHandicap
                    playingHandicapWhs
                    undoHandicap
                    panelty
                    PlayerQL: player {
                        id
                        firstName
                        lastName
                        handicap
                        membershipNumber
                        picture
                    }
                    ScoresQL: scores(order_by: { hole: { holeNo: asc } }) {
                        ...ScoreQL
                    }
                }
                CourseQL: course {
                    ...CourseQL
                    HolesQL: holes {
                        ...HoleQL
                    }
                }
            }
        }
    }
    ${PlayerQL}
    ${TournamentQL}
    ${FlightsQL}
    ${ScoreQL}
    ${ScoreDetailQL}
    ${CourseQL}
    ${CourseHoleSetsQL}
    ${HoleQL}
    ${TournamentRoleManagerQL}
    ${PlayerHandicapQL}
`;
export const getTeeTimesSlots = gql`
    query ClubSingleRoundFlightsQuery($clubId: String!, $toDate: date!) {
        TournamentsQL: tee_time_booking(
            where: { clubId: { _eq: $clubId }, teeDate: { _eq: $toDate } }
        ) {
            id
            bookingDate
            noOfPlayers
            teeDate
            slots(order_by: { slotTime: asc }) {
                id
                bookingId
                flightId
                joinedMembers
                startingHole
                slotTime
                courseHoleSets
                courseHoleSetsInverted
                FlightsQL: flight {
                    id
                    courseId
                    courseHoleSets
                    courseHoleSetsInverted
                    tournamentId
                    date
                    ended
                    tee
                    categoryRound
                    tee_id
                    time
                    flightNo
                    MembersQL: members {
                        flightId
                        playerId
                        attendance
                        guest
                        playingTee
                        playingHandicap
                        playingHandicapWhs
                        undoHandicap
                        panelty
                        PlayerQL: player {
                            id
                            firstName
                            lastName
                            handicap
                            membershipNumber
                            picture
                            email
                        }
                        ScoresQL: scores(order_by: { hole: { holeNo: asc } }) {
                            ...ScoreQL
                        }
                    }
                    CourseQL: course {
                        ...CourseQL
                        HolesQL: holes {
                            ...HoleQL
                        }
                    }
                }
            }
        }
    }
    ${ScoreQL}
    ${CourseQL}
    ${HoleQL}
`;
export const getTeeTimesSlotsAdmin = gql`
    query ClubSingleRoundFlightsQuery($toDate: date!) {
        TournamentsQL: tee_time_booking(where: { teeDate: { _eq: $toDate } }) {
            id
            bookingDate
            noOfPlayers
            teeDate
            slots {
                id
                bookingId
                flightId
                joinedMembers
                startingHole
                slotTime
                courseHoleSets
                courseHoleSetsInverted
                FlightsQL: flight {
                    id
                    courseId
                    courseHoleSets
                    courseHoleSetsInverted
                    tournamentId
                    date
                    ended
                    tee
                    categoryRound
                    tee_id
                    time
                    flightNo
                    MembersQL: members {
                        flightId
                        playerId
                        attendance
                        guest
                        playingTee
                        playingHandicap
                        playingHandicapWhs
                        undoHandicap
                        panelty
                        PlayerQL: player {
                            id
                            firstName
                            lastName
                            handicap
                            membershipNumber
                            picture
                            email
                        }
                        ScoresQL: scores(order_by: { hole: { holeNo: asc } }) {
                            ...ScoreQL
                        }
                    }
                    CourseQL: course {
                        ...CourseQL
                        HolesQL: holes {
                            ...HoleQL
                        }
                    }
                }
            }
        }
    }
    ${ScoreQL}
    ${CourseQL}
    ${HoleQL}
`;
export const ClubSingleRoundFlightsQueryAdminQLA = gql`
    query ClubSingleRoundFlightsQuery($toDate: date!) {
        TournamentsQL: tournament(
            where: { singleRound: { _eq: true }, startDate: { _eq: $toDate } }
        ) {
            id
            noOfRounds
            playingOnWhs
            adminId
            createdAt

            FlightsQL: flights {
                id
                courseId
                courseHoleSets
                courseHoleSetsInverted
                tournamentId
                date
                ended
                tee
                categoryRound
                tee_id
                time
                flightNo
                MembersQL: members {
                    flightId
                    playerId
                    attendance
                    guest
                    playingTee
                    playingHandicap
                    playingHandicapWhs
                    undoHandicap
                    panelty
                    PlayerQL: player {
                        id
                        firstName
                        lastName
                        handicap
                        membershipNumber
                        picture
                    }
                    ScoresQL: scores(order_by: { hole: { holeNo: asc } }) {
                        ...ScoreQL
                    }
                }
                CourseQL: course {
                    ...CourseQL
                    HolesQL: holes {
                        ...HoleQL
                    }
                }
            }
        }
    }
    ${PlayerQL}
    ${TournamentQL}
    ${FlightsQL}
    ${ScoreQL}
    ${ScoreDetailQL}
    ${CourseQL}
    ${CourseHoleSetsQL}
    ${HoleQL}
    ${TournamentRoleManagerQL}
    ${PlayerHandicapQL}
`;
export const setScoreUpdateTimeQL = gql`
    mutation setScoreUpdateTimeQL($tournamentId: String!, $date: timestamptz!) {
        updateScoreTime: update_tournament(
            where: { id: { _eq: $tournamentId } }
            _set: { scoreUpdateTime: $date }
        ) {
            AffectedRowsQL: affected_rows
        }
    }
`;
export const RoundScoreQLA = gql`
    query ClubSingleRoundFlightsQuery($id: String!) {
        FlightQL: flight(where: { id: { _eq: $id } }) {
            MembersQL: members {
                flightId
                playerId
                playingTee
                playingHandicap
                playingHandicapWhs
                PlayerQL: player {
                    id
                    firstName
                    lastName
                    handicap
                }
                ScoresQL: scores(order_by: { hole: { holeNo: asc } }) {
                    holeId
                    grossScore
                }
            }
            courseHoleSets
            courseHoleSetsInverted
            ended
        }
    }
`;
export const getPlayerScorebyIDQLA = gql`
    query ClubSingleRoundFlightsQuery($id: String!) {
        score(
            where: {
                _and: [
                    { playerId: { _eq: $id } }
                    {
                        updatedAt: {
                            _gte: "2023-09-10T00:00:00Z"
                            _lt: "2023-09-11T00:00:00Z"
                        }
                    }
                    { hole: { courseId: { _eq: "-Nd_BBNwmiEvFbyR-Qtz" } } }
                ]
            }
        ) {
            hole {
                holeNo
            }
            grossScore
        }
    }
`;
export const updateTournamentFlightSettings = gql`
    mutation updateTournamentFlightSettings(
        $where: tournament_member_category_bool_exp!
        $set: tournament_member_category_set_input!
    ) {
        update_tournament_member_category(where: $where, _set: $set) {
            affected_rows
        }
    }
`;

export const eliminateRoundQL = gql`
    mutation eliminateRoundQLMutation(
        $oldFlightId: String!
        $newFlightId: String!
        $playerId: String!
    ) {
        updateFlightMemberQL: update_flight_member(
            where: {
                _and: [
                    { flightId: { _eq: $oldFlightId } }
                    { playerId: { _eq: $playerId } }
                ]
            }
            _set: { flightId: $newFlightId }
        ) {
            AffectedRowsQL: affected_rows
        }

        undoScoreQL: update_score(
            where: {
                _and: [
                    { flightId: { _eq: $oldFlightId } }
                    { playerId: { _eq: $playerId } }
                ]
            }
            _set: { flightId: $newFlightId }
        ) {
            AffectedRowsQL: affected_rows
        }
    }
`;

/******************************************************************************************************************************** */
/*******************************************  Leaderboard Quries and Subscriptions ************************************************/
/******************************************************************************************************************************** */

export const LeaderAllRoundDataQL = gql`
    query leaderAllRoundData($tournamentId: String!) {
        LeaderGrossQL: leader(
            where: {
                tournamentId: { _eq: $tournamentId }
                type: { _eq: "GROSS" }
            }
        ) {
            ...LeaderQL
        }
        LeaderNetQL: leader(
            where: {
                tournamentId: { _eq: $tournamentId }
                type: { _eq: "NET" }
            }
        ) {
            ...LeaderQL
        }
    }
    ${LeaderQL}
`;

export const getallDashboard = gql`
    query geteverything(
        $adminId: String!
        $adminClubId: String!
        $fromDate: date!
        $toDate: date!
    ) {
        TournamentQL: tournament(
            where: {
                _and: [
                    {
                        singleRound: { _eq: false }
                        clubId: { _eq: $adminClubId }
                    }
                ]
            }
            order_by: [{ startDate: desc }]
            limit: 8
        ) {
            id
            title
            matchFormat
            noOfRounds
            admin {
                firstName
                lastName
            }
        }
        TournamentCount: tournament_aggregate(
            where: {_and: [
                {
                    singleRound: { _eq: false }
                    clubId: { _eq: $adminClubId }
                }
            ] }
        ) {
            aggregate {
                count
            }
        }
        Count: flight_aggregate(
            where: { admin: { adminClubId: { _eq: $adminClubId } } }
        ) {
            aggregate {
                count
            }
        }
        AggregateQL: player_aggregate(
            where: { membership: { clubId: { _eq: $adminClubId } } }
        ) {
            aggregate {
                totalCount: count
            }
        }
        club(where: { id: { _eq: $adminClubId } }) {
            Amateurs: members_aggregate(
                where: { player: { playerCategory: { _eq: "Amateurs" } } }
            ) {
                aggregate {
                    count
                }
            }
            Senior_Amateurs: members_aggregate(
                where: {
                    player: { playerCategory: { _eq: "Senior Amateurs" } }
                }
            ) {
                aggregate {
                    count
                }
            }
            Veterans: members_aggregate(
                where: { player: { playerCategory: { _eq: "Veterans" } } }
            ) {
                aggregate {
                    count
                }
            }
            Ladies: members_aggregate(
                where: { player: { playerCategory: { _eq: "Ladies" } } }
            ) {
                aggregate {
                    count
                }
            }
        }
        TournamentsQLs: flight(
            where: {
                adminId: { _eq: $adminId }
                _and: [
                    { date: { _gte: $toDate } }
                    { date: { _lte: $fromDate } }
                ]
            }
        ) {
            date
            ended
            MembersQL: members {
                playerId
                attendance
                player {
                    playerCategory
                }
            }
        }
    }
`;
export const getPlayer = gql`
    query geteverything($fromDate: timestamptz!, $toDate: timestamptz!) {
        player(
            where: {
                _and: [
                    { createdAt: { _lte: $toDate } }
                    { createdAt: { _gt: $fromDate } }
                ]
            }
            order_by: { createdAt: desc }
        ) {
            id
            createdAt
            firstName
            lastName
            playerCategory
            handicap
            handicapWhsIndex
            phone
            email
        }
    }
`;
export const getClubPlayer = gql`
    query getClubPlayer {
        club_member {
            player{
                id
                createdAt
                firstName
                lastName
                playerCategory
                handicap
                handicapWhsIndex
                phone
                email
            }
        }
    }
`;
export const getMobilePlayer = gql`
    query getMobilePlayer {
        player(where:{firebaseUid:{_is_null:false}}) {
            id
            createdAt
            firstName
            lastName
            playerCategory
            handicap
            handicapWhsIndex
            phone
            email
        }
    }
`;
export const getTrailPlayer = gql`
    query getTrailPlayer {
        player_subscription(where:{subscription:{_eq:"TRIAL"}}) {
            player{
                id
                createdAt
                firstName
                lastName
                playerCategory
                handicap
                handicapWhsIndex
                phone
                email
            }
        }
    }
`;
export const getPremiumPlayer = gql`
    query getPremiumPlayer {
        player_subscription(where:{subscription:{_eq:"PREMIUM"}}) {
            player{
                id
                createdAt
                firstName
                lastName
                playerCategory
                handicap
                handicapWhsIndex
                phone
                email
            }
        }
    }
`;

export const getTourDashboard = gql`
    query getTourDashboard(
        $adminId: String!
        $fromDate: date!
        $toDate: date!
    ) {
        tour(
            where: { adminId: { _eq: $adminId } }
            order_by: [{ dateCreated: desc }]
        ) {
            id
            name
            tournaments {
                id
                leagueId
                title
                matchFormat
                noOfRounds
                startDate
                admin {
                    firstName
                    lastName
                }
            }
            members {
                playerId
                player {
                    id
                    playerCategory
                }
            }
        }
        TournamentsQLs: tournament(
            where: {
                adminId: { _eq: $adminId }
                _and: [
                    { startDate: { _gte: $toDate } }
                    { endDate: { _lte: $fromDate } }
                ]
            }
        ) {
            id
            startDate
            MembersQL: members {
                playerId
                player {
                    id
                    playerCategory
                }
            }
        }
    }
`;
export const getTours = gql`
    query getTourDashboard($adminId: String!) {
        tour(
            where: { adminId: { _eq: $adminId } }
            order_by: [{ dateCreated: desc }]
        ) {
            id
            name
            logo
            dateCreated
            startDate
            endDate
            tournaments {
                id
                leagueId
                title
            }
            members {
                playerId
            }
        }
    }
`;
export const getToursReport = gql`
    query getTourDashboard {
        tour(
            order_by: [{ dateCreated: desc }]
        ) {
            id
            name
            logo
            dateCreated
            startDate
            endDate
            tournaments {
                id
                leagueId
                title
            }
            members {
                playerId
            }
            admin{
                firstName
                lastName
                id
                email
            }
        }
    }
`;
export const getToursListByDate = gql`
    query getTourDashboard($fromDate: date!, $toDate: date!) {
        tour(
            where: {
                _and: [
                    { dateCreated: { _lte: $toDate } }
                    { dateCreated: { _gt: $fromDate } }
                ]
            }
            order_by: [{ dateCreated: desc }]
        ) {
            id
            name
            logo
            dateCreated
            startDate
            endDate
            tournaments {
                id
                leagueId
                title
            }
            members {
                playerId
            }
            admin{
                firstName
                lastName
                id
                email
            }
        }
    }
`;
export const getAllAdmin = gql`
    query geteverything($fromDate: date!, $toDate: date!) {
        TournamentQL: tournament(
            where: { singleRound: { _eq: false } }
            order_by: [{ startDate: desc }]
            limit:8
        ) {
            id
            title
            matchFormat
            noOfRounds
            startDate
            endDate
            admin {
                firstName
                lastName
            }
        }
        TournamentCount: tournament_aggregate(where: { singleRound: { _eq: false } }) {
            aggregate {
                count
            }
        }
        Count: flight_aggregate(
            where: { flightRound: { _eq : 0 } }
        ) {
            aggregate {
                count
            }
        }
        AggregateQL: player_aggregate {
            aggregate {
                totalCount: count
            }
        }
        MobileAggregateQL: player_aggregate(where:{firebaseUid:{_is_null:false}}) {
            aggregate {
                 count
            }
        }
        ClubAggregateQL: player_aggregate(where:{firebaseUid:{_is_null:true}}) {
            aggregate {
                 count
            }
        }
        PremiumAggregateQL:player_subscription_aggregate(where:{subscription:{_eq:"PREMIUM"}}) {
            aggregate {
                 count
            }
        }
        TrialAggregateQL:player_subscription_aggregate(where:{subscription:{_eq:"TRIAL"}}) {
            aggregate {
                 count
            }
        }
        TournamentsQLs: flight(
            where: {
                _and: [
                    { date: { _gte: $toDate } }
                    { date: { _lte: $fromDate } }
                ]
            }
        ) {
            date
            ended
            
            MembersQL: members {
                playerId
                attendance
                player {
                    playerCategory
                }
            }
        }
        Tours:tour_aggregate{
            aggregate {
                count
            } 
        }
        Leagues:league_aggregate{
            aggregate {
                count
            } 
        }
    }
`;
