// Wrapper service for SweetAlert2

import { Injectable } from '@angular/core';
import Swal, { SweetAlertOptions } from 'sweetalert2';

@Injectable({
    providedIn: 'root'
})
export class NotificationService {

    // Default styling for all alerts
    private readonly defaultOptions: SweetAlertOptions = {
        background: '#19472b',
        color: '#ffffff',
        confirmButtonColor: '#48bb78',
        cancelButtonColor: '#fc8181'
    };

    constructor() { }

    /**
     * Show success message
     * @param title 
     * @param message 
     * @param timer 
     */
    success(title: string, message?: string, timer?: number): Promise<any> {
        return Swal.fire({
            ...this.defaultOptions,
            icon: 'success',
            title,
            text: message,
            timer,
            showConfirmButton: !timer,
            timerProgressBar: !!timer
        });
    }

    /**
     * Show error message
     * @param title 
     * @param message
     */
    error(title: string, message: string): Promise<any> {
        return Swal.fire({
            ...this.defaultOptions,
            icon: 'error',
            title,
            text: message
        });
    }

    /**
     * Show warning message
     * @param title 
     * @param message 
     */
    warning(title: string, message: string): Promise<any> {
        return Swal.fire({
            ...this.defaultOptions,
            icon: 'warning',
            title,
            text: message
        });
    }

    /**
     * Show info message
     * @param title 
     * @param message 
     * @param timer 
     */
    info(title: string, message: string, timer?: number): Promise<any> {
        return Swal.fire({
            ...this.defaultOptions,
            icon: 'info',
            title,
            text: message,
            timer,
            showConfirmButton: !timer,
            timerProgressBar: !!timer
        });
    }

    /**
     * Show confirmation dialog
     * @param title 
     * @param message 
     * @param confirmText 
     * @param cancelText 
     * @returns 
     */
    async confirm(
        title: string,
        message: string,
        confirmText: string = 'Yes',
        cancelText: string = 'No'
    ): Promise<boolean> {
        const result = await Swal.fire({
            ...this.defaultOptions,
            icon: 'question',
            title,
            html: message,
            showCancelButton: true,
            confirmButtonText: confirmText,
            cancelButtonText: cancelText
        });

        return result.isConfirmed;
    }

    /**
     * Show danger confirmation 
     * @param title 
     * @param message 
     * @param confirmText 
     * @param cancelText 
     * @returns
     */
    async confirmDanger(
        title: string,
        message: string,
        confirmText: string = 'Yes, Delete It',
        cancelText: string = 'Cancel'
    ): Promise<boolean> {
        const result = await Swal.fire({
            ...this.defaultOptions,
            icon: 'warning',
            title,
            html: message,
            showCancelButton: true,
            confirmButtonText: confirmText,
            cancelButtonText: cancelText,
            confirmButtonColor: '#fc8181',
            cancelButtonColor: '#48bb78'
        });

        return result.isConfirmed;
    }

    /**
     * Show toast notification 
     * @param title 
     * @param icon 
     * @param timer 
     */
    toast(
        title: string,
        icon: 'success' | 'error' | 'info' | 'warning' = 'info',
        timer: number = 3000
    ): void {
        Swal.fire({
            ...this.defaultOptions,
            icon,
            title,
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer,
            timerProgressBar: true
        });
    }

    /**
     * Show challenge completion with confetti
     * @param points 
     * @param badges 
     */
    challengeCompleted(points: number, badges: string[] = []): Promise<any> {
        let badgeText = '';
        if (badges.length > 0) {
            badgeText = `<p style="margin-top: 1rem;">🏅 <strong>New Badge${badges.length > 1 ? 's' : ''} Earned:</strong> ${badges.join(', ')}</p>`;
        }

        return Swal.fire({
            ...this.defaultOptions,
            icon: 'success',
            title: '🏆 Challenge Completed!',
            html: `<p>Congratulations! You've earned <strong>${points}</strong> points!</p>${badgeText}`,
            confirmButtonText: 'Awesome!'
        });
    }

/**
 * Show reminder notification
 * @param message 
 */
showReminder(message: string): void {
    setTimeout(() => {
        Swal.fire({
            ...this.defaultOptions,
            icon: 'info',
            title: '🔔 Daily Reminder',
            text: message,
            timer: 5000,
            timerProgressBar: true,
            showConfirmButton: false,
            position: 'top-end',
            toast: true
        });
    }, 3000);
}
}