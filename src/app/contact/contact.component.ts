import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContactService } from '../../contact.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {
  contactForm: FormGroup;
  isSubmitting = false;
  message = '';
  messageType: 'success' | 'error' = 'success';

  constructor(
    private fb: FormBuilder,
    private contactService: ContactService
  ) {
    this.contactForm = this.createForm();
  }

  private createForm(): FormGroup {
    return this.fb.group({
      firstName: ['', [Validators.required, Validators.pattern('^[A-Za-z\\s]{2,}$')]],
      lastName: ['', [Validators.required, Validators.pattern('^[A-Za-z\\s]{2,}$')]],
      email: ['', [Validators.required, Validators.email]],
      message: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  async onSubmit() {
    if (this.contactForm.valid) {
      this.isSubmitting = true;
      this.message = '';

      const formData = {
        firstName: this.contactForm.get('firstName')?.value,
        lastName: this.contactForm.get('lastName')?.value,
        email: this.contactForm.get('email')?.value,
        message: this.contactForm.get('message')?.value,
        date: new Date().toLocaleString(),
        to_name: 'Indowest United',
        from_name: `${this.contactForm.get('firstName')?.value} ${this.contactForm.get('lastName')?.value}`
      };

      try {
        const result = await this.contactService.sendEmail(formData);
        
        if (result.success) {
          this.message = 'Thank you! Your message has been sent successfully. We will get back to you soon.';
          this.messageType = 'success';
          this.contactForm.reset();
        } else {
          this.message = 'Sorry, there was an error sending your message. Please try again or email us directly at info@indowestunited.com';
          this.messageType = 'error';
        }
      } catch (error) {
        this.message = 'Sorry, there was an error sending your message. Please try again.';
        this.messageType = 'error';
      } finally {
        this.isSubmitting = false;
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched() {
    Object.keys(this.contactForm.controls).forEach(key => {
      const control = this.contactForm.get(key);
      control?.markAsTouched();
    });
  }

  get firstName() { return this.contactForm.get('firstName'); }
  get lastName() { return this.contactForm.get('lastName'); }
  get email() { return this.contactForm.get('email'); }
  get messageField() { return this.contactForm.get('message'); }

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

    setTimeout(() => {
      const animateElements = document.querySelectorAll('.animate-on-scroll');
      animateElements.forEach(el => observer.observe(el));
    });
  }
}