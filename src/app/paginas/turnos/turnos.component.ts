import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { first } from 'rxjs';
import { AuthService } from 'src/app/servicios/auth.service';
import { FirestoreService } from 'src/app/servicios/firestore.service';

@Component({
  selector: 'app-turnos',
  templateUrl: './turnos.component.html',
  styleUrls: ['./turnos.component.css']
})
export class TurnosComponent implements OnInit{
  turnos: any;
  usuario: any;
  turnosFiltrados: any[] = [];
  palabraBusqueda: string = '';


  constructor(private auth:AuthService, private firestore:FirestoreService, private router:Router){

  }

  ngOnInit(): void {
    this.usuario = this.auth.usuarioActual;
    if(this.usuario?.tipo == 'admin')
    {
      const consulta = this.firestore.traerTodosTurnos().pipe(first()).subscribe((turnos: any) => {
        this.turnos = turnos;
        this.turnosFiltrados = this.turnos;
      });
    }
    else{
      this.router.navigate(['home']);
    }
  }

  filtrarPorCampos() {
    this.turnosFiltrados = [];
    if (this.palabraBusqueda == '') {
      this.turnosFiltrados = [...this.turnos];
    } else {
      const busqueda = this.palabraBusqueda.trim().toLocaleLowerCase();
      for (let i = 0; i < this.turnos.length; i++) {
        const turno = this.turnos[i];
        const fechaBusqueda = this.transformarFechaParaBusqueda(turno.fecha);
        if (
          turno.especialista.nombre.toLocaleLowerCase().includes(busqueda) ||
          turno.especialista.apellido.toLocaleLowerCase().includes(busqueda) ||
          turno.especialidad.toLocaleLowerCase().includes(busqueda) ||
          turno.estado.toLocaleLowerCase().includes(busqueda) ||
          turno.paciente.nombre.toLocaleLowerCase().includes(busqueda) ||
          turno.paciente.apellido.toLocaleLowerCase().includes(busqueda) ||
          fechaBusqueda.includes(busqueda) ||
          turno?.detalle?.altura?.toString().includes(busqueda) ||
          turno?.detalle?.peso?.toString().includes(busqueda) ||
          turno?.detalle?.temperatura?.toString().includes(busqueda) ||
          turno?.detalle?.presion?.includes(busqueda) ||
          turno?.detalleAdicional?.clave1?.includes(busqueda) ||
          turno?.detalleAdicional?.clave2?.includes(busqueda) ||
          turno?.detalleAdicional?.clave3?.includes(busqueda) ||
          turno?.detalleAdicional?.valor1?.includes(busqueda) ||
          turno?.detalleAdicional?.valor2?.includes(busqueda) ||
          turno?.detalleAdicional?.valor3?.includes(busqueda)
        ) {
          this.turnosFiltrados.push(turno);
        }
      }
    }
  }

  transformarFechaParaBusqueda(value: any) {
    if (value.seconds) {
      value = new Date(value.seconds * 1000);
    }
    let rtn =
      value.getFullYear() +
      '-' +
      (value.getMonth() + 1) +
      '-' +
      value.getDate();
    if (parseInt(rtn.split('-')[2]) < 10 && parseInt(rtn.split('-')[2]) > 0) {
      rtn =
        value.getFullYear() +
        '-' +
        (value.getMonth() + 1) +
        '-0' +
        value.getDate();
    } else {
      rtn =
        value.getFullYear() +
        '-' +
        (value.getMonth() + 1) +
        '-' +
        value.getDate();
    }
    return rtn;
  }

  cancelarTurno(turno:any)
  {

  }
}
