import { Component, HostListener, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { ThemeService } from '../../theme.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnDestroy {
  menuOpen = false;
  private routerSubscription: Subscription;

  constructor(
    public themeService: ThemeService,
    private router: Router
  ) {
    // Handle route changes
    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.handleRouteChange();
      });
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu() {
    this.menuOpen = false;
  }

  private handleRouteChange() {
    this.closeMenu();
    this.forceScrollToTop();
    this.triggerAnimations();
  }

  private forceScrollToTop() {
    // Multiple methods to ensure scroll to top
    if (typeof window !== 'undefined') {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
      
      // Additional fallbacks
      setTimeout(() => {
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
      }, 100);
    }
  }

  private triggerAnimations() {
    // Wait for route to load completely
    setTimeout(() => {
      this.setupScrollAnimations();
    }, 600);
  }

  private setupScrollAnimations() {
    if (typeof document === 'undefined') return;

    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Add small delay for better visual effect
          setTimeout(() => {
            entry.target.classList.add('show');
          }, 50);
        }
      });
    }, observerOptions);

    // Reset and observe all animations
    const animateElements = document.querySelectorAll('.animate-on-scroll');
    animateElements.forEach(el => {
      el.classList.remove('show'); // Reset
      observer.observe(el);
    });
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.main-nav') && !target.closest('.navbar-toggler') && this.menuOpen) {
      this.closeMenu();
    }
  }

  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }
}