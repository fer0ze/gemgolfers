export interface TeeTime {
    id: string;
    clubId: string;
    courseId: string;
    bookingDate: Date;
    startTime: string;
    endTime: string;
    interval: number;
    noOfPlayers: number;
    teeTimeSlot: TeeTimeSlot[];
    allowNineHole: boolean;
    bookingTime:string;
}

export interface TeeTimeSlot {
    id: string;
    bookingId: string;
    slotTime: string;
    joinedMembers: number;
    flightId: string;
    strtingHole: number;
}