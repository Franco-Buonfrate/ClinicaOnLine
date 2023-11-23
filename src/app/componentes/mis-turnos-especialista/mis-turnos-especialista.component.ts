import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/servicios/auth.service';
import { FirestoreService } from 'src/app/servicios/firestore.service';

@Component({
  selector: 'app-mis-turnos-especialista',
  templateUrl: './mis-turnos-especialista.component.html',
  styleUrls: ['./mis-turnos-especialista.component.css']
})
export class MisTurnosEspecialistaComponent implements OnInit{
  turnos: any;
  usuario:any;

  palabraBusqueda: string = '';
  turnosFiltrados: any[] = [];

  constructor(private authServer: AuthService, private firestoreService: FirestoreService){

  }

  ngOnInit(): void {
    this.usuario = this.authServer.usuarioActual;    
    
    const consulta = this.firestoreService.traerTurnosEspecialista().subscribe((turnos:any) => {
      this.turnos = turnos;
      this.turnosFiltrados = this.turnos;
    });
  }

  filtrarPorCampos() {
    this.turnosFiltrados = [];
    if (this.palabraBusqueda == '') {
      this.turnosFiltrados = [...this.turnos];
    } else {
      const busqueda = this.palabraBusqueda.trim().toLocaleLowerCase();
      for (let i = 0; i < this.turnos.length; i++) {
        const turno = this.turnos[i];
        if (
          turno.especialista.nombre.toLocaleLowerCase().includes(busqueda) ||
          turno.especialista.apellido.toLocaleLowerCase().includes(busqueda) ||
          turno.especialidad.toLocaleLowerCase().includes(busqueda)
        ) {
          this.turnosFiltrados.push(turno);
        }
      }
    }
  }

  cambiarEstadoTurno(turno:any, estado:string)
  {
    this.firestoreService.cambiarEstadoTurno(turno, estado);
  }
}
