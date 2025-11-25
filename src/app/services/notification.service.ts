import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

export interface Notification {
  id: string;
  title: string;
  message: string;
  time: Date;
  read: boolean;
  type: 'info' | 'success' | 'warning' | 'error';
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/notifications`;

  notifications = signal<Notification[]>([]);
  unreadCount = signal(0);

  loadNotifications() {
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: (data) => {
        // Map backend notification to frontend format
        const mappedNotifications = data.map(n => ({
          id: n.id,
          title: n.title,
          message: n.message,
          time: new Date(n.createdAt),
          read: n.read,
          type: n.type.toLowerCase() as 'info' | 'success' | 'warning' | 'error'
        }));
        this.notifications.set(mappedNotifications);
        this.updateUnreadCount();
      },
      error: (err) => {
        console.error('Error loading notifications:', err);
        // Keep empty array on error
        this.notifications.set([]);
        this.unreadCount.set(0);
      }
    });
  }

  markAsRead(id: string) {
    this.http.put(`${this.apiUrl}/${id}/read`, {}).subscribe({
      next: () => {
        this.notifications.update(notes => 
          notes.map(n => n.id === id ? { ...n, read: true } : n)
        );
        this.updateUnreadCount();
      },
      error: (err) => console.error('Error marking notification as read:', err)
    });
  }

  markAllAsRead() {
    this.http.put(`${this.apiUrl}/mark-all-read`, {}).subscribe({
      next: () => {
        this.notifications.update(notes => 
          notes.map(n => ({ ...n, read: true }))
        );
        this.updateUnreadCount();
      },
      error: (err) => console.error('Error marking all as read:', err)
    });
  }

  private updateUnreadCount() {
    this.unreadCount.set(this.notifications().filter(n => !n.read).length);
  }
}
