import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { App } from './app/app';
import { routes } from './app/app.routes';
import { AuthService } from './auth.service';

bootstrapApplication(App, {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    AuthService
  ]
}).catch(err => console.error(err));