import { Component, computed, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

type BookingStatus = 'CONFIRMED' | 'CANCELLED';
type BookingFilter = 'ALL' | BookingStatus;

interface Booking {
  reference: string;
  resourceName: string;
  resourceKey: string;
  quantity: number;
  createdAt: string;
  status: BookingStatus;
}

@Component({
  selector: 'app-bookings',
  standalone: true,
  imports: [DatePipe, RouterLink],
  templateUrl: './bookings.component.html',
  styleUrl: './bookings.component.css'
})
export class BookingsComponent {

  // بيانات تجريبية مؤقتة لتصميم الصفحة واختبار الفلاتر.
  // سنستبدلها ببيانات Spring Boot عند ربط API الحجوزات.

  readonly bookings = signal<Booking[]>([
    {
      reference: 'HP-BK-2026-0018',
      resourceName: 'Conference Room A',
      resourceKey: 'ROOM-CONF-A',
      quantity: 4,
      createdAt: '2026-11-15T09:24:00',
      status: 'CONFIRMED'
    },
    {
      reference: 'HP-BK-2026-0017',
      resourceName: 'Laptop Pool',
      resourceKey: 'IT-LAPTOP',
      quantity: 12,
      createdAt: '2026-11-14T14:35:00',
      status: 'CONFIRMED'
    },
    {
      reference: 'HP-BK-2026-0016',
      resourceName: 'Warehouse Bay 03',
      resourceKey: 'WAREHOUSE-BAY-03',
      quantity: 2,
      createdAt: '2026-11-14T11:10:00',
      status: 'CANCELLED'
    },
    {
      reference: 'HP-BK-2026-0015',
      resourceName: 'Meeting Room B',
      resourceKey: 'ROOM-MEETING-B',
      quantity: 6,
      createdAt: '2026-11-13T16:20:00',
      status: 'CONFIRMED'
    },
    {
      reference: 'HP-BK-2026-0014',
      resourceName: 'Delivery Vehicles',
      resourceKey: 'DELIVERY-VEHICLES',
      quantity: 3,
      createdAt: '2026-11-12T10:05:00',
      status: 'CONFIRMED'
    },
    {
      reference: 'HP-BK-2026-0013',
      resourceName: 'Laptop Pool',
      resourceKey: 'IT-LAPTOP',
      quantity: 5,
      createdAt: '2026-11-11T08:45:00',
      status: 'CANCELLED'
    }
  ]);

  readonly searchTerm = signal('');
  readonly activeFilter = signal<BookingFilter>('ALL');
  readonly selectedBooking = signal<Booking | null>(null);

  readonly totalBookings = computed(() =>
    this.bookings().length
  );

  readonly confirmedBookings = computed(() =>
    this.bookings().filter(
      booking => booking.status === 'CONFIRMED'
    ).length
  );

  readonly cancelledBookings = computed(() =>
    this.bookings().filter(
      booking => booking.status === 'CANCELLED'
    ).length
  );

  readonly committedUnits = computed(() =>
    this.bookings()
      .filter(booking => booking.status === 'CONFIRMED')
      .reduce((total, booking) => total + booking.quantity, 0)
  );

  readonly filteredBookings = computed(() => {
    const query = this.searchTerm().trim().toLowerCase();
    const filter = this.activeFilter();

    return this.bookings().filter(booking => {
      const matchesFilter =
        filter === 'ALL' || booking.status === filter;

      const matchesSearch =
        !query ||
        booking.reference.toLowerCase().includes(query) ||
        booking.resourceName.toLowerCase().includes(query) ||
        booking.resourceKey.toLowerCase().includes(query);

      return matchesFilter && matchesSearch;
    });
  });

  setFilter(filter: BookingFilter): void {
    this.activeFilter.set(filter);
  }

  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchTerm.set(input.value);
  }

  openDetails(booking: Booking): void {
    this.selectedBooking.set(booking);
  }

  closeDetails(): void {
    this.selectedBooking.set(null);
  }

  statusLabel(status: BookingStatus): string {
    return status === 'CONFIRMED' ? 'Confirmed' : 'Cancelled';
  }
}