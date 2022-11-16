import { CourseRating } from './course-rating';
export class Course {
    
    private par: number;
    private courseRating: number;
    private slopeRating: number;
    
    private ratings?: Map<String, CourseRating>;

    constructor(courseRating: number, slopeRating: number, coursePar: number) {
        this.courseRating = courseRating;
        this.slopeRating = slopeRating;
        this.par = coursePar;
    }

    public getPar() : number {
        return this.par;
    }

    public getCourseRating() : number {
        return this.courseRating;
    }

    public getSlopeRating() : number {
        return this.slopeRating;
    }

    public getRating(tee: string, courseHoleSets: number) : CourseRating {
        if (this.ratings == null) {
            return null;
        }
        let key: string = tee + courseHoleSets;
        return this.ratings.get(key);
    }
}