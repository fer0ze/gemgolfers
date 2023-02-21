import gql from 'graphql-tag';
import {
    PlayerQL,
    PlayerHandicapQL,
    PlayerHandicapWhsQL,
    PlayerHandicapLogQL,
} from '../fragments/player.fragment';
import { FlightsQL } from '../fragments/flight.fragment';
import { ScoreQL, ScoreDetailQL } from '../fragments/score.fragment';
import { CourseQL } from '../fragments/course.fragment';

export const GetPlayers = gql`
    query PostsGetQuery {
        AggregateQL: player_aggregate {
            aggregate {
                totalCount: count
            }
        }
        player(
            where: { firstName: { _neq: "" } }
            order_by: { firstName: asc }
        ) {
            id
            firstName
            lastName
            playerCategory
            handicap
            handicapWhsIndex
            phone
            email
            homeClubId
            membershipNumber
            membershipQL: membership {
                suspended
            }
        }
    }
    ${PlayerQL}
`;

export const GetPlayersByClub = gql`
    query PostsGetQuery($where: player_bool_exp!) {
        AggregateQL: player_aggregate(where: $where) {
            aggregate {
                totalCount: count
            }
        }
        player(where: $where, order_by: { firstName: asc }) {
            id
            firstName
            lastName
            playerCategory
            handicap
            homeClubId
            handicapWhsIndex
            phone
            email
            membershipNumber
            membershipQL: membership {
                suspended
            }
        }
    }
`;
export const getPlayersList = gql`
    query PostsGetQuery($where: player_bool_exp!) {
        player(where: $where, order_by: { firstName: asc }) {
            id
            firstName
            lastName
            playerCategory
            handicap
            email
            membershipNumber
        }
    }
`;
export const getPlayersListByClubCONGU = gql`
    query PostsGetQuery($where: player_bool_exp!) {
        player(where: $where, order_by: { firstName: asc }) {
            id
            firstName
            lastName
            playerCategory
            handicap
            handicapWhsIndex
            phone
            email
            membershipNumber
            handicapQL: handicap_history(
                order_by: { updatedAt: desc }
                limit: 1
            ) {
                handicap
                oldHandicap
                updatedAt
            }
        }
    }
`;
export const getPlayersListByClubOnlyWHS = gql`
    query PostsGetQuery($where: player_bool_exp!) {
        player(where: $where, order_by: { firstName: asc }) {
            id
            firstName
            lastName
            playerCategory
            handicap
            handicapWhsIndex
            phone
            email
            membershipNumber
        }
    }
`;
export const getTotalPlayers = gql`
    query PostsGetQuery($where: player_bool_exp!) {
        AggregateQL: player_aggregate(where: $where) {
            aggregate {
                totalCount: count
            }
        }
    }
`;
export const getTotalPlayersAll = gql`
    query PostsGetQuery {
        AggregateQL: player_aggregate {
            aggregate {
                totalCount: count
            }
        }
    }
`;
export const GetTotalFLightPlayed = gql`
    query PostsGetQuery($where: player_bool_exp!, $date: date!, $sdate: date!) {
        player(where: $where) {
            id
            firstName
            lastName
            playerCategory
            handicap
            membershipNumber
            AggregateQL: flights_played_aggregate(
                where: {
                    _and: [
                        { flight: { date: { _gte: $sdate } } }
                        { flight: { date: { _lte: $date } } }
                    ]
                }
            ) {
                aggregate {
                    count
                }
            }
        }
    }
`;

export const GetPlayerByID = gql`
    query PostsGetQuery($where: player_bool_exp!) {
        player(where: $where) {
            ...PlayerQL
            subscriptionQL: subscription {
                playerId
                subscription
            }
        }
    }
    ${PlayerQL}
`;

export const GetPlayerByFilter = gql`
    query PostsGetQuery($where: player_bool_exp!) {
        player(where: $where) {
            id
            fullName
            firstName
            lastName
            phone
            handicap
            playerCategory
            membershipNumber
        }
    }
    ${PlayerQL}
`;
export const getPlayerByEmailLogin = gql`
    query PostsGetQuery($where: player_bool_exp!) {
        player(where: $where) {
            ...PlayerQL
            subscriptionQL: subscription {
                playerId
                subscription
            }
        }
    }
    ${PlayerQL}
`;

export const GetPlayerByMembershipNumber = gql`
    query PostsGetQuery($where: player_bool_exp!) {
        player(where: $where) {
            id
            fullName
            firstName
            lastName
            handicap
            playerCategory
            membershipNumber
            membership {
                club {
                    name
                }
            }
            subscriptionQL: subscription {
                playerId
                subscription
            }
        }
    }
    ${PlayerQL}
`;

export const GetPlayerByFirstName = gql`
    query PostsGetQuery($where: player_bool_exp!) {
        player(where: $where) {
            id
            fullName
            firstName
            lastName
            handicap
            playerCategory
            membershipNumber
            membership {
                club {
                    name
                }
            }
            subscriptionQL: subscription {
                playerId
                subscription
            }
        }
    }
    ${PlayerQL}
`;

export const GetPlayerByClub = gql`
    query PostsGetQuery($where: club_member_bool_exp!) {
        AggregateQL: club_member_aggregate(where: $where) {
            aggregate {
                totalCount: count
            }
        }
        club_member(where: $where) {
            player {
                id
                firstName
                lastName
                playerCategory
                handicap
                handicapWhsIndex
                phone
                email
                membershipNumber
            }
        }
    }
    ${PlayerQL}
`;

export const AddMutation = gql`
    mutation insert_player($objects: [player_insert_input!]!) {
        insert_player(objects: $objects) {
            returning {
                id
            }
        }
    }
`;

export const AddMutationHandicapLog = gql`
    mutation insert_handicap_change_log(
        $objects: [handicap_change_log_insert_input!]!
    ) {
        insert_handicap_change_log(objects: $objects) {
            returning {
                id
            }
        }
    }
`;

export const GetPlayerlistbyName = gql`
    query PostsGetQuery($where: player_bool_exp!) {
        player(where: $where) {
            ...PlayerQL
            subscriptionQL: subscription {
                playerId
                subscription
            }
        }
    }
    ${PlayerQL}
`;
export const getPlayerlistbyNameClubWise = gql`
    query PostsGetQuery($where: player_bool_exp!) {
        player(where: $where) {
            ...PlayerQL
            subscriptionQL: subscription {
                playerId
                subscription
            }
        }
    }
    ${PlayerQL}
`;

export const GetPlayerTodayRoundQL = gql`
    query GetPlayerTodayRoundQL($playerId: String!, $toDate: date!) {
        flight(
            where: {
                _and: [
                    { date: { _eq: $toDate } }
                    { members: { playerId: { _eq: $playerId } } }
                ]
            }
        ) {
            id
        }
    }
`;

export const SavePlayersList = gql`
    mutation SavePlayersListMutation(
        $playersToSave: [player_insert_input!]!
        $clubmembers: [club_member_insert_input!]!
    ) {
        PlayerEntryQLi: insert_player(
            objects: $playersToSave
            on_conflict: {
                constraint: player_pkey
                update_columns: [
                    phone
                    email
                    firstName
                    lastName
                    membershipNumber
                ]
            }
        ) {
            AffectedRowsQLi: affected_rows
        }
        insert_club_member(
            objects: $clubmembers
            on_conflict: {
                constraint: club_member_pkey
                update_columns: [playerId]
            }
        ) {
            returning {
                playerId
            }
        }
    }
`;

export const UpdateMutation = gql`
    mutation updateMutation(
        $where: player_bool_exp!
        $set: player_set_input!
        $playerID: String!
        $clubID: String!
        $suspended: Boolean!
    ) {
        update_player(where: $where, _set: $set) {
            affected_rows
            returning {
                id
            }
        }
        delete_club_member(where: { playerId: { _eq: $playerID } }) {
            affected_rows
        }
        insert_club_member(
            objects: [
                { clubId: $clubID, playerId: $playerID, suspended: $suspended }
            ]
            on_conflict: {
                constraint: club_member_pkey
                update_columns: [suspended]
            }
        ) {
            returning {
                playerId
            }
        }
    }
`;

// export const DeletePlayer = gql`
// mutation DeletePlayer($where: player_bool_exp!) {
//     delete_player(
//       where: $where
//     ) {
//       affected_rows
//       returning {
//         id
//       }
//     }
//   }`;

export const DeletePlayer = gql`
    mutation DeletePlayer($where: club_member_bool_exp!) {
        delete_club_member(where: $where) {
            affected_rows
        }
    }
`;

export const PlayerFlightScoresQuery = gql`
    query PlayerFlightScoresQuery($playerId: String!) {
        PlayerQL: player(where: { id: { _eq: $playerId } }) {
            id
            firstName
            membershipNumber
            lastName
            playerCategory
            handicapWhsIndex
            phone
            handicap
            countryCode
            gender
        }
        HandicapQL: player_handicap(
            where: { playerId: { _eq: $playerId } }
            order_by: [{ tournament: { startDate: desc } }]
            limit:20
        ) {
            ...PlayerHandicapQL
        }
        MemberQL: flight_member(
            where: { playerId: { _eq: $playerId } }
            order_by: [
                { flight: { date: desc } }
                { flight: { flightRound: asc } }
                { flight: { flightNo: asc } }
            ]
        ) {
            FlightQL: flight {
                flightRound
                flightNo
                date
                name {
                    name
                }
                ScoresQL: scores(where: { playerId: { _eq: $playerId } }) {
                    playerId
                    playerHandicap
                    grossScore
                    hole {
                        holeNo
                        index
                        par
                    }
                }
                CourseQL: course {
                    ...CourseQL
                }
            }
        }
    }
    ${FlightsQL}
    ${ScoreQL}
    ${ScoreDetailQL}
    ${CourseQL}
    ${PlayerQL}
    ${PlayerHandicapQL}
`;

export const AllPlayersByCategoryQL = gql`
    query playersByCategory {
        Amateurs: player(where: { playerCategory: { _eq: "Amateurs" } }) {
            id
        }
        Seniors: player(where: { playerCategory: { _eq: "Seniors" } }) {
            id
        }
        Veterans: player(where: { playerCategory: { _eq: "Veterans" } }) {
            id
        }
        Juniors: player(where: { playerCategory: { _eq: "Juniors" } }) {
            id
        }
        Professionals: player(
            where: { playerCategory: { _eq: "Professionals" } }
        ) {
            id
        }
        Ladies: player(where: { playerCategory: { _eq: "Ladies" } }) {
            id
        }
    }
`;

export const PlayerHandicapListByClubQL = gql`
    query getPlayerHandi($clubId: String!) {
        player(where: { membership: { clubId: { _eq: $clubId } } }) {
            ...PlayerQL
            handicapQL: handicap_history_log(
                distinct_on: [playerId]
                order_by: [{ playerId: asc }]
            ) {
                ...PlayerHandicapLogQL
            }
        }
    }
    ${PlayerQL}
    ${PlayerHandicapLogQL}
`;

export const PlayerHandicapListByplayerIdQL = gql`
    query getPlayerHandicap($where: flight_bool_exp!, $playerId: String!) {
        flight(where: $where) {
            date
            members(where: { playerId: { _eq: $playerId } }) {
                playingHandicapWhs
                playingHandicap
                playingTee
                player {
                    firstName
                    lastName
                    membershipNumber
                }
            }
        }
    }
    ${PlayerHandicapLogQL}
`;

export const createMarshalQL = gql`
    mutation createMarshalQL($objects: [marshal_insert_input!]!) {
        insert_marshal(objects: $objects) {
            returning {
                id
            }
        }
    }
`;

export const PlayerHandicapQuery = gql`
    query PlayerHandicapQuery($playerId: String!) {
        PlayerQL: player_by_pk(id: $playerId) {
            firstName
            id
            HandicapHistoryWhsQL: handicap_history_whs(
                order_by: { playedAt: desc }
                limit: 40
            ) {
                Handicap_id
                playerId
                adjustedScore
                back9
                combined_handicap {
                    playerId
                    round
                    handicapDifferential
                }
                combined_handicap_id
                exceptionalScore
                front9
                handicapDifferential
                handicapIndex
                is_combined
                playedAt
                updatedAt
                score
                tournamentQL: tournament {
                    title
                    startDate
                    endDate
                }
                used_handicaps {
                    id
                    used_handicap_id
                    combine_handicap_id
                    holes
                }
            }
        }
    }
    ${PlayerHandicapWhsQL}
    ${PlayerQL}
`;
export const PlayerHandicapRoundQuery = gql`
    query PlayerHandicapQuery($courseId: String!, $courseHoleSets: Int!) {
        course_rating(
            where: {
                courseId: { _eq: $courseId }
                _and: [{ courseHoleSets: { _eq: $courseHoleSets } }]
            }
        ) {
            courseId
            tee
            courseHoleSets
            courseRating
            slopeRating
            coursePar
            tee_id
            tee_name {
                id
                name
                key
            }
        }
    }

`;

export const searchPlayerQL = gql`
    query searchPlayerQL(
        $firstName: String!
        $lastName: String!
        $playerCategory: String!
        $handicapLower: numeric!
        $handicapUpper: numeric!
    ) {
        Result11: player(
            where: {
                firstName: { _ilike: $firstName }
                _or: [
                    { firstName: { _ilike: $lastName } }
                    { lastName: { _ilike: $lastName } }
                ]
                playerCategory: { _ilike: $playerCategory }
                handicap: { _gte: $handicapLower, _lte: $handicapUpper }
                firebaseUid: { _neq: "" }
            }
        ) {
            ...PlayerQL
        }
        Result12: player(
            where: {
                firstName: { _ilike: $firstName }
                _or: [
                    { firstName: { _ilike: $lastName } }
                    { lastName: { _ilike: $lastName } }
                ]
                playerCategory: { _ilike: $playerCategory }
                firebaseUid: { _neq: "" }
            }
        ) {
            ...PlayerQL
        }
        Result13: player(
            where: {
                firstName: { _ilike: $firstName }
                _or: [
                    { firstName: { _ilike: $lastName } }
                    { lastName: { _ilike: $lastName } }
                ]
                firebaseUid: { _neq: "" }
            }
        ) {
            ...PlayerQL
        }
        Result21: player(
            where: {
                firstName: { _ilike: $firstName }
                _or: [
                    { firstName: { _ilike: $lastName } }
                    { lastName: { _ilike: $lastName } }
                ]
                playerCategory: { _ilike: $playerCategory }
                handicap: { _gte: $handicapLower, _lte: $handicapUpper }
            }
        ) {
            ...PlayerQL
        }
        Result22: player(
            where: {
                firstName: { _ilike: $firstName }
                _or: [
                    { firstName: { _ilike: $lastName } }
                    { lastName: { _ilike: $lastName } }
                ]
                playerCategory: { _ilike: $playerCategory }
            }
        ) {
            ...PlayerQL
        }
        Result23: player(
            where: {
                firstName: { _ilike: $firstName }
                _or: [
                    { firstName: { _ilike: $lastName } }
                    { lastName: { _ilike: $lastName } }
                ]
            }
        ) {
            ...PlayerQL
        }
        Result31: player(
            where: {
                _or: [
                    { firstName: { _ilike: $firstName } }
                    { lastName: { _ilike: $lastName } }
                ]
                playerCategory: { _ilike: $playerCategory }
                handicap: { _gte: $handicapLower, _lte: $handicapUpper }
                firebaseUid: { _neq: "" }
            }
        ) {
            ...PlayerQL
        }
        Result32: player(
            where: {
                _or: [
                    { firstName: { _ilike: $firstName } }
                    { lastName: { _ilike: $lastName } }
                ]
                playerCategory: { _ilike: $playerCategory }
                firebaseUid: { _neq: "" }
            }
        ) {
            ...PlayerQL
        }
        Result33: player(
            where: {
                _or: [
                    { firstName: { _ilike: $firstName } }
                    { lastName: { _ilike: $lastName } }
                ]
                firebaseUid: { _neq: "" }
            }
        ) {
            ...PlayerQL
        }
        Result41: player(
            where: {
                _or: [
                    { firstName: { _ilike: $firstName } }
                    { lastName: { _ilike: $lastName } }
                ]
                playerCategory: { _ilike: $playerCategory }
                handicap: { _gte: $handicapLower, _lte: $handicapUpper }
            }
        ) {
            ...PlayerQL
        }
        Result42: player(
            where: {
                _or: [
                    { firstName: { _ilike: $firstName } }
                    { lastName: { _ilike: $lastName } }
                ]
                playerCategory: { _ilike: $playerCategory }
            }
        ) {
            ...PlayerQL
        }
        Result43: player(
            where: {
                _or: [
                    { firstName: { _ilike: $firstName } }
                    { lastName: { _ilike: $lastName } }
                ]
            }
        ) {
            ...PlayerQL
        }
    }
    ${PlayerQL}
`;
export const searchPlayerForTournamentQL = gql`
    query searchPlayerQL(
        $fullName: String!
        $handicapLower: numeric!
        $handicapUpper: numeric!
    ) {
        Result: player(
            where: {
                _or: [
                    { fullName: { _ilike: $fullName } }
                    { handicap: { _gte: $handicapLower, _lte: $handicapUpper } }
                ]
            }
        ) {
            id
            fullName
            firstName
            lastName
            handicap
            playerCategory
            membershipNumber
            membership {
                club {
                    name
                }
            }
        }
    }
    ${PlayerQL}
`;
export const playerUpdatedHandicapReport = gql`
    query playerUpdatedHandicapReport($fromDate: date!, $toDate: date!) {
        player_handicap(
            where: {
                _and: [
                    { tournament: { startDate: { _gte: $toDate } } }
                    { tournament: { endDate: { _lte: $fromDate } } }
                ]
            }
            order_by: [
                { tournament: { endDate: asc } }
                { player: { fullName: asc } }
            ]
        ) {
            ...PlayerHandicapQL
        }
    }
    ${PlayerHandicapQL}
`;
export const playerUpdatedHandicapWHSReport = gql`
    query playerUpdatedHandicapReport(
        $clubId: String!
        $fromDate: date!
        $toDate: date!
    ) {
        player_handicap_whs(
            where: {
                player: { membership: { clubId: { _eq: $clubId } } }
                _and: [
                    { tournament: { endDate: { _gte: $toDate } } }
                    { tournament: { endDate: { _lte: $fromDate } } }
                ]
            }
            order_by: [
                { tournament: { endDate: desc } }
                { player: { fullName: asc } }
            ]
        ) {
            adjustedScore
            handicapDifferential
            handicapIndex
            playedAt
            score
            player {
                firstName
                lastName
                membershipNumber
            }
            tournament {
                endDate
            }
        }
    }
    ${PlayerHandicapWhsQL}
`;
