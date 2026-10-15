import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

interface RuntimeLine {
  label: string;
  text: string;
  tone: string;   // colour class for the label
  highlight?: boolean;
}

interface Service {
  id: string;       // also the #fragment used by links from the home page and footer
  category: string;
  icon: string;
  iconTone: string;
  title: string;
  tagline: string;
  description: string;
  tags: string[];
  runtime: RuntimeLine[];
}

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrl: './services.component.css'
})
export class ServicesComponent implements OnInit{

  selectedFilter = 'all';

  services: Service[] = [
    {
      id: 'ai-agents', category: 'Agents', icon: 'fa-robot', iconTone: '',
      title: 'AI Agents & Agentic Automation',
      tagline: 'Agents that plan, act and finish the job across your systems — with your people in control.',
      description: 'We build agents and multi-agent workflows that connect securely to your CRM, ERP, email and documents. Each one ships with approval steps, guardrails and a full activity log, so you always know what it did and why.',
      tags: ['Custom AI Agents', 'Multi-Agent Workflows', 'Tool & API Integration', 'Human-in-the-Loop'],
      runtime: [
        { label: 'TRIGGER', text: 'New supplier invoice arrives by email', tone: 'c-brand' },
        { label: 'UNDERSTAND', text: 'Reads the email and extracts the details', tone: 'c-orange' },
        { label: 'ACT', text: 'Matches the purchase order in the ERP', tone: 'c-green' },
        { label: 'HUMAN APPROVAL', text: 'Finance lead approves the reply', tone: 'c-yellow', highlight: true }
      ]
    },
    {
      id: 'generative-ai', category: 'Generative AI', icon: 'fa-wand-magic-sparkles', iconTone: 'orange',
      title: 'Generative AI & LLM Applications',
      tagline: 'Assistants and copilots that know your business — grounded in your own data.',
      description: 'We build knowledge assistants that answer from your documents with citations, add AI features to the products you already run, and automate document processing for invoices, forms and handwritten pages.',
      tags: ['RAG Knowledge Assistants', 'Copilots in Your Product', 'Document Intelligence', 'LLM Integration'],
      runtime: [
        { label: 'KNOWLEDGE', text: 'Your policies, manuals and tickets indexed', tone: 'c-brand' },
        { label: 'RETRIEVE', text: 'Finds the passages that answer the question', tone: 'c-orange' },
        { label: 'RESPONSE', text: 'Cited answer, user permissions respected', tone: 'c-green', highlight: true }
      ]
    },
    {
      id: 'ai-consulting', category: 'Strategy', icon: 'fa-shield-halved', iconTone: 'yellow',
      title: 'AI Consulting & Responsible AI',
      tagline: 'Find the AI use cases worth building — and run them with confidence.',
      description: 'A short discovery maps your processes and data and ranks opportunities by value and risk. You leave with a clear roadmap, a pilot ready to start, and the oversight and audit trail your compliance team expects.',
      tags: ['AI Discovery Workshops', 'Use-Case Roadmaps', 'AI Readiness Reviews', 'Responsible AI'],
      runtime: [
        { label: 'DISCOVER', text: 'Processes and data mapped', tone: 'c-brand' },
        { label: 'RANK', text: 'Use cases scored by value and risk', tone: 'c-orange' },
        { label: 'ROADMAP', text: 'Pilot scoped, oversight defined', tone: 'c-green', highlight: true }
      ]
    },
    {
      id: 'data-collection', category: 'Data', icon: 'fa-database', iconTone: 'green',
      title: 'Data Engineering for AI & Analytics',
      tagline: 'AI is only as good as the data behind it. We make yours clean, connected and ready to use.',
      description: 'We collect, clean and structure data from spreadsheets, databases, APIs and documents into pipelines you can trust — ready for dashboards, reporting and the AI that depends on it.',
      tags: ['Data Pipelines', 'AI-Ready Data', 'Knowledge Base Preparation', 'Power BI Dashboards'],
      runtime: [
        { label: 'COLLECT', text: 'Spreadsheets, databases, APIs, documents', tone: 'c-brand' },
        { label: 'CLEAN', text: 'Validated and structured', tone: 'c-orange' },
        { label: 'DELIVER', text: 'Dashboards and AI-ready data', tone: 'c-green', highlight: true }
      ]
    },
    {
      id: 'custom-software-development', category: 'Engineering', icon: 'fa-code', iconTone: '',
      title: 'AI-Powered Software Development',
      tagline: 'Scalable web and enterprise applications with AI built in from the start — not bolted on afterwards.',
      description: 'We design and build custom software that solves real business challenges, securely and at scale. Our UK-led team specialises in .NET, Azure, Angular and Python, and uses AI-assisted development to deliver faster.',
      tags: ['AI-Native Applications', '.NET & Python', 'Angular & React', 'Legacy Modernisation'],
      runtime: [
        { label: 'DESIGN', text: 'Architecture built around your workflows', tone: 'c-brand' },
        { label: 'BUILD', text: '.NET, Python, Angular and React', tone: 'c-orange' },
        { label: 'REVIEW', text: 'Every line checked by senior developers', tone: 'c-green', highlight: true }
      ]
    },
    {
      id: 'azure-cloud', category: 'Infrastructure', icon: 'fa-cloud', iconTone: 'orange',
      title: 'Cloud, MLOps & LLMOps',
      tagline: 'Run AI securely on Azure and AWS — automated, monitored and cost-controlled.',
      description: 'From cloud migration to CI/CD, our UK-based team builds infrastructure that is agile, secure and scalable. For AI we add private model deployments, quality monitoring and cost control.',
      tags: ['Azure & AWS', 'Private AI Deployments', 'CI/CD Automation', 'AI Monitoring & Cost Control'],
      runtime: [
        { label: 'DEPLOY', text: 'Private models in your own tenancy', tone: 'c-brand' },
        { label: 'AUTOMATE', text: 'CI/CD with automated evaluation', tone: 'c-orange' },
        { label: 'MONITOR', text: 'Quality, usage and cost tracked', tone: 'c-green', highlight: true }
      ]
    },
    {
      id: 'quality-assurance', category: 'Quality', icon: 'fa-circle-check', iconTone: 'green',
      title: 'Quality Assurance & AI Testing',
      tagline: 'Manual, automated and AI-specific testing, so every release is production-ready.',
      description: 'We test functionality, performance and security at every stage. For AI we go further — checking accuracy, hallucination and prompt-injection risks, and re-testing whenever a prompt or model changes.',
      tags: ['Automated Testing', 'LLM & Agent Evaluation', 'Performance Testing', 'Security & Red-Team Testing'],
      runtime: [
        { label: 'TEST', text: 'Functionality, performance, security', tone: 'c-brand' },
        { label: 'EVALUATE', text: 'Accuracy and hallucination checks', tone: 'c-orange' },
        { label: 'RE-RUN', text: 'On every prompt or model change', tone: 'c-green', highlight: true }
      ]
    },
    {
      id: 'outsourced-development', category: 'Teams', icon: 'fa-users', iconTone: 'yellow',
      title: 'Dedicated AI & Engineering Teams',
      tagline: 'Scale efficiently with dedicated offshore teams for AI, development, testing and data operations.',
      description: 'AI skills are hard to hire. Our dedicated AI engineers, developers and testers plug into your workflows and tools, with UK-based project management and oversight.',
      tags: ['AI Engineers', 'Dedicated Developers', 'Testing Teams', 'Data Operations'],
      runtime: [
        { label: 'TEAM', text: 'AI engineers, developers, testers', tone: 'c-brand' },
        { label: 'INTEGRATE', text: 'Works inside your tools and process', tone: 'c-orange' },
        { label: 'OVERSIGHT', text: 'UK-based project management', tone: 'c-green', highlight: true }
      ]
    }
  ];

  categories = this.services.map(s => s.category);

  industries = [
    { name: 'Aviation & Travel', description: 'Market & fleet data intelligence', icon: 'fa-plane', tone: '' },
    { name: 'E-Commerce & Retail', description: 'Customer service agents', icon: 'fa-bag-shopping', tone: 'orange' },
    { name: 'Logistics & Warehousing', description: 'Document automation', icon: 'fa-truck', tone: 'green' },
    { name: 'FinTech & Insurance', description: 'Claims & document processing', icon: 'fa-chart-line', tone: 'yellow' },
    { name: 'Education & E-Learning', description: 'AI-assisted marking & feedback', icon: 'fa-graduation-cap', tone: '' },
    { name: 'Manufacturing & Supply Chain', description: 'Supplier & order automation', icon: 'fa-industry', tone: 'orange' }
  ];

  constructor(private route: ActivatedRoute) {}

  get filteredServices(): Service[] {
    return this.selectedFilter === 'all'
      ? this.services
      : this.services.filter(s => s.category === this.selectedFilter);
  }

  ngOnInit() {
    this.route.fragment.subscribe(fragment => {
      if (fragment) {
        // a deep link must not land on a service the filter has hidden
        this.selectedFilter = 'all';
        this.scrollToFragment(fragment);
      }
      this.setupScrollAnimations();
    });
  }

  scrollToFragment(fragment: string) {
    setTimeout(() => {
      const element = document.getElementById(fragment);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
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
