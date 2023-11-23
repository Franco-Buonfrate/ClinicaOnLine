import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { timeout } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(
    private firestore: AngularFirestore, 
    private authService:AuthService
  ) { }

  
  traerEspecialistas()
  {
    try{
      const ret = this.firestore.collection<any>('usuarios', ref => ref.where('tipo', '==', 'especialista'));
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

  subirTurnoPacienteEspecialista(turno:any, esp:any, pac:any)
  {
    try{
      this.firestore.collection('turnos').add(turno).then((docRef) => {
        this.firestore.collection('turnos').doc(docRef.id).update({uid:docRef.id});
        esp.turnos.push(docRef.id);
        pac.turnos.push(docRef.id);
        this.firestore.collection('usuarios').doc(esp.uid).update({turnos:esp.turnos});
        this.firestore.collection('usuarios').doc(pac.uid).update({turnos:pac.turnos});
      });
    }catch(err){
      console.log(err);
    }
  }

  traerTurnosPaciente():any{
    const usuario = this.authService.usuarioActual;
    if(usuario)
    {
      return this.firestore.collection('turnos', ref => ref.where('paciente.uid', '==', usuario.uid)).valueChanges();
    }
  }

  traerTurnosEspecialista():any{
    const usuario = this.authService.usuarioActual;
    if(usuario)
    {
      return this.firestore.collection('turnos', ref => ref.where('especialista.uid', '==', usuario.uid)).valueChanges();
    }
  }

  traerEspecialidades(){
    try
    {
      return this.firestore.collection('especialidades').valueChanges();
    }catch(err){
      console.log(err);
      return null
    }
  }

  agregarEspecialidad(esp:string){
    try
    {
      this.firestore.collection('especialidades').add({especialidad:esp});
    }
    catch(err)
    {
      console.log(err);
    }
  }

  subirHorarios(esp:any){
    try{
      if(this.authService.usuarioActual)
      {
        this.firestore.collection('usuarios').doc(this.authService.usuarioActual.uid).update({especialidades:esp});
      }
    }catch(err)
    {
      console.log(err);
    }
  }

  //Turnos

  cambiarEstadoTurno(turno:any,estado:string){
    try
    {
      this.firestore.collection('turnos').doc(turno.uid).update({estado:estado});
    }
    catch(err)
    {
      console.log(err);
    }
  }

  subirComentario(turno:any, comentario:string){
    try
    {
      this.firestore.collection('turnos').doc(turno.uid).update({comentarioPac:comentario})
    }
    catch(err)
    {
      console.log(err);
    }
  }
}
