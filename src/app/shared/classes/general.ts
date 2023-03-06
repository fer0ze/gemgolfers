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

    public static parseToDate(dateValue: string) {
        let datePipe = new DatePipe(Constants.LOCALE_EN_US);

        if (dateValue)
            return new Date(
                datePipe.transform(dateValue, Constants.FORMAT_DATE)
            );
        else return null;
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

    public static getPlayersTees(teeName: String) {
        const Course_Tee = [
            { id: 1, name: 'AMATEURS' },
            { id: 2, name: 'LADIES' },
            { id: 3, name: 'SENIORS' },
            { id: 4, name: 'PROFESSIONALS' },
        ];
        let ID = Course_Tee.find((element) => element.name == teeName);

        return ID;
    }

    public static getPlayersTe(teeName: String) {
        const Course_Tee = [
          { id: "1", name: "Amateurs", result: "AMATEURS" },
          { id: "1", name: "Invitational", result: "AMATEURS" },
          { id: "1", name: "Subsidiary Amateurs", result: "AMATEURS" },
          { id: "1", name: "BLUE", result: "AMATEURS" },
          { id: "1", name: "Blue", result: "AMATEURS" },
          { id: "1", name: "AMATEURS", result: "AMATEURS" },
          { id: "5", name: "VETERANS", result: "VETERANS" },
          { id: "5", name: "Veterans", result: "VETERANS" },
          { id: "5", name: "Veterans ", result: "VETERANS" },
          { id: "5", name: " Veterans ", result: "VETERANS" },
          {
            id: "2",
            name: "Ladies",
            result: "LADIES",
          },
          {
            id: "2",
            name: "LADIES",
            result: "LADIES",
          },
          {
            id: "3",
            name: "Seniors",
            result: "SENIORS",
          },
          {
            id: "3",
            name: "Yellow",
            result: "SENIORS",
          },
          {
            id: "3",
            name: "YELLOW",
            result: "SENIORS",
          },
          { id: "2", name: "Red", result: "LADIES" },
          { id: "2", name: "Ladies A", result: "LADIES" },
          { id: "2", name: "Ladies B", result: "LADIES" },
          { id: "2", name: "RED", result: "LADIES" },
          { id: "4", name: "Professionals", result: "PROFESSIONALS" },
          { id: "4", name: "PROFESSIONALS", result: "PROFESSIONALS" },
          {
            id: "3",
            name: "SENIORS",
            result: "SENIORS",
          },
          { id: "2", name: "Junior Amateurs", result: "LADIES" },
          { id: "2", name: "Junior Ladies", result: "LADIES" },
          { id: "2", name: "JUNIOR LADIES", result: "LADIES" },
          { id: "2", name: "Junior Professionals", result: "LADIES" },
          { id: "2", name: "Junior Boy(18-21)", result: "LADIES" },
          { id: "2", name: "Junior Boy(16-18)", result: "LADIES" },
          { id: "2", name: "Junior Boy(12-16)", result: "LADIES" },
          { id: "2", name: "Junior Girl(16-21)", result: "LADIES" },
          { id: "2", name: "Junior Gril(12-16)", result: "LADIES" },
          { id: "2", name: "Junior", result: "LADIES" },
          { id: "3", name: "Senior Amateurs", result: "SENIORS" },
          { id: "3", name: "Senior Professionals", result: "SENIORS" },
        ];
        let ID = Course_Tee.find((element) => element.name == teeName);
    
        return ID;
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

    public static getCourseTee(teeId: number) {
        const Course_Tee = [
            { id: 1, name: 'Amateurs' },
            { id: 2, name: 'Ladies' },
            { id: 3, name: 'Seniors' },
            { id: 4, name: 'Professionals' },
            { id: 5, name: 'Veterans' },
        ];

        return Course_Tee.find((element) => element.id == teeId);
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
    public static createClm(round){
        switch (round) {
            case 1:
                return ["Sr.", "Name","HCP", "Club", "Gross Rd1","Net Rd1","Total Gross","Total Net"];
                break;
            case 2:
                return ["Sr.", "Name","HCP", "Club", "Gross Rd2","Net Rd2","Gross Rd1","Net Rd1","Total Gross","Total Net"];
                break;
            case 3:
                return ["Sr.", "Name","HCP", "Club", "Gross Rd3","Net Rd3","Gross Rd2","Net Rd2","Gross Rd1","Net Rd1","Total Gross","Total Net"];
                break;
            case 4:
                return ["Sr.", "Name","HCP", "Club", "Gross Rd4","Net Rd4","Gross Rd3","Net Rd3","Gross Rd2","Net Rd2","Gross Rd1","Net Rd1","Total Gross","Total Net"];
                break;
            default:
                return ["Sr.", "Name","HCP", "Club", "Gross Rd4","Net Rd4","Gross Rd3","Net Rd3","Gross Rd2","Net Rd2","Gross Rd1","Net Rd1","Total Gross","Total Net"];
                break;
        }
    }
    public static getClubName(clubName){
        if(clubName)
          return clubName.match(/\b([A-Z])/g).join('');
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
    static readonly CATEGORY_SENIORS = 'Seniors';
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
    static readonly MF_STABLEFORD = 'STABLEFORD';

    // Score Management
    static readonly SM_ONLY_PLAYERS = 'ONLY_PLAYERS';
    static readonly SM_ONLY_MARSHALS = 'ONLY_MARSHALS';
    static readonly SM_PLAYERS_AND_MARSHALS = 'PLAYERS_AND_MARSHALS';

    // Sessions
    static readonly LOGGED_IN_USER = 'aXNMb2dnZWRJbg';

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

    public static generate(playerId: string) {
        let asciiArray: number[] = this.toAsciiArray(playerId);

        if (asciiArray != null) {
            let length: number = asciiArray.length;
            let lengthOneThird: number = Math.floor(length / 3);
            let lengthTwoThird: number = Math.floor(lengthOneThird * 2);
            let asciiSum1: number = 0;

            for (var i = 0; i < lengthOneThird; i++) {
                asciiSum1 += asciiArray[i];
            }

            let asciiSum2: number = 0;
            for (var i: number = +lengthOneThird; i < lengthTwoThird; i++) {
                asciiSum2 += asciiArray[i];
            }

            let asciiSum3: number = 0;
            for (var i = lengthTwoThird; i < length; i++) {
                asciiSum3 += asciiArray[i];
            }

            return 'gg' + asciiSum1 + '' + asciiSum2 + '' + asciiSum3;
        }

        return '';
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
export const labels = ['Mon', 'Tue', 'Wed','Thu','Fri','Sat','Sun'];
export const labelsPlayers = ['Amatuers','S.Amatuers','Vetrans','Ladies'];
