import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/servicios/auth.service';
import { FirestoreService } from 'src/app/servicios/firestore.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-mis-turnos-especialista',
  templateUrl: './mis-turnos-especialista.component.html',
  styleUrls: ['./mis-turnos-especialista.component.css']
})
export class MisTurnosEspecialistaComponent implements OnInit {
  turnos: any;
  usuario: any;

  palabraBusqueda: string = '';
  turnosFiltrados: any[] = [];

  turnoFinalizado: any = null;
  formHistorial: FormGroup;
  cantidadClaveValor: number = 0;
  dato1: string[] = ['', ''];
  dato2: string[] = ['', ''];
  dato3: string[] = ['', ''];
  arrayClaveValorAdicionales: any[] = [];


  constructor(private authServer: AuthService, private firestoreService: FirestoreService, private formBuilder: FormBuilder, private modal: NgbModal) {
    this.formHistorial = this.formBuilder.group({
      altura: ['', [Validators.required]],
      peso: ['', [Validators.required]],
      temperatura: ['', [Validators.required]],
      presion: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.usuario = this.authServer.usuarioActual;

    const consulta = this.firestoreService.traerTurnosEspecialista().subscribe((turnos: any) => {
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

  cambiarEstadoTurno(turno: any, estado: string) {
    this.firestoreService.cambiarEstadoTurno(turno, { estado: estado });
  }


  finalizarTurno(turno: any) {
    this.turnoFinalizado = turno;
  }

  agregarClaveValor() {
    if (this.cantidadClaveValor < 3) {
      this.cantidadClaveValor++;
      if (this.cantidadClaveValor == 1) {
        this.arrayClaveValorAdicionales.push(this.dato1);
      } else if (this.cantidadClaveValor == 2) {
        this.arrayClaveValorAdicionales.push(this.dato2);
      } else {
        this.arrayClaveValorAdicionales.push(this.dato3);
      }
    }
  }


  crearHistorialClinico() {
    if(this.formHistorial.valid)
    {
      let detalle: any = {
        altura: this.formHistorial.getRawValue().altura,
        peso: this.formHistorial.getRawValue().peso,
        temperatura: this.formHistorial.getRawValue().temperatura,
        presion: this.formHistorial.getRawValue().presion,
      };

      let detalleAdicional: any = {};
      if (this.arrayClaveValorAdicionales.length == 1) {
        detalleAdicional.clave1 = this.dato1[0];
        detalleAdicional.valor1 = this.dato1[1];
      }
      if (this.arrayClaveValorAdicionales.length == 2) {
        detalleAdicional.clave1 = this.dato1[0];
        detalleAdicional.valor1 = this.dato1[1];
        detalleAdicional.clave2 = this.dato2[0];
        detalleAdicional.valor2 = this.dato2[1];
      }
      if (this.arrayClaveValorAdicionales.length == 3) {
        detalleAdicional.clave1 = this.dato1[0];
        detalleAdicional.valor1 = this.dato1[1];
        detalleAdicional.clave2 = this.dato2[0];
        detalleAdicional.valor2 = this.dato2[1];
        detalleAdicional.clave3 = this.dato3[0];
        detalleAdicional.valor3 = this.dato3[1];
      }

      this.firestoreService.cambiarEstadoTurno(this.turnoFinalizado, {detalle:detalle, datalleAdicional:detalleAdicional, estado:'finalizado'});

      this.dato1 = ['clave 1', 'valor 1'];
      this.dato2 = ['clave 2', 'valor 2'];
      this.dato3 = ['clave 3', 'valor 3'];
      this.arrayClaveValorAdicionales = [];
      this.cantidadClaveValor = 0;
      this.formHistorial.reset();
    }
  }

  async rechazarTurno(turno:any){
    await Swal.fire({
      title: "Esta seguro que desea rechazar el turno?",
      input: "text",
      inputLabel: "Ingrese comentario",
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, rechazarlo!",
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
          title: "Rechazado!",
          text: "Se ha rechazado el turno con exito.",
          icon: "success"
        });
        this.firestoreService.subirComentario(turno, {comentarioEsp:res.value, estado:'rechazado'});
      }
    });
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

  verResenia(resenia:string, tipo:string)
  {
    Swal.fire({
      title: `El paciente ha dejado ${tipo}!`,
      text: resenia,
      icon: "info"
    });
  }
}
