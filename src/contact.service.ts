import { Injectable } from '@angular/core';
import emailjs from '@emailjs/browser';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private serviceID = 'service_927wvj9';
  private templateID = 'template_ddyvx07';
  private publicKey = 'XxMCuP1H1oDeuhXTA';

  constructor() {
    emailjs.init(this.publicKey);
  }

  async sendEmail(formData: any): Promise<any> {
    try {
      const response = await emailjs.send(this.serviceID, this.templateID, {
        to_name: 'Indowest United',
        from_name: `${formData.firstName} ${formData.lastName}`,
        from_email: formData.email,
        message: formData.message,
        date: new Date().toLocaleString(),
        reply_to: formData.email
      });
      return { success: true, response };
    } catch (error) {
      console.error('EmailJS error:', error);
      return { success: false, error };
    }
  }
}