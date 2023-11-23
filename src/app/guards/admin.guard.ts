import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, map, take, tap } from 'rxjs';
import Swal from 'sweetalert2';
import { AuthService } from '../servicios/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(
    private afAuth: AngularFireAuth,
    private router: Router,
    private authService: AuthService
  ) {}

  canActivate(
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    return this.afAuth.authState.pipe(
      take(1),
      map(user => !!user && this.authService.esAdmin()),
      tap(esAdmin => {
        if (!esAdmin) {
          this.router.navigate(['/home']); 
          Swal.fire({
            title: 'Error',
            text: 'Debe ser administrador para ingresar',
            icon: 'error',
            confirmButtonText: 'Aceptar'
          })
        }
      })
    );
  }

  
}
