import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = getCookie('Auth');

  if (!token || tokenExpired(token)) {
    return router.parseUrl('/auth');
  }
  return true;
};
function getCookie(nome: string) {
  const match = document.cookie.match(new RegExp('(^| )' + nome + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) :null
}

function tokenExpired(token: string): boolean {
  try {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const exp = payload.exp;
      const now = Math.floor(Date.now() / 1000);
      return exp < now;
    } catch {
      return true; // Token inválido
    }
  } catch (error) {
    return true;
  }
}

