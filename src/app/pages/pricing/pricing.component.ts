import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
// TODO: adjust this import to where your AuthService lives
import { AuthService } from '../../core/services/auth.service';

type Billing = 'monthly' | 'yearly';

interface Plan {
  id: 'starter' | 'business' | 'enterprise';
  name: string;
  tagline: string;
  monthly: number | null; // price per user / month, null = custom
  yearly: number | null;  // price per user / month when billed yearly
  cta: string;
  popular?: boolean;
  features: string[];
}

interface Row { label: string; values: string[]; } // 'yes' | 'no' | any text

@Component({
  selector: 'app-pricing',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './pricing.component.html',
  styleUrl: './pricing.component.css',
})
export class PricingComponent {
  readonly auth = inject(AuthService);

  readonly billing = signal<Billing>('yearly');

  readonly plans: Plan[] = [
    {
      id: 'starter', name: 'Starter', tagline: 'For small teams getting organized.',
      monthly: 0, yearly: 0, cta: 'Start for free',
      features: ['1 application of your choice', 'Up to 3 users', '25 resources', 'Reservations and holds', 'Community support'],
    },
    {
      id: 'business', name: 'Business', tagline: 'For growing companies running real operations.',
      monthly: 15, yearly: 12, cta: 'Start free trial', popular: true,
      features: ['Up to 5 applications', 'Unlimited users and resources', 'Capacity control and rules', 'Analytics and reports', 'API access and webhooks', 'Priority email support'],
    },
    {
      id: 'enterprise', name: 'Enterprise', tagline: 'For organizations that need the whole ecosystem.',
      monthly: null, yearly: null, cta: 'Contact sales',
      features: ['All applications, present and future', 'SSO and advanced permissions', 'Audit logs and data retention', 'Custom integrations', '99.9% uptime SLA', 'Dedicated success manager'],
    },
  ];

  readonly rows: Row[] = [
    { label: 'Applications', values: ['1', 'Up to 5', 'All'] },
    { label: 'Users', values: ['3', 'Unlimited', 'Unlimited'] },
    { label: 'Resources', values: ['25', 'Unlimited', 'Unlimited'] },
    { label: 'Reservations and holds', values: ['yes', 'yes', 'yes'] },
    { label: 'Capacity control', values: ['no', 'yes', 'yes'] },
    { label: 'Analytics and reports', values: ['no', 'yes', 'yes'] },
    { label: 'API access', values: ['no', 'yes', 'yes'] },
    { label: 'SSO', values: ['no', 'no', 'yes'] },
    { label: 'Audit logs', values: ['no', 'no', 'yes'] },
    { label: 'Support', values: ['Community', 'Priority email', 'Dedicated manager'] },
    { label: 'Uptime SLA', values: ['no', 'no', '99.9%'] },
  ];

  readonly faqs = [
    { q: 'What counts as an application?', a: 'Each product in the ecosystem, such as Resources, Bookings or Finance, is one application. All of them share the same account and users.' },
    { q: 'Can I change plans later?', a: 'Yes. Upgrade or downgrade at any time. Changes apply from your next billing cycle.' },
    { q: 'Is there a free trial for Business?', a: 'Yes, 14 days with no credit card required.' },
    { q: 'What happens to new applications?', a: 'Enterprise includes every new application automatically. On Business you choose which applications to enable.' },
  ];

  price(plan: Plan): number | null {
    return this.billing() === 'yearly' ? plan.yearly : plan.monthly;
  }

  setBilling(b: Billing): void {
    this.billing.set(b);
  }
}