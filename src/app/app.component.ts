import { Component } from '@angular/core';
import { Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'indowest-website';
  isLoading = true;

  constructor(private router: Router) {}

  ngOnInit() {
    // Initial load
    setTimeout(() => {
      this.isLoading = false;
    }, 1000);

    // Router navigation events
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        // Show loader when navigation starts
        this.isLoading = true;
      } else if (
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError
      ) {
        // Hide loader when navigation completes or errors
        setTimeout(() => {
          this.isLoading = false;
        }, 300); // Small delay for smooth transition
      }
    });
  }
}