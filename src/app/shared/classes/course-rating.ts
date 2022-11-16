export class CourseRating {
    
    private courseId: string;
    private tee: string;
    private courseHoleSets: number;
    private courseRating: number;
    private slopeRating: number;
    private coursePar: number;

    constructor(courseId: string, tee: string, courseHoleSets: number, courseRating: number, slopeRating: number, coursePar: number) {
        this.courseId = courseId;
        this.tee = tee;
        this.courseHoleSets = courseHoleSets;
        this.courseRating = courseRating;
        this.slopeRating = slopeRating;
        this.coursePar = coursePar;
    }

    public getCourseId() : string {
        return this.courseId;
    }

    public getTee() : string {
        return this.tee;
    }

    public getCourseHoleSets() : number {
        return this.courseHoleSets;
    }

    public getCourseRating() : number {
        return this.courseRating;
    }

    public getSlopeRating() : number {
        return this.slopeRating;
    }

    public getCoursePar() : number {
        return this.coursePar;
    }
}