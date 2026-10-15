import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit, OnDestroy {

  readonly trialUrl = 'https://www.ai-smartgrader.com/contact';

  stats = [
    { value: '10×', label: 'Faster Grading' },
    { value: '90%', label: 'Accuracy rate' },
    { value: '80%', label: 'Time Saved' }
  ];

  // Sample graded paper shown in the demo board
  questions = [
    { q: 'Q1', topic: 'Cell structure', score: 9, max: 10 },
    { q: 'Q2', topic: 'Mitochondria', score: 9, max: 10 },
    { q: 'Q3', topic: 'Cellular respiration', score: 7, max: 10 },
    { q: 'Q4', topic: 'Membrane transport', score: 9, max: 10 }
  ];
  readonly total = this.questions.reduce((sum, q) => sum + q.score, 0);
  readonly maxTotal = this.questions.reduce((sum, q) => sum + q.max, 0);
  readonly percent = Math.round((this.total / this.maxTotal) * 100);
  readonly ringLength = 251.2;   // circumference of the r=40 score ring

  private readonly feedback =
    'Strong conceptual grasp on Q1–Q2. Review Q3 for cellular respiration — likely to get full marks with a quick revision.';
  typedFeedback = '';
  analysing = false;
  graded = false;   // bars and ring fill once this is true

  steps = [
    { step: '1', title: 'Upload', description: 'Answer sheets in any format' },
    { step: '2', title: 'AI grades', description: 'Scoring + feedback generated' },
    { step: '3', title: 'Reviewed by Teachers', description: 'Results, analytics, export' },
    { step: '✓', title: 'Done!', description: 'Teach, don\'t grade' }
  ];

  features = [
    { icon: 'fa-cloud-arrow-up', tone: '', title: 'Upload answer sheets', description: 'Supports image, PDF and handwritten formats' },
    { icon: 'fa-circle-check', tone: 'green', title: 'AI evaluation', description: 'Smart scoring aligned to your rubric or answer key' },
    { icon: 'fa-comment-dots', tone: 'orange', title: 'Instant feedback', description: 'Per-question comments generated automatically' },
    { icon: 'fa-chart-column', tone: 'yellow', title: 'Class analytics', description: 'Track trends, weak topics, and student progress' },
    { icon: 'fa-download', tone: '', title: 'Export reports', description: 'Download grade sheets and parent-ready summaries' },
    { icon: 'fa-clock', tone: 'orange', title: 'Save 80% time', description: 'Grade a full class in minutes, not hours' }
  ];

  private typeTimer: any;
  private runTimer: any;

  ngOnInit(): void {
    this.runTimer = setTimeout(() => this.showResult(), 400);
  }

  /** Replays the demo: clears the result, "evaluates" briefly, then fills it in again. */
  rerun() {
    if (this.analysing) return;
    this.analysing = true;
    this.graded = false;
    this.typedFeedback = '';
    clearInterval(this.typeTimer);
    this.runTimer = setTimeout(() => {
      this.analysing = false;
      this.showResult();
    }, 1200);
  }

  private showResult() {
    this.graded = true;
    let index = 0;
    clearInterval(this.typeTimer);
    this.typeTimer = setInterval(() => {
      index++;
      this.typedFeedback = this.feedback.substring(0, index);
      if (index >= this.feedback.length) clearInterval(this.typeTimer);
    }, 25);
  }

  ngOnDestroy(): void {
    clearInterval(this.typeTimer);
    clearTimeout(this.runTimer);
  }
}
