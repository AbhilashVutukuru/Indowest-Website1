import {
  AfterViewInit, Component, ElementRef, HostListener, NgZone, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren
} from '@angular/core';

interface Agent {
  id: string;
  title: string;
  description: string;
  tools: string[];
  icon: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('orbBox') orbBox!: ElementRef<HTMLElement>;
  @ViewChild('orbCanvas') orbCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChildren('orbNode') orbNodes!: QueryList<ElementRef<HTMLElement>>;

  // Hero headline: the last word rotates
  cyclingWords = ['Real Results', 'Faster Growth', 'Smarter Teams', 'Global Success'];
  wordIndex = 0;

  heroTags = ['AI Agents', 'Generative AI & RAG', 'Document Intelligence', 'Responsible AI'];

  stats = [
    { count: 10, suffix: '+', text: '', label: 'Years Experience', detail: 'Over a decade of engineering excellence' },
    { count: 60, suffix: '%', text: '', label: 'Cost Savings', detail: 'Efficient offshore delivery' },
    { count: 0, suffix: '', text: '24/7', label: 'Support', detail: 'Round-the-clock reliability' }
  ];

  agents: Agent[] = [
    { id: 'customer-service', title: 'Customer Service Agents', icon: 'fa-headset',
      description: 'Resolve routine enquiries instantly, with a smooth hand-off to your team.',
      tools: ['Helpdesk', 'CRM', 'Knowledge base'] },
    { id: 'document-processing', title: 'Document Processing Agents', icon: 'fa-file-invoice',
      description: 'Read invoices, contracts and forms, and post the data straight into your systems.',
      tools: ['PDFs & scans', 'ERP', 'SharePoint'] },
    { id: 'knowledge-assistants', title: 'Knowledge Assistants', icon: 'fa-magnifying-glass',
      description: 'Instant, cited answers from your own documents and policies.',
      tools: ['RAG', 'Microsoft 365', 'Intranet'] },
    { id: 'sales-crm', title: 'Sales & CRM Agents', icon: 'fa-arrow-trend-up',
      description: 'Qualify leads, draft follow-ups and keep your CRM up to date.',
      tools: ['Salesforce', 'Dynamics 365', 'Email'] },
    { id: 'finance-ops', title: 'Finance & Operations Agents', icon: 'fa-chart-column',
      description: 'Reconcile, report and flag exceptions automatically.',
      tools: ['Accounts payable', 'Reporting', 'Approvals'] },
    { id: 'engineering-it', title: 'Engineering & IT Agents', icon: 'fa-terminal',
      description: 'Triage tickets, review code and automate routine DevOps work.',
      tools: ['Azure DevOps', 'GitHub', 'Service desk'] }
  ];
  activeAgent: Agent = this.agents[0];

  // "How an agent works" walkthrough
  steps = [
    { name: 'Understand', label: 'Reads the request and its context.', badge: 'Intent & context',
      detail: 'Works out what is being asked and gathers the facts it needs.' },
    { name: 'Plan', label: 'Breaks the goal into steps.', badge: 'Task planning',
      detail: 'Turns one goal into an ordered list of small, checkable tasks.' },
    { name: 'Act', label: 'Uses your tools and systems.', badge: 'Tool & API execution',
      detail: 'Carries out each step through the systems you have authorised.' },
    { name: 'Check', label: 'Asks a human when it matters.', badge: 'Human-in-the-loop',
      detail: 'Pauses for sign-off on anything sensitive or uncertain.' },
    { name: 'Improve', label: 'Is measured, logged and refined.', badge: 'Logging & evaluation',
      detail: 'Every run is recorded, so quality and cost keep getting better.' }
  ];
  activeStep = 0;
  autoPlay = true;

  services = [
    { category: 'Agents', title: 'AI Agents & Agentic Automation', fragment: 'ai-agents', tag: 'Custom AI Agents',
      line: 'Agents that plan, act and complete multi-step work — with humans in control.' },
    { category: 'Generative AI', title: 'Generative AI & LLM Applications', fragment: 'generative-ai', tag: 'RAG Knowledge Assistants',
      line: 'Assistants and copilots grounded in your own data.' },
    { category: 'Strategy', title: 'AI Consulting & Responsible AI', fragment: 'ai-consulting', tag: 'AI Discovery Workshops',
      line: 'Find the right use cases and run AI safely.' },
    { category: 'Data', title: 'Data Engineering for AI', fragment: 'data-collection', tag: 'Data Pipelines',
      line: 'Clean, connected data your AI can rely on.' },
    { category: 'Engineering', title: 'AI-Powered Software & Cloud', fragment: 'custom-software-development', tag: 'AI-Native Applications',
      line: 'Bespoke applications with AI built in, on Azure and AWS.' },
    { category: 'Teams', title: 'Dedicated AI & Engineering Teams', fragment: 'outsourced-development', tag: 'AI Engineers',
      line: 'AI engineers, developers and testers who extend your team.' }
  ];

  responsibleAI = [
    { title: 'Data protection by design', description: 'Minimal data, clear purposes and strict access controls.' },
    { title: 'Human in the loop', description: 'People stay in control of the decisions that matter.' },
    { title: 'Tested and auditable', description: 'Every AI action is evaluated, logged and traceable.' },
    { title: 'No model lock-in', description: 'The right model for the job — always swappable.' }
  ];

  stackStrip = this.loop(['Azure OpenAI', 'Anthropic Claude', 'Model Context Protocol (MCP)', 'Semantic Kernel',
    'LangGraph', 'Azure & AWS', 'pgvector', 'C# .NET & Python', 'Angular & React']);
  stackRowOne = this.loop(['Azure OpenAI', 'OpenAI', 'Anthropic Claude', 'Google Gemini', 'Open-source LLMs',
    'LangGraph', 'Semantic Kernel', 'Model Context Protocol (MCP)']);
  stackRowTwo = this.loop(['RAG pipelines', 'Azure AI Search', 'pgvector', 'Power BI', 'LLM evaluation', 'Guardrails',
    'Monitoring', 'CI/CD', 'Python', 'C# / .NET', 'Angular', 'React', 'Node.js', 'Azure', 'AWS']);

  // Side dots that track the main sections of this page
  sections = [
    { id: 'hero', label: 'Hero' },
    { id: 'about-us', label: 'About' },
    { id: 'agents', label: 'Agents' },
    { id: 'how-an-agent-works', label: 'Workflow' },
    { id: 'services-preview', label: 'Services' }
  ];
  activeSection = 'hero';

  private wordTimer: any;
  private stepTimer: any;
  private frameId = 0;
  private cleanup: Array<() => void> = [];

  constructor(private zone: NgZone) {}

  ngOnInit() {
    this.setupScrollAnimations();
    this.wordTimer = setInterval(() => {
      this.wordIndex = (this.wordIndex + 1) % this.cyclingWords.length;
    }, 2400);
    this.startStepTimer();
  }

  ngAfterViewInit() {
    this.zone.runOutsideAngular(() => {
      this.startOrb();
      this.startCountUp();
    });
  }

  /** Repeat a list so the marquee can scroll by half its width and loop seamlessly. */
  private loop(items: string[]): string[] {
    return [...items, ...items, ...items, ...items];
  }

  // ---------- "How an agent works" ----------

  private startStepTimer() {
    clearInterval(this.stepTimer);
    if (!this.autoPlay) return;
    this.stepTimer = setInterval(() => {
      this.activeStep = (this.activeStep + 1) % this.steps.length;
    }, 4500);
  }

  toggleAutoPlay() {
    this.autoPlay = !this.autoPlay;
    this.startStepTimer();
  }

  /** Any manual choice stops the auto-cycle, so the visitor can read at their own pace. */
  goToStep(index: number) {
    this.autoPlay = false;
    clearInterval(this.stepTimer);
    this.activeStep = (index + this.steps.length) % this.steps.length;
  }

  // ---------- section dots ----------

  @HostListener('window:scroll')
  onWindowScroll() {
    const position = window.scrollY + 250;
    for (let i = this.sections.length - 1; i >= 0; i--) {
      const el = document.getElementById(this.sections[i].id);
      if (el && el.offsetTop <= position) {
        this.activeSection = this.sections[i].id;
        break;
      }
    }
  }

  scrollToSection(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }

  // ---------- hero orb ----------

  /** Rotating particle sphere with two orbital rings; the agent buttons circle around it. */
  private startOrb() {
    const box = this.orbBox.nativeElement;
    const canvas = this.orbCanvas.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = 0;
    let height = 0;
    const resize = () => {
      width = box.clientWidth;
      height = box.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    // Evenly spread points on a sphere (Fibonacci distribution)
    const count = 900;
    const colours = ['76, 195, 255', '1, 166, 240', '255, 154, 86'];
    const points = Array.from({ length: count }, (_, i) => {
      const phi = Math.acos(-1 + (2 * i) / count);
      const theta = Math.sqrt(count * Math.PI) * phi;
      const radius = 1 + (Math.random() - 0.5) * 0.13;
      return {
        x: radius * Math.cos(theta) * Math.sin(phi),
        y: radius * Math.sin(theta) * Math.sin(phi),
        z: radius * Math.cos(phi),
        colour: colours[i % 3]
      };
    });

    let targetX = 0, targetY = 0, mouseX = 0, mouseY = 0;
    const onMouseMove = (e: MouseEvent) => {
      const rect = box.getBoundingClientRect();
      targetX = (((e.clientX - rect.left) / rect.width) * 2 - 1) * 0.4;
      targetY = -(((e.clientY - rect.top) / rect.height) * 2 - 1) * 0.4;
    };
    window.addEventListener('mousemove', onMouseMove, { passive: true });
    this.cleanup.push(() => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
    });

    const ring = (cx: number, cy: number, rx: number, ry: number, tilt: number, colour: string) => {
      ctx.strokeStyle = colour;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.ellipse(cx, cy, rx, ry, tilt, 0, Math.PI * 2);
      ctx.stroke();
    };

    const started = performance.now();
    const draw = () => {
      this.frameId = requestAnimationFrame(draw);
      const time = (performance.now() - started) / 1000;
      mouseX += (targetX - mouseX) * 0.05;
      mouseY += (targetY - mouseY) * 0.05;

      ctx.clearRect(0, 0, width, height);
      const cx = width / 2;
      const cy = height / 2 - 30;
      const R = Math.min(width, height) * 0.31 * (1 + Math.sin(time * 1.5) * 0.025);

      // soft core glow
      const glow = ctx.createRadialGradient(cx, cy, R * 0.1, cx, cy, R * 1.1);
      glow.addColorStop(0, 'rgba(1, 110, 190, 0.38)');
      glow.addColorStop(1, 'rgba(1, 110, 190, 0)');
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(cx, cy, R * 1.1, 0, Math.PI * 2);
      ctx.fill();

      ring(cx, cy, R * 1.32, R * 0.46, 0.28 + Math.sin(time * 0.2) * 0.05, 'rgba(76, 195, 255, 0.3)');
      ring(cx, cy, R * 1.5, R * 0.62, -0.5 + Math.cos(time * 0.15) * 0.05, 'rgba(255, 154, 86, 0.22)');

      const ay = time * 0.12 + mouseX * 0.5;
      const ax = time * 0.05 + mouseY * 0.5;
      const cosY = Math.cos(ay), sinY = Math.sin(ay), cosX = Math.cos(ax), sinX = Math.sin(ax);
      for (const p of points) {
        const x1 = p.x * cosY + p.z * sinY;
        const z1 = -p.x * sinY + p.z * cosY;
        const y1 = p.y * cosX - z1 * sinX;
        const z2 = p.y * sinX + z1 * cosX;
        const depth = (z2 + 1.1) / 2.2;            // 0 = far side, 1 = near side
        const scale = 1 / (1 - z2 * 0.18);
        const size = 1.1 + depth * 1.5;
        ctx.fillStyle = `rgba(${p.colour}, ${0.25 + depth * 0.75})`;
        ctx.fillRect(cx + x1 * R * scale, cy + y1 * R * scale, size, size);
      }

      // agent buttons travel around an ellipse; nearer ones are larger and brighter
      const orbitX = Math.min(250, width * 0.4);
      const orbitY = orbitX * 0.58;
      const nodes = this.orbNodes.toArray();
      nodes.forEach((node, i) => {
        const angle = time * 0.15 + (i * Math.PI * 2) / nodes.length;
        const near = (Math.sin(angle) + 1) / 2;
        const el = node.nativeElement;
        el.style.transform =
          `translate(-50%, -50%) translate3d(${Math.cos(angle) * orbitX}px, ${Math.sin(angle) * orbitY - 30}px, 0) scale(${0.8 + near * 0.3})`;
        el.style.opacity = String(0.5 + near * 0.5);
        el.style.zIndex = String(Math.round(near * 30));
      });
    };
    draw();
  }

  // ---------- stat count-up ----------

  private startCountUp() {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        observer.unobserve(entry.target);
        const el = entry.target as HTMLElement;
        const target = Number(el.dataset['count']);
        const suffix = el.dataset['suffix'] || '';
        const began = performance.now();
        const tick = (now: number) => {
          const progress = Math.min(1, (now - began) / 1400);
          const eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.round(target * eased) + suffix;
          if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      });
    }, { threshold: 0.4 });
    document.querySelectorAll<HTMLElement>('.home [data-count]').forEach(el => observer.observe(el));
    this.cleanup.push(() => observer.disconnect());
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

  ngOnDestroy() {
    clearInterval(this.wordTimer);
    clearInterval(this.stepTimer);
    cancelAnimationFrame(this.frameId);
    this.cleanup.forEach(fn => fn());
  }
}
