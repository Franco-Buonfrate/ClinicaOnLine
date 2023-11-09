import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'TpClinicaLabo4';
  estaLogueado!:boolean;

  constructor(private auth:AngularFireAuth) {
    this.auth.authState.subscribe(user => {
      this.estaLogueado = !!user;
    });
  }

  async logOut()
  {
    await this.auth.signOut();
    this.estaLogueado = true;
  }
}
