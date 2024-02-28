import { General } from "../classes/general";

export function mapDashboardData(data: any): any {

    //console.log(data);
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const day = String(currentDate.getDate()).padStart(2, '0');

    const formattedDate = `${year}-${month}-${day}`;
    let leadActiveTotal = 0;
    let myData: any[] = [];
    let todayData: any[] = [];
    let prevDate = null;
    let memCounter = 0;
    let amateurs = 0;
    let seniorsAmatuers = 0;
    let ladies = 0;
    let professionals = 0;
    let veterans = 0;
    let nulls = 0;
    let totalFlights = 0;
    let active = 0;
    let ended = 0;
    let disclaimer = 0;
    let audioRecording = 0;
    let addedToday = 0;
    let redNine: number = 0;
    let blueNine: number = 0;
    let yellowNine: number = 0;
    let redfrontBlueback: number = 0;
    let blueFrontRedback: number = 0;
    let redFrontYellowback: number = 0;
    let yellowFrontRedback: number = 0;
    let blueFrontYellowback: number = 0;
    let yellowFrontBlueback: number = 0;

    for (let stats of data.FlightsQL) {

        const timestamp = stats.date;
        if (timestamp === prevDate) {
            memCounter += stats ? stats.MembersQL.length : 0;
            totalFlights++;
            amateurs += stats.MembersQL.length > 0
                ? stats.MembersQL.filter((a) => {
                    return (
                        a.PlayerQL.playerCategory == 'Amateurs'
                    );
                }).length
                : 0;
            seniorsAmatuers += stats.MembersQL.length > 0
                ? stats.MembersQL.filter((a) => {
                    return (
                        a.PlayerQL.playerCategory == 'Senior Amateurs'
                    );
                }).length
                : 0;
            ladies += stats.MembersQL.length > 0
                ? stats.MembersQL.filter((a) => {
                    return (
                        a.PlayerQL.playerCategory == 'Ladies'
                    );
                }).length
                : 0;
            professionals += stats.MembersQL.length > 0
                ? stats.MembersQL.filter((a) => {
                    return (
                        a.PlayerQL.playerCategory == 'Professionals'
                    );
                }).length
                : 0;
            veterans += stats.MembersQL.length > 0
                ? stats.MembersQL.filter((a) => {
                    return (
                        a.PlayerQL.playerCategory == 'Veterans'
                    );
                }).length
                : 0;
            nulls += stats.MembersQL.length > 0
                ? stats.MembersQL.filter((a) => {
                    return (
                        a.PlayerQL.playerCategory == null
                    );
                }).length
                : 0;
            redNine += (stats.courseHoleSets == 1 && stats.courseHoleSetsInverted == false) ? 1 : 0;
            blueNine += (stats.courseHoleSets == 4 && stats.courseHoleSetsInverted == false) ? 1 : 0;
            redfrontBlueback += (stats.courseHoleSets == 3 && stats.courseHoleSetsInverted == false) ? 1 : 0;
            yellowNine += (stats.courseHoleSets == 8 && stats.courseHoleSetsInverted == false) ? 1 : 0;
            blueFrontYellowback += (stats.courseHoleSets == 12 && stats.courseHoleSetsInverted == false) ? 1 : 0;
            redFrontYellowback += (stats.courseHoleSets == 9 && stats.courseHoleSetsInverted == false) ? 1 : 0;
        } else {
            memCounter = stats ? stats.MembersQL.length : 0;
            totalFlights = 1;
            amateurs = stats.MembersQL.length > 0
                ? stats.MembersQL.filter((a) => {
                    return (
                        a.PlayerQL.playerCategory == 'Amateurs'
                    );
                }).length
                : 0;
            seniorsAmatuers = stats.MembersQL.length > 0
                ? stats.MembersQL.filter((a) => {
                    return (
                        a.PlayerQL.playerCategory == 'Senior Amateurs'
                    );
                }).length
                : 0;
            ladies = stats.MembersQL.length > 0
                ? stats.MembersQL.filter((a) => {
                    return (
                        a.PlayerQL.playerCategory == 'Ladies'
                    );
                }).length
                : 0;
            professionals = stats.MembersQL.length > 0
                ? stats.MembersQL.filter((a) => {
                    return (
                        a.PlayerQL.playerCategory == 'Professionals'
                    );
                }).length
                : 0;
            veterans = stats.MembersQL.length > 0
                ? stats.MembersQL.filter((a) => {
                    return (
                        a.PlayerQL.playerCategory == 'Veterans'
                    );
                }).length
                : 0;
            nulls = stats.MembersQL.length > 0
                ? stats.MembersQL.filter((a) => {
                    return (
                        a.PlayerQL.playerCategory == null
                    );
                }).length
                : 0;
            redNine = (stats.courseHoleSets == 1 && stats.courseHoleSetsInverted == false) ? 1 : 0;
            blueNine = (stats.courseHoleSets == 4 && stats.courseHoleSetsInverted == false) ? 1 : 0;
            redfrontBlueback = (stats.courseHoleSets == 3 && stats.courseHoleSetsInverted == false) ? 1 : 0;
            yellowNine = (stats.courseHoleSets == 8 && stats.courseHoleSetsInverted == false) ? 1 : 0;
            blueFrontYellowback = (stats.courseHoleSets == 12 && stats.courseHoleSetsInverted == false) ? 1 : 0;
            redFrontYellowback = (stats.courseHoleSets == 9 && stats.courseHoleSetsInverted == false) ? 1 : 0;
            let obj = {
                date: timestamp,
                membersCount: memCounter,
                totalFlights: totalFlights,
                amateurs: amateurs,
                seniorsAmatuers: seniorsAmatuers,
                ladies: ladies,
                professionals: professionals,
                veterans: veterans,
                nulls: nulls,
                redNine: redNine,
                blueNine: blueNine,
                yellowNine: yellowNine,
                redfrontBlueback: redfrontBlueback,
                blueFrontYellowback: blueFrontYellowback,
                redFrontYellowback: redFrontYellowback,
            };

            myData.push(obj);
            prevDate = timestamp;
        }

        myData[myData.length - 1].membersCount = memCounter;
        myData[myData.length - 1].totalFlights = totalFlights;
        myData[myData.length - 1].amateurs = amateurs;
        myData[myData.length - 1].seniorsAmatuers = seniorsAmatuers;
        myData[myData.length - 1].ladies = ladies;
        myData[myData.length - 1].professionals = professionals;
        myData[myData.length - 1].veterans = veterans;
        myData[myData.length - 1].nulls = nulls;
        myData[myData.length - 1].redNine = redNine;
        myData[myData.length - 1].blueNine = blueNine;
        myData[myData.length - 1].yellowNine = yellowNine;
        myData[myData.length - 1].redfrontBlueback = redfrontBlueback;
        myData[myData.length - 1].blueFrontYellowback = blueFrontYellowback;
        myData[myData.length - 1].redFrontYellowback = redFrontYellowback;
        if (timestamp === formattedDate) {
            if (stats.MembersQL.length > 0) {
                const timeParts = stats.time.split(':');
                const hour = parseInt(timeParts[0], 10);
                const minute = parseInt(timeParts[1], 10);
                const formattedTime = General.formatAMPM(hour, minute);
                let newobj = {
                    members: stats.MembersQL,
                    time: formattedTime,
                    courseHoleSetKey: stats.courseHoleSets
                        ? stats.courseHoleSets +
                        '_' +
                        stats.courseHoleSetsInverted
                        : '',
                };
                todayData.push(newobj);
            }
        }
    }
    todayData.sort((a, b) => {
        const timeA = new Date(`01/01/2000 ${a.time}`);
        const timeB = new Date(`01/01/2000 ${b.time}`);
        return (timeB.getTime() - timeA.getTime()) as number; // Cast the result to number
    });

    //console.log(myData);
    //console.log(todayData);
    let dataMembers: any[] = [];
    let dataFlight: any[] = [];
    let areaSource: any[] = [];
    let barChartDataAmateur: any[] = [];
    let barChartDataSenior: any[] = [];
    let barChartDataProfessional: any[] = [];
    let barChartDataLadies: any[] = [];
    let barChartDataVeteran: any[] = [];
    let barChartDataseniorsAmatuers: any[] = [];
    let barChartDataOthers: any[] = [];
    let _labels: any[] = [];
    redNine = 0;
    yellowNine = 0;
    blueNine = 0;
    redfrontBlueback = 0;
    redFrontYellowback = 0;
    blueFrontYellowback = 0;
    for (let obj of myData) {
        dataMembers.push(obj.membersCount);
        dataFlight.push(obj.date);
        barChartDataAmateur.push(obj.amateurs);
        barChartDataSenior.push(obj.seniors);
        barChartDataProfessional.push(obj.professionals);
        barChartDataLadies.push(obj.ladies);
        barChartDataVeteran.push(obj.veterans);
        barChartDataseniorsAmatuers.push(obj.seniorsAmatuers);
        barChartDataOthers.push(obj.nulls);
        redNine += obj.redNine;
        yellowNine += obj.yellowNine;
        blueNine += obj.blueNine;
        redfrontBlueback += obj.redfrontBlueback;
        redFrontYellowback += obj.redFrontYellowback;
        blueFrontYellowback += obj.blueFrontYellowback;
    }
    _labels.push(redNine);
    _labels.push(yellowNine);
    _labels.push(blueNine);
    _labels.push(redfrontBlueback);
    _labels.push(redFrontYellowback);
    _labels.push(blueFrontYellowback);
    let _series = [];
    _series['0'] = [
        {
            data: dataMembers,
            name: 'Members',
            type: 'line',
        },
        {
            data: barChartDataAmateur,
            name: 'Amateurs',
            type: 'column',
        },
        {
            data: barChartDataLadies,
            name: 'Ladies',
            type: 'column',
        },
        {
            data: barChartDataProfessional,
            name: 'Professionals',
            type: 'column',
        },
        {
            data: barChartDataVeteran,
            name: 'Veterans',
            type: 'column',
        },
        {
            data: barChartDataVeteran,
            name: 'Seniors Amateurs',
            type: 'column',
        },
        {
            data: barChartDataOthers,
            name: 'Others',
            type: 'column',
        },
    ];
    let _HolesSetsseries = [
        {
            data: _labels,
            name: 'Played',
        },
    ];
    //console.log(_series);
    const mappedData = {
        series: _series,
        labels: dataFlight,
        holesSet: _HolesSetsseries,
        todayData: todayData,
    };

    return mappedData;
}