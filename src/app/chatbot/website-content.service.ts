import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WebsiteContentService {

  private websiteContent = `
ABOUT INDOWEST UNITED:
Indowest United is an AI and software engineering company founded in 2015 and based in India, working in close partnership with ARCVIK Solutions Ltd (UK).
Together, we build AI agents, generative AI applications and AI-powered software for businesses worldwide, responsibly and cost-efficiently.
Our mission: To make AI agents and intelligent software practical, trustworthy and affordable for every business.

COMPANY BACKGROUND:
- Founded: EST. 2015
- Over a decade of excellence
- India-based company
- Partnership with ARCVIK Solutions Ltd (UK)
- Focus: AI agents, generative AI, data engineering and software for businesses worldwide
- Our own AI product: AI SmartGrader (AI-assisted grading of answer sheets) - https://www.ai-smartgrader.com
- Team of 13+ skilled professionals including developers, testers, and data engineers
- 24+ Years of combined experience
- Built on technical depth, process discipline, and culture of continuous learning

COMPANY VALUES:
- Integrity: We do what's right, even when no one's watching
- Innovation: We continuously advance and pursue excellence
- Excellence: We pursue highest standards in everything
- Collaboration: We work together for better results

OUR SERVICES:
1. AI AGENTS & AGENTIC AUTOMATION
   - Custom AI agents that understand a goal, plan the steps and complete work across your systems
   - Multi-agent workflows
   - Tool and API integration (CRM, ERP, email, documents, internal APIs), including Model Context Protocol (MCP)
   - Human-in-the-loop approvals, guardrails, evaluation tests and activity logs
   - Example agents: customer service, document processing, knowledge assistants, sales & CRM, finance & operations, engineering & IT

2. GENERATIVE AI & LLM APPLICATIONS
   - RAG knowledge assistants that answer from your own documents with citations
   - Copilots and AI features inside your existing products and portals
   - Document intelligence for invoices, forms, contracts and handwritten pages
   - LLM integration, prompt and model evaluation
   - Model-agnostic: commercial and open-source models

3. AI CONSULTING & RESPONSIBLE AI
   - AI discovery workshops and use-case roadmaps
   - AI readiness reviews
   - Solutions designed with data-protection principles in mind
   - Help understanding which data and AI regulations apply in the markets you operate in
   - Human oversight, documentation, logging and data residency options
   - Note: this is engineering and advisory support, not legal advice

4. DATA ENGINEERING FOR AI & ANALYTICS
   - Data pipelines, validation and AI-ready data
   - Knowledge base preparation for retrieval
   - Power BI dashboards and business intelligence

5. AI-POWERED SOFTWARE DEVELOPMENT
   - Custom software and web applications with AI built in
   - .NET, Python, Angular, React
   - Legacy modernisation and enterprise solutions

6. CLOUD, MLOPS & LLMOPS (AZURE & AWS)
   - Cloud migration and CI/CD automation
   - Private AI deployments in your own tenancy
   - AI monitoring and cost control

7. QUALITY ASSURANCE & AI TESTING
   - Manual and automated testing, performance and security testing
   - LLM and agent evaluation (accuracy, hallucination, bias, prompt-injection risks)

8. DEDICATED AI & ENGINEERING TEAMS
   - AI engineers, developers, testers and data specialists
   - UK-based project management and oversight

INDUSTRIES WE SERVE:
- Aviation & Travel, E-Commerce & Retail, Logistics & Warehousing, FinTech & Insurance, Education & E-Learning, Manufacturing & Supply Chain

TECHNOLOGIES WE WORK WITH:
- AI models: Azure OpenAI, OpenAI, Anthropic Claude, Google Gemini, Mistral, open-source LLMs
- Agents & orchestration: LangGraph, Semantic Kernel, Model Context Protocol (MCP)
- Retrieval & data: RAG pipelines, Azure AI Search, pgvector, document OCR, Power BI
- Backend: .NET, Python
- Frontend: Angular, React
- Databases: SQL Server, MongoDB
- Cloud Platforms: Azure, AWS
- Other: Node.js, Java, CI/CD tools

ENGAGEMENT MODELS:
0. AI DISCOVERY & PILOT
   - The low-risk way to begin with AI
   - Use-case discovery and prioritisation
   - Working prototype on your real data
   - Clear success measures agreed up front
   - Ideal for a first AI agent or assistant

1. DEDICATED OFFSHORE TEAM
   - Build your own remote AI and development team in India
   - Full control over processes, timelines, and deliverables
   - Flexible team scaling
   - Transparent monthly pricing
   - Ideal for long-term collaborations

2. PROJECT-BASED DELIVERY
   - We take full responsibility from discovery to delivery
   - Well-defined scope and deliverables
   - End-to-end execution
   - Regular updates and reviews
   - Ideal for MVPs or fixed-scope projects
   - Milestone-based progress

3. HYBRID COLLABORATION (UK + INDIA)
   - Combine UK client engagement with India delivery excellence
   - Local expertise of ARCVIK Solutions Ltd (UK)
   - Delivery excellence of Indowest United (India)
   - Single accountability across geographies
   - Best suited for UK and European clients

OUR WORK PROCESS:
Step 1: DISCOVER & ASSESS
- We learn your processes, data and constraints
- Agree the use case, the risks and how success will be measured

Step 2: PROTOTYPE & PROVE
- The right mix of UK and Indian talent builds a working prototype on your data
- You see real results early

Step 3: BUILD & EVALUATE
- Build in agile sprints, integrating with your systems
- Test accuracy, safety and security at every step

Step 4: LAUNCH, MONITOR & IMPROVE
- Go live with monitoring and human oversight in place
- Keep improving quality and cost as usage grows

CONTACT INFORMATION:
- Email: info@indowest.com
- Email: info@indowestunited.com
- Contact Form: Available on website
- Inquiry Response: Within 24 hours

LOCATION:
- Indowest United: India-based
- ARCVIK Solutions Ltd: UK-based
- Global reach serving clients worldwide

KEY HIGHLIGHTS:
- Team of Experts: Dedicated professionals with decades of combined experience
- Consistent Growth: Long-lasting client relationships across industries
- Driven by Purpose: Empower organizations to achieve excellence through technology
- Flexible Models: Solutions tailored to your business needs
- Technical Excellence: Expertise across multiple technology domains
  `;

  constructor() { }

  /**
   * Get all website content
   */
  getWebsiteContent(): string {
    return this.websiteContent;
  }

  /**
   * Search specific topic in website content
   */
  searchContent(query: string): string {
    const upperQuery = query.toUpperCase();
    const lines = this.websiteContent.split('\n');
    const relevantLines: string[] = [];

    for (let i = 0; i < lines.length; i++) {
      if (lines[i].toUpperCase().includes(upperQuery)) {
        // Include context (2 lines before and 5 lines after)
        const start = Math.max(0, i - 2);
        const end = Math.min(lines.length, i + 6);
        relevantLines.push(...lines.slice(start, end));
        relevantLines.push('---');
      }
    }

    return relevantLines.length > 0 
      ? relevantLines.join('\n') 
      : this.websiteContent;
  }
}
