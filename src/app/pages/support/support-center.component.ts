
import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  LucideSearch,
  LucideBookOpen,
  LucideCalendarCheck,
  LucideShieldCheck,
  LucideMessageCircle,
  LucideArrowRight,
  LucideChevronDown,
  LucideChevronRight,
  LucidePlus,
  LucideLifeBuoy,
  LucideFileText,
  LucideLockKeyhole,
  LucideCircleHelp,
  LucideMail,
  LucideClock,
  LucideSend,
  LucideExternalLink,
  LucideCheckCircle2,
  LucideZap,
  LucideHeadphones,
  LucideX,
  LucideSearchX
} from '@lucide/angular';

interface Faq {
  question: string;
  answer: string;
  category: string;
}

interface SupportCategory {
  title: string;
  description: string;
  icon: string;
  color: string;
  count: string;
}

@Component({
  selector: 'app-support-center',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
  ],
  templateUrl: './support-center.component.html',
  styleUrl: './support-center.component.css'
})
export class SupportCenterComponent {

  readonly searchQuery = signal('');
  readonly activeCategory = signal('All');
  readonly expandedFaq = signal<number | null>(0);
  readonly showRequestForm = signal(false);
  readonly submitted = signal(false);

  readonly categories: SupportCategory[] = [
    {
      title: 'Getting started',
      description: 'Learn the basics and set up your workspace.',
      icon: 'book',
      color: 'blue',
      count: '04 guides'
    },
    {
      title: 'Resource management',
      description: 'Manage resources, capacities and availability.',
      icon: 'calendar',
      color: 'green',
      count: '06 guides'
    },
    {
      title: 'Account & security',
      description: 'Manage your account and security settings.',
      icon: 'shield',
      color: 'purple',
      count: '05 guides'
    },
    {
      title: 'Technical support',
      description: 'Troubleshoot errors and technical issues.',
      icon: 'technical',
      color: 'orange',
      count: '03 guides'
    }
  ];

  readonly faqs: Faq[] = [
    {
      question: 'How do I create my first resource?',
      answer: 'Open Resource Management from your workspace, navigate to Resources, and select Create Resource. Enter a resource name, unique resource key and capacity, then save your changes.',
      category: 'Resource management'
    },
    {
      question: 'What is the difference between a hold and a confirmed reservation?',
      answer: 'A hold temporarily reserves a quantity of a resource for a limited period. A confirmed reservation converts that held quantity into a confirmed allocation.',
      category: 'Resource management'
    },
    {
      question: 'How can I access my account?',
      answer: 'Use your registered email address and password on the sign-in page. If you have forgotten your password, use the password recovery process when available.',
      category: 'Account & security'
    },
    {
      question: 'How does resource capacity work?',
      answer: 'Resource capacity represents the total quantity available. Active holds and confirmed reservations consume available capacity.',
      category: 'Resource management'
    },
    {
      question: 'How can I secure my account?',
      answer: 'Use a strong unique password, keep your credentials private and sign out when using shared devices.',
      category: 'Account & security'
    },
    {
      question: 'What should I do if something is not working?',
      answer: 'Refresh the page, check your connection and try again. If the issue persists, submit a support request with the error details and the steps that caused it.',
      category: 'Technical support'
    }
  ];

  readonly filteredFaqs = computed(() => {
    const query = this.searchQuery().trim().toLowerCase();
    const category = this.activeCategory();

    return this.faqs.filter(faq => {
      const matchesCategory =
        category === 'All' || faq.category === category;

      const matchesQuery =
        !query ||
        faq.question.toLowerCase().includes(query) ||
        faq.answer.toLowerCase().includes(query) ||
        faq.category.toLowerCase().includes(query);

      return matchesCategory && matchesQuery;
    });
  });

  readonly selectedCategory = signal('General');

  readonly request = signal({
    subject: '',
    email: '',
    priority: 'Normal',
    description: ''
  });

  readonly requestValid = computed(() => {
    const value = this.request();

    return !!(
      value.subject.trim() &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.email) &&
      value.description.trim().length >= 10
    );
  });

  updateRequest(
    field: keyof ReturnType<typeof this.request>,
    value: string
  ): void {
    this.request.update(current => ({
      ...current,
      [field]: value
    }));
  }

  openRequestForm(): void {
    this.submitted.set(false);
    this.showRequestForm.set(true);
  }

  closeRequestForm(): void {
    this.showRequestForm.set(false);
  }

  submitRequest(): void {
    if (!this.requestValid()) return;

    // Frontend demonstration only.
    // Connect this method to the Spring Boot support API later.

    this.submitted.set(true);
  }

  resetRequest(): void {
    this.request.set({
      subject: '',
      email: '',
      priority: 'Normal',
      description: ''
    });

    this.submitted.set(false);
    this.showRequestForm.set(false);
  }

  toggleFaq(index: number): void {
    this.expandedFaq.update(current =>
      current === index ? null : index
    );
  }

  setCategory(category: string): void {
    this.activeCategory.set(category);
    this.expandedFaq.set(null);
  }
}
