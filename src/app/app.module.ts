import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

// Import your routing module
import { AppRoutingModule } from './app-routing.module';

// Import components
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { ServicesComponent } from './services/services.component';
import { HowWeWorkComponent } from './how-we-work/how-we-work.component';
import { ContactComponent } from './contact/contact.component';
import { FooterComponent } from './footer/footer.component';
import { ChatbotComponent } from './chatbot/chatbot.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    AboutComponent,
    ServicesComponent,
    HowWeWorkComponent,
    ContactComponent,
    FooterComponent,
    ChatbotComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,       // <--- Routing is handled here
    FormsModule,            // <--- Template-driven forms
    ReactiveFormsModule,    // <--- Reactive forms
    HttpClientModule        // <--- HTTP client for API calls
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
