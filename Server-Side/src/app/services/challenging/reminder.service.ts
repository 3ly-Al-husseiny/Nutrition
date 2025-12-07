/**
 * Manages reminder notifications for active challenges
 * Used sessionStorage to show reminder once per session
 */

import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { NotificationService } from './notification.service';

@Injectable({
    providedIn: 'root'
})
export class ReminderService {

    private readonly reminders = [
        "A small step every day makes big progress.",
        "Keep going, your future self will thank you.",
        "Remember to take care of yourself today.",
        "Don't forget to check today's challenge!"
    ];

    constructor(
        private storageService: StorageService,
        private notificationService: NotificationService
    ) { }


    checkAndShowReminder(): void {
        const activeChallenges = this.storageService.getChallenges();

        // If there are no active challenges, do not show the reminder
        if (activeChallenges.length === 0) return;

        // Check if reminder was already shown in this session
        if (sessionStorage.getItem("reminderShown") === "true") return;

        // Get the last reminder index from localStorage
        let currentIndex = parseInt(localStorage.getItem("reminderIndex") || '0', 10);

        // Ensure index is valid
        if (isNaN(currentIndex) || currentIndex < 0 || currentIndex >= this.reminders.length) {
            currentIndex = 0;
        }

        // Get the current reminder message
        const message = this.reminders[currentIndex];

        // Display the reminder
        this.notificationService.showReminder(message);

        // Move to the next reminder message
        const nextIndex = (currentIndex + 1) % this.reminders.length;

        // Save the updated index for next visit
        localStorage.setItem("reminderIndex", nextIndex.toString());

        // Mark reminder as shown for this session
        sessionStorage.setItem("reminderShown", "true");
    }
}