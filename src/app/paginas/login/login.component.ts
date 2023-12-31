import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/servicios/auth.service';
import {MDCRipple} from '@material/ripple';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  formEnviado: boolean = false;
  formularioLogin: FormGroup;
  constructor(private formBuilder: FormBuilder, private auth:AuthService) {
    this.formularioLogin = formBuilder.group({
      mail:['',[Validators.required,Validators.email]],
      contrasenia:['',[Validators.required]]
    })
  }

  onLoginSubmit(){
    this.formEnviado = true;
    if(this.formularioLogin.valid)
    { 
      this.auth.login(this.formularioLogin.get('mail')?.value, this.formularioLogin.get('contrasenia')?.value);
    }
  }

  clickListadoUsuarios($event :any){
    this.formularioLogin.get('mail')?.setValue($event.mail);
    this.formularioLogin.get('contrasenia')?.setValue($event.contrasenia);

  }
}
