import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WebsiteContentService {

  private websiteContent = `
ABOUT INDOWEST UNITED:
Indowest United is a leading software development company founded in 2012 based in India, working in close partnership with ARCVIK Solutions Ltd (UK). 
Together, we deliver innovative, cost-efficient, and high-quality technology solutions for businesses worldwide.
Our mission: "Empowering Innovation from India to the World."

COMPANY BACKGROUND:
- Founded: EST. 2012
- Over a decade of excellence
- India-based company
- Partnership with ARCVIK Solutions Ltd (UK)
- Team of 13+ skilled professionals including developers, testers, and data engineers
- 24+ Years of combined experience
- Built on technical depth, process discipline, and culture of continuous learning

COMPANY VALUES:
- Integrity: We do what's right, even when no one's watching
- Innovation: We continuously advance and pursue excellence
- Excellence: We pursue highest standards in everything
- Collaboration: We work together for better results

OUR SERVICES:
1. AI AUTOMATION
   - Workflow Automation
   - Intelligent Agents
   - AI Integration
   - Process Optimization

2. AZURE & AWS CLOUD SOLUTIONS
   - Cloud Migration
   - CI/CD Pipeline Setup
   - Infrastructure Optimization
   - DevOps Services

3. SOFTWARE DEVELOPMENT
   - Custom Software Development
   - Web Application Development
   - Full-stack Solutions
   - Enterprise Solutions

TECHNOLOGIES WE WORK WITH:
- Backend: .NET, Python
- Frontend: Angular, React
- Databases: SQL Server, MongoDB
- Cloud Platforms: Azure, AWS
- Other: Node.js, Java, CI/CD tools

ENGAGEMENT MODELS:
1. DEDICATED OFFSHORE TEAM
   - Build your own remote development team in India
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
Step 1: DISCOVERY & PLANNING
- We start by understanding your business requirements
- Technical constraints and project goals
- Detailed discovery sessions

Step 2: TEAM ASSEMBLY
- Based on your needs, assemble right mix of talent
- UK and Indian professionals
- Optimal cost-efficiency and expertise

Step 3: EXECUTION
- Execute project with precision
- Follow agile methodologies
- Consistent quality checks

Step 4: DELIVERY & SUPPORT
- Deliver your solution
- Continue providing post-launch support
- Ensure smooth operation

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
