import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from './servicios/auth.service';
import { slideInAnimation } from './animations';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    slideInAnimation
  ]
})
export class AppComponent {
  title = 'TpClinicaLabo4';
  estaLogueado:boolean = false;
  usuario:any;

  constructor(private auth:AuthService, public router: Router) {

    this.auth.estaLogueado().subscribe((usuarioActual)=>{
      this.estaLogueado=usuarioActual?true:false;
      this.usuario = usuarioActual;
    });

  }

  async logOut()
  {
    this.auth.logout();
    this.estaLogueado = false;
    this.router.navigate(['home']);
  }

  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData["animation"];
  }

}
