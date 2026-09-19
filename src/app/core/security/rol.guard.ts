import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

export const rolGuard = (
  rolesPermitidos: ('CLIENTE' | 'TRABAJADOR')[]
): CanActivateFn => {

  return () => {

    const authService = inject(AuthService);
    const router = inject(Router);

    const rol = authService.obtenerRol();

    if (rol && rolesPermitidos.includes(rol)) {
      return true;
    }

    return router.createUrlTree(['/home']);
  };
};