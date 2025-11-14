import { Component, HostListener, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ThemeService } from '../../theme.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent implements OnInit {
isScrolled = false;
menuOpen = false;

  constructor(public themeService: ThemeService) {}

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  @HostListener('window:scroll')
  onWindowScroll() {
    // Show scroll-to-top button when scrolled down 300px
    this.isScrolled = window.pageYOffset > 300;
  }

  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
  ngOnInit() {
    this.setupScrollAnimations();
  }

  setupScrollAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('show');
        }
      });
    }, observerOptions);

    // Observe all elements with animate-on-scroll class after view init
    setTimeout(() => {
      const animateElements = document.querySelectorAll('.animate-on-scroll');
      animateElements.forEach(el => observer.observe(el));
    });
  }
}
