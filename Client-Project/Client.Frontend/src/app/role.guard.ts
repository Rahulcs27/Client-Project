import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { firstValueFrom, Observable } from 'rxjs';
import { RoleAccessService } from './services/role-access.service';
import { LoginService } from './services/login.service';
import { RoleAccessDto } from './components/role/role-dtos';

@Injectable({
    providedIn: 'root'
})
export class RoleGuard implements CanActivate {

    constructor(private loginService: LoginService, private authService: RoleAccessService, private router: Router) { }

    async canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Promise<boolean> {

        const userName = this.loginService.user();
        if (userName) {
            const screenCode = next.data['screenCode'];
            let hasAccess = false
            await firstValueFrom(this.authService.getUserAccess(userName)).then((response: RoleAccessDto[]) => {
                hasAccess = response.some((item) => item.a_screenCode === screenCode && item.a_viewAccess);
            }).catch((error) => {
                console.log(error);
            })
            if (!hasAccess) {
                this.router.navigate(['/home']);
                return false;
            }
            else {
                return true;
            }
        }
        else {
            this.loginService.logout();
            return false;
        }
    }
}
