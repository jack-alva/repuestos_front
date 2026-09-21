import { Routes } from '@angular/router';

import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { RegisterComponent } from './pages/auth/register/register.component';

import { CatalogoComponent } from './pages/catalogo/catalogo.component';
import { CarritoComponent } from './pages/carrito/carrito.component';

import { GenerarProformaComponent }
  from './pages/proformas/generar-proforma/generar-proforma.component';

import { MisProformasComponent }
  from './pages/proformas/mis-proformas/mis-proformas.component';

import { DashboardComponent }
  from './pages/trabajador/dashboard/dashboard.component';

import { ProformasComponent }
  from './pages/trabajador/proformas/proformas.component';

import { ProductosComponent }
  from './pages/trabajador/productos/productos.component';
import { DashboardUsuarioComponent } from './pages/usuario/dashboard/dashboard-usuario.component';

import { authGuard } from './core/security/auth.guard';
import { rolGuard } from './core/security/rol.guard';

export const routes: Routes = [

  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },

  {
    path: 'home',
    component: HomeComponent
  },

  {
    path: 'login',
    component: LoginComponent
  },

  {
    path: 'register',
    component: RegisterComponent
  },

  {
    path: 'catalogo',
    component: CatalogoComponent,
    canActivate: [
      authGuard,
      rolGuard(['CLIENTE'])
    ]
  },

  {
    path: 'carrito',
    component: CarritoComponent,
    canActivate: [
      authGuard,
      rolGuard(['CLIENTE'])
    ]
  },

  {
    path: 'proformas/generar',
    component: GenerarProformaComponent,
    canActivate: [
      authGuard,
      rolGuard(['CLIENTE'])
    ]
  },

  {
    path: 'proformas',
    component: MisProformasComponent,
    canActivate: [
      authGuard,
      rolGuard(['CLIENTE'])
    ]
  },
  {
    path: 'mi-cuenta',
    component: DashboardUsuarioComponent,
    canActivate: [authGuard, rolGuard(['CLIENTE'])]
  },

  {
    path: 'trabajador/dashboard',
    component: DashboardComponent,
    canActivate: [
      authGuard,
      rolGuard(['TRABAJADOR'])
    ]
  },

  {
    path: 'trabajador/proformas',
    component: ProformasComponent,
    canActivate: [
      authGuard,
      rolGuard(['TRABAJADOR'])
    ]
  },

  {
    path: 'trabajador/productos',
    component: ProductosComponent,
    canActivate: [
      authGuard,
      rolGuard(['TRABAJADOR'])
    ]
  },

  {
    path: '**',
    redirectTo: 'home'
  }

];
