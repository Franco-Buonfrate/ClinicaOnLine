import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { take } from 'rxjs';
import { AuthService } from 'src/app/servicios/auth.service';
import { FirestoreService } from 'src/app/servicios/firestore.service';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-pacientes',
  templateUrl: './pacientes.component.html',
  styleUrls: ['./pacientes.component.css']
})
export class PacientesComponent implements OnInit{
  usuario:any;
  uidPacientes:string[] = [];
  listaPacientes:any[] = [];
  listaTurnos:any[] = [];

  fechaActual:Date = new Date();
  listaHistorialClinico:any[] = [];
  pacienteActual:any;
  constructor(private authService:AuthService, private router:Router, private firestore:FirestoreService){

  }

  ngOnInit(): void {
    this.usuario = this.authService.usuarioActual;
    console.log(this.usuario);
    if(this.usuario?.tipo == 'especialista')
    {
      this.firestore.traerTurnosEspecialista().pipe(take(1)).subscribe((turnos:any) => {
        this.uidPacientes = [];
        turnos.forEach((turno:any) => {
          if(!this.uidPacientes.includes(turno.paciente.uid) && turno.estado == 'finalizado')
          {
            this.uidPacientes.push(turno.paciente.uid);
            this.listaTurnos.push(turno);
          }
        });

        this.firestore.traerListaPacientes(this.uidPacientes)?.pipe(take(1)).subscribe((pacientes:any) => {
          this.listaPacientes = pacientes;
        });
        
      });
    }
    else
    {
      this.router.navigate(['home']);
    }
  }

  mostrarTurnos(paciente:any)
  {
    this.listaHistorialClinico = [];
    this.pacienteActual = paciente;
    this.listaTurnos.forEach((turno:any) => {
      if(turno.paciente.uid == paciente.uid)
      {
        this.listaHistorialClinico.push(turno);
      }
    });
  }

  crearPDF()
  {
    const DATA = document.getElementById('pdf');
    const doc = new jsPDF('p', 'pt', 'a4');
    const options = {
      background: 'white',
      scale: 2,
    };
    //@ts-ignore
    html2canvas(DATA, options)
      .then((canvas: any) => {
        const img = canvas.toDataURL('image/PNG');

        const bufferX = 30;
        const bufferY = 30;
        const imgProps = (doc as any).getImageProperties(img);
        const pdfWidth = doc.internal.pageSize.getWidth() - 2 * bufferX;
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        doc.addImage(
          img,
          'PNG',
          bufferX,
          bufferY,
          pdfWidth,
          pdfHeight,
          undefined,
          'FAST'
        );
        return doc;
      })
      .then((docResult: any) => {
        docResult.save(`historialClinico-${this.pacienteActual.apellido}.${this.pacienteActual.nombre}.pdf`);
      });
  }
}
