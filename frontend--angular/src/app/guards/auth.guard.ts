import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs';
import { AuthService } from '../../service/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  return authService.me().pipe(
    map(isAuthenticated => {
      if (isAuthenticated) {
        return true;
      }
      return router.parseUrl('/auth/login');
    })
  );
};