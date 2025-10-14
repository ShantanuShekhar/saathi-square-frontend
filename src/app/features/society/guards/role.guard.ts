// import { Injectable } from '@angular/core';
// import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
// import { AuthService } from '../auth.service';

// @Injectable({ providedIn: 'root' })
// export class RoleGuard implements CanActivate {
//   constructor(private authService: AuthService, private router: Router) {}

//   canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
//     const expectedRoles = route.data['roles'] as Array<string>;
//     const userRole = this.authService.login.name;//need to correct here

//     if (!expectedRoles.includes(userRole)) {
//       this.router.navigate(['/unauthorized']);
//       return false;
//     }
//     return true;
//   }
// }
