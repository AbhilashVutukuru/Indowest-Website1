import { NgModule } from '@angular/core';
import { RouterModule, Routes, ExtraOptions } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { ServicesComponent } from './services/services.component';
import { HowWeWorkComponent } from './how-we-work/how-we-work.component';
import { ContactComponent } from './contact/contact.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'about', component: AboutComponent},
  { path: 'services', component: ServicesComponent},
  { path: 'how-we-work', component: HowWeWorkComponent},
  { path: 'contact', component: ContactComponent},
  { path: '**', redirectTo: '/home', pathMatch: 'full' }
];

const routerOptions: ExtraOptions = {
  scrollPositionRestoration: 'enabled', // This will scroll to the top
  anchorScrolling: 'enabled',           // Optionally enable anchor scrolling
};

@NgModule({
  imports: [RouterModule.forRoot(routes, routerOptions)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
