import { Injectable } from '@angular/core';

export interface ChatLink {
  label: string;
  route: string;
  fragment?: string;
  external?: boolean;
}

export interface ChatAnswer {
  text: string;
  link?: ChatLink;
  suggestions: string[];
  matched: boolean;
}

interface KnowledgeEntry {
  id: string;
  question: string;          // shown as a suggestion chip
  keywords: string[];        // single words or short phrases
  answer: string;
  link?: ChatLink;
  related?: string[];        // ids of entries to suggest next
}

/**
 * Answers visitor questions from the website's own content.
 * No external AI service or API key is involved: the question is matched
 * against keywords for each topic and the best-scoring answer is returned.
 */
@Injectable({
  providedIn: 'root'
})
export class ChatKnowledgeService {

  readonly starterQuestions = [
    'What services do you offer?',
    'Which AI agents can you build?',
    'How do I get started with AI?',
    'Tell me about AI SmartGrader',
    'How can I contact you?'
  ];

  private readonly entries: KnowledgeEntry[] = [
    {
      id: 'greeting',
      question: 'Hello',
      keywords: ['hi', 'hello', 'hey', 'hii', 'good morning', 'good afternoon', 'good evening', 'namaste'],
      answer: 'Hello! 👋 I can answer questions about IndoWest United — our AI services, how we work, our product AI SmartGrader, and how to get in touch. What would you like to know?',
      related: ['services', 'agents', 'contact']
    },
    {
      id: 'thanks',
      question: 'Thanks',
      keywords: ['thanks', 'thank you', 'thank', 'thx', 'great', 'awesome', 'helpful'],
      answer: 'You\'re welcome! If you\'d like to discuss a project, our team replies within 24 hours at info@indowestunited.com.',
      link: { label: 'Contact us', route: '/contact' },
      related: ['services', 'pilot']
    },
    {
      id: 'about',
      question: 'What does IndoWest United do?',
      keywords: ['about', 'company', 'who are you', 'what do you do', 'indowest', 'overview', 'business', 'introduce', 'tell me about you'],
      answer: 'IndoWest United is an AI and software engineering company based in India, working in close partnership with ARCVIK Solutions Ltd (UK).\n\nWe build AI agents, generative AI applications and the software around them — so your people spend less time on repetitive work — delivered cost-efficiently for businesses worldwide.',
      link: { label: 'About us', route: '/about' },
      related: ['services', 'founded', 'partner']
    },
    {
      id: 'founded',
      question: 'How long have you been in business?',
      keywords: ['founded', 'who founded', 'founder', 'established', 'since', 'history', 'how old', 'experience', 'decade', '2015', 'started', 'years'],
      answer: 'IndoWest United was established in 2015 — over a decade of software engineering excellence. The company is led by a software development expert with 25 years of hands-on experience, and today that same engineering discipline powers our AI work.',
      link: { label: 'Our story', route: '/about', fragment: 'our-story' },
      related: ['about', 'team', 'clients']
    },
    {
      id: 'partner',
      question: 'Who is ARCVIK Solutions?',
      keywords: ['arcvik', 'partner', 'partnership', 'uk', 'united kingdom', 'nottingham', 'england', 'britain', 'europe'],
      answer: 'ARCVIK Solutions Ltd is our partner in Nottingham, United Kingdom (info@arcvik.co.uk).\n\nTogether we offer UK-led client engagement and project management, with AI engineering, development and QA delivered by our team in India — one point of accountability across both countries.',
      link: { label: 'Hybrid collaboration model', route: '/business-models' },
      related: ['models', 'location', 'contact']
    },
    {
      id: 'services',
      question: 'What services do you offer?',
      keywords: ['services', 'service', 'offer', 'provide', 'what can you do', 'capabilities', 'solutions', 'help with', 'expertise'],
      answer: 'We offer eight services:\n• AI Agents & Agentic Automation\n• Generative AI & LLM Applications\n• AI Consulting & Responsible AI\n• Data Engineering for AI & Analytics\n• AI-Powered Software Development\n• Cloud, MLOps & LLMOps (Azure & AWS)\n• Quality Assurance & AI Testing\n• Dedicated AI & Engineering Teams',
      link: { label: 'View all services', route: '/services' },
      related: ['agents', 'genai', 'pilot']
    },
    {
      id: 'agents',
      question: 'What are AI agents?',
      keywords: ['ai agent', 'ai agents', 'agent', 'agents', 'agentic', 'automation', 'automate', 'autonomous', 'workflow', 'digital colleague', 'multi agent', 'mcp'],
      answer: 'AI agents don\'t just answer questions — they plan, act across your systems and finish the job, with your people in control.\n\nWe build single agents and multi-agent workflows that connect securely to your CRM, ERP, email and documents. Every agent ships with approval steps, guardrails and a full activity log, so you always know what it did and why.',
      link: { label: 'AI Agents service', route: '/services', fragment: 'ai-agents' },
      related: ['agentTypes', 'agentSteps', 'pilot']
    },
    {
      id: 'agentTypes',
      question: 'Which AI agents can you build?',
      keywords: ['which agents', 'which ai agents', 'what agents', 'agents can you build', 'agents do you build', 'types of agents', 'kinds of agents', 'examples', 'use case', 'use cases', 'customer service', 'helpdesk', 'support agent', 'document processing', 'invoice', 'invoices', 'contracts', 'forms', 'sales', 'crm', 'leads', 'finance', 'accounts payable', 'reconcile', 'devops', 'tickets', 'code review'],
      answer: 'Some of the agents we build:\n• Customer Service Agents — resolve routine enquiries, hand off to your team when needed\n• Document Processing Agents — read invoices, contracts and forms into your systems\n• Knowledge Assistants — cited answers from your own documents\n• Sales & CRM Agents — qualify leads, draft follow-ups, keep the CRM current\n• Finance & Operations Agents — reconcile, report and flag exceptions\n• Engineering & IT Agents — triage tickets, review code, automate DevOps',
      link: { label: 'See the agents', route: '/home', fragment: 'agents' },
      related: ['agentSteps', 'pilot', 'contact']
    },
    {
      id: 'agentSteps',
      question: 'How does an AI agent work?',
      keywords: ['how does an agent work', 'how agents work', 'how it works', 'steps', 'human in the loop', 'approval', 'oversight', 'understand plan act', 'control'],
      answer: 'An agent works in five steps:\n1. Understand — reads the request and its context\n2. Plan — breaks the goal into steps\n3. Act — uses your tools and systems\n4. Check — asks a human when it matters\n5. Improve — every run is logged and measured, so quality and cost keep getting better',
      link: { label: 'See the walkthrough', route: '/home', fragment: 'how-an-agent-works' },
      related: ['agentTypes', 'responsible', 'pilot']
    },
    {
      id: 'genai',
      question: 'Do you build generative AI apps?',
      keywords: ['generative', 'generative ai', 'genai', 'gen ai', 'llm', 'llms', 'chatgpt', 'gpt', 'rag', 'copilot', 'assistant', 'chatbot', 'knowledge base', 'document intelligence', 'ocr', 'summarisation', 'summarization'],
      answer: 'Yes. We build assistants and copilots that know your business — grounded in your own data rather than guesswork.\n\nThat includes knowledge assistants that answer from your documents with citations, AI features inside the products you already run, and document processing for invoices, forms and handwritten pages.',
      link: { label: 'Generative AI service', route: '/services', fragment: 'generative-ai' },
      related: ['tech', 'data', 'pilot']
    },
    {
      id: 'responsible',
      question: 'Is your AI safe and compliant?',
      keywords: ['responsible', 'governance', 'compliance', 'compliant', 'gdpr', 'regulation', 'regulations', 'ai act', 'safe', 'safety', 'security', 'secure', 'privacy', 'data protection', 'audit', 'auditable', 'risk', 'lock in', 'vendor lock'],
      answer: 'Data protection, human oversight and auditability are built into every AI system we deliver — from day one:\n• Data protection by design — minimal data, clear purposes, strict access controls\n• Human in the loop — people stay in control of the decisions that matter\n• Tested and auditable — every AI action is evaluated, logged and traceable\n• No model lock-in — the right model for the job, always swappable',
      link: { label: 'AI Consulting & Responsible AI', route: '/services', fragment: 'ai-consulting' },
      related: ['consulting', 'qa', 'contact']
    },
    {
      id: 'consulting',
      question: 'Do you offer AI consulting?',
      keywords: ['consulting', 'consultancy', 'consultant', 'strategy', 'roadmap', 'readiness', 'advice', 'advise', 'where to use ai', 'workshop', 'assessment'],
      answer: 'Yes. A short discovery maps your processes and data and ranks AI opportunities by value and risk. You leave with a clear roadmap, a pilot ready to start, and the oversight and audit trail your compliance team expects.',
      link: { label: 'AI Consulting service', route: '/services', fragment: 'ai-consulting' },
      related: ['pilot', 'responsible', 'models']
    },
    {
      id: 'data',
      question: 'Can you help with our data?',
      keywords: ['data', 'data engineering', 'pipeline', 'pipelines', 'power bi', 'dashboard', 'dashboards', 'analytics', 'reporting', 'etl', 'clean data', 'business intelligence', 'bi'],
      answer: 'Yes — AI is only as good as the data behind it. We collect, clean and structure data from spreadsheets, databases, APIs and documents into pipelines you can trust, ready for Power BI dashboards, reporting and the AI that depends on it.',
      link: { label: 'Data Engineering service', route: '/services', fragment: 'data-collection' },
      related: ['genai', 'cloud', 'services']
    },
    {
      id: 'software',
      question: 'Do you build custom software?',
      keywords: ['software', 'custom software', 'development', 'develop', 'web app', 'website', 'application', 'applications', 'app', 'portal', 'platform', '.net', 'dotnet', 'c#', 'angular', 'react', 'python', 'legacy', 'modernisation', 'modernization', 'enterprise'],
      answer: 'Yes. We design and build scalable web and enterprise applications with AI built in from the start. Our UK-led team specialises in .NET, Azure, Angular and Python, alongside React, and uses AI-assisted development to deliver faster — with experienced developers reviewing every line.',
      link: { label: 'Software Development service', route: '/services', fragment: 'custom-software-development' },
      related: ['cloud', 'tech', 'models']
    },
    {
      id: 'cloud',
      question: 'Do you work with Azure and AWS?',
      keywords: ['cloud', 'azure', 'aws', 'amazon', 'microsoft', 'devops', 'mlops', 'llmops', 'hosting', 'deploy', 'deployment', 'ci cd', 'cicd', 'migration', 'migrate', 'infrastructure'],
      answer: 'Yes. From cloud migration to CI/CD, our UK-based team builds infrastructure on Azure and AWS that is agile, secure and scalable. For AI we add private model deployments in your own tenancy, quality monitoring and cost control.',
      link: { label: 'Cloud, MLOps & LLMOps', route: '/services', fragment: 'azure-cloud' },
      related: ['software', 'responsible', 'tech']
    },
    {
      id: 'qa',
      question: 'Do you offer testing?',
      keywords: ['testing', 'test', 'tests', 'qa', 'quality', 'quality assurance', 'automated testing', 'performance', 'evaluation', 'hallucination', 'red team', 'bugs'],
      answer: 'Yes — manual, automated and AI-specific testing. We test functionality, performance and security at every stage, and for AI we also check accuracy, hallucination and prompt-injection risks, re-testing whenever a prompt or model changes.',
      link: { label: 'QA & AI Testing', route: '/services', fragment: 'quality-assurance' },
      related: ['responsible', 'teams', 'services']
    },
    {
      id: 'teams',
      question: 'Can I hire a dedicated team?',
      keywords: ['dedicated', 'dedicated team', 'hire', 'hiring', 'developers', 'engineers', 'offshore', 'outsource', 'outsourcing', 'staff', 'resources', 'augmentation', 'extend my team', 'remote team'],
      answer: 'Yes. Our dedicated AI engineers, developers and testers plug into your workflows and tools, with UK-based project management and oversight. You get full-time professionals, flexible team scaling and transparent monthly pricing.',
      link: { label: 'Dedicated Offshore Team model', route: '/business-models' },
      related: ['models', 'cost', 'contact']
    },
    {
      id: 'models',
      question: 'How can we work together?',
      keywords: ['engagement', 'engagement model', 'business model', 'business models', 'models', 'work with you', 'work together', 'how do we start working', 'hybrid', 'project based', 'fixed scope', 'fixed price', 'contract'],
      answer: 'We offer four engagement models:\n• AI Discovery & Pilot — prove value on your own data before committing\n• Dedicated Offshore Team — your own remote team in India, full control\n• Project-Based Delivery — fixed scope with milestone-based progress\n• Hybrid Collaboration (UK + India) — UK engagement via ARCVIK, delivery in India',
      link: { label: 'Business models', route: '/business-models' },
      related: ['pilot', 'process', 'cost']
    },
    {
      id: 'pilot',
      question: 'How do I get started with AI?',
      keywords: ['get started', 'start', 'begin', 'first step', 'pilot', 'poc', 'proof of concept', 'prototype', 'discovery', 'discovery call', 'trial project', 'where do i start', 'book'],
      answer: 'The low-risk way to begin is our AI Discovery & Pilot: we find your strongest AI use case and build a working pilot on your own data — so you see results before you commit.\n\nThe first step is a short discovery call. Book one from the Contact page and we\'ll reply within 24 hours.',
      link: { label: 'Book an AI Discovery Call', route: '/contact' },
      related: ['process', 'models', 'cost']
    },
    {
      id: 'process',
      question: 'What is your delivery process?',
      keywords: ['process', 'methodology', 'approach', 'delivery', 'how do you work', 'phases', 'agile', 'sprints', 'timeline'],
      answer: 'We follow four steps:\n1. Discover & Assess — your processes, data, risks and success measures\n2. Prototype & Prove — a working prototype on your data, so you see results early\n3. Build & Evaluate — agile sprints, tested for accuracy, safety and security\n4. Launch, Monitor & Improve — live with monitoring and human oversight, improving as usage grows',
      link: { label: 'Our process', route: '/business-models' },
      related: ['pilot', 'models', 'support']
    },
    {
      id: 'smartgrader',
      question: 'Tell me about AI SmartGrader',
      keywords: ['smartgrader', 'smart grader', 'ai smartgrader', 'product', 'products', 'grading', 'grade', 'marking', 'exam', 'exams', 'answer sheet', 'answer sheets', 'teacher', 'teachers', 'school', 'education', 'students', 'evaluation tool'],
      answer: 'AI SmartGrader is our own AI product: upload answer sheets (image, PDF or handwritten) and AI handles evaluation, scoring, per-question feedback and class analytics — reviewed by teachers before results go out.\n\nGrade Smarter. Teach Better. — 10× faster grading, 90% accuracy rate and 80% time saved.',
      link: { label: 'Explore AI SmartGrader', route: '/products' },
      related: ['smartgraderTrial', 'about', 'contact']
    },
    {
      id: 'smartgraderTrial',
      question: 'Can I try SmartGrader?',
      keywords: ['try smartgrader', 'free trial', 'trial', 'demo', 'sign up', 'signup', 'login', 'access'],
      answer: 'Yes — you can start a free trial or request a demo for your institution on the AI SmartGrader website.',
      link: { label: 'Open ai-smartgrader.com', route: 'https://www.ai-smartgrader.com/contact', external: true },
      related: ['smartgrader', 'contact']
    },
    {
      id: 'cost',
      question: 'How much does it cost?',
      keywords: ['price', 'pricing', 'cost', 'costs', 'quote', 'quotation', 'budget', 'rates', 'rate', 'how much', 'expensive', 'cheap', 'affordable', 'savings', 'fees', 'charges'],
      answer: 'Every project is scoped to your needs, so we don\'t publish fixed prices. Our delivery model typically gives up to 60% cost savings, and dedicated teams come with transparent monthly pricing.\n\nTell us what you have in mind and we\'ll come back with a proposal.',
      link: { label: 'Request a quote', route: '/contact' },
      related: ['models', 'pilot', 'contact']
    },
    {
      id: 'contact',
      question: 'How can I contact you?',
      keywords: ['contact', 'email', 'mail', 'phone', 'call', 'number', 'mobile number', 'reach', 'talk', 'speak', 'get in touch', 'whatsapp', 'enquiry', 'enquire', 'inquiry'],
      answer: 'You can reach us at:\n• Email: info@indowestunited.com\n• Phone: +91 7901666696\n• UK partner (ARCVIK Solutions Ltd): info@arcvik.co.uk\n\nOr send a message through the Contact page — we respond within 24 hours.',
      link: { label: 'Go to Contact', route: '/contact' },
      related: ['location', 'hours', 'pilot']
    },
    {
      id: 'location',
      question: 'Where are you located?',
      keywords: ['where', 'located', 'location', 'address', 'office', 'offices', 'hyderabad', 'india', 'hitech city', 'visit', 'directions', 'map'],
      answer: 'Our head office is in Hyderabad, India:\nFlat No 402, Veekay Prime Apartments, Patrika Nagar, Hitech City, Hyderabad – 500081.\n\nOur UK partner office, ARCVIK Solutions Ltd, is in Nottingham, United Kingdom.',
      link: { label: 'Find us on the map', route: '/contact' },
      related: ['contact', 'hours', 'partner']
    },
    {
      id: 'hours',
      question: 'What are your working hours?',
      keywords: ['hours', 'timing', 'timings', 'working hours', 'office hours', 'open', 'available', 'availability', 'response time', 'reply', 'respond'],
      answer: 'We\'re available Monday to Friday, 9 AM to 6 PM (IST). You can also send us a message any time — we\'ll respond within 24 hours. We also offer 24/7 support for the systems we run.',
      link: { label: 'Contact us', route: '/contact' },
      related: ['contact', 'support']
    },
    {
      id: 'support',
      question: 'Do you provide support after launch?',
      keywords: ['support', '24/7', '24x7', 'maintenance', 'after launch', 'post launch', 'monitoring', 'help desk support'],
      answer: 'Yes. We offer 24/7 support, and AI systems go live with monitoring and human oversight in place — then we keep improving quality and cost as usage grows.',
      link: { label: 'Our process', route: '/business-models' },
      related: ['process', 'cloud', 'contact']
    },
    {
      id: 'tech',
      question: 'Which technologies do you use?',
      keywords: ['technology', 'technologies', 'tech', 'stack', 'tools', 'framework', 'frameworks', 'models', 'ai models', 'which models', 'what models', 'models do you use', 'llm models', 'openai', 'azure openai', 'claude', 'anthropic', 'gemini', 'open source', 'langgraph', 'semantic kernel', 'pgvector', 'node'],
      answer: 'We\'re model-agnostic and choose the stack that fits your security, data and cost needs:\n• Models — Azure OpenAI, OpenAI, Anthropic Claude, Google Gemini, open-source LLMs\n• Agents — LangGraph, Semantic Kernel, Model Context Protocol (MCP)\n• Data & retrieval — RAG pipelines, Azure AI Search, pgvector, Power BI\n• Engineering — Python, C# / .NET, Angular, React, Node.js, Azure, AWS',
      link: { label: 'See the AI stack', route: '/home' },
      related: ['genai', 'software', 'cloud']
    },
    {
      id: 'industries',
      question: 'Which industries do you serve?',
      keywords: ['industry', 'industries', 'sector', 'sectors', 'domain', 'aviation', 'travel', 'retail', 'e-commerce', 'ecommerce', 'logistics', 'warehousing', 'fintech', 'insurance', 'banking', 'education', 'e-learning', 'manufacturing', 'supply chain'],
      answer: 'We serve:\n• Aviation & Travel — market & fleet data intelligence\n• E-Commerce & Retail — customer service agents\n• Logistics & Warehousing — document automation\n• FinTech & Insurance — claims & document processing\n• Education & E-Learning — AI-assisted marking & feedback\n• Manufacturing & Supply Chain — supplier & order automation',
      link: { label: 'Industries we serve', route: '/services' },
      related: ['agentTypes', 'clients', 'services']
    },
    {
      id: 'team',
      question: 'Who is on your team?',
      keywords: ['team', 'people', 'members', 'employees', 'who works', 'leadership', 'centre head', 'center head', 'ashok', 'venkat', 'aman', 'kavya', 'lead developer'],
      answer: 'Our team of developers, testers, data specialists and AI engineers is led by:\n• Ashok Rajamahendravarapu — Centre Head\n• Venkat Mandla — Lead Developer\n• Aman Kattepogu — Lead QA Analyst\n• Kavya Uppalapati — Lead Data Researcher',
      link: { label: 'Meet the team', route: '/about' },
      related: ['about', 'teams', 'contact']
    },
    {
      id: 'clients',
      question: 'What do your clients say?',
      keywords: ['client', 'clients', 'customer', 'customers', 'testimonial', 'testimonials', 'review', 'reviews', 'reference', 'references', 'rdc aviation', 'aircraft values', 'peter', 'richard', 'portfolio', 'case study'],
      answer: 'Two of our UK clients:\n• Peter Hind, CEO, RDC Aviation — has worked with us for more than 9 years: "Indowest United consistently delivers exceptional results, making them an indispensable part of our success."\n• Richard Leigh, Director, Aircraft Values Pro — "Indowest has provided us with skilled software developers within just two weeks of our request."',
      link: { label: 'Read the testimonials', route: '/home' },
      related: ['industries', 'about', 'contact']
    },
    {
      id: 'why',
      question: 'Why choose IndoWest United?',
      keywords: ['why', 'why choose', 'choose you', 'different', 'difference', 'advantage', 'benefits', 'better', 'trust'],
      answer: 'Four reasons clients choose us:\n• AI that reaches production — we run our own AI product, AI SmartGrader\n• Responsible by design — data protection, oversight and auditability from day one\n• Hybrid scalability — UK project management with Indian development efficiency\n• Cost-effective — from a small AI pilot to a dedicated team',
      link: { label: 'Why choose us', route: '/about' },
      related: ['clients', 'pilot', 'cost']
    },
    {
      id: 'values',
      question: 'What are your mission and values?',
      keywords: ['mission', 'vision', 'values', 'value', 'purpose', 'culture', 'principles'],
      answer: 'Our mission is to make AI agents and intelligent software practical, trustworthy and affordable for every business. Our vision is to be a globally trusted AI and technology partner.\n\nOur values: Integrity, Innovation, Transparency, Collaboration and Excellence.',
      link: { label: 'About us', route: '/about', fragment: 'our-mission' },
      related: ['about', 'why', 'team']
    }
  ];

  private readonly fallback =
    'I can only answer questions about IndoWest United and what\'s on this website — our services, AI agents, AI SmartGrader, how we work and how to reach us.\n\nFor anything else, please contact info@indowestunited.com or call +91 7901666696.';

  /** Find the best answer for a visitor's question. */
  answer(question: string): ChatAnswer {
    const text = this.normalise(question);

    // suggestion chips send an entry's own question, so answer those directly
    const exact = this.entries.find(e => this.normalise(e.question) === text);
    if (exact) return this.toAnswer(exact);

    const words = new Set(text.split(' ').filter(Boolean).map(w => this.stem(w)));

    let best: KnowledgeEntry | null = null;
    let bestScore = 0;

    for (const entry of this.entries) {
      let score = 0;
      for (const keyword of entry.keywords) {
        const k = this.normalise(keyword);
        if (!k) continue;
        if (k.includes(' ')) {
          // phrases are strong signals
          if (` ${text} `.includes(` ${k} `)) score += 3;
        } else if (words.has(this.stem(k))) {
          score += 1;
        }
      }
      if (score > bestScore) {
        bestScore = score;
        best = entry;
      }
    }

    // a bare greeting/thanks only wins when nothing more specific matched
    if (!best || bestScore < 1) {
      return {
        text: this.fallback,
        link: { label: 'Contact us', route: '/contact' },
        suggestions: this.starterQuestions.slice(0, 3),
        matched: false
      };
    }

    return this.toAnswer(best);
  }

  private toAnswer(entry: KnowledgeEntry): ChatAnswer {
    return {
      text: entry.answer,
      link: entry.link,
      suggestions: (entry.related || [])
        .map(id => this.entries.find(e => e.id === id)?.question)
        .filter((q): q is string => !!q),
      matched: true
    };
  }

  private normalise(value: string): string {
    return value
      .toLowerCase()
      .replace(/[’']/g, '')
      .replace(/[^a-z0-9#.+/ -]/g, ' ')
      .replace(/(\w)\.(\s|$)/g, '$1 ')   // sentence full stops, but keep ".net"
      .replace(/[-/]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  /** Very small stemmer so "agents" matches "agent", "testing" matches "test". */
  private stem(word: string): string {
    if (word.length > 5 && word.endsWith('ing')) return word.slice(0, -3);
    if (word.length > 3 && word.endsWith('s') && !word.endsWith('ss')) return word.slice(0, -1);
    return word;
  }
}
