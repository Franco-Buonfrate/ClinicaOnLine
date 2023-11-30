import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { first } from 'rxjs';
import { AuthService } from 'src/app/servicios/auth.service';
import { FirestoreService } from 'src/app/servicios/firestore.service';
import Swal from 'sweetalert2';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
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

  listaHistorialClinico:any = [];

  fechaActual:Date = new Date();

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
      if(this.tipoUsuario == 'especialista')
      {
        this.usuario.especialidades.forEach((e:any) => {
          this.listaEspecialidades.push(e);
        });
        this.espSeleccionada = this.listaEspecialidades[0]
      }
      else if(this.tipoUsuario == 'paciente'){
        this.firestore.traerTurnosPaciente().pipe(first()).subscribe((a:any) => {
          a.forEach((turno:any) => {
            if(turno.detalle)
            {
              console.log(turno);
              this.listaHistorialClinico.push(turno);
            }
          });
        });
      }
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
        docResult.save(`historialClinico-${this.usuario.apellido}.${this.usuario.nombre}.pdf`);
      });
  }

  filtrarHistorialClinico(esp:string){

  }

  isEspecialidadSelected(esp:string){
    return true;
  }
}
