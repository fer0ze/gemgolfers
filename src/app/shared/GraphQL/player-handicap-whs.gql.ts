import gql from 'graphql-tag';
import { TournamentQL } from '../fragments/tournament.fragment';
import { FlightsQL } from '../fragments/flight.fragment';
import { ScoreQL, HoleQL } from '../fragments/score.fragment';
import { CourseQL, CourseRatingQL } from '../fragments/course.fragment';
import {
    PlayerQL,
    PlayerHandicapQL,
    PlayerHandicapWhsQL,
} from '../fragments/player.fragment';

export const TournamentScoresQueryQL = gql`
    query TournamentScoresQuery($tournamentId: String!) {
        TournamentQL: tournament_by_pk(id: $tournamentId) {
            ...TournamentQL
            CourseQL: course {
                ...CourseQL
                HolesQL: holes {
                    ...HoleQL
                }
                CourseRatingsQL: ratings {
                    ...CourseRatingQL
                }
            }
            LeagueQL: league {
                MembersQL: members {
                    playerId
                    handicap
                }
            }
            FlightsQL: flights(order_by: [{ flightRound: asc }]) {
                ...FlightQL
                MembersQL: members(order_by: [{ player: { firstName: asc } }]) {
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
            PlayerHandicapsWhsQL: player_handicaps_whs(
                order_by: [{ round: asc }]
            ) {
                round
                ...PlayerHandicapWhsQL
            }
        }
    }
    ${TournamentQL}
    ${CourseQL}
    ${CourseRatingQL}
    ${HoleQL}
    ${FlightsQL}
    ${PlayerQL}
    ${ScoreQL}
    ${PlayerHandicapQL}
    ${PlayerHandicapWhsQL}
`;
export const getTorunamentScoreViewQueryQL = gql`
    query TournamentScoresQuery($tournamentId: String!) {
        TournamentQL: tournament_by_pk(id: $tournamentId) {
           id 
           handicapAllocations
           matchFormat
            CourseQL: course {
                id
                noOfHoles  
            }
            FlightsQL: flights(order_by: [{ flightRound: asc }]) {
                id
                flightRound
                name {
                    name
                }
                MembersQL: members(order_by: [{ player: { firstName: asc } }]) {
                    playerId
                    PlayerQL: player {
                        id
                        firstName
                        lastName
                        picture
                        playerCategory
                        handicap
                    }
                    ScoresQL: scores(where: { grossScore: { _gt: 0 } }) {
                        ...ScoreQL
                    }
                }
            }
            TeamsQL: teams {
                id
                tournamentId
                name
                
            }
            OpponentsQL: opponents {
                id
                flightId
                team1Id
                team2Id
                team1MemberId
                team2MemberId
                tournamentId
        
            }
        }
    }

    ${ScoreQL}  
`;

export const PlayersHandicapWhsHistoryQueryQL = gql`
    query PlayersHandicapWhsHistoryQuery(
        $playerIds: [String!]!
        $playingDate: timestamptz!
    ) {
        PlayerQL: player(where: { id: { _in: $playerIds } }) {
            id
            HandicapHistoryWhsQL: handicap_history_whs(
                where: { playedAt: { _lte: $playingDate } }
                order_by: [{ playedAt: desc }]
                limit: 40
            ) {
                ...PlayerHandicapWhsQL
                TournamentQL: tournament {
                    tee
                    courseHoleSets
                    CourseQL: course {
                        ...CourseQL
                    }
                }
            }
        }
    }
    ${PlayerHandicapWhsQL}
    ${CourseQL}
`;
export const PlayersHandicapWhsHistoryAboveDateQueryQL = gql`
    query PlayersHandicapWhsHistoryQuery(
        $playerId: String!
        $playingDate: timestamptz!
    ) {
        HandicapHistoryWhsQL: player_handicap_whs(
            where: {
                _and: [
                    { playerId: { _eq: $playerId } }
                    { playedAt: { _gte: $playingDate } }
                ]
            }
        ) {
            playerId
        }
    }
`;

export const SavePlayerWhsHandicapsMutationQL = gql`
    mutation SavePlayerWhsHandicapsMutation(
        $handicapsWhs: [player_handicap_whs_insert_input!]!
    ) {
        HandicapWhsEntryQL: insert_player_handicap_whs(
            objects: $handicapsWhs
            on_conflict: {
                constraint: player_handicap_whs_pkey
                update_columns: [
                    handicapDifferential
                    updatedAt
                    playedAt
                    score
                ]
            }
        ) {
            AffectedRowsQL: affected_rows
        }
    }
`;

export const UpdatePlayersHandicapWhsIndexMutationQL = gql`
    mutation UpdatePlayersHandicapWhsIndexMutation(
        $playersWithHandicapWhsIndex: [player_insert_input!]!
        $handicapChangeLog: [handicap_change_log_insert_input!]!
    ) {
        UpdateHandicapWhsIndexQL: insert_player(
            objects: $playersWithHandicapWhsIndex
            on_conflict: {
                constraint: player_pkey
                update_columns: [handicapWhsIndex]
            }
        ) {
            AffectedRowsQL: affected_rows
        }
        HandicapChangeLogEntryQL: insert_handicap_change_log(
            objects: $handicapChangeLog
            on_conflict: {
                constraint: handicap_change_log_pkey
                update_columns: [
                    oldHandicap
                    newHandicap
                    whs
                    dateTime
                    remarks
                    tournamentId
                    updaterId
                ]
            }
        ) {
            AffectedRowsQL: affected_rows
        }
    }
`;

export const UpdatePlayersHandicapWhsIndexQL = gql`
    mutation UpdatePlayersHandicapWhsIndexMutation(
        $handicapsWhs: [player_handicap_whs_insert_input!]!
    ) {
        HandicapWhsEntryQL: insert_player_handicap_whs(
            objects: $handicapsWhs
            on_conflict: {
                constraint: player_handicap_whs_pkey
                update_columns: [handicapIndex]
            }
        ) {
            AffectedRowsQL: affected_rows
        }
    }
`;
export const updatePlayerHandicapWhsDifferentialQL = gql`
    mutation UpdatePlayersHandicapWhsIndexMutation(
        $handicapsWhs: [player_handicap_whs_insert_input!]!
    ) {
        HandicapWhsEntryQL: insert_player_handicap_whs(
            objects: $handicapsWhs
            on_conflict: {
                constraint: player_handicap_whs_pkey
                update_columns: [handicapDifferential]
            }
        ) {
            AffectedRowsQL: affected_rows
        }
    }
`;
