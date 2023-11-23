import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/servicios/auth.service';
import { FirestoreService } from 'src/app/servicios/firestore.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-mis-turnos-paciente',
  templateUrl: './mis-turnos-paciente.component.html',
  styleUrls: ['./mis-turnos-paciente.component.css']
})
export class MisTurnosPacienteComponent implements OnInit{
  turnos: any;
  usuario:any;

  palabraBusqueda: string = '';
  turnosFiltrados: any[] = [];

  constructor(private authServer: AuthService, private firestoreService: FirestoreService){

  }

  ngOnInit(): void {
    this.usuario = this.authServer.usuarioActual;    
    
    const consulta = this.firestoreService.traerTurnosPaciente().subscribe((turnos:any) => {
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

  async cancelarTurno(turno:any)
  {
    await Swal.fire({
      title: "Esta seguro que desea cancelar el turno?",
      input: "text",
      inputLabel: "Ingrese comentario",
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, cancelarlo!",
      cancelButtonText: "Mejor no",
      showCancelButton:true,
      inputValidator: (value) => {
        if (!value) {
          return "Tienes que dejar un comentario!";
        }
        return null;
      }
    }).then((res) => {
      if(res.isConfirmed)
      {
        Swal.fire({
          title: "Cancelado!",
          text: "Se ha cancelado el turno con exito.",
          icon: "success"
        });
        this.firestoreService.cambiarEstadoTurno(turno, 'cancelado');
        this.firestoreService.subirComentario(turno, res.value);
      }
    });
    
  }
}
