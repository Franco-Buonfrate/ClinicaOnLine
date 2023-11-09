import { Component, OnInit } from '@angular/core';
import { FirestoreService } from 'src/app/servicios/firestore.service';

@Component({
  selector: 'app-seccion-usuarios-admin',
  templateUrl: './seccion-usuarios-admin.component.html',
  styleUrls: ['./seccion-usuarios-admin.component.css']
})
export class SeccionUsuariosAdminComponent implements OnInit{

  listaEspecialistas: any;
  menuSeleccionado: number = 0;

  constructor(private firestoreService:FirestoreService) {

  }

  ngOnInit(): void {
    this.firestoreService.traerEspecialistas()?.subscribe((especialistas) => {
      this.listaEspecialistas = especialistas;
    });
  }


  cambiarEstado(uid:string, estado:string){
    this.firestoreService.cambiarEstadoEspecialista(uid, estado);

  }

  onValueChange(menu:number)
  {
    this.menuSeleccionado = menu;
  }
}
