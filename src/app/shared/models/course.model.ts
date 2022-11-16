export interface Course {
    id: string;
    clubId: string;
    name: string;
    noOfHoles: number;
    par: number;
    courseRating: number;
    slopeRating: number;
    teeDistanceUnit: string;
    mapSupported: boolean;
    country: string;
    countryGeonameId: number;
    city: string;
    cityGeonameId: number;
    nameForHoles1to9: string;
    nameForHoles10to18: string;
    nameForHoles19to27: string;
    nameForHoles28to36: string
}

export interface CourseHoles {
    id: string;
    courseId: string;
    name: string;
}

export interface CourseHoleSet {
    courseId: string;
    holeSets: number;
    inverted: boolean;
    noOfHoles: number;
    displayName: string;
}

export interface CourseRating {
    courseId: string;
    tee: string;
    courseHoleSets: number;
    courseRating: number;
    slopeRating: number;
    coursePar: number;
}
