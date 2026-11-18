
import { Component, signal } from '@angular/core';

interface SecuritySession {
  id: string;
  device: string;
  browser: string;
  location: string;
  lastActive: string;
  current: boolean;
  icon: 'monitor' | 'smartphone';
}

interface SecurityEvent {
  id: number;
  title: string;
  description: string;
  date: string;
  icon: string;
}

@Component({
  selector: 'app-security',
  standalone: true,
  templateUrl: './security.html',
  styleUrl: './security.css'
})
export class SecurityComponent {

  // Presentation data only. Replace with API data later.
  readonly emailVerified = signal(true);
  readonly twoFactorEnabled = signal(false);

  readonly sessions = signal<SecuritySession[]>([
    {
      id: 'session-1',
      device: 'Windows PC',
      browser: 'Chrome',
      location: 'Current device',
      lastActive: 'Active now',
      current: true,
      icon: 'monitor'
    },
    {
      id: 'session-2',
      device: 'Mobile device',
      browser: 'Mobile browser',
      location: 'Example location',
      lastActive: 'Example activity',
      current: false,
      icon: 'smartphone'
    }
  ]);

  readonly events: SecurityEvent[] = [
    {
      id: 1,
      title: 'Email verification',
      description: 'Email verification completed',
      date: 'Example activity',
      icon: 'mail-check'
    },
    {
      id: 2,
      title: 'Account created',
      description: 'Your account was registered',
      date: 'Example activity',
      icon: 'user-plus'
    }
  ];

  get activeSessionsCount(): number {
    return this.sessions().length;
  }

  get otherSessionsCount(): number {
    return this.sessions().filter(session => !session.current).length;
  }

  // UI demonstration only. This does not revoke a server session.
  removeDemoSession(id: string): void {
    this.sessions.update(current =>
      current.filter(session => session.id !== id || session.current)
    );
  }
}
