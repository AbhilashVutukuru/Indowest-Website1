import { AfterViewInit, Component, ElementRef, NgZone, OnDestroy, ViewChild } from '@angular/core';
import { Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit, OnDestroy {
  title = 'indowest-website';
  isLoading = true;

  @ViewChild('bgCanvas') bgCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('progressBar') progressBar!: ElementRef<HTMLElement>;
  @ViewChild('cursorRing') cursorRing!: ElementRef<HTMLElement>;

  private frameId = 0;
  private cleanup: Array<() => void> = [];

  constructor(private router: Router, private zone: NgZone) {}

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

  ngAfterViewInit() {
    // Purely visual effects: keep them out of Angular change detection
    this.zone.runOutsideAngular(() => {
      this.startParticles();
      this.startScrollProgress();
      this.startCursor();
    });
  }

  /** Slowly drifting, twinkling dust behind the page content. */
  private startParticles() {
    const canvas = this.bgCanvas.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    const count = Math.min(Math.floor((width * height) / 18000), 70);
    const particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.5 + 0.5,
      vx: (Math.random() - 0.5) * 0.25,
      vy: -Math.random() * 0.3 - 0.05,
      baseAlpha: Math.random() * 0.4 + 0.1,
      phase: Math.random() * Math.PI * 2
    }));

    const onResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', onResize);
    this.cleanup.push(() => window.removeEventListener('resize', onResize));

    let time = 0;
    const render = () => {
      this.frameId = requestAnimationFrame(render);
      time += 0.015;
      ctx.clearRect(0, 0, width, height);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.y < 0) p.y = height;
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        const alpha = p.baseAlpha + Math.sin(time + p.phase) * 0.15;
        ctx.fillStyle = `rgba(125, 211, 252, ${Math.max(0, alpha)})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      }
    };
    render();
  }

  private startScrollProgress() {
    const bar = this.progressBar.nativeElement;
    const onScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = total > 0 ? `${(window.scrollY / total) * 100}%` : '0';
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    this.cleanup.push(() => window.removeEventListener('scroll', onScroll));
    onScroll();
  }

  /** A ring that follows the mouse and grows over anything clickable. */
  private startCursor() {
    const ring = this.cursorRing.nativeElement;
    const onMove = (e: MouseEvent) => {
      ring.classList.add('on');
      ring.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      const target = e.target as HTMLElement | null;
      ring.classList.toggle('hover', !!target?.closest('a, button, input, textarea, [role="button"]'));
    };
    const onLeave = () => ring.classList.remove('on');
    window.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseleave', onLeave);
    this.cleanup.push(() => {
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseleave', onLeave);
    });
  }

  ngOnDestroy() {
    cancelAnimationFrame(this.frameId);
    this.cleanup.forEach(fn => fn());
  }
}
