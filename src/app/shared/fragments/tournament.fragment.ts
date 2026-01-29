import gql from 'graphql-tag';
import { PlayerQL } from './player.fragment';
import { CourseQL } from '../fragments/course.fragment';
import { FlightsQL } from './flight.fragment';

// Fragment on Tournament

export const LeaderQL = gql`
    fragment LeaderQL on leader {
        tournamentId
        playerId
        flightId
        type
        handicap
        under
        score
        points
        holesPlayed
        position
        player {
            firstName
            lastName
            playerCategory
        }
        flight {
            flightRound
        }
    }
    ${PlayerQL}
`;

export const LeaderAllRoundQL = gql`
    fragment LeaderAllRoundQL on leader_all_round {
        tournamentId
        playerId
        type
        handicap
        underR1
        underR2
        underR3
        underR4
        scoreR1
        scoreR2
        scoreR3
        scoreR4
        pointsR1
        pointsR2
        pointsR3
        pointsR4
        holesPlayedR1
        holesPlayedR2
        holesPlayedR3
        holesPlayedR4
        position
        tied
        status
        completedR1
        completedR2
        completedR3
        completedR4
        startedInwardsR1
        startedInwardsR2
        startedInwardsR3
        startedInwardsR4
        roundsPlayed
        maxRoundParticipated
        player {
            ...PlayerQL
        }
    }
    ${PlayerQL}
`;

export const TournamentQL = gql`
    fragment TournamentQL on tournament {
        id
        leagueId
        tourId
        clubId
        courseId
        secondFormat
        skipCategory
        adminId
        inviteCode
        title
        courseHoleSets
        teamMatch
        pairsMatch
        interLeague
        publicTournament
        confirmParticipants
        noOfRounds
        activeRound
        matchFormat
        tee
        playingOnWhs
        scoreManagement
        scoreUpdateTime
        leaderUpdateTime
        startDate
        endDate
        started
        invited
        singleRound
        pointsFormats
        pointsValues
        handicapAllocations
        sponsorName
        sponsorLogo
        mobileLogoUrl
        webLogoUrl
        cutOffCriteria
        prefix
        multiFormat
        marshalsStartWith
        noOfMarshals
        subTournament
        courseHoleSetsInverted
        isSetupComplete
        currentTab
        CourseQL: course {
            ...CourseQL
        }
        CategoriesQL: categories {
            id
            tournamentId
            category
            flightSettings
        }
        members {
            playerId
            category
            PlayerQL: player {
                ...PlayerQL
            }
        }
    }
    ${CourseQL}
    ${PlayerQL}
    ${LeaderAllRoundQL}
`;

// Fragment on Tournament Teams
export const TournamentOpponentQL = gql`
    fragment TournamentOpponentQL on tournament_team_opponent {
        id
        flightId
        tournamentId
        team1Id
        team2Id
        Player1QL: playerTeam1 {
            ...PlayerQL
        }
        Player2QL: playerTeam2 {
            ...PlayerQL
        }
    }
    ${PlayerQL}
`;

export const TournamentTeamQL = gql`
    fragment TournamentTeamQL on tournament_team {
        id
        adminId
        tournamentId
        name
        color
    }
`;

export const TournamentMemberCategoryQL = gql`
    fragment TournamentMemberCategoryQL on tournament_member_category {
        id
        tournamentId
        category
        handicapLimits
        default
        flightSettings
        lowerHandicap
        higherHandicap
    }
`;

export const TournamentMemberStatusQL = gql`
    fragment TournamentMemberStatusQL on tournament_member_status {
        tournamentId
        playerId
        status
        attendance
    }
`;

export const TournamentPairQL = gql`
    fragment TournamentPairQL on tournament_pair {
        id
        flightId
        tournamentId
        pairName
        Player1QL: player1 {
            ...PlayerQL
        }
        Player2QL: player2 {
            ...PlayerQL
        }
    }
    ${PlayerQL}
`;

export const TournamentRoleManagerQL = gql`
    fragment TournamentRoleManagerQL on tournament_role_manager {
        playerId
        tournamentId
        updateTournament
        changeFlights
        enterScores
    }
`;

export const LeaderboardAdQL = gql`
    fragment LeaderboardAdQL on leaderboard_ad {
        tournamentId
        ad
        firstRow
        repetitionInterval
    }
`;
