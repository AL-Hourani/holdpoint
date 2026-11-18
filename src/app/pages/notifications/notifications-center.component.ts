
import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

type NotificationType =
  | 'reservation'
  | 'resource'
  | 'security'
  | 'system';

type NotificationFilter =
  | 'all'
  | 'unread'
  | 'read';

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  time: string;
  timestamp: number;
  read: boolean;
  application: string;
}

@Component({
  selector: 'app-notifications-center',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './notifications-center.component.html',
  styleUrl: './notifications-center.component.css'
})
export class NotificationsCenterComponent {

  readonly activeFilter = signal<NotificationFilter>('all');

  readonly searchQuery = signal('');

  readonly notifications = signal<NotificationItem[]>([
    {
      id: 'NTF-1001',
      title: 'Reservation confirmed',
      message: 'A reservation has been successfully confirmed for resource Conference Room A.',
      type: 'reservation',
      time: '5 minutes ago',
      timestamp: Date.now() - 5 * 60 * 1000,
      read: false,
      application: 'Resource Management'
    },
    {
      id: 'NTF-1002',
      title: 'Resource capacity updated',
      message: 'The capacity of Warehouse Storage has been updated successfully.',
      type: 'resource',
      time: '32 minutes ago',
      timestamp: Date.now() - 32 * 60 * 1000,
      read: false,
      application: 'Resource Management'
    },
    {
      id: 'NTF-1003',
      title: 'New login detected',
      message: 'A new sign-in to your Holdpoint account was detected.',
      type: 'security',
      time: '2 hours ago',
      timestamp: Date.now() - 2 * 60 * 60 * 1000,
      read: false,
      application: 'Platform Security'
    },
    {
      id: 'NTF-1004',
      title: 'Hold successfully created',
      message: 'A temporary resource hold has been created successfully.',
      type: 'reservation',
      time: 'Yesterday',
      timestamp: Date.now() - 24 * 60 * 60 * 1000,
      read: true,
      application: 'Resource Management'
    },
    {
      id: 'NTF-1005',
      title: 'Welcome to Holdpoint',
      message: 'Your account is ready. Explore your workspace and available applications.',
      type: 'system',
      time: '2 days ago',
      timestamp: Date.now() - 2 * 24 * 60 * 60 * 1000,
      read: true,
      application: 'Holdpoint Platform'
    },
    {
      id: 'NTF-1006',
      title: 'Reservation expired',
      message: 'A temporary hold has expired and its reserved capacity has been released.',
      type: 'reservation',
      time: '3 days ago',
      timestamp: Date.now() - 3 * 24 * 60 * 60 * 1000,
      read: true,
      application: 'Resource Management'
    }
  ]);

  readonly unreadCount = computed(() =>
    this.notifications().filter(item => !item.read).length
  );

  readonly readCount = computed(() =>
    this.notifications().filter(item => item.read).length
  );

  readonly totalCount = computed(() =>
    this.notifications().length
  );

  readonly filteredNotifications = computed(() => {

    const filter = this.activeFilter();
    const query = this.searchQuery().trim().toLowerCase();

    return this.notifications()
      .filter(item => {

        if (filter === 'unread' && item.read) {
          return false;
        }

        if (filter === 'read' && !item.read) {
          return false;
        }

        if (!query) {
          return true;
        }

        return (
          item.title.toLowerCase().includes(query) ||
          item.message.toLowerCase().includes(query) ||
          item.application.toLowerCase().includes(query) ||
          item.id.toLowerCase().includes(query)
        );

      })
      .sort((a, b) => b.timestamp - a.timestamp);
  });

  setFilter(filter: NotificationFilter): void {
    this.activeFilter.set(filter);
  }

  markAsRead(id: string): void {
    this.notifications.update(items =>
      items.map(item =>
        item.id === id
          ? { ...item, read: true }
          : item
      )
    );
  }

  markAsUnread(id: string): void {
    this.notifications.update(items =>
      items.map(item =>
        item.id === id
          ? { ...item, read: false }
          : item
      )
    );
  }

  markAllAsRead(): void {
    this.notifications.update(items =>
      items.map(item => ({
        ...item,
        read: true
      }))
    );
  }

  deleteNotification(id: string): void {
    this.notifications.update(items =>
      items.filter(item => item.id !== id)
    );
  }

  clearReadNotifications(): void {
    this.notifications.update(items =>
      items.filter(item => !item.read)
    );
  }

  clearSearch(): void {
    this.searchQuery.set('');
  }

  getTypeLabel(type: NotificationType): string {
    const labels: Record<NotificationType, string> = {
      reservation: 'Reservations',
      resource: 'Resources',
      security: 'Security',
      system: 'System'
    };

    return labels[type];
  }

}
