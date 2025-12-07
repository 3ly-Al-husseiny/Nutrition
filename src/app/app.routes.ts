// Used lazy loading for better performance

import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'challenges',
        pathMatch: 'full'
    },

    {
        path: 'challenges',
        loadComponent: () => import('./components/challenges-list/challenges-list.component')
            .then(m => m.ChallengesListComponent)
    },

    {
        path: 'challenge/:id',
        loadComponent: () => import('./components/challenge-details/challenge-details.component')
            .then(m => m.ChallengeDetailsComponent)
    },

    {
        path: 'progress',
        loadComponent: () => import('./components/progress/progress.component')
            .then(m => m.ProgressComponent)
    },

    {
        path: '**',
        redirectTo: 'challenges'
    }
];