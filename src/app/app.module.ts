import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

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

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    AboutComponent,
    ServicesComponent,
    HowWeWorkComponent,
    ContactComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,       // <--- Routing is handled here
    FormsModule,            // <--- Template-driven forms
    ReactiveFormsModule     // <--- Reactive forms
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
