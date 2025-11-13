import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private isDarkMode = new BehaviorSubject<boolean>(true); // 👈 Default to dark mode
  public isDarkMode$ = this.isDarkMode.asObservable();
  private renderer: Renderer2;

  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
    this.initializeTheme();
  }

  private initializeTheme() {
    const savedTheme = localStorage.getItem('theme');

    // 👇 Always dark if no saved theme
    if (!savedTheme) {
      this.enableDarkMode();
      localStorage.setItem('theme', 'dark');
      return;
    }

    if (savedTheme === 'dark') {
      this.enableDarkMode();
    } else {
      this.disableDarkMode();
    }
  }

  toggleTheme() {
    const newMode = !this.isDarkMode.value;
    this.isDarkMode.next(newMode);

    if (newMode) {
      this.enableDarkMode();
      localStorage.setItem('theme', 'dark');
    } else {
      this.disableDarkMode();
      localStorage.setItem('theme', 'light');
    }
  }

  private enableDarkMode() {
    this.renderer.addClass(document.body, 'dark-theme');
    this.isDarkMode.next(true);
  }

  private disableDarkMode() {
    this.renderer.removeClass(document.body, 'dark-theme');
    this.isDarkMode.next(false);
  }
}
