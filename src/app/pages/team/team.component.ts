import { Component, computed, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

type MemberRole =
  | 'OWNER'
  | 'ADMIN'
  | 'OPERATIONS_MANAGER'
  | 'MEMBER'
  | 'VIEWER';

type MemberStatus = 'ACTIVE' | 'INVITED' | 'SUSPENDED';
type TeamFilter = 'ALL' | MemberStatus;

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: MemberRole;
  status: MemberStatus;
  joinedAt: string;
  lastActive: string | null;
}

@Component({
  selector: 'app-team',
  standalone: true,
  imports: [DatePipe, RouterLink],
  templateUrl: './team.component.html',
  styleUrl: './team.component.css'
})
export class TeamComponent {

  // بيانات تجريبية مؤقتة لتطوير الواجهة.
  // لاحقاً ستأتي هذه البيانات من Organization Members API.

  readonly members = signal<TeamMember[]>([
    {
      id: 'member-001',
      name: 'Aaron Mitchell',
      email: 'aaron@northstar.example',
      role: 'OWNER',
      status: 'ACTIVE',
      joinedAt: '2026-09-10T09:00:00',
      lastActive: '2026-11-16T08:42:00'
    },
    {
      id: 'member-002',
      name: 'Sophia Chen',
      email: 'sophia@northstar.example',
      role: 'ADMIN',
      status: 'ACTIVE',
      joinedAt: '2026-09-12T10:30:00',
      lastActive: '2026-11-16T08:15:00'
    },
    {
      id: 'member-003',
      name: 'Daniel Brooks',
      email: 'daniel@northstar.example',
      role: 'OPERATIONS_MANAGER',
      status: 'ACTIVE',
      joinedAt: '2026-09-15T11:00:00',
      lastActive: '2026-11-15T16:20:00'
    },
    {
      id: 'member-004',
      name: 'Maya Patel',
      email: 'maya@northstar.example',
      role: 'OPERATIONS_MANAGER',
      status: 'ACTIVE',
      joinedAt: '2026-10-01T09:15:00',
      lastActive: '2026-11-15T14:05:00'
    },
    {
      id: 'member-005',
      name: 'Noah Williams',
      email: 'noah@northstar.example',
      role: 'MEMBER',
      status: 'ACTIVE',
      joinedAt: '2026-10-08T12:00:00',
      lastActive: '2026-11-14T10:35:00'
    },
    {
      id: 'member-006',
      name: 'Olivia Davis',
      email: 'olivia@northstar.example',
      role: 'VIEWER',
      status: 'SUSPENDED',
      joinedAt: '2026-10-12T08:30:00',
      lastActive: '2026-11-02T09:10:00'
    },
    {
      id: 'invite-001',
      name: '',
      email: 'emily@northstar.example',
      role: 'MEMBER',
      status: 'INVITED',
      joinedAt: '2026-11-15T09:00:00',
      lastActive: null
    },
    {
      id: 'invite-002',
      name: '',
      email: 'james@northstar.example',
      role: 'VIEWER',
      status: 'INVITED',
      joinedAt: '2026-11-15T11:30:00',
      lastActive: null
    }
  ]);

  readonly searchTerm = signal('');
  readonly activeFilter = signal<TeamFilter>('ALL');

  readonly selectedMember = signal<TeamMember | null>(null);

  readonly inviteOpen = signal(false);
  readonly inviteEmail = signal('');
  readonly inviteRole = signal<MemberRole>('MEMBER');
  readonly inviteError = signal('');
  readonly feedbackMessage = signal('');

  readonly totalMembers = computed(() =>
    this.members().filter(member => member.status !== 'INVITED').length
  );

  readonly activeMembers = computed(() =>
    this.members().filter(member => member.status === 'ACTIVE').length
  );

  readonly pendingInvitations = computed(() =>
    this.members().filter(member => member.status === 'INVITED').length
  );

  readonly administrators = computed(() =>
    this.members().filter(
      member => member.role === 'OWNER' || member.role === 'ADMIN'
    ).length
  );

  readonly filteredMembers = computed(() => {
    const query = this.searchTerm().trim().toLowerCase();
    const filter = this.activeFilter();

    return this.members().filter(member => {
      const matchesFilter =
        filter === 'ALL' || member.status === filter;

      const matchesSearch =
        !query ||
        member.name.toLowerCase().includes(query) ||
        member.email.toLowerCase().includes(query) ||
        this.roleLabel(member.role).toLowerCase().includes(query);

      return matchesFilter && matchesSearch;
    });
  });

  countFor(filter: TeamFilter): number {
    if (filter === 'ALL') {
      return this.members().length;
    }

    return this.members().filter(
      member => member.status === filter
    ).length;
  }

  setFilter(filter: TeamFilter): void {
    this.activeFilter.set(filter);
  }

  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchTerm.set(input.value);
  }

  initials(name: string): string {
    if (!name.trim()) {
      return 'IN';
    }

    return name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map(part => part.charAt(0).toUpperCase())
      .join('');
  }

  roleLabel(role: MemberRole): string {
    const labels: Record<MemberRole, string> = {
      OWNER: 'Owner',
      ADMIN: 'Administrator',
      OPERATIONS_MANAGER: 'Operations manager',
      MEMBER: 'Member',
      VIEWER: 'Viewer'
    };

    return labels[role];
  }

  statusLabel(status: MemberStatus): string {
    const labels: Record<MemberStatus, string> = {
      ACTIVE: 'Active',
      INVITED: 'Invitation pending',
      SUSPENDED: 'Suspended'
    };

    return labels[status];
  }

  openInvite(): void {
    this.inviteEmail.set('');
    this.inviteRole.set('MEMBER');
    this.inviteError.set('');
    this.inviteOpen.set(true);
  }

  closeInvite(): void {
    this.inviteOpen.set(false);
    this.inviteError.set('');
  }

  updateInviteEmail(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.inviteEmail.set(input.value);
    this.inviteError.set('');
  }

  updateInviteRole(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.inviteRole.set(select.value as MemberRole);
  }

  sendInvitation(event: Event): void {
    event.preventDefault();

    const email = this.inviteEmail().trim().toLowerCase();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      this.inviteError.set('Enter a valid email address.');
      return;
    }

    const alreadyExists = this.members().some(
      member => member.email.toLowerCase() === email
    );

    if (alreadyExists) {
      this.inviteError.set(
        'This email already belongs to a member or an existing invitation.'
      );
      return;
    }

    const invitation: TeamMember = {
      id: `invite-${Date.now()}`,
      name: '',
      email,
      role: this.inviteRole(),
      status: 'INVITED',
      joinedAt: new Date().toISOString(),
      lastActive: null
    };

    this.members.update(current => [invitation, ...current]);

    this.searchTerm.set('');
    this.activeFilter.set('ALL');

    this.inviteOpen.set(false);
    this.feedbackMessage.set(
      'Invitation added to the local preview. Connect the invitation API to send it by email.'
    );
  }

  dismissFeedback(): void {
    this.feedbackMessage.set('');
  }

  openDetails(member: TeamMember): void {
    this.selectedMember.set(member);
  }

  closeDetails(): void {
    this.selectedMember.set(null);
  }
}