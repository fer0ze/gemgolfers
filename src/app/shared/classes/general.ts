import { DatePipe } from '@angular/common';
import { CourseTee } from '../models/player.model';

export class General {
    public static getCountries() {
        const COUNTRIES = [
            { id: 1, name: 'Pakistan', code: 'PK' },
            { id: 2, name: 'United Kingdom', code: 'UK' },
        ];

        return COUNTRIES;
    }

    public static getdate(idate: any) {
        const date = new Date(idate);

        // Explicitly type the options object
        const options: Intl.DateTimeFormatOptions = { month: "short", day: "2-digit" };

        // Format the date using Intl.DateTimeFormat
        const formattedDate = new Intl.DateTimeFormat("en-US", options).formatToParts(date);

        // Extract the month and day and format them as "Sep 03"
        const formattedDateString = `${formattedDate[0].value} ${formattedDate[2].value}`;

        return formattedDateString;
    }



    public static getCourseHoleSets(holeSet, inverted) {
        if (holeSet == 4 && inverted == false) {
            return 'Blue 9';
        } else if (holeSet == 1 && inverted == false) {
            return 'Red 9';
        } else if (holeSet == 8 && inverted == false) {
            return 'Yellow 9';
        } else if (holeSet == 3 && inverted == false) {
            return 'Red Front 9 - Blue Back 9';
        } else if (holeSet == 12 && inverted == false) {
            return 'Blue Front 9 - Yellow Back 9';
        } else if (holeSet == 9 && inverted == false) {
            return 'Red Front 9 - Yellow Back 9';
        } else {
            return 'Yellow Front 9 - Red Back 9';
        }
    }
    public static formatAMPM(hours: number, minutes: number): string {
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const formattedHours = hours % 12 || 12;
        const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
        return `${formattedHours}:${formattedMinutes} ${ampm}`;
    }
    public static parseToDate(dateValue: string) {
        let datePipe = new DatePipe(Constants.LOCALE_EN_US);

        if (dateValue)
            return new Date(
                datePipe.transform(dateValue, Constants.FORMAT_DATE)
            );
        else return null;
    }
    public static formatDate(date: Date): string {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
        const day = String(date.getDate()).padStart(2, '0');

        return `${year}-${month}-${day}`;
    }

    public static precisionRound(number: number, precision: number) {
        if (precision < 0) {
            let factor = Math.pow(10, precision);
            return Math.round(number * factor) / factor;
        } else
            return +(
                Math.round(Number(number + 'e+' + precision)) +
                'e-' +
                precision
            );
    }

    public static truncateDecimals(num, fixed) {
        let re = new RegExp('^-?\\d+(?:.\\d{0,' + (fixed || -1) + '})?');
        return num.toString().match(re)[0];
    }

    public static capitalizeFirstLetter(data: string) {
        return data ? data.charAt(0).toUpperCase() + data.slice(1) : '';
    }

    public static getPlayersTee(courseID: string): Array<CourseTee> {
        // if(courseID = '-LUFS3FCQKOGpJ2IEHmf'){

        //     const Course_Tee: CourseTee[] = [

        //         {id: "WHITE", name: "Amateurs"},
        //         {id: "RED", name: "Ladies"},
        //         {id: "YELLOW", name: "Seniors"},
        //         {id: "BLUE", name: "Professionals"}
        //     ];

        //     return Course_Tee;
        // }
        // else{

        const Course_Tee: CourseTee[] = [
            { id: 'BLUE', name: 'Amateurs' },
            { id: 'RED', name: 'Ladies' },
            { id: 'WHITE', name: 'Seniors' },
            { id: 'BLACK', name: 'Professionals' },
        ];
        return Course_Tee;
        // }
    }

    public static getMonthDates(monthYearText) {
        const months = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];

        const [month, year] = monthYearText.split(" ");
        const monthIndex = months.indexOf(month);

        if (monthIndex === -1 || !year) {
            // Handle invalid input
            console.error("Invalid input format");
            return null;
        }

        const startDate = new Date(year, monthIndex, 1);
        const endDate = new Date(year, monthIndex + 1, 0);

        const formattedStartDate = startDate.toISOString().split("T")[0];
        const formattedEndDate = endDate.toISOString().split("T")[0];

        return { startDate: formattedStartDate, endDate: formattedEndDate };
    }


    public static getPlayersTees(teeName: String) {
        const Course_Tee = [
            { id: 1, name: 'AMATEURS' },
            { id: 2, name: 'LADIES' },
            { id: 3, name: 'SENIORS' },
            { id: 4, name: 'PROFESSIONALS' },
            { id: 5, name: 'VETERANS' },
        ];
        let ID = Course_Tee.find((element) => element.name == teeName);

        return ID;
    }
    public static getPlayersTeesColour(teeName: String) {
        const Course_Tee = [
            { id: 'White', name: 'AMATEURS' },
            { id: 'Red', name: 'LADIES' },
            { id: 'Yellow', name: 'SENIORS' },
            { id: 'Blue', name: 'PROFESSIONALS' },
            { id: 'Black', name: 'BLACK' },
            { id: 'Black', name: 'VETERANS' },
        ];
        let ID = Course_Tee.find((element) => element.name == teeName);

        return ID ? ID.id : teeName;
    }
    public static getPlayersTeesColourByCategory(teeName: String) {
        const Course_Tee = [
            { id: 'White', name: 'Amateurs' },
            { id: 'Red', name: 'Ladies' },
            { id: 'Yellow', name: 'Senior Amateurs' },
            { id: 'Yellow', name: 'Seniors' },
            { id: 'Blue', name: 'Professionals' },
            { id: 'Black', name: 'Veterans' },
        ];
        let ID = Course_Tee.find((element) => element.name == teeName);

        return ID ? ID.id : teeName;
    }
    public static formatTime(timeString: string): string {
        const [hours, minutes] = timeString.split(':').map(Number);
        const formattedHours = ((hours + 11) % 12) + 1; // Convert to 12-hour format
        return `${formattedHours}:${minutes.toString().padStart(2, '0')}`;
    }
    public static getPlayersTe(teeName: String) {
        const Course_Tee = [
            { id: '1', name: 'Amateurs', result: 'AMATEURS' },
            { id: '1', name: 'Invitational', result: 'AMATEURS' },
            { id: '1', name: 'Subsidiary Amateurs', result: 'AMATEURS' },
            { id: '1', name: 'BLUE', result: 'AMATEURS' },
            { id: '1', name: 'Blue', result: 'AMATEURS' },
            { id: '1', name: 'AMATEURS', result: 'AMATEURS' },
            { id: '1', name: 'Masters', result: 'AMATEURS' },
            { id: '5', name: 'VETERANS', result: 'VETERANS' },
            { id: '5', name: 'Veterans', result: 'VETERANS' },
            { id: '5', name: 'Veterans ', result: 'VETERANS' },
            { id: '5', name: ' Veterans ', result: 'VETERANS' },
            {
                id: '2',
                name: 'Ladies',
                result: 'LADIES',
            },
            {
                id: '2',
                name: 'LADIES',
                result: 'LADIES',
            },
            {
                id: '3',
                name: 'Seniors',
                result: 'SENIORS',
            },
            {
                id: '3',
                name: 'Yellow',
                result: 'SENIORS',
            },
            {
                id: '3',
                name: 'YELLOW',
                result: 'SENIORS',
            },
            { id: '2', name: 'Red', result: 'LADIES' },
            { id: '2', name: 'Ladies A', result: 'LADIES' },
            { id: '2', name: 'Ladies B', result: 'LADIES' },
            { id: '2', name: 'RED', result: 'LADIES' },
            { id: '4', name: 'Professionals', result: 'PROFESSIONALS' },
            { id: '4', name: 'PROFESSIONALS', result: 'PROFESSIONALS' },
            {
                id: '3',
                name: 'SENIORS',
                result: 'SENIORS',
            },
            { id: '2', name: 'Junior Amateurs', result: 'LADIES' },
            { id: '2', name: 'Junior Ladies', result: 'LADIES' },
            { id: '2', name: 'JUNIOR LADIES', result: 'LADIES' },
            { id: '2', name: 'Junior Professionals', result: 'LADIES' },
            { id: '2', name: 'Junior Boy(18-21)', result: 'LADIES' },
            { id: '2', name: 'Junior Boy(16-18)', result: 'LADIES' },
            { id: '2', name: 'Junior Boy(12-16)', result: 'LADIES' },
            { id: '2', name: 'Junior Girl(16-21)', result: 'LADIES' },
            { id: '2', name: 'Junior Gril(12-16)', result: 'LADIES' },
            { id: '2', name: 'Junior', result: 'LADIES' },
            { id: '2', name: 'Juniors', result: 'LADIES' },
            { id: '3', name: 'Senior Amateurs', result: 'SENIORS' },
            { id: '3', name: 'Senior Professionals', result: 'SENIORS' },
        ];
        let ID = Course_Tee.find((element) => element.name == teeName);

        if (ID) {
            return ID;
        } else {
            return { id: '1', name: 'Amateurs', result: 'AMATEURS' };
        }
    }

    public static getTeeYards(teeDistance, tee, courseId, holeId, latLong) {
        // console.log(teeDistance);
        let teeYards = [];
        let lat, lng;
        if (Object.keys(teeDistance).length != 0) {
            for (const [key, value] of Object.entries(teeDistance)) {
                // console.log(`Key: ${key}, Value: ${value}`);
                let teeId = this.getPlayersTe(key);
                // console.log(teeId);
                if (latLong[key]) {
                    [lat, lng] = latLong[key].split(',').map(parseFloat);
                } else {
                    lat = lng = null;
                }
                if (teeId) {
                    let obj = {
                        tee_distance: value,
                        tee_lat: lat,
                        tee_long: lng,
                        tee_id: Number(teeId?.id),
                        course_id: courseId,
                        hole_id: holeId,
                    }
                    teeYards.push(obj);
                }
            }
        } else {
            for (const [key, value] of Object.entries(latLong)) {
                // console.log(`Key: ${key}, Value: ${value}`);
                let teeId = this.getPlayersTe(key);
                // console.log(teeId);
                if (latLong[key]) {
                    [lat, lng] = latLong[key].split(',').map(parseFloat);
                } else {
                    lat = lng = null;
                }
                if (teeId) {
                    let obj = {
                        tee_distance: 0,
                        tee_lat: lat,
                        tee_long: lng,
                        tee_id: Number(teeId?.id),
                        course_id: courseId,
                        hole_id: holeId,
                    }
                    teeYards.push(obj);
                }
            }
        }
        // console.log(tee);
        return teeYards;
    }

    public static getTeeYard(teeDistance, tee, courseId, holeId) {
        // console.log(teeDistance);
        let teeYards = [];
        let lat, lng;
        if (Object.keys(teeDistance).length != 0) {
            for (const [key, value] of Object.entries(teeDistance)) {
                // console.log(`Key: ${key}, Value: ${value}`);
                let teeId = this.getPlayersTe(key);
                // console.log(teeId);
                // if (latLong[key]) {
                //     [lat, lng] = latLong[key].split(',').map(parseFloat);
                // } else {
                //     lat = lng = null;
                // }
                if (teeId) {
                    let obj = {
                        tee_distance: value,
                        tee_lat: null,
                        tee_long: null,
                        tee_id: Number(teeId?.id),
                        course_id: courseId,
                        hole_id: holeId,
                    }
                    teeYards.push(obj);
                }
            }
        }
        // console.log(tee);
        return teeYards;
    }

    public static getHoleLatLong(greenStart: string | number, greenCenter: string | number, greenEnd: string | number): [number, number, number, number, number, number] {
        const parseLatLong = (latLong: string | number): [number, number] => {

            if (typeof latLong === 'string') {
                const [lat, lng] = latLong.split(',').map(parseFloat);
                return [lat, lng];
            } else {
                return [0, 0];
            }
        };

        const [startLat, startLng] = parseLatLong(greenStart);
        const [centerLat, centerLng] = parseLatLong(greenCenter);
        const [endLat, endLng] = parseLatLong(greenEnd);

        return [startLat, startLng, centerLat, centerLng, endLat, endLng];
    }

    public static getHazards(data) {
        let result = [];

        data.forEach(item => {
            if (typeof (item.lat_long) == 'string') {
                const [lat, long] = item.lat_long.split(',').map(parseFloat);
                result.push({
                    holeId: item.holeId,
                    hazardId: item.hazardId,
                    lat: lat,
                    lng: long,
                    hazardNo: item.hazardNo,
                });
            }
        });

        return result;
    }


    public static getPhonePrefix(phone) {
        if (phone.toString().indexOf('+92') === 0) {
            phone = phone.toString();
        } else if (phone.toString().indexOf('0') === 0) {
            phone = phone.toString().replace(0, '+92');
        } else if (phone.toString().indexOf('3') === 0) {
            phone = '+92' + phone.toString();
        }
        return phone;
    }
    public static getCourseTeeId(tee: string) {
        const Course_Tee = [
            { id: 1, name: 'AMATEURS' },
            { id: 2, name: 'LADIES' },
            { id: 3, name: 'SENIORS' },
            { id: 4, name: 'PROFESSIONALS' },
            { id: 5, name: 'VETERANS' },
        ];

        return Course_Tee.find((element) => element.name == tee);
    }

    public static singleFormats() {
        return [
            { name: "Stroke Play", value: "STROKE_PLAY" },
            { name: "Stable Ford", value: "STABLEFORD" },
            { name: "Modified Stableford", value: "MODIFIED_STABLEFORD" },
            // { name: "Split Sixes", value: "SPLIT_SIXES" },
        ];
    }

    public static teamFormats() {
        return [
            { name: "Ryder Cup", value: "MATCH_PLAY" },
            { name: "Texas Scramble", value: "TEXAS_SCRAMBLE" },
            // { name: "Two Ball Scramble", value: "TWO_BALL_SCRAMBLE" },
            // { name: "Three Ball Scramble", value: "THREE_BALL_SCRAMBLE" },
            { name: "Four Ball Scramble", value: "FOUR_BALL_SCRAMBLE" },
            { name: "Shambles", value: "SHAMBLES" },
            { name: "GreenSome", value: "GREENSOME" },
            { name: "FourSome", value: "FOURSOME" },
            { name: "Two Ball Best Ball", value: "TWO_BALL_BEST_BALL" },
            { name: "Best Three", value: "BEST_THREE" },
            { name: "Best Two", value: "BEST_TWO" },
            // { name: "LIV", value: "LIV" },
        ];
    }

    public static getCourseTee(Id: number) {
        const Course_Tee = [
            { id: 0, name: 'Professionals', tee_id: 'PROFESSIONALS', color: '#000000' },
            { id: 1, name: 'Ladies', tee_id: 'LADIES', color: '#FF0000' },
            { id: 2, name: 'Seniors', tee_id: 'SENIORS', color: '#FFFFFF' },
            { id: 3, name: 'Amateurs', tee_id: 'AMATEURS', color: '#0000FF' },
            { id: 4, name: 'Veterans', tee_id: 'VETERANS', color: '#FFFF00' },
        ];

        return Course_Tee.find((element) => element.id == Id);
    }
    public static addNewTee(tees) {
        const Course_Tee = [
            { id: 0, name: 'Professionals', tee_id: 'PROFESSIONALS', color: '#000000' },
            { id: 1, name: 'Ladies', tee_id: 'LADIES', color: '#FF0000' },
            { id: 2, name: 'Seniors', tee_id: 'SENIORS', color: '#FFFFFF' },
            { id: 3, name: 'Amateurs', tee_id: 'AMATEURS', color: '#0000FF' },
            { id: 4, name: 'Veterans', tee_id: 'VETERANS', color: '#FFFF00' },
        ];
        let tee_id;
        Course_Tee.map(tee => {
            const foundItem = tees.find(item => item.name_by_club === tee.name);
            if (!foundItem) {
                tee_id = tee.tee_id;
            }
        });
        return tee_id;
    }

    public static getGolfCourseFeatures() {
        const features = [
            {
                id: '0',
                icon: 'heroicons_outline:star',
                title: 'Add Course',
                description:
                    'Create you courses by adding them',
            },
            {
                id: '1',
                icon: 'heroicons_outline:user-circle',
                title: 'Tees',
                description: 'Manage your course tees, their names and colors',
            },
            {
                id: '2',
                icon: 'heroicons_outline:lock-closed',
                title: 'Holes ',
                description: 'Manage your course holes, par, and index',
            },
            {
                id: '3',
                icon: 'heroicons_outline:credit-card',
                title: 'Hole-Set',
                description: 'Manage your course hole-sets by combining hole-sets',
            },
            {
                id: '4',
                icon: 'heroicons_outline:bell',
                title: 'Course Rating',
                description: 'Manage your course ratings and slope ratings',
            },
            {
                id: '5',
                icon: 'heroicons_outline:user-group',
                title: 'Holes Coordinates',
                description: 'Manage your hole lat, long',
            },
        ];

        // if (number != 1) {
        //     return features.filter(feature => feature.id !== '5');
        // }

        return features;
    }
    public static checkPlayerExcelMembership(player) {
        if ('Membership Number' in player) {
            return 'Membership Number';
        } else if ('MembershipNumber' in player) {
            return 'MembershipNumber';
        } else if ('membershipnumber' in player) {
            return 'membershipnumber';
        } else if ('Membershipnumber' in player) {
            return 'Membershipnumber';
        } else if ('Membership' in player) {
            return 'Membership';
        } else if ('membership' in player) {
            return 'membership';
        } else if ('Membership Numbers' in player) {
            return 'Membership Numbers';
        } else if ('MemberShip Number' in player) {
            return 'MemberShip Number';
        } else if ('MemberShipNumber' in player) {
            return 'MemberShipNumber';
        } else if ('MemberShipnumber' in player) {
            return 'MemberShipnumber';
        } else if ('MemberShip number' in player) {
            return 'MemberShip number';
        } else if ('MemberShip numbers' in player) {
            return 'MemberShip numbers';
        } else if ('Membership number' in player) {
            return 'Membership number';
        } else if ('Membership numbers' in player) {
            return 'Membership numbers';
        }
    }
    public static checkPlayerExcelphone(player) {
        if ('phone' in player) {
            return 'phone';
        } else if ('Phone' in player) {
            return 'Phone';
        } else if ('Phone No' in player) {
            return 'Phone No';
        } else if ('Phone Num' in player) {
            return 'Phone Num';
        }
    }
    public static checkPlayerExcelEmail(player) {
        if ('email' in player) {
            return 'email';
        } else if ('Email' in player) {
            return 'Email';
        }
    }
    public static checkPlayerExcelClub(player) {
        if ('KGC' in player) {
            return 'KGC';
        } else if ('Karachi Golf Club' in player) {
            return 'Karachi Golf Club';
        }
    }
    public static generateUUID() {
        let d = new Date().getTime(),
            d2 =
                (performance && performance.now && performance.now() * 1000) ||
                0;
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
            let r = Math.random() * 16;
            if (d > 0) {
                r = (d + r) % 16 | 0;
                d = Math.floor(d / 16);
            } else {
                r = (d2 + r) % 16 | 0;
                d2 = Math.floor(d2 / 16);
            }
            return (c == 'x' ? r : (r & 0x7) | 0x8).toString(16);
        });
    }
    public static getPlayersFlight(teeName: String) {
        const Course_Tee = [
            { id: 1, name: 'AMATEURS' },
            { id: 2, name: 'LADIES' },
            { id: 3, name: 'SENIORS' },
            { id: 4, name: 'PROFESSIONALS' },
        ];
        let ID = Course_Tee.find((element) => element.name == teeName);

        return ID;
    }

    public static generateRandomColor() {
        // Generate a random hexadecimal color code
        const color = '#' + Math.floor(Math.random() * 16777215).toString(16);
        return color;
    }

    public static getStatus(status: string) {
        if (status === MemberStatus.DISQUALIFY) {
            return 2;
        } else if (status === MemberStatus.INCOMPLETED) {
            return 1;
        } else return 0;
    }

    public static rayaToKgc(tee: string) {
        switch (tee) {
            case 'BLUE':
                return 'BLACK';
                break;
            case 'YELLOW':
                return 'WHITE';
                break;
            case 'RED':
                return 'RED';
                break;
            case 'WHITE':
                return 'BLUE';
                break;
            default:
                return 'BLUE';
                break;
        }

        return tee;
    }
    public static createClmGross(round) {
        switch (round) {
            case 1:
                return [
                    'Sr.',
                    'Name',
                    'HCP',
                    'Club',
                    'Gross',
                    'To Par',
                ];
                break;
            case 2:
                return [
                    'Sr.',
                    'Name',
                    'HCP',
                    'Club',
                    'Gross Rd2',
                    'Gross Rd1',
                    'Total Gross',
                ];
                break;
            case 3:
                return [
                    'Sr.',
                    'Name',
                    'HCP',
                    'Club',
                    'Gross Rd3',

                    'Gross Rd2',

                    'Gross Rd1',

                    'Total Gross',

                ];
                break;
            case 4:
                return [
                    'Sr.',
                    'Name',
                    'HCP',
                    'Club',
                    'Gross Rd4',

                    'Gross Rd3',

                    'Gross Rd2',

                    'Gross Rd1',

                    'Total Gross',

                ];
                break;
            default:
                return [
                    'Sr.',
                    'Name',
                    'HCP',
                    'Club',
                    'Gross Rd4',

                    'Gross Rd3',

                    'Gross Rd2',

                    'Gross Rd1',

                    'Total Gross',
                    ,
                ];
                break;
        }
    }
    public static createClmNet(round) {
        switch (round) {
            case 1:
                return [
                    'Sr.',
                    'Name',
                    'HCP',
                    'Club',
                    'Net',
                    'To Par',
                ];
                break;
            case 2:
                return [
                    'Sr.',
                    'Name',
                    'HCP',
                    'Club',

                    'Net Rd2',

                    'Net Rd1',

                    'Total Net',
                ];
                break;
            case 3:
                return [
                    'Sr.',
                    'Name',
                    'HCP',
                    'Club',

                    'Net Rd3',

                    'Net Rd2',

                    'Net Rd1',

                    'Total Net',
                ];
                break;
            case 4:
                return [
                    'Sr.',
                    'Name',
                    'HCP',
                    'Club',

                    'Net Rd4',

                    'Net Rd3',

                    'Net Rd2',

                    'Net Rd1',

                    'Total Net',
                ];
                break;
            default:
                return [
                    'Sr.',
                    'Name',
                    'HCP',
                    'Club',

                    'Net Rd4',

                    'Net Rd3',

                    'Net Rd2',

                    'Net Rd1',

                    'Total Net',
                ];
                break;
        }
    }
    public static getClubName(clubName) {
        if (clubName) return clubName.match(/\b([A-Z])/g).join('');
    }
    public static createUser(signUpPerson, uui) {
        return {
            id: UniqueIdGenerator.generate(),
            adminClubId: null,
            firebaseUid: uui,
            fcmToken: null,
            gemId: 'gg' + Math.random(),
            firstName: signUpPerson.firstName,
            lastName: signUpPerson.lastName,
            gender: null,
            dob: null,
            picture: null,
            email: signUpPerson.email ? signUpPerson.email : null,
            phone: null,
            playerCategory: null,
            handicap: 0,
            online: false,
            countryCode: null,
            extraData: null,
            membershipNumber: null,
            userRole: 3,
            membership: [],
        };
    }
}

export enum MemberStatus {
    COMPLETED = 'co',
    INCOMPLETED = 'ic',
    DISQUALIFY = 'dq',
}

export enum handicapAllocation {
    THREE_FOURTH = 'THREE_FOURTH',
    AS_IS = 'AS_IS',
    HALF = 'HALF',
    ONE_FOURTH = 'ONE_FOURTH',
    ONE_TENTH = 'ONE_TENTH',
    ONE_TENTH_DEC = 'ONE_TENTH_DEC',
}

export class Constants {
    // Players Categories
    static readonly CATEGORY_AMATEURS = 'Amateurs';
    static readonly CATEGORY_AMATEUR = 'Amateur';
    static readonly PUBLIC_TOKEN = 'AUOZbiqwX03jnltdZstE';
    static readonly CATEGORY_SENIORS = 'Seniors';
    static readonly CATEGORY_SENIORS_AMATEUR = 'Senior Amateurs';
    static readonly CATEGORY_SENIOR = 'Senior';
    static readonly CATEGORY_VETERANS = 'Veterans';
    static readonly CATEGORY_VETERAN = 'Veterans';
    static readonly CATEGORY_JUNIORS = 'Juniors';
    static readonly CATEGORY_JUNIOR = 'Junior';
    static readonly CATEGORY_LADIES = 'Ladies';
    static readonly CATEGORY_PROFESSIONALS = 'Professionals';
    static readonly CATEGORY_PROFESSIONAL = 'Professional';
    static readonly CATEGORY_PRO_AM = 'Pro-Am';

    static readonly SCORE_GROSS = 'gross';
    static readonly SCORE_NET = 'net';

    static readonly LABEL_GROSS = 'GROSS';
    static readonly LABEL_NET = 'NET';

    // Match Formats
    static readonly MF_MATCH_PLAY = 'MATCH_PLAY';
    static readonly MF_STROKE_PLAY = 'STROKE_PLAY';
    static readonly MF_STABLEFORD = 'STABLE_FORD';
    static readonly MF_BESTBALL = 'BESTBALL';

    // Score Management
    static readonly SM_ONLY_PLAYERS = 'ONLY_PLAYERS';
    static readonly SM_ONLY_MARSHALS = 'ONLY_MARSHALS';
    static readonly SM_PLAYERS_AND_MARSHALS = 'PLAYERS_AND_MARSHALS';

    // Sessions
    static readonly LOGGED_IN_USER = 'aXNMb2dnZWRJbg';
    static readonly TOUR_ID = 'ToUr_Id';
    static readonly TOUR = 'TOUR';
    static readonly LEAGUE = 'LEAGUE';
    static readonly STATE = 'STATE';
    static readonly LEAGUE_ID = 'League_Id';

    //Daily Rounds
    static readonly DR_TODAY = 'Today';
    static readonly DR_YESTERDAY = 'Yesterday';
    static readonly DR_LAST_WEEK = 'Last_Week';
    static readonly DR_LAST_MONTH = 'Last_Month';
    static readonly DR_LAST_3_MONTH = 'Last_3_Months';
    static readonly DR_LAST_6_MONTH = 'Last_6_Months';
    static readonly DR_CUSTOM = 'Custom';

    // Date Time Formats
    static readonly LOCALE_EN_US = 'en-US';
    static readonly FORMAT_DATE = 'yyyy-MM-dd';
    static readonly FORMAT_DATE_TIME = "yyyy-MM-dd'T'HH:mm:ssZZZZZ";
    static readonly DEFAULT_DATE = '2020-01-01';

    static readonly DEFAULT_CLUB_LOGO = '../../../assets/images/banner.jpg';
    static readonly DEFAULT_TEE = 'BLUE';

    static Holes1to9 = 1 << 0;
    static Holes10to18 = 1 << 1;
    static Holes19to27 = 1 << 2;
    static Holes28to36 = 1 << 3;
}

export class UniqueIdGenerator {
    // Timestamp of last push, used to prevent local collisions if you push twice in one ms.
    private static lastPushTime = 0;

    // Modeled after base64 web-safe chars, but ordered by ASCII.
    private static PUSH_CHARS =
        '-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz';

    // We generate 72-bits of randomness which get turned into 12 characters and appended to the
    // timestamp to prevent collisions with other clients.  We store the last characters we
    // generated because in the event of a collision, we'll use those same characters except
    // "incremented" by one.
    private static lastRandChars = [];

    // Generates chronologically orderable unique string one by one
    public static generate() {
        let now = new Date().getTime();
        let duplicateTime = now === UniqueIdGenerator.lastPushTime;
        UniqueIdGenerator.lastPushTime = now;

        let timeStampChars = new Array(8);
        for (let i = 7; i >= 0; i--) {
            timeStampChars[i] = UniqueIdGenerator.PUSH_CHARS.charAt(now % 64);
            // NOTE: Can't use << here because javascript will convert to int and lose the upper bits.
            now = Math.floor(now / 64);
        }
        if (now !== 0)
            throw new Error('We should have converted the entire timestamp.');

        let id = timeStampChars.join('');

        if (!duplicateTime) {
            for (var i = 0; i < 12; i++) {
                UniqueIdGenerator.lastRandChars[i] = Math.floor(
                    Math.random() * 64
                );
            }
        } else {
            // If the timestamp hasn't changed since last push, use the same random number, except incremented by 1.
            for (
                var i = 11;
                i >= 0 && UniqueIdGenerator.lastRandChars[i] === 63;
                i--
            ) {
                UniqueIdGenerator.lastRandChars[i] = 0;
            }
            UniqueIdGenerator.lastRandChars[i]++;
        }
        for (var i = 0; i < 12; i++) {
            id += UniqueIdGenerator.PUSH_CHARS.charAt(
                UniqueIdGenerator.lastRandChars[i]
            );
        }
        if (id.length != 20) throw new Error('Length should be 20.');

        return id;
    }
}

export class passwordGenerator {
    private static PUSH_CHARS = '0123456789'; //0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz
    private static lastRandChars = [];

    public static generate() {
        let timeStampChars = new Array(4);
        let id = timeStampChars.join('');

        for (var i = 0; i < 6; i++) {
            passwordGenerator.lastRandChars[i] = Math.floor(Math.random() * 10);
        }

        for (i = 0; i < 6; i++) {
            id += passwordGenerator.PUSH_CHARS.charAt(
                passwordGenerator.lastRandChars[i]
            );
        }

        return id;
    }
}

export class generateGemId {
    private static asciiArray: number[] = [];

    public static generate(gemID: string) {
        var num = 0;

        if (gemID) {
            let gemid = (parseInt(gemID.slice(2)) + 1).toString();
            return 'gg' + gemid;
        } else {
            return 'gg';
        }
        // do {
        //     num = Math.floor(Math.random() * 9000) + 1000;
        // } while (num < 1500 || num > 9999);
        // if (num && num > 1500) {
        //     return 'gg' + num;
        // }
        // return '';
        // let asciiArray: number[] = this.toAsciiArray(playerId);

        // if (asciiArray != null) {
        // let length: number = asciiArray.length;
        // let lengthOneThird: number = Math.floor(length / 3);
        // let lengthTwoThird: number = Math.floor(lengthOneThird * 2);
        // let asciiSum1: number = 0;

        // for (var i = 0; i < lengthOneThird; i++) {
        //     asciiSum1 += asciiArray[i];
        // }

        // let asciiSum2: number = 0;
        // for (var i: number = +lengthOneThird; i < lengthTwoThird; i++) {
        //     asciiSum2 += asciiArray[i];
        // }

        // let asciiSum3: number = 0;
        // for (var i = lengthTwoThird; i < length; i++) {
        //     asciiSum3 += asciiArray[i];
        // }

        //return 'gg' + asciiSum1 + '' + asciiSum2 + '' + asciiSum3;
        // }

        // return '';
    }

    public static toAsciiArray(playerId: string): number[] {
        let length: number = playerId.length;

        if (length <= 0) {
            return null;
        }

        for (var i = 0; i < playerId.length; i++) {
            this.asciiArray.push(playerId.charCodeAt(i));
        }

        return this.asciiArray;
    }


}
export const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
export const labelsPlayers = ['Club', 'Mobile', 'Trail', 'Premium'];
export const labelsMembers = ['Amateurs', 'Senior Amateurs', 'Veterans', 'Ladies', 'Others'];
