import { Component, computed, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

type ActivityCategory =
  | 'RESOURCE'
  | 'RESERVATION'
  | 'TEAM'
  | 'SECURITY';

type ActivityOutcome = 'SUCCESS' | 'FAILED';

type ActivityFilter = 'ALL' | ActivityCategory;

interface ActivityEntry {
  id: string;
  actorName: string;
  actorEmail: string;
  actorRole: string;
  action: string;
  category: ActivityCategory;
  target: string;
  targetType: string;
  occurredAt: string;
  outcome: ActivityOutcome;
  description: string;
}

@Component({
  selector: 'app-activity',
  standalone: true,
  imports: [DatePipe, RouterLink],
  templateUrl: './activity.component.html',
  styleUrl: './activity.component.css'
})
export class ActivityComponent {

  // بيانات توضيحية مؤقتة لتطوير الواجهة.
  // سيتم استبدالها بنتائج Activity Log API لاحقاً.

  readonly activities = signal<ActivityEntry[]>([
    {
      id: 'evt-2026-0012',
      actorName: 'Aaron Mitchell',
      actorEmail: 'aaron@northstar.example',
      actorRole: 'Owner',
      action: 'Updated resource capacity',
      category: 'RESOURCE',
      target: 'Conference Room A',
      targetType: 'Resource',
      occurredAt: '2026-11-16T09:42:00',
      outcome: 'SUCCESS',
      description: 'Resource capacity was updated from 10 to 12 units.'
    },
    {
      id: 'evt-2026-0011',
      actorName: 'Sophia Chen',
      actorEmail: 'sophia@northstar.example',
      actorRole: 'Administrator',
      action: 'Confirmed a hold',
      category: 'RESERVATION',
      target: 'HP-BK-2026-0018',
      targetType: 'Booking',
      occurredAt: '2026-11-16T09:18:00',
      outcome: 'SUCCESS',
      description: 'A temporary hold was confirmed and its quantity was moved to confirmed capacity.'
    },
    {
      id: 'evt-2026-0010',
      actorName: 'Daniel Brooks',
      actorEmail: 'daniel@northstar.example',
      actorRole: 'Operations manager',
      action: 'Created a hold',
      category: 'RESERVATION',
      target: 'ROOM-CONF-A',
      targetType: 'Resource',
      occurredAt: '2026-11-16T08:54:00',
      outcome: 'SUCCESS',
      description: 'A hold for 4 units was created against Conference Room A.'
    },
    {
      id: 'evt-2026-0009',
      actorName: 'Aaron Mitchell',
      actorEmail: 'aaron@northstar.example',
      actorRole: 'Owner',
      action: 'Invited a team member',
      category: 'TEAM',
      target: 'emily@northstar.example',
      targetType: 'Invitation',
      occurredAt: '2026-11-15T16:32:00',
      outcome: 'SUCCESS',
      description: 'A workspace invitation was created for a new member.'
    },
    {
      id: 'evt-2026-0008',
      actorName: 'Sophia Chen',
      actorEmail: 'sophia@northstar.example',
      actorRole: 'Administrator',
      action: 'Updated member role',
      category: 'TEAM',
      target: 'noah@northstar.example',
      targetType: 'Team member',
      occurredAt: '2026-11-15T14:20:00',
      outcome: 'SUCCESS',
      description: 'The member role was changed from Viewer to Member.'
    },
    {
      id: 'evt-2026-0007',
      actorName: 'Daniel Brooks',
      actorEmail: 'daniel@northstar.example',
      actorRole: 'Operations manager',
      action: 'Created a resource',
      category: 'RESOURCE',
      target: 'Delivery Vehicles',
      targetType: 'Resource',
      occurredAt: '2026-11-15T11:45:00',
      outcome: 'SUCCESS',
      description: 'A new resource was created with an initial capacity of 8 units.'
    },
    {
      id: 'evt-2026-0006',
      actorName: 'System',
      actorEmail: 'system',
      actorRole: 'System',
      action: 'Expired a hold',
      category: 'RESERVATION',
      target: 'HOLD-2026-0041',
      targetType: 'Hold',
      occurredAt: '2026-11-15T10:00:00',
      outcome: 'SUCCESS',
      description: 'The hold reached its expiration time and its reserved quantity was released.'
    },
    {
      id: 'evt-2026-0005',
      actorName: 'Aaron Mitchell',
      actorEmail: 'aaron@northstar.example',
      actorRole: 'Owner',
      action: 'Signed in',
      category: 'SECURITY',
      target: 'Workspace session',
      targetType: 'Session',
      occurredAt: '2026-11-15T08:30:00',
      outcome: 'SUCCESS',
      description: 'A user successfully authenticated and started a workspace session.'
    },
    {
      id: 'evt-2026-0004',
      actorName: 'Sophia Chen',
      actorEmail: 'sophia@northstar.example',
      actorRole: 'Administrator',
      action: 'Cancelled a booking',
      category: 'RESERVATION',
      target: 'HP-BK-2026-0016',
      targetType: 'Booking',
      occurredAt: '2026-11-14T15:10:00',
      outcome: 'SUCCESS',
      description: 'A confirmed booking was cancelled and its committed quantity was released.'
    },
    {
      id: 'evt-2026-0003',
      actorName: 'Daniel Brooks',
      actorEmail: 'daniel@northstar.example',
      actorRole: 'Operations manager',
      action: 'Updated resource',
      category: 'RESOURCE',
      target: 'Laptop Pool',
      targetType: 'Resource',
      occurredAt: '2026-11-14T12:05:00',
      outcome: 'SUCCESS',
      description: 'Resource information was updated.'
    },
    {
      id: 'evt-2026-0002',
      actorName: 'Unknown user',
      actorEmail: 'unrecognized sign-in',
      actorRole: 'Unknown',
      action: 'Failed sign-in attempt',
      category: 'SECURITY',
      target: 'Authentication',
      targetType: 'Security event',
      occurredAt: '2026-11-14T09:22:00',
      outcome: 'FAILED',
      description: 'An authentication attempt was rejected. Sensitive credentials are not stored in the activity log.'
    },
    {
      id: 'evt-2026-0001',
      actorName: 'Aaron Mitchell',
      actorEmail: 'aaron@northstar.example',
      actorRole: 'Owner',
      action: 'Created a resource',
      category: 'RESOURCE',
      target: 'Laptop Pool',
      targetType: 'Resource',
      occurredAt: '2026-11-13T10:15:00',
      outcome: 'SUCCESS',
      description: 'A new resource was added to the workspace.'
    }
  ]);

  readonly searchTerm = signal('');
  readonly activeFilter = signal<ActivityFilter>('ALL');
  readonly selectedActivity = signal<ActivityEntry | null>(null);
  readonly showAll = signal(false);

  readonly totalEvents = computed(() =>
    this.activities().length
  );

  readonly resourceEvents = computed(() =>
    this.activities().filter(
      activity => activity.category === 'RESOURCE'
    ).length
  );

  readonly reservationEvents = computed(() =>
    this.activities().filter(
      activity => activity.category === 'RESERVATION'
    ).length
  );

  readonly teamEvents = computed(() =>
    this.activities().filter(
      activity => activity.category === 'TEAM'
    ).length
  );

  readonly filteredActivities = computed(() => {
    const query = this.searchTerm().trim().toLowerCase();
    const filter = this.activeFilter();

    return this.activities().filter(activity => {
      const matchesFilter =
        filter === 'ALL' || activity.category === filter;

      const searchableText = [
        activity.id,
        activity.actorName,
        activity.actorEmail,
        activity.actorRole,
        activity.action,
        activity.target,
        activity.targetType,
        activity.description
      ].join(' ').toLowerCase();

      const matchesSearch =
        !query || searchableText.includes(query);

      return matchesFilter && matchesSearch;
    });
  });

  readonly visibleActivities = computed(() => {
    const activities = this.filteredActivities();

    return this.showAll()
      ? activities
      : activities.slice(0, 8);
  });

  countFor(filter: ActivityFilter): number {
    if (filter === 'ALL') {
      return this.activities().length;
    }

    return this.activities().filter(
      activity => activity.category === filter
    ).length;
  }

  setFilter(filter: ActivityFilter): void {
    this.activeFilter.set(filter);
    this.showAll.set(false);
  }

  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;

    this.searchTerm.set(input.value);
    this.showAll.set(false);
  }

  toggleShowAll(): void {
    this.showAll.update(value => !value);
  }

  initials(name: string): string {
    return name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map(part => part.charAt(0).toUpperCase())
      .join('');
  }

  categoryLabel(category: ActivityCategory): string {
    const labels: Record<ActivityCategory, string> = {
      RESOURCE: 'Resource',
      RESERVATION: 'Reservation',
      TEAM: 'Team',
      SECURITY: 'Security'
    };

    return labels[category];
  }

  outcomeLabel(outcome: ActivityOutcome): string {
    return outcome === 'SUCCESS' ? 'Successful' : 'Failed';
  }

  openDetails(activity: ActivityEntry): void {
    this.selectedActivity.set(activity);
  }

  closeDetails(): void {
    this.selectedActivity.set(null);
  }

  clearFilters(): void {
    this.searchTerm.set('');
    this.activeFilter.set('ALL');
    this.showAll.set(false);
  }
}