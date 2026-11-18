
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  LucideIcon,
  LucideArrowRight,
  LucideCheck,
  LucideHelpCircle,
  LucideMail,
  LucideShieldCheck,
  LucideZap
} from '@lucide/angular';

@Component({
  selector: 'app-pricing',
  standalone: true,
  imports: [
    RouterLink,
  LucideArrowRight,
  LucideCheck,
  LucideHelpCircle,
  LucideMail,
  LucideShieldCheck,
  LucideZap
  ],
  templateUrl: './pricing.component.html',
  styleUrl: './pricing.component.css'
})
export class PricingComponent {}
