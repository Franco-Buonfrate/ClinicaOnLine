import {Component, OnInit} from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Timestamp } from 'firebase/firestore';
import { first } from 'rxjs';
import { AuthService } from 'src/app/servicios/auth.service';
import { FirestoreService } from 'src/app/servicios/firestore.service';

@Component({
  selector: 'app-sacar-turnos',
  templateUrl: './sacar-turnos.component.html',
  styleUrls: ['./sacar-turnos.component.css']
})
export class SacarTurnosComponent implements OnInit{
  usuario:any;

  listaEspecialistas:any = [];
  listaEspecialidades:any[] = [];
  listaFechas:any = null;

  especialidadSeleccionada:string='';
  especialistaSeleccionado:any = null;
  fechaSeleccionada:any;
  botonSeleccionado:string = '';

  listaEspecialistasFiltrada:any = [];
  
  listaBotones:any = ['8:00','8:30','9:00','9:30','10:00','10:30','11:00','11:30','12:00','12:30','13:00','13:30','14:00','14:30','15:00'];
  fontStyleControl = new FormControl('');
  fontStyle?: string;

  listaPacientes:any[] = [];
  paciente:any = null;
  constructor(private firestoreService: FirestoreService, private auth:AuthService, private router:Router){}

  ngOnInit(): void {
    this.usuario = this.auth.usuarioActual
    if(this.usuario && (this.usuario.tipo == 'paciente' || this.usuario.tipo == 'admin'))
    {
      if(this.usuario.tipo == 'admin')
      {
        this.firestoreService.traerPacientes()?.pipe(first()).subscribe((pacientes:any) => {
          this.listaPacientes = pacientes;
        });
      }
      else
      {
        this.paciente = this.usuario;
      }

      this.firestoreService.traerEspecialidades()?.pipe(first()).subscribe((lista:any)=>{
        this.listaEspecialidades = lista;
      });

      this.firestoreService.traerEspecialistas()?.pipe(first()).subscribe(listado => {
        this.listaEspecialistas = [];
        listado.forEach(e => {
          e = {
            ...e,
            nuevoTurno: null,
          }
          this.listaEspecialistas.push(e);
        });
      });
    }
    else
    {
      this.router.navigate(['home']);
    }

  }

  seleccionarEspecialidad(especialidad:any)
  {
    this.listaEspecialistasFiltrada = [];
    this.especialidadSeleccionada = especialidad.especialidad;
    this.listaEspecialistas.forEach((esp:any) => {
      if(esp.especialidades.some((a:any)=>a.tipo == this.especialidadSeleccionada))
      {
        this.listaEspecialistasFiltrada.push(esp);
      }
    });
  }

  seleccionarEspecialista(esp:any){
    this.especialistaSeleccionado = esp;
    this.listaFechas = this.calcularFechas(esp);
  }

  calcularFechas(especialista:any){
    
    const fechas: Date[] = [];
    let diasSemana: any[] = [];

    especialista.especialidades.forEach((e:any) => {
      if(e.tipo == this.especialidadSeleccionada)
      {
        diasSemana = e.dias;
      }
    });

    // Obtener la fecha actual
    const fechaActual: Date = new Date();

    // Iterar sobre los próximos 15 días
    for (let i = 0; i < 15; i++) {
      const fecha: Date = new Date();
      fecha.setDate(fechaActual.getDate() + i);

      // Verificar si el día de la semana coincide con los días especificados en el objeto
      if (diasSemana.includes(fecha.getDay())) {
        fechas.push(fecha);
      }
    }

    return fechas;
  }

  limpiar(esp:any){
    this.botonSeleccionado = '';
    esp.nuevoTurno =  null;
  }

  seleccionarBoton(boton:string){
    this.botonSeleccionado = boton;
  }

  seleccionarFecha(fecha:Date){
    this.fechaSeleccionada = fecha;
  }

  esTurnoAsignado(boton: string, especialista: any): boolean {
    console.log('entra');
    if (especialista.nuevoTurno ) {
      console.log(boton);
      if(especialista.turnos){
        const [hora, minutos] = boton.split(':');
        const fechaBoton =  especialista.nuevoTurno;
        fechaBoton.setHours(Number(hora), Number(minutos), 0, 0);
        console.log(fechaBoton);
    
        return especialista.turnos.some((turno:any) => {
          const fechaTurno = turno.toDate();
          return fechaTurno.getTime() === fechaBoton.getTime();
        });
      }
    }
  
    return true;
  }

  confirmarTurno(especialista:any)
  {
    if(this.botonSeleccionado && this.fechaSeleccionada){
      const [hora, minutos] = this.botonSeleccionado.split(':');

      this.fechaSeleccionada.setHours(Number(hora), Number(minutos), 0);


      const turno = {
        fecha:Timestamp.fromMillis(this.fechaSeleccionada.getTime()), 
        paciente:{ uid:this.paciente.uid, nombre:this.paciente.nombre, apellido:this.paciente.apellido }, 
        especialista:{ uid:especialista.uid, nombre:especialista.nombre, apellido:especialista.apellido },
        especialidad:this.especialidadSeleccionada,
        estado:'pendiente',
        uid:'',
        resenia:'',
        comentarioEsp:'',
        comentarioPac:'',
        detalle:null,
        datalleAdicional:null
      }

      

      this.firestoreService.subirTurnoPacienteEspecialista(turno, especialista, this.paciente);

      this.especialidadSeleccionada = '';
      this.especialistaSeleccionado  = null;
      this.fechaSeleccionada = null;
      this.botonSeleccionado = '';
    }
  }

  seleccionarPaciente(paciente:any){
    this.paciente = paciente;
  }

  backButton(){
    this.especialidadSeleccionada = '';
    this.especialistaSeleccionado  = null;
    this.fechaSeleccionada = null;
    this.botonSeleccionado = '';
    if(this.usuario.tipo == 'admin')
    {
      this.paciente = null;
    }
  }
}
