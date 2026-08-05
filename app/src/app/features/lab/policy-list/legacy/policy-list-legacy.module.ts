import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PolicyListLegacyComponent } from './policy-list-legacy.component';

const routes: Routes = [{ path: '', component: PolicyListLegacyComponent }];

/**
 * REFERENCIA LEGACY — la forma clásica de un feature-module Angular 14-18:
 * declarations + import de CommonModule + un NgModule ruteado. Se mantiene
 * solo para que lo compares con la versión moderna; no forma parte de las
 * rutas productivas de la app.
 */
@NgModule({
  declarations: [PolicyListLegacyComponent],
  imports: [CommonModule, RouterModule.forChild(routes)],
})
export class PolicyListLegacyModule {}
