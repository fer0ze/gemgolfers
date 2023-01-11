/* tslint:disable:max-line-length */
import { FuseNavigationItem } from '@fuse/components/navigation';

export const defaultNavigation: FuseNavigationItem[] = [
    {
        id: 'dashboards',
        title: 'DashBoards',

        type: 'group',
        icon: 'heroicons_outline:home',
        children: [
            {
                id: 'dashboards.dasboard',
                title: 'Home',
                type: 'basic',
                icon: 'heroicons_outline:clipboard-check',
                link: '/dashboard',
            },
        ],
    },
    {
        id: 'tournaments',
        title: 'Tournament',

        type: 'group',
        icon: 'heroicons_outline:home',
        children: [
            {
                id: 'tournaments.newTournament',
                title: 'New Tournament',
                type: 'basic',
                icon: 'heroicons_outline:academic-cap',
                link: '/tournaments/add',
            },
            {
                id: 'tournaments.schedule',
                title: 'Schedule Tournaments',
                type: 'basic',
                icon: 'heroicons_outline:truck',
                link: '/tournaments/schedule',
            },
            {
                id: 'tournaments.viewtournaments',
                title: 'All Tournaments',
                type: 'basic',
                icon: 'heroicons_outline:view-list',
                link: '/tournaments',
            },
        ],
    },
    // },
    // {
    //     id: 'leagues',
    //     title: 'League',

    //     type: 'group',
    //     icon: 'heroicons_outline:view-boards',
    //     children: [
    //         {
    //             id: 'leagues.newleagues',
    //             title: 'New League',
    //             type: 'basic',
    //             icon: 'heroicons_outline:academic-cap',
    //             link: '/leagues/new',
    //         },
    //         {
    //             id: 'leagues.viewleagues',
    //             title: 'All Leagues',
    //             type: 'basic',
    //             icon: 'heroicons_outline:view-boards',
    //             link: '/leagues/view',
    //         },
    //     ],
    // },
    {
        id: 'players',
        title: 'Players',
        type: 'group',
        icon: 'heroicons_outline:menu-alt-2',
        children: [
            {
                id: 'players.viewplayers',
                title: 'All Players',
                type: 'basic',
                icon: 'heroicons_outline:user-group',
                link: '/players',
            },
        ],
    },
   
    {
        id: 'dailyRounds',
        title: 'DailyRound',
        type: 'group',
        icon: 'heroicons_outline:pencil-alt',
        children: [
            // {
            //     id: 'dailyRounds.add',
            //     title: 'New Round',
            //     type: 'basic',
            //     icon: 'heroicons_outline:check-circle',
            //     link: '/dailyRounds/new',
            // },
            {
                id: 'dailyRounds.daily',
                title: 'Daily-Rounds',
                type: 'basic',
                icon: 'heroicons_outline:view-boards',
                link: '/dailyRounds',
            },
            {
                id: 'dailyRounds.teetimes',
                title: 'Tee Times',
                type: 'basic',
                icon: 'heroicons_outline:menu-alt-4',
                link: '/teetimes',
            },
        ],
    },
    {
        id: 'handicaps',
        title: 'Handicaps',
        type: 'group',
        icon: 'heroicons_outline:document',
        children: [
            {
                id: 'handicaps.CONGU',
                title: 'CONGU',
                type: 'basic',
                icon: 'heroicons_outline:check-circle',
                link: '/handicaps/CONGU',
            },
            {
                id: 'leagues.WHS',
                title: 'WHS',
                type: 'basic',
                icon: 'heroicons_outline:newspaper',
                link: '/handicaps/WHS',
            },
        ],
    },

    {
        id: 'reports',
        title: 'Report',
        type: 'group',
        icon: 'heroicons_outline:support',
        children: [
            {
                id: 'reports.handicap',
                title: 'Handicap',
                type: 'basic',
                icon: 'heroicons_outline:check-circle',
                link: '/reports/handicap',
            },
            {
                id: 'reports.dailyround',
                title: 'Daily-Round',
                type: 'basic',
                icon: 'heroicons_outline:pencil',
                link: '/reports/dailyround',
            },
            {
                id: 'reports.dailycard',
                title: 'Daily-Card',
                type: 'basic',
                icon: 'heroicons_outline:book-open',
                link: '/reports/dailycard',
            },
            {
                id: 'reports.Players',
                title: 'Players',
                type: 'basic',
                icon: 'heroicons_outline:speakerphone',
                link: '/reports/players',
            },
        ],
    }
];
export const defaultNavigationSuperAdmin: FuseNavigationItem[] = [
    {
        id: 'dashboards',
        title: 'DashBoards',

        type: 'group',
        icon: 'heroicons_outline:home',
        children: [
            {
                id: 'dashboards.dasboard',
                title: 'Home',
                type: 'basic',
                icon: 'heroicons_outline:clipboard-check',
                link: '/dashboard',
            },
        ],
    },
    {
        id: 'tournaments',
        title: 'Tournament',

        type: 'group',
        icon: 'heroicons_outline:home',
        children: [
            {
                id: 'tournaments.newTournament',
                title: 'New Tournament',
                type: 'basic',
                icon: 'heroicons_outline:academic-cap',
                link: '/tournaments/add',
            },
            {
                id: 'tournaments.schedule',
                title: 'Schedule Tournaments',
                type: 'basic',
                icon: 'heroicons_outline:truck',
                link: '/tournaments/schedule',
            },
            {
                id: 'tournaments.viewtournaments',
                title: 'All Tournaments',
                type: 'basic',
                icon: 'heroicons_outline:view-list',
                link: '/tournaments',
            },
        ],
    },
    // },
    // {
    //     id: 'leagues',
    //     title: 'League',

    //     type: 'group',
    //     icon: 'heroicons_outline:view-boards',
    //     children: [
    //         {
    //             id: 'leagues.newleagues',
    //             title: 'New League',
    //             type: 'basic',
    //             icon: 'heroicons_outline:academic-cap',
    //             link: '/leagues/new',
    //         },
    //         {
    //             id: 'leagues.viewleagues',
    //             title: 'All Leagues',
    //             type: 'basic',
    //             icon: 'heroicons_outline:view-boards',
    //             link: '/leagues/view',
    //         },
    //     ],
    // },
    {
        id: 'players',
        title: 'Players',
        type: 'group',
        icon: 'heroicons_outline:menu-alt-2',
        children: [
            {
                id: 'players.viewplayers',
                title: 'All Players',
                type: 'basic',
                icon: 'heroicons_outline:user-group',
                link: '/players',
            },
        ],
    },
   
    {
        id: 'dailyRounds',
        title: 'DailyRound',
        type: 'group',
        icon: 'heroicons_outline:pencil-alt',
        children: [
            // {
            //     id: 'dailyRounds.add',
            //     title: 'New Round',
            //     type: 'basic',
            //     icon: 'heroicons_outline:check-circle',
            //     link: '/dailyRounds/new',
            // },
            {
                id: 'dailyRounds.daily',
                title: 'Daily-Rounds',
                type: 'basic',
                icon: 'heroicons_outline:view-boards',
                link: '/dailyRounds',
            },
            {
                id: 'dailyRounds.teetimes',
                title: 'Tee Times',
                type: 'basic',
                icon: 'heroicons_outline:menu-alt-4',
                link: '/teetimes',
            },
        ],
    },
    {
        id: 'handicaps',
        title: 'Handicaps',
        type: 'group',
        icon: 'heroicons_outline:document',
        children: [
            {
                id: 'handicaps.CONGU',
                title: 'CONGU',
                type: 'basic',
                icon: 'heroicons_outline:check-circle',
                link: '/handicaps/CONGU',
            },
            {
                id: 'leagues.WHS',
                title: 'WHS',
                type: 'basic',
                icon: 'heroicons_outline:newspaper',
                link: '/handicaps/WHS',
            },
        ],
    },

    {
        id: 'reports',
        title: 'Report',
        type: 'group',
        icon: 'heroicons_outline:support',
        children: [
            {
                id: 'reports.handicap',
                title: 'Handicap',
                type: 'basic',
                icon: 'heroicons_outline:check-circle',
                link: '/reports/handicap',
            },
            {
                id: 'reports.dailyround',
                title: 'Daily-Round',
                type: 'basic',
                icon: 'heroicons_outline:pencil',
                link: '/reports/dailyround',
            },
            {
                id: 'reports.dailycard',
                title: 'Daily-Card',
                type: 'basic',
                icon: 'heroicons_outline:book-open',
                link: '/reports/dailycard',
            },
            {
                id: 'reports.Players',
                title: 'Players',
                type: 'basic',
                icon: 'heroicons_outline:speakerphone',
                link: '/reports/players',
            },
        ],
    },
    {
        id: 'feedback',
        title: 'Admin Side',
        type: 'group',
        icon: 'heroicons_outline:heart',
        children: [
            {
                id: 'feedback.viewfeedback',
                title: 'FeedBacks',
                type: 'basic',
                icon: 'heroicons_outline:user-group',
                link: '/feedback',
            },
            {
                id: 'feedback.allCourses',
                title: 'Courses',
                type: 'basic',
                icon: 'heroicons_outline:user-group',
                link: '/courses',
            },
        ],
    },
];
export const compactNavigation: FuseNavigationItem[] = [
    {
        id: 'dashboard',
        title: 'DashBoard',
        type: 'basic',
        icon: 'heroicons_outline:chart-pie',
        link: '/dashboard',
    },
    {
        id: 'tournaments',
        title: 'Tournament',
        type: 'basic',
        icon: 'heroicons_outline:chart-pie',
        link: '/tournament',
    },
    {
        id: 'players',
        title: 'Players',
        type: 'basic',
        icon: 'heroicons_outline:chart-pie',
        link: '/players',
    },
    {
        id: 'handicaps',
        title: 'Handicap',
        type: 'basic',
        icon: 'heroicons_outline:chart-pie',
        link: '/handicap',
    },
    {
        id: 'dailyRounds',
        title: 'DailyRound',
        type: 'basic',
        icon: 'heroicons_outline:chart-pie',
        link: '/dailyRound',
    },
    {
        id: 'reports',
        title: 'Report',
        type: 'basic',
        icon: 'heroicons_outline:chart-pie',
        link: '/report',
    },
];
export const futuristicNavigation: FuseNavigationItem[] = [
    {
        id: 'dashboard',
        title: 'DashBoard',
        type: 'basic',
        icon: 'heroicons_outline:chart-pie',
        link: '/dashboard',
    },
    {
        id: 'tournaments',
        title: 'Tournament',
        type: 'basic',
        icon: 'heroicons_outline:chart-pie',
        link: '/tournament',
    },
    {
        id: 'players',
        title: 'Players',
        type: 'basic',
        icon: 'heroicons_outline:chart-pie',
        link: '/players',
    },
    {
        id: 'handicaps',
        title: 'Handicap',
        type: 'basic',
        icon: 'heroicons_outline:chart-pie',
        link: '/handicap',
    },
    {
        id: 'dailyRounds',
        title: 'DailyRound',
        type: 'basic',
        icon: 'heroicons_outline:chart-pie',
        link: '/dailyRound',
    },
    {
        id: 'reports',
        title: 'Report',
        type: 'basic',
        icon: 'heroicons_outline:chart-pie',
        link: '/report',
    },
];
export const horizontalNavigation: FuseNavigationItem[] = [
    {
        id: 'dashboard',
        title: 'DashBoard',
        type: 'basic',
        icon: 'heroicons_outline:chart-pie',
        link: '/dashboard',
    },
    {
        id: 'tournaments',
        title: 'Tournament',
        type: 'basic',
        icon: 'heroicons_outline:chart-pie',
        link: '/tournament',
    },
    {
        id: 'players',
        title: 'Players',
        type: 'basic',
        icon: 'heroicons_outline:chart-pie',
        link: '/players',
    },
    {
        id: 'handicaps',
        title: 'Handicap',
        type: 'basic',
        icon: 'heroicons_outline:chart-pie',
        link: '/handicap',
    },
    {
        id: 'dailyRounds',
        title: 'DailyRound',
        type: 'basic',
        icon: 'heroicons_outline:chart-pie',
        link: '/dailyRound',
    },
    {
        id: 'reports',
        title: 'Report',
        type: 'basic',
        icon: 'heroicons_outline:chart-pie',
        link: '/report',
    },
];
