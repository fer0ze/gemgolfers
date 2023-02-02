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
        TournamentQL: tournament(
            where: {
                _or: [
                    { id: { _eq: $tournamentPrefix } }
                    { prefix: { _eq: $tournamentPrefix } }
                ]
            }
        ) {
            cutOffCriteria
            activeRound
            handicapAllocations
            noOfRounds
            webLogoUrl
            matchFormat
            tee_id
            FlightsQL: flights(
                order_by: [{ flightRound: asc }, { flightNo: asc }]
            ) {
                id
                courseId
                courseHoleSets
                flightRound
                flightNo
                name {
                    name
                }
                MembersQL: members(order_by: { playerId: asc }) {
                    playerId
                    PlayerQL: player {
                        id
                        playerCategory
                        handicap
                        firstName
                        lastName
                    }
                    ScoresQL: scores(where: { grossScore: { _gt: 0 } }) {
                        playerId
                        playerHandicap
                        grossScore
                        hole {
                            holeNo
                            index
                            par
                        }
                    }
                }
                CourseQL: course {
                    id
                    noOfHoles
                }
            }
            CategoriesQL: categories {
                ...TournamentMemberCategoryQL
            }
            MemberStatusesQL: member_statuses {
                ...TournamentMemberStatusQL
            }
        }
    }

    ${TournamentMemberCategoryQL}
    ${TournamentMemberStatusQL}
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
            courseId
            title
            noOfRounds
            matchFormat
            members
            cutOffCriteria
            activeRound
            webLogoUrl
            startDate
            endDate
            adminId
            courseHoleSets
            courseHoleSetsInverted
            prefix
            members {
                playerId
                PlayerQL: player {
                    playerCategory
                    firstName
                    lastName
                    handicap
                }
            }
            FlightsQL: flights(
                order_by: [{ flightRound: asc }, { flightNo: asc }]
            ) {
                flightRound
                time
                flightNo
                name {
                    name
                }
                MembersQL: members(order_by: { playerId: asc }) {
                    playerId
                    PlayerQL: player {
                        playerCategory
                        firstName
                        lastName
                        handicap
                    }
                    ScoresQL: scores(where: { grossScore: { _gt: 0 } }) {
                        grossScore
                        playerId
                        playerHandicap
                        hole {
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
        }
    }
    ${TournamentMemberCategoryQL}
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

export const LeaderboardTeamSubscription = gql`
    query LeaderboardTeamSubscription(
        $tournamentId: String!
        $playerId: String!
    ) {
        TournamentQL: tournament_by_pk(id: $tournamentId) {
            ...TournamentQL
            FlightsQL: flights(
                order_by: [{ flightRound: asc }, { flightNo: asc }]
            ) {
                id
                ...FlightManagerTeamQL
                ScoresQL: scores(where: { grossScore: { _gt: 0 } }) {
                    ...ScoreQL
                }
            }
            TeamsQL: teams {
                ...TournamentTeamQL
            }
            OwnRoleManagerQL: role_managers(
                where: { playerId: { _eq: $playerId } }
            ) {
                ...TournamentRoleManagerQL
            }
            LeaderboardAdQL: leaderboard_ad {
                ...LeaderboardAdQL
            }
        }
    }
    ${TournamentQL}
    ${FlightManagerTeamQL}
    ${ScoreQL}
    ${TournamentTeamQL}
    ${TournamentMemberStatusQL}
    ${TournamentRoleManagerQL}
    ${LeaderboardAdQL}
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
            HandicapCalculated: player_handicaps {
                handicap
                oldHandicap
                updatedAt
                player {
                    firstName
                    lastName
                }
            }
            PlayerHandicapWhs: player_handicaps_whs {
                round
                score
                adjustedScore
                handicapDifferential
                handicapIndex
                updatedAt
                player {
                    firstName
                    lastName
                }
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
            HandicapCalculated: player_handicaps {
                handicap
                oldHandicap
                updatedAt
                player {
                    firstName
                    lastName
                }
            }
            PlayerHandicapWhs: player_handicaps_whs {
                round
                score
                adjustedScore
                handicapDifferential
                handicapIndex
                updatedAt
                player {
                    firstName
                    lastName
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
            matchFormat
            course {
                name
            }
        }
    }
`;
export const GetTournamnetListForIncomplete = gql`
    query PostsGetQuery($endDate: date!, $clubId: String!) {
        Scheduled: club_schedule(
            where: {
                _and: [{ date: { _gt: $endDate }, clubId: { _eq: $clubId } }]
            }
            order_by: { date: desc }
        ) {
            id
            title
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
            ggggg
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
    ${PlayerHandicapQL}
    ${PlayerHandicapWhsQL}
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

export const GetClubDashboardStatsQL = gql`
    query GetClubDashboardStatsQL($endDate: date!, $clubId: String!) {
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
            activeRound
            title
        }
        CompletedRecently: tournament(
            limit: 3
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
            activeRound
            title
        }
        HandicapCalculated: tournament(
            limit: 3
            where: {
                _not: { player_handicaps: {} }
                clubId: { _eq: $clubId }
                singleRound: { _eq: false }
            }
            order_by: { endDate: desc }
        ) {
            id
            title
            endDate
        }
    }
    ${TournamentQL}
`;

export const GetClubDashboardStatsQLs = gql`
    query GetClubDashboardStatsQL($endDate: date!) {
        ActiveTournaments: tournament(
            where: {
                _and: [
                    { endDate: { _gte: $endDate }, singleRound: { _eq: false } }
                ]
            }
        ) {
            id
            activeRound
            title
        }
        CompletedRecently: tournament(
            limit: 3
            where: {
                _and: [
                    { endDate: { _lt: $endDate }, singleRound: { _eq: false } }
                ]
            }
            order_by: { endDate: desc }
        ) {
            id
            activeRound
            title
        }
        HandicapCalculated: tournament(
            limit: 3
            where: {
                _not: { player_handicaps: {} }
                singleRound: { _eq: false }
            }
            order_by: { endDate: desc }
        ) {
            id
            title
            endDate
        }
    }
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
        }
    }
    ${TournamentQL}
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
    mutation insert_tournament($objects: [tournament_insert_input!]!) {
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
    }
`;

export const superAdminStatsQL = gql`
    query SuperAdminStatsQL {
        Leagues: league {
            id
        }
        Clubs: club {
            id
        }
        Tours: tour {
            id
        }
        Tournament_Rounds: tournament(where: { singleRound: { _eq: false } }) {
            id
        }
        NON_Tournament_Rounds: tournament(
            where: { singleRound: { _eq: true } }
        ) {
            id
        }
        Tour_Rounds: tournament(where: { tourId: { _is_null: false } }) {
            id
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

export const DailyRoundsStatQueryQLs = gql`
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
                    PlayerQL: player {
                        playerCategory
                    }
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
                        playerCategory
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
            where: {
                clubId: { _eq: $clubId }
                singleRound: { _eq: true }
                startDate: { _eq: $toDate }
            }
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

                ScoresQL: scores(order_by: { hole: { holeNo: asc } }) {
                    holeId
                    grossScore
                }
            }
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

/* query to fetch data only once when leaderboard is shown, this data usually does not changes */
export const LeaderboardOneTimeDataQueryQL = gql`
    query LeaderboardOneTimeDataQuery(
        $tournamentId: String!
        $playerId: String!
    ) {
        TournamentQL: tournament(
            where: { _or: [{ id: { _eq: $tournamentId } }] }
        ) {
            ...TournamentQL
            CourseQL: course {
                ...CourseQL
                HolesQL: holes(order_by: [{ holeNo: asc }]) {
                    ...HoleQL
                }
            }
            CategoriesQL: categories {
                ...TournamentMemberCategoryQL
            }
            TeamsQL: teams {
                ...TournamentTeamQL
            }
            OwnRoleManagerQL: role_managers(
                where: { playerId: { _eq: $playerId } }
            ) {
                ...TournamentRoleManagerQL
            }
            SubTournamentsQL: sub_tournaments {
                SubTournamentQL: sub_tournament {
                    ...TournamentQL
                }
            }
            ParentTournamentQL: parent_tournament {
                TournamentQL: tournament {
                    ...TournamentQL
                    SubTournamentsQL: sub_tournaments {
                        SubTournamentQL: sub_tournament {
                            ...TournamentQL
                        }
                    }
                }
            }
            LeaderboardAdQL: leaderboard_ad {
                ...LeaderboardAdQL
            }
        }
    }
    ${TournamentQL}
    ${HoleQL}
    ${ScoreQL}
    ${TournamentMemberCategoryQL}
    ${TournamentTeamQL}
    ${TournamentRoleManagerQL}
    ${LeaderboardAdQL}
    ${CourseQL}
`;

/* subscription to fetch active round and all rounds processed leader live data */
export const LeaderRoundsSubscriptionQL = gql`
    subscription LeaderRoundsSubscription(
        $tournamentId: String!
        $activeRound: Int!
    ) {
        TournamentQL: tournament(
            where: {
                _or: [
                    { id: { _eq: $tournamentId } }
                    { prefix: { _eq: $tournamentId } }
                ]
            }
        ) {
            LeaderGrossQL: leaders(
                where: {
                    flight: { flightRound: { _eq: $activeRound } }
                    type: { _eq: "GROSS" }
                }
                order_by: [
                    { position: asc }
                    { player: { firstName: asc, lastName: asc } }
                ]
            ) {
                ...LeaderQL
            }
            LeaderNetQL: leaders(
                where: {
                    flight: { flightRound: { _eq: $activeRound } }
                    type: { _eq: "NET" }
                }
                order_by: [
                    { position: asc }
                    { player: { firstName: asc, lastName: asc } }
                ]
            ) {
                ...LeaderQL
            }
            LeaderAllRoundGrossQL: leader_all_rounds(
                where: { type: { _eq: "GROSS" } }
                order_by: [
                    { position: asc }
                    { player: { firstName: asc, lastName: asc } }
                ]
            ) {
                ...LeaderAllRoundQL
            }
            LeaderAllRoundNetQL: leader_all_rounds(
                where: { type: { _eq: "NET" } }
                order_by: [
                    { position: asc }
                    { player: { firstName: asc, lastName: asc } }
                ]
            ) {
                ...LeaderAllRoundQL
            }
        }
    }
    ${LeaderQL}
    ${LeaderAllRoundQL}
`;

export const LeaderAllRoundDataQL = gql`
    query leaderAllRoundData($tournamentId: String!) {
        TournamentLeaderDataQL: leader_all_round(
            where: { tournamentId: { _eq: $tournamentId } }
        ) {
            ...LeaderAllRoundQL
        }

        TouranmentCategoriesQL: tournament_member_category(
            where: { tournamentId: { _eq: $tournamentId } }
        ) {
            ...TournamentMemberCategoryQL
        }

        TouranmentPlayersStatusQL: tournament_member_status(
            where: { tournamentId: { _eq: $tournamentId } }
        ) {
            ...TournamentMemberStatusQL
        }
    }
    ${LeaderAllRoundQL}
    ${TournamentMemberCategoryQL}
    ${TournamentMemberStatusQL}
`;

export const LeaderRoundQueryQL = gql`
    query LeaderRoundQuery($tournamentId: String!, $round: Int!) {
        LeaderGrossQL: leader(
            where: {
                tournamentId: { _eq: $tournamentId }
                flight: { flightRound: { _eq: $round } }
                type: { _eq: "GROSS" }
            }
            order_by: [
                { position: asc }
                { player: { firstName: asc, lastName: asc } }
            ]
        ) {
            ...LeaderQL
        }
        LeaderNetQL: leader(
            where: {
                tournamentId: { _eq: $tournamentId }
                flight: { flightRound: { _eq: $round } }
                type: { _eq: "NET" }
            }
            order_by: [
                { position: asc }
                { player: { firstName: asc, lastName: asc } }
            ]
        ) {
            ...LeaderQL
        }
    }
    ${LeaderQL}
`;

export const getTournamentCountsByClub = gql`
    query getTournamentCountsByClub($where: tournament_bool_exp!) {
        Count: tournament(where: $where) {
            id
            title
            matchFormat
            noOfRounds
        }
    }
`;
export const getTournamentCountsByClubAll = gql`
    query getTournamentCountsByClub($where: tournament_bool_exp!) {
        Count: tournament_aggregate(where: $where) {
            aggregate {
                count
            }
        }
    }
`;

export const getallDashboard = gql`
    query geteverything(
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
            },
            order_by: [{ startDate: desc }]
        ) {
            id
            title
            matchFormat
            noOfRounds
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
        TournamentsQLs: tournament(
            where: {
                clubId: { _eq: $adminClubId }
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
