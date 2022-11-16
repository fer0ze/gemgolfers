export interface Hole {
    id: string;
    courseId: string;
    holeNo: number;
    par: number;
    index: number;
    teeDistances: string;
    teeLatLongs: string;
    poleLat: number;
    poleLong: number;
    requested: boolean
}