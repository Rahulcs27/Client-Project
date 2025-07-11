import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LoginService } from './services/login.service';

export const roleGuard: CanActivateFn = (route, state) => {
const router = inject(Router)
const loginService = inject(LoginService);
if (loginService.role() && loginService.role() === 'Admin') {
    return true;
}
else {
    return router.createUrlTree(['/home']);
}
};


