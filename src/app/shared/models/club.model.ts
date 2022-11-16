import { Course } from "./course.model";

export interface Club {
    id: string;
    name: string;
    address: string;
    phone: string;
    email: string;
}

export interface ClubDetailQueryResponse {
    singleClub: Club;
}

export interface ClubSchedule {
    id: string;
    clubId: string;
    courseId: string;
    tournamentTitle: string;
    date: Date;
    matchFormat: string;
    description: string;
}