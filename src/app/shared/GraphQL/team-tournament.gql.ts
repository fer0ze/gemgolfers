import gql from 'graphql-tag';

export const TeamTournamentQL = gql`
fragment TeamTournamentQL on tournament {
    id
    leagueId
    tourId
    clubId
    courseId
    adminId
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
    scoreManagement
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
}`;

export const PlayerQL = gql`
fragment TeamPlayerQL on player {
  id
  adminClubId
  firebaseUid
  fcmToken
  gemId
  firstName
  lastName
  gender
  dob
  picture
  email
  phone
  playerCategory
  handicap
  online
  extraData
  countryCode
  userRole
  membership {
    clubId
    playerId
  }
}`;

export const FlightsQL = gql`
fragment TeamFlightQL on flight {
    id
    tournamentId
    courseId
    adminId
    courseHoleSets
    flightNo
    flightRound
    startingHole
    tee
    date
    time
    ended
}`;

export const ScoreQL = gql`
fragment ScoreQL on score {
    playerId
    flightId
    holeId
    detailId
    playerHandicap
    HoleIPQL: hole {
        holeNo
        index
        par
    }
    grossScore
    updatedAt
    updaterId
    updaterName
}`;

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
}${PlayerQL}`;

export const FlightManagerTeamQL = gql`
fragment FlightManagerTeamQL on flight {
    ...FlightQL
    opponents {
        ...TournamentOpponentQL
    }
}${TournamentOpponentQL}`;

export const TournamentTeamQL = gql`
fragment TournamentTeamQL on tournament_team {
    id
    adminId
    tournamentId
    name
    color
}`;


export const LeaderboardTeamSubscription = gql`
query PostsGetQuery($tournamentId: String!, $playerId: String!) {
    tournament_by_pk(id: $tournamentId) {
        ...TournamentQL
        FlightsQL: flights(
            order_by: [
                {flightRound: asc},
                {flightNo: asc}
            ]
        ) {
            id
            ...FlightManagerTeamQL
            ScoresQL: scores(
                where: {
                    grossScore: {_gt: 0}
                }
            ) {
                ...ScoreQL
            }
        }
        TeamsQL: teams {
            ...TournamentTeamQL
        }
    }
}${TeamTournamentQL}${FlightsQL}${ScoreQL}${FlightManagerTeamQL}${TournamentTeamQL}`;