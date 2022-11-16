import gql from "graphql-tag";
import { FlightManagerQL } from "../fragments/flight.fragment";

export const GetClubs = gql`
  query PostsGetQuery {
    club {
      id
      name
      address
      phone
      email
      logo
    }
  }
`;

export const GetPGFClubs = gql`
  query GetPGFClub($where: subclub_bool_exp!) {
    subclub(where: $where) {
      club {
        id
        name
        address
        phone
        email
        logo
      }
    }
  }
`;

export const GetClubByID = gql`
  query PostsGetQuery($where: club_bool_exp!) {
    club(where: $where) {
      id
      name
      address
      phone
      email
      logo
    }
  }
`;

export const GetSchedule = gql`
  query getSchedule($where: club_schedule_bool_exp!) {
    club_schedule(where: $where, order_by: { date: desc }) {
      id

      tournamentTitle
      date
    }
  }
`;

export const AddMutation = gql`
  mutation insert_club($objects: [club_insert_input!]!) {
    insert_club(objects: $objects) {
      returning {
        id
        name
        address
        email
        phone
      }
    }
  }
`;

export const UpdateMutation = gql`
  mutation updateMutation($where: club_bool_exp!, $set: club_set_input!) {
    update_club(where: $where, _set: $set) {
      affected_rows
      returning {
        name
        address
        email
        phone
      }
    }
  }
`;

export const DeleteClub = gql`
  mutation DeleteClub($where: club_bool_exp!) {
    delete_club(where: $where) {
      affected_rows
      returning {
        id
      }
    }
  }
`;

export const getClubMemberAggregateByCategroy = gql`
  query playersByClub($where: club_bool_exp!) {
    club(where: $where) {
      Amateurs: members_aggregate(
        where: { player: { playerCategory: { _eq: "Amateurs" } } }
      ) {
        aggregate {
          count
        }
      }
      Senior_Amateurs: members_aggregate(
        where: { player: { playerCategory: { _eq: "Senior Amateurs" } } }
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
      Junior_Amateurs: members_aggregate(
        where: { player: { playerCategory: { _eq: "Junior Amateurs" } } }
      ) {
        aggregate {
          count
        }
      }
      Professionals: members_aggregate(
        where: { player: { playerCategory: { _eq: "Professionals" } } }
      ) {
        aggregate {
          count
        }
      }
      Senior_Professionals: members_aggregate(
        where: { player: { playerCategory: { _eq: "Senior Professionals" } } }
      ) {
        aggregate {
          count
        }
      }
      Junior_Professionals: members_aggregate(
        where: { player: { playerCategory: { _eq: "Junior Professionals" } } }
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
  }
`;

export const AddScheduleMutation = gql`
  mutation insertClubSchedule($objects: [club_schedule_insert_input!]!) {
    insert_club_schedule(objects: $objects) {
      returning {
        id
        clubId
        courseId
        tournamentTitle
        date
        matchFormat
        description
      }
    }
  }
`;

export const GetTeeTimeBookingQL = gql`
  query GetTeeTimeBookingQL($where: tee_time_booking_bool_exp!) {
    tee_time_booking(where: $where, order_by: { bookingDate: desc }) {
      id
      clubId
      courseId
      bookingDate
      startTime
      endTime
      interval
      allowNineHole
      slots(order_by: { slotTime: asc }) {
        id
        slotTime
        joinedMembers
        flightId
        startingHole
        flight {
          ...FlightManagerQL
        }
      }
    }
  }
  ${FlightManagerQL}
`;

export const AddTeeTimeQL = gql`
  mutation AddTeeTimeQL($objects: [tee_time_booking_insert_input!]!) {
    insert_tee_time_booking(objects: $objects) {
      returning {
        id
      }
    }
  }
`;
export const Getfeedbacks = gql`
  query PostsGetQuery {
    feedback {
      id
      type
      name
      contact
      message
    }
  }
`;
