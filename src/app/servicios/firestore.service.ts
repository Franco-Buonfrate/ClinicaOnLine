import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { timeout } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(private firestore: AngularFirestore) { }

  
  traerEspecialistas()
  {
    try{
      const ret = this.firestore.collection<any>('especialistas')
      return ret.valueChanges();
    }catch(err){
      console.log(err);
      return null;
    }
  }

  cambiarEstadoEspecialista(uid:string, nuevoEstado:string){
    let usuarioCambiado: any;
    this.firestore.collection('especialistas').doc(uid).valueChanges().subscribe((usuario:any) => {
      usuario.estado = nuevoEstado;
      usuarioCambiado = usuario;
    });
    setTimeout(() => {
      this.firestore.collection('especialistas').doc(uid).set(usuarioCambiado);
    }, 100);
  } 
}
