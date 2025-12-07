import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  features = [
    {
      icon: '💪',
      title: 'Physical Health',
      description:
        'Track your workouts, monitor your physical activities, and achieve your fitness goals.',
      route: '/physical',
      color: '#4caf50',
    },
    {
      icon: '🧠',
      title: 'Mental Wellness',
      description:
        'Monitor your mental health, practice mindfulness, and maintain emotional balance.',
      route: '/mental',
      color: '#9c27b0',
    },
    {
      icon: '🥗',
      title: 'Nutrition',
      description: 'Log your meals, track nutrients, and get AI-powered nutritional analysis.',
      route: '/nutrition',
      color: '#ff9800',
    },
    {
      icon: '🏆',
      title: 'Challenges',
      description: 'Join health challenges, earn points, and build healthy habits that last.',
      route: '/challenging/list',
      color: '#2196f3',
    },
    {
      icon: '📚',
      title: 'Health Library',
      description: 'Access curated health resources, articles, and educational content.',
      route: '/library',
      color: '#e91e63',
    },
    {
      icon: '👤',
      title: 'Your Profile',
      description: 'View your progress, achievements, badges, and personalized health insights.',
      route: '/user-profile',
      color: '#00bcd4',
    },
  ];

  stats = [
    { value: '10K+', label: 'Active Users' },
    { value: '50+', label: 'Health Challenges' },
    { value: '1M+', label: 'Meals Tracked' },
    { value: '98%', label: 'User Satisfaction' },
  ];
}
