import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideStore } from '@ngrx/store';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    // provideStore() va una sola vez en la raíz: EffectsRunner de @ngrx/effects
    // es `providedIn: 'root'`, así que siempre se instancia en el injector raíz
    // y necesita a Store ahí — provideStore() a nivel de ruta no alcanza.
    provideStore(),
  ]
};
