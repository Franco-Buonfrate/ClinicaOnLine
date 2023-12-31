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
        const fechaBusqueda = this.transformarFechaParaBusqueda(turno.fecha);
        if (
          turno.especialista.nombre.toLocaleLowerCase().includes(busqueda) ||
          turno.especialista.apellido.toLocaleLowerCase().includes(busqueda) ||
          turno.especialidad.toLocaleLowerCase().includes(busqueda)||
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
        this.firestoreService.subirComentario(turno, {comentarioPac:res.value, estado:'cancelado'});
      }
    });
    
  }

  verResenia(resenia:string)
  {
    Swal.fire({
      title: "El especialista ha comentado!",
      text: resenia,
      icon: "info"
    });
  }

  async calificar(turno:any){
    await Swal.fire({
      title: "Deja un comentario sobre como ha sido la atencion",
      input: "text",
      inputLabel: "Ingrese comentario",
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Dejar calificacion",
      cancelButtonText: "Cancelar",
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
          title: "Calificado!",
          text: "Se ha califica el turno con exito.",
          icon: "success"
        });
        this.firestoreService.subirComentario(turno, {resenia:res.value});
      }
    });
  }
}
