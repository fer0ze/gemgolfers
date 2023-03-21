import { Route } from '@angular/router';
import { AuthGuard } from 'app/core/auth/guards/auth.guard';
import { NoAuthGuard } from 'app/core/auth/guards/noAuth.guard';
import { LayoutComponent } from 'app/layout/layout.component';
import { InitialDataResolver } from 'app/app.resolvers';
import { EmptyLayoutComponent } from './layout/layouts/empty/empty.component';
import { LayoutLeaderComponent } from './layout-Leader/layout-leader.component';

// @formatter:off
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
export const appRoutes: Route[] = [
    // Redirect empty path to '/example'
    { path: '', pathMatch: 'full', redirectTo: 'dashboard' },

    // Landing routes
    {
        path: 'leaderboard',
        loadChildren: () =>
            import(
                'app/modules/admin/mainleaderboard/mainleaderboard.module'
            ).then((m) => m.MainLeaderboardModule),
        component: LayoutLeaderComponent,
        data: {
            layout: 'empty',
        },

    },
    {
        path: 'signUpForm',
        loadChildren: () =>
            import(
                'app/modules/admin/tournaments/Sign-Up-Form/sign-up-form/sign-up-form.module'
            ).then((m) => m.SignUpFormModule),
        component: LayoutComponent,
        data: {
            layout: 'empty',
        },
    },

    // Redirect signed in user to the '/example'
    //
    // After the user signs in, the sign in page will redirect the user to the 'signed-in-redirect'
    // path. Below is another redirection for that path to redirect the user to the desired
    // location. This is a small convenience to keep all main routes together here on this file.
    { path: 'signed-in-redirect', pathMatch: 'full', redirectTo: 'dashboard' },

    // Auth routes for guests
    {
        path: '',
        canActivate: [NoAuthGuard],
        canActivateChild: [NoAuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'empty',
        },
        children: [
            {
                path: 'confirmation-required',
                loadChildren: () =>
                    import(
                        'app/modules/auth/confirmation-required/confirmation-required.module'
                    ).then((m) => m.AuthConfirmationRequiredModule),
            },
            {
                path: 'forgot-password',
                loadChildren: () =>
                    import(
                        'app/modules/auth/forgot-password/forgot-password.module'
                    ).then((m) => m.AuthForgotPasswordModule),
            },
            {
                path: 'reset-password',
                loadChildren: () =>
                    import(
                        'app/modules/auth/reset-password/reset-password.module'
                    ).then((m) => m.AuthResetPasswordModule),
            },
            {
                path: 'sign-in',
                loadChildren: () =>
                    import('app/modules/auth/sign-in/sign-in.module').then(
                        (m) => m.AuthSignInModule
                    ),
            },
            {
                path: 'sign-up',
                loadChildren: () =>
                    import('app/modules/auth/sign-up/sign-up.module').then(
                        (m) => m.AuthSignUpModule
                    ),
            },
        ],
    },

    // Auth routes for authenticated users
    {
        path: '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'empty',
        },
        children: [
            {
                path: 'sign-out',
                loadChildren: () =>
                    import('app/modules/auth/sign-out/sign-out.module').then(
                        (m) => m.AuthSignOutModule
                    ),
            },
            {
                path: 'unlock-session',
                loadChildren: () =>
                    import(
                        'app/modules/auth/unlock-session/unlock-session.module'
                    ).then((m) => m.AuthUnlockSessionModule),
            },
        ],
    },

    // Admin routes
    {
        path: '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component: LayoutComponent,
        resolve: {
            initialData: InitialDataResolver,
        },
        children: [
            {
                path: 'dashboard',
                loadChildren: () =>
                    import(
                        'app/modules/admin/dashboards/project/project.module'
                    ).then((m) => m.ProjectModule),
            },
            {
                path: 'players',
                loadChildren: () =>
                    import('app/modules/admin/players/players.module').then(
                        (m) => m.PlayersModule
                    ),
            },
            {
                path: 'dailyRounds',
                loadChildren: () =>
                    import(
                        'app/modules/admin/daily-rounds/daily-rounds.module'
                    ).then((m) => m.DailyRoundsModule),
            },
            {
                path: 'handicaps/CONGU',
                loadChildren: () =>
                    import(
                        'app/modules/admin/handicap-CONGU/handicap.module'
                    ).then((m) => m.HandicapModule),
            },
            {
                path: 'handicaps/WHS',
                loadChildren: () =>
                    import(
                        'app/modules/admin/handicap-WHS/handicap.module'
                    ).then((m) => m.HandicapModule),
            },
            {
                path: 'reports/dailyround',
                loadChildren: () =>
                    import(
                        'app/modules/admin/reports/daily-rounds-stats/daily-rounds-stats.module'
                    ).then((m) => m.DailyRoundsStatsModule),
            },
            {
                path: 'reports/dailycard',
                loadChildren: () =>
                    import(
                        'app/modules/admin/reports/daily-starter-report/daily-starter-report.module'
                    ).then((m) => m.DailyStarterReportModule),
            },
            {
                path: 'reports/handicap',
                loadChildren: () =>
                    import(
                        'app/modules/admin/reports/updated-handicap-report/updated-handicap-report.module'
                    ).then((m) => m.UpdatedHandicapReportModule),
            },
            {
                path: 'reports/players',
                loadChildren: () =>
                    import(
                        'app/modules/admin/reports/golf-report/golf-report.module'
                    ).then((m) => m.GolfReportModule),
            },
            {
                path: 'reports/club',
                loadChildren: () =>
                    import(
                        'app/modules/admin/reports/club-report/club-report/club-report.module'
                    ).then((m) => m.ClubReportModule),
            },
            {
                path: 'feedback',
                loadChildren: () =>
                    import('app/modules/admin/feedback/feedback.module').then(
                        (m) => m.FeedbackModule
                    ),
            },
            {
                path: 'teetimes',
                loadChildren: () =>
                    import('app/modules/admin/tee-times/tee-times.module').then(
                        (m) => m.TeeTimesModule
                    ),
            },
            {
                path: 'tournaments',
                loadChildren: () =>
                    import(
                        'app/modules/admin/tournaments/tournaments.module'
                    ).then((m) => m.TournamentsModule),
            },
            {
                path: 'leagues',
                loadChildren: () =>
                    import(
                        'app/modules/admin/leagues/leagues.module'
                    ).then((m) => m.LeaguesModule),
            },
            {
                path: 'tournaments/schedule',
                loadChildren: () =>
                    import(
                        'app/modules/admin/tournaments/schedule/schedule.module'
                    ).then((m) => m.ScheduleModule),
            },
            {
                path: 'courses',
                loadChildren: () =>
                    import('app/modules/admin/course/course.module').then(
                        (m) => m.CourseModule
                    ),
            },
            {
                path: 'mergeProfile',
                loadChildren: () =>
                    import(
                        'app/modules/admin/mergeProfile/merge-profiles/merge-profiles.module'
                    ).then((m) => m.MergeProfilesModule),
            },
            //{path: 'matchplay', loadChildren: () => import('app/modules/admin/matchplay/matchplay.module').then(m => m.MatchplayModule)},
        ],
    },
];
