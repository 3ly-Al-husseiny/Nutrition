import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { ChallengeService } from '../../services/challenge.service';
import { NotificationService } from '../../services/notification.service';
import { StorageService } from '../../services/storage.service';
import { UserChallenge, ChallengeStats } from '../../models/challenge.model';
import { UserData } from '../../models/user.model';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
    selector: 'app-progress',
    standalone: true,
    imports: [CommonModule, HeaderComponent],
    templateUrl: './progress.component.html',
    styleUrl: './progress.component.css'
})
export class ProgressComponent implements OnInit, AfterViewInit {

    userData: UserData = { badges: [], points: 0, lastReminderShown: null };
    activeChallenges: UserChallenge[] = [];

    stats = {
        totalPoints: 0,
        activeChallenges: 0,
        completedChallenges: 0
    };

    badgeInfo = [
        { name: 'Bronze', icon: '🥉', class: 'badge-bronze' },
        { name: 'Silver', icon: '🥈', class: 'badge-silver' },
        { name: 'Gold', icon: '🥇', class: 'badge-gold' }
    ];

    private pieChart: Chart | null = null;
    private barChart: Chart | null = null;
    private lineChart: Chart | null = null;

    constructor(
        private challengeService: ChallengeService,
        private notificationService: NotificationService,
        private storageService: StorageService,
        private router: Router
    ) { }

    ngOnInit(): void {
        window.scrollTo(0, 0);
        this.loadProgressData();
    }

    ngAfterViewInit(): void {
        // Initialize charts after view is ready
        setTimeout(() => {
            this.initializeCharts();
        }, 100);
    }

    
    loadProgressData(): void {
        this.userData = this.storageService.getUserData();
        this.activeChallenges = this.challengeService.getActiveChallenges();
        this.stats = this.challengeService.getUserStats();
    }


    initializeCharts(): void {
        this.renderPieChart();
        this.renderBarChart();
        this.renderLineChart();
    }


    renderPieChart(): void {
        const canvas = document.getElementById('challengesPieChart') as HTMLCanvasElement;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        if (this.pieChart) {
            this.pieChart.destroy();
        }

        const completed = this.stats.completedChallenges;
        const inProgress = this.stats.activeChallenges - completed;

        if (this.activeChallenges.length === 0) {
            const container = canvas.parentElement;
            if (container) {
                container.innerHTML = '<p style="text-align: center; color: #a0aec0; padding: 2rem;">No challenges started yet. Join a challenge to see statistics!</p>';
            }
            return;
        }

        this.pieChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: ['Completed', 'In Progress'],
                datasets: [{
                    data: [completed, inProgress],
                    backgroundColor: ['#48bb78', '#f6ad55'],
                    borderColor: '#122017',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: '#ffffff',
                            font: { size: 14 },
                            padding: 15
                        }
                    },
                    tooltip: {
                        backgroundColor: '#19472b',
                        titleColor: '#ffffff',
                        bodyColor: '#ffffff',
                        borderColor: '#48bb78',
                        borderWidth: 1,
                        padding: 12
                    }
                }
            }
        });
    }

    renderBarChart(): void {
        const canvas = document.getElementById('challengesBarChart') as HTMLCanvasElement;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        if (this.barChart) {
            this.barChart.destroy();
        }

        if (this.activeChallenges.length === 0) {
            const container = canvas.parentElement;
            if (container) {
                container.innerHTML = '<p style="text-align: center; color: #a0aec0; padding: 2rem;">No active challenges to display.</p>';
            }
            return;
        }

        // Prepare data
        const labels = this.activeChallenges.map(c => {
            const title = c.title.replace(/[💧🚶💤🍎🧘🧊🍔🥤☕🚭💪🤸‍♀️📱]/g, '').trim();
            return title.length > 15 ? title.substring(0, 15) + '...' : title;
        });

        const progressData = this.activeChallenges.map(c => {
            const stats = this.challengeService.getChallengeStats(c);
            return stats.percentage;
        });

        this.barChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Completion %',
                    data: progressData,
                    backgroundColor: '#48bb78',
                    borderColor: '#38a169',
                    borderWidth: 2,
                    borderRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            color: '#ffffff',
                            callback: function (value) {
                                return value + '%';
                            }
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    },
                    x: {
                        ticks: {
                            color: '#ffffff',
                            maxRotation: 45,
                            minRotation: 45
                        },
                        grid: {
                            display: false
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: '#19472b',
                        titleColor: '#ffffff',
                        bodyColor: '#ffffff',
                        borderColor: '#48bb78',
                        borderWidth: 1,
                        padding: 12,
                        callbacks: {
                            label: function (context) {
                                return 'Progress: ' + context.parsed.y + '%';
                            }
                        }
                    }
                }
            }
        });
    }


    renderLineChart(): void {
        const canvas = document.getElementById('pointsHistoryChart') as HTMLCanvasElement;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        if (this.lineChart) {
            this.lineChart.destroy();
        }

        // Calculate points progression
        const completedChallenges = this.activeChallenges.filter(c =>
            c.progress.every(day => day === true)
        );

        let cumulativePoints = 0;
        const labels = ['Start'];
        const pointsData = [0];

        completedChallenges.forEach((challenge, index) => {
            cumulativePoints += challenge.pointsEarned || challenge.points || 0;
            labels.push(`Challenge ${index + 1}`);
            pointsData.push(cumulativePoints);
        });

        if (completedChallenges.length === 0) {
            labels.push('Now');
            pointsData.push(0);
        }

        this.lineChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Points Earned',
                    data: pointsData,
                    borderColor: '#f6ad55',
                    backgroundColor: 'rgba(246, 173, 85, 0.2)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 5,
                    pointHoverRadius: 7,
                    pointBackgroundColor: '#f6ad55',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            color: '#ffffff',
                            callback: function (value) {
                                return value + ' pts';
                            }
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    },
                    x: {
                        ticks: {
                            color: '#ffffff',
                            maxRotation: 45,
                            minRotation: 0
                        },
                        grid: {
                            display: false
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: '#19472b',
                        titleColor: '#ffffff',
                        bodyColor: '#ffffff',
                        borderColor: '#f6ad55',
                        borderWidth: 1,
                        padding: 12,
                        callbacks: {
                            label: function (context) {
                                return 'Total Points: ' + context.parsed.y;
                            }
                        }
                    }
                }
            }
        });
    }

    
    // Get challenge statistics
    getChallengeStats(challenge: UserChallenge): ChallengeStats {
        return this.challengeService.getChallengeStats(challenge);
    }


// Check if user has a specific badge
hasBadge(badgeName: string): boolean {
    return this.userData.badges.includes(badgeName);
}

/**
 * Get only the badges that user has earned
 * @returns
 */
getEarnedBadges() {
    return this.badgeInfo.filter(badge => this.hasBadge(badge.name));
}

    browseChallenges(): void {
        this.router.navigate(['/challenges']);
    }

        
    exportProgress(): void {
        const data = this.storageService.exportData();
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `challenges-backup-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        this.notificationService.success(
            'Data Exported!',
            'Your progress has been downloaded as a JSON file.'
        );
    }

    
    resetProgress(): void {
        this.notificationService.confirmDanger(
            'Reset All Data?',
            '<p>Your progress will be lost.</p><p style="color: #fc8181; margin-top: 1rem;"><strong>This action cannot be undone!</strong></p>',
            'Yes, Reset Everything',
            'Cancel'
        ).then(confirmed => {
            if (confirmed) {
                this.storageService.clearAll();

                this.notificationService.success(
                    'Data Reset Complete',
                    'All your progress has been cleared. Starting fresh!'
                ).then(() => {
                    window.location.reload();
                });
            }
        });
    }

    
    viewChallenge(challengeId: number): void {
        this.router.navigate(['/challenge', challengeId]);
    }
}