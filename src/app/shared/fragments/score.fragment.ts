import gql from 'graphql-tag';

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

export const ScoreDetailQL = gql`
fragment ScoreDetailQL on score_detail {
    id
    putts
    penalties
    fairway
    gir
    sandSave
    upAndDown
    penalty
    firClub
    girClub
    girDistance
    sandSavePoint
    upAndDownPoint
    upAndDownDistance
    girShot
}`;

export const HoleQL = gql`
fragment HoleQL on hole {
    id
    courseId
    holeNo
    par
    index
    teeDistances
    teeLatLongs
    poleLat
    poleLong
    holeSetId
}`;
export const CourseTeesQL = gql`
fragment CourseTeesQL on hole {
    name_by_club
    tee_id
}`;