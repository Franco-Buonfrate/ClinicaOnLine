import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/servicios/auth.service';
import { FirestoreService } from 'src/app/servicios/firestore.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-mi-perfil',
  templateUrl: './mi-perfil.component.html',
  styleUrls: ['./mi-perfil.component.css']
})
export class MiPerfilComponent implements OnInit{
  usuario:any;
  tipoUsuario:string = '';
  listaEspecialidades:any[] = [];
  espSeleccionada:any;
  botonesDias:any[] = [
    {dia:'Lunes', numero:1},
    {dia:'Martes', numero:2}, 
    {dia:'Miércoles', numero:3}, 
    {dia:'Jueves', numero:4}, 
    {dia:'Viernes', numero:5},
    {dia:'Sábado', numero:6}
  ];
  constructor(private auth:AuthService, private router:Router, private firestore:FirestoreService){

  }

  ngOnInit(): void {
    this.usuario = this.auth.usuarioActual;
    console.log(this.usuario);
    if(!this.usuario)
    {
      this.router.navigate(['home']);
    }
    else
    {
      this.tipoUsuario = this.usuario.tipo;
      this.usuario.especialidades.forEach((e:any) => {
        this.listaEspecialidades.push(e);
      });
      this.espSeleccionada = this.listaEspecialidades[0]
      console.log(this.espSeleccionada);
      console.log(this.listaEspecialidades);

    }
  }

  obtenerClaseDia(dia: number): string {
    if (this.espSeleccionada && this.espSeleccionada.dias && this.espSeleccionada.dias.includes(dia)) {
      if(this.desactivarSeleccionados(dia))
      {
        return 'btn-warning disabled';
      }
      return 'btn-success';
    } else {
      if(this.desactivarSeleccionados(dia))
      {
        return 'btn-warning disabled';
      }
      return 'btn-danger';
    }
  }

  desactivarSeleccionados(dia:number){
    return this.listaEspecialidades.some((esp:any) => {
      if(esp.tipo != this.espSeleccionada.tipo)
      {
        return esp.dias.includes(dia)
      }
      else
      {
        return false
      }
    });
  }

  agregarDia(numeroDia: number) {
    const index = this.espSeleccionada.dias.indexOf(numeroDia);
  
    if (index !== -1) {
      this.espSeleccionada.dias.splice(index, 1);
    } else {
      this.espSeleccionada.dias.push(numeroDia);
    }
  }

  actualizarCalendario()
  {
    this.firestore.subirHorarios(this.listaEspecialidades);

    const Toast = Swal.mixin({
      toast: true,
      position: "top",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      }
    });
    Toast.fire({
      icon: "success",
      title: "Se actualizo su calendario!"
    });
  }
}
