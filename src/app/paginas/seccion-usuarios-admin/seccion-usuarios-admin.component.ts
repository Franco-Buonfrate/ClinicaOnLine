import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { take } from 'rxjs';
import { AuthService } from 'src/app/servicios/auth.service';
import { FirestoreService } from 'src/app/servicios/firestore.service';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
@Component({
  selector: 'app-seccion-usuarios-admin',
  templateUrl: './seccion-usuarios-admin.component.html',
  styleUrls: ['./seccion-usuarios-admin.component.css']
})
export class SeccionUsuariosAdminComponent implements OnInit{

  listaEspecialistas: any;
  listaPacientes: any;
  menuSeleccionado: number = 0;
  usuario:any = null;

  fechaActual:Date= new Date();
  listaHistorialClinico:any;
  pacienteSeleccionado:any;
  constructor(private router:Router ,private firestoreService:FirestoreService, private authService:AuthService) {

  }

  ngOnInit(): void {
    this.usuario = this.authService.usuarioActual 
    
    if(this.usuario?.tipo == 'admin')
    {
      this.firestoreService.traerEspecialistas()?.subscribe((especialistas) => {
        this.listaEspecialistas = especialistas;
      });

      this.firestoreService.traerPacientes()?.subscribe((pacientes) => {
        this.listaPacientes = pacientes;
      });
    }
    else
    {
      this.router.navigate(['home']);
    }
  }


  cambiarEstado(uid:string, estado:string){
    this.firestoreService.cambiarEstadoEspecialista(uid, estado);

  }

  onValueChange(menu:number)
  {
    this.menuSeleccionado = menu;
  }

  verHistorialClinico(paciente:any){
    this.listaHistorialClinico = [];
    this.pacienteSeleccionado = paciente;
    this.firestoreService.traerTurnosPaciente(paciente.uid).pipe(take(1)).subscribe((turnos:any) => {
      turnos.forEach((turno:any) => {
        if(turno.detalle)
        {
          this.listaHistorialClinico.push(turno);
        }
      });
      console.log(this.listaHistorialClinico);
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
        docResult.save(`historialClinico-${this.pacienteSeleccionado.apellido}.${this.pacienteSeleccionado.nombre}.pdf`);
      });
  }
}
