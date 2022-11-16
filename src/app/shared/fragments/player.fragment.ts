import gql from "graphql-tag";

export const PlayerHandicapQL = gql`
  fragment PlayerHandicapQL on player_handicap {
    playerId
    handicap
    oldHandicap
    updatedAt
    score
    grossScore
    adjustedScore
    PlayerQL: player {
      firstName
      lastName
      membershipNumber
    }
    tournamentQL: tournament {
      title
      startDate
      endDate
    }
  }
`;

export const PlayerHandicapQLs = gql`
  fragment PlayerHandicapQL on player_handicap {
    handicap
    oldHandicap
    updatedAt
    score
    tournamentQL: tournament {
      title
    }
  }
`;

export const PlayerQL = gql`
  fragment PlayerQL on player {
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
    fullName
    email
    phone
    playerCategory
    handicap
    online
    extraData
    countryCode
    userRole
    membershipNumber
    homeClubId
    handicapWhsIndex
    handicapIndexFreezeTill
    handicapQL: handicap_history {
      ...PlayerHandicapQL
    }
    membership {
      clubId
      playerId
      suspended
      club {
        id
        name
        address
        phone
        logo
        courses {
          id
          name
        }
      }
    }
    permissions {
      qrScanAllowed
      handicapAdmin
      courseEntry
      revertHandicaps
    }
  }
  ${PlayerHandicapQL}
`;

export const PlayerQLs = gql`
  fragment PlayerQL on player {
    id
    firstName
    lastName
    playerCategory
    handicap
    handicapWhsIndex
    handicapQL: handicap_history {
      ...PlayerHandicapQLs
    }
  }
  ${PlayerHandicapQLs}
`;
export const PlayerHandicapWhsQL = gql`
  fragment PlayerHandicapWhsQL on player_handicap_whs {
    playerId
    round
    handicapDifferential
    updatedAt
    playedAt
    score
    adjustedScore
    front9
    back9
    handicapIndex
    exceptionalScore
    Handicap_id
    combined_handicap_id
    is_combined
    combined_handicap {
      playerId
      round
      handicapDifferential
      updatedAt
      playedAt
      score
      adjustedScore
      front9
      back9
      handicapIndex
      exceptionalScore
      Handicap_id
      combined_handicap_id
      tournamentQL: tournament {
        title
        endDate
        startDate
      }
    }
    PlayerQL: player {
      firstName
      lastName
      handicap
      handicapWhsIndex
      membershipNumber
    }
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
`;

export const PlayerHandicapLogQL = gql`
  fragment PlayerHandicapLogQL on handicap_change_log {
    playerId
    newHandicap
    oldHandicap
    whs
    dateTime
    remarks
    tournamentId
    updaterId
    PlayerQL: player {
      firstName
      lastName
    }

    tournamentQL: tournament {
      title
    }
  }
`;
