import gql from 'graphql-tag';

export const CourseQL = gql`
fragment CourseQL on course {
    id
    clubId
    name
    noOfHoles
    par
    courseRating
    slopeRating
    teeDistanceUnit
    mapSupported
    country
    countryGeonameId
    city
    picture
    
    cityGeonameId
    nameForHoles1to9
    nameForHoles10to18
    nameForHoles19to27
    nameForHoles28to36
}`;

export const CourseHoleSetsQL = gql`
fragment CourseHoleSetsQL on course_hole_sets {
    courseId
    holeSets
    inverted
    noOfHoles
    displayName
    backId
    frontId
    id
    isActive
}`;

export const CourseRatingQL = gql`
fragment CourseRatingQL on course_rating {
    courseId
    tee
    courseHoleSets
    courseRating
    slopeRating
    coursePar
}`;

// export const HolesQl = gql`
// fragment HolesQl on hole {
//     id
//     courseId
//     holeNo
//     par
//     index
//     teeDistances
//     teeLatLongs
//     poleLat
//     poleLong
//     requested
// }`;