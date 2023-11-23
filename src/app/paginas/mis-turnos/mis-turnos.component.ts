import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/servicios/auth.service';

@Component({
  selector: 'app-mis-turnos',
  templateUrl: './mis-turnos.component.html',
  styleUrls: ['./mis-turnos.component.css']
})
export class MisTurnosComponent implements OnInit {
  usuario:any;
  constructor(private authService:AuthService, private router:Router){
    
  }
  
  ngOnInit(): void {
    this.usuario = this.authService.usuarioActual
    if(!(this.usuario && (this.usuario.tipo == 'paciente' || this.usuario.tipo == 'especialista')))
    {
      this.router.navigate(['home']);
    }
  }

  
}
