import gql from "graphql-tag";
import { FlightsQL, FlightManagerQL } from "../fragments/flight.fragment";
import { PlayerQL } from "../fragments/player.fragment";
import { ScoreQL, ScoreDetailQL, HoleQL } from "../fragments/score.fragment";
import { CourseQL, CourseHoleSetsQL } from "../fragments/course.fragment";
import {
  TournamentQL,
  TournamentMemberCategoryQL,
} from "../fragments/tournament.fragment";

export const SaveRoundFlightsMutation = gql`
  mutation SaveRoundFlightsMutation(
   
    $flightsToSave: [flight_insert_input!]!

  ) {
    FlightEntryQLi: insert_flight(
      objects: $flightsToSave
      on_conflict: {
        constraint: flight_pkey
        update_columns: [
          courseId
          courseHoleSets
          flightNo
          flightRound
          startingHole
          tee
          date
          tee_id
          time
          ended
        ]
      }
    ) {
      AffectedRowsQLi: affected_rows
    }
  }
`;
export const SaveTournamentFlightsMutation = gql`
  mutation SaveTournamentFlightsMutation(
    $tournamentId: String!
    $flightsToSave: [flight_insert_input!]!
    $flightMembersToSave: [flight_member_insert_input!]!
  ) {
    TournamentEntryQLi: update_tournament(
      where: { id: { _eq: $tournamentId } }
      _set: { started: true }
    ) {
      AffectedRowsQLi: affected_rows
    }
    FlightEntryQLi: insert_flight(
      objects: $flightsToSave
      on_conflict: {
        constraint: flight_pkey
        update_columns: [
          courseId
          courseHoleSets
          flightNo
          flightRound
          startingHole
          tee
          date
          tee_id
          time
          ended
        ]
      }
    ) {
      AffectedRowsQLi: affected_rows
    }
    FlightMembersEntryQLi: insert_flight_member(
      objects: $flightMembersToSave
      on_conflict: {
        constraint: flight_member_pkey
        update_columns: [playingTee, tee_id, attendance]
      }
    ) {
      AffectedRowsQLi: affected_rows
    }
  }
`;
export const SaveFlightsMembersMutation = gql`
  mutation SaveFlightsMembersMutation(
    $flightMembersToSave: [flight_member_insert_input!]!
  ) {
   
    FlightMembersEntryQLi: insert_flight_member(
      objects: $flightMembersToSave
      on_conflict: {
        constraint: flight_member_pkey
        update_columns: [flightId, playerId, playingTee, tee_id, attendance]
      }
    ) {
      AffectedRowsQLi: affected_rows
    }
  }
`;

export const SaveTournamentFlightsMutationsForTaxes = gql`
  mutation SaveTournamentFlightsMutation(
    $tournamentId: String!
    $flightNamesToSave: [flight_name_insert_input!]!
    $flightsToSave: [flight_insert_input!]!
    $flightMembersToSave: [flight_member_insert_input!]!
  ) {
    TournamentEntryQLi: update_tournament(
      where: { id: { _eq: $tournamentId } }
      _set: { started: true }
    ) {
      AffectedRowsQLi: affected_rows
    }
    FlightEntryQLi: insert_flight(
      objects: $flightsToSave
      on_conflict: {
        constraint: flight_pkey
        update_columns: [
          courseId
          courseHoleSets
          flightNo
          flightRound
          startingHole
          tee
          date
          tee_id
          time
          ended
        ]
      }
    ) {
      AffectedRowsQLi: affected_rows
    }
    FlightMembersEntryQLi: insert_flight_member(
      objects: $flightMembersToSave
      on_conflict: {
        constraint: flight_member_pkey
        update_columns: [flightId, playerId, playingTee, tee_id, attendance]
      }
    ) {
      AffectedRowsQLi: affected_rows
    }
    FlightNameEntryQL: insert_flight_name(
      objects: $flightNamesToSave
      on_conflict: { constraint: flight_name_pkey, update_columns: [name] }
    ) {
      AffectedRowsQL: affected_rows
    }
  }
`;

export const SaveTournamentFlightsMutationsForStroke = gql`
  mutation SaveTournamentFlightsMutation(
    $tournamentId: String!
    $flightsToSave: [flight_insert_input!]!
    $flightMembersToSave: [flight_member_insert_input!]!
  ) {
    TournamentEntryQLi: update_tournament(
      where: { id: { _eq: $tournamentId } }
      _set: { started: true }
    ) {
      AffectedRowsQLi: affected_rows
    }
    FlightEntryQLi: insert_flight(
      objects: $flightsToSave
      on_conflict: {
        constraint: flight_pkey
        update_columns: [
          courseId
          courseHoleSets
          flightNo
          flightRound
          startingHole
          tee
          date
          tee_id
          time
          ended
        ]
      }
    ) {
      AffectedRowsQLi: affected_rows
    }
    FlightMembersEntryQLi: insert_flight_member(
      objects: $flightMembersToSave
      on_conflict: {
        constraint: flight_member_pkey
        update_columns: [flightId, playerId, playingTee, tee_id, attendance]
      }
    ) {
      AffectedRowsQLi: affected_rows
    }
  }
`;

export const ChangeScoresFlightMutation = gql`
  mutation ChangeScoresFlightMutation(
    $playerId: String!
    $flightIdFrom: String!
    $flightIdTo: String!
  ) {
    ScoreUpdateQL: update_score(
      where: { playerId: { _eq: $playerId }, flightId: { _eq: $flightIdFrom } }
      _set: { flightId: $flightIdTo }
    ) {
      AffectedRowsQL: affected_rows
    }
    FlightMemberDeleteQL: delete_flight_member(
      where: { playerId: { _eq: $playerId }, flightId: { _eq: $flightIdFrom } }
    ) {
      AffectedRowsQL: affected_rows
    }
  }
`;

export const UpsertFlightAndMembersMutation = gql`
  mutation UpsertFlightAndMembersMutation(
    $tournamentId: String!
    $courseHolset: Int!
    $courseHoleSetsInverted: Boolean!
    $deleteAndInsertScores: Boolean!
    $scoreDetailsDeleteExpression: score_detail_bool_exp!
    $scoresDeleteExpression: score_bool_exp!
    $scoresToInsert: [score_insert_input!]!
    $tee: String!
    $time: timetz!
    $members: [flight_member_insert_input!]!
    $membersDeleteExpression: flight_member_bool_exp!
  ) {
    DeleteScoreDetailQL: delete_score_detail(
      where: $scoreDetailsDeleteExpression
    ) @include(if: $deleteAndInsertScores) {
      AffectedRowsQL: affected_rows
    }
    DeleteScoreQL: delete_score(where: $scoresDeleteExpression) @include(if: $deleteAndInsertScores) {
      AffectedRowsQL: affected_rows
    }

    ScoreEntryQL: insert_score(
      objects: $scoresToInsert
      on_conflict: {
        constraint: score_pkey
        update_columns: [
          playerHandicap
          grossScore
          updatedAt
          updaterId
          updaterName
          detailId
        ]
      }
    ) @include(if: $deleteAndInsertScores) {
      AffectedRowsQL: affected_rows
    }

    TournamentUpdateQL: update_tournament(
      where: { id: { _eq: $tournamentId } }
      _set: {
        courseHoleSets: $courseHolset
        courseHoleSetsInverted: $courseHoleSetsInverted
      }
    ) {
      AffectedRowsQLi: affected_rows
    }

    FlightUpdateQL: update_flight(
      where: { tournamentId: { _eq: $tournamentId } }
      _set: {
        courseHoleSets: $courseHolset
        courseHoleSetsInverted: $courseHoleSetsInverted
        tee: $tee
        time: $time
      }
    ) {
      AffectedRowsQLi: affected_rows
    }

    FlightMembersQL: insert_flight_member(
      objects: $members
      on_conflict: {
        constraint: flight_member_pkey
        update_columns: [playingTee, tee_id, guest]
      }
    ) {
      AffectedRowsQL: affected_rows
    }

    DeleteFlightMembers: delete_flight_member(where: $membersDeleteExpression) {
      AffectedRowsQL: affected_rows
    }
  }
`;

export const DeleteFlightsAndMembersMutation = gql`
  mutation DeleteFlightsAndMembersMutation($flightIdsToRemove: [String!]!) {
    FlightDeleteQL: delete_flight(where: { id: { _in: $flightIdsToRemove } }) {
      AffectedRowsQL: affected_rows
    }
  }
`;
export const DeleteFlightMembersMutation = gql`
  mutation DeleteFlightMembersMutation( $membersDeleteExpression: flight_member_bool_exp!) {
    DeleteFlightMembers: delete_flight_member(where: $membersDeleteExpression) {
      AffectedRowsQL: affected_rows
    }
  }
`;

export const moveFlightsPlayerMutation = gql`
  mutation moveFlightsPlayerMutation(
    $flightMembersToSave: [flight_member_insert_input!]!
  ) {
    FlightMembersEntryQLi: insert_flight_member(
      objects: $flightMembersToSave
      on_conflict: {
        constraint: flight_member_pkey
        update_columns: [flightId, playerId]
      }
    ) {
      AffectedRowsQLi: affected_rows
    }
  }
`;

export const FlightManagersQuery = gql`
  query FlightManagersQuery($tournamentId: String!) {
    TournamentQL: tournament(where: { id: { _eq: $tournamentId } }) {
      id
      courseId
      adminId
      clubId
      courseHoleSets
      courseHoleSetsInverted
      noOfRounds
      matchFormat
      activeRound
      startDate

      FlightManagerQLi: flights(
        where: { tournamentId: { _eq: $tournamentId } }
        order_by: [{ flightRound: asc }, { flightNo: asc }]
      ) {
        flightRound
        id
        flightNo
        courseId
        adminId
        courseHoleSets
        date
        tournamentId
        time
        startingHole
        tee
        tee_id
        FlightName: name {
          name
        }
        MembersQL: members {
          PlayerQL: player {
            id
            firstName
            lastName
            playerCategory
            handicap
          }
          attendance
          playingTee
          tee_id
          playerId
        }
      }
    }
  }
`;
// OwnQLi: player_by_pk(id: $playerId) {
//     PermissionsQLi: permissions {
//         handicapAdmin
//     }
// }

export const getFlightTotal = gql`
 query getFlightTotal($where: flight_bool_exp!) {
  Count: flight_aggregate(where: $where) {
    aggregate {
      count
    }
  }
}
`;
export const getFlightTotalAll = gql`
 query getFlightTotal {
  Count: flight_aggregate {
    aggregate {
      count
    }
  }
}
`;
export const MarkPlayerAttendance = gql`
  mutation markPlayerAttendance(
    $where: flight_member_bool_exp!
    $set: flight_member_set_input!
  ) {
    update_flight_member(where: $where, _set: $set) {
      affected_rows
      returning {
        playerId
      }
    }
  }
`;

export const closeActiveRound = gql`
  mutation markPlayerAttendance(
    $where: tournament_bool_exp!
    $set: tournament_set_input!
  ) {
    update_tournament(where: $where, _set: $set) {
      affected_rows
      returning {
        id
      }
    }
  }
`;

export const createNextRoundFlights = gql`
  mutation createNextRoundFlights($objects: [flight_insert_input!]!) {
    insert_flight(objects: $objects) {
      returning {
        id
      }
    }
  }
`;

export const singleRoundFlightsQueryQL = gql`
  query ClubSingleRoundFlightsQuery($where: flight_bool_exp!) {
    FlightsQL: flight(
      where: $where
      order_by: [{ flightRound: asc }, { flightNo: asc }]
    ) {
      ...FlightQL
      MembersQL: members {
        flightId
        playerId
        attendance
        guest
        playingTee

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
        HolesQL: holes {
          ...HoleQL
        }
      }
    }
  }
  ${PlayerQL}
  ${FlightsQL}
  ${ScoreQL}
  ${ScoreDetailQL}
  ${CourseQL}
  ${HoleQL}
  ${CourseHoleSetsQL}
`;


export const singleRoundFlightQueryQL = gql`
  mutation ClubSingleRoundFlightQuery($flightId: String!) {
    flightEndedQl: update_flight(
      where: { id: { _eq: $flightId } }
      _set: { ended: true }
    ) {
      AffectedRowsQLi: affected_rows
    }
  }
`;