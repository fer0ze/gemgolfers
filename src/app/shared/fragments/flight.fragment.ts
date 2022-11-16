import gql from 'graphql-tag';
import { TournamentOpponentQL } from './tournament.fragment';
import { PlayerQL } from './player.fragment';

export const FlightsQL = gql`
fragment FlightQL on flight {
    id
    tournamentId
    courseId
    adminId
    courseHoleSets
    flightNo
    flightRound
    startingHole
    tee
    tee_id
    date
    time
    ended
	category
    courseHoleSetsInverted
    FlightName: name {
        name
    }
}`;

export const FlightManagerQL = gql`
fragment FlightManagerQL on flight {
    ...FlightQL
    MembersQL: members {
        playerId
        attendance
        playingTee
        tee_id
        playingHandicap
        playingHandicapWhs
        PlayerQL: player {
            ...PlayerQL
        }
    }
}${FlightsQL}${PlayerQL}`;

export const FlightManagerTeamQL = gql`
fragment FlightManagerTeamQL on flight {
    ...FlightQL
    opponents {
        ...TournamentOpponentQL
    }
}${FlightsQL}${TournamentOpponentQL}`;