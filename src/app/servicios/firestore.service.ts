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

  traerPacientes()
  {
    try{
      const ret = this.firestore.collection<any>('usuarios', ref => ref.where('tipo', '==', 'paciente'));
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
      this.firestore.collection('especialidades').add({especialidad:esp, foto:'https://firebasestorage.googleapis.com/v0/b/tpclinicalabo4.appspot.com/o/especialidades%2FporDefecto.png?alt=media&token=434d19a6-8b29-4e62-9e50-c6855791fbd8'});
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

  cambiarEstadoTurno(turno:any,estado:any){
    try
    {
      this.firestore.collection('turnos').doc(turno.uid).update(estado);
    }
    catch(err)
    {
      console.log(err);
    }
  }

  subirComentario(turno:any, comentario:any){
    try
    {
      this.firestore.collection('turnos').doc(turno.uid).update(comentario)
    }
    catch(err)
    {
      console.log(err);
    }
  }

  traerTurnosPaciente(uid?:string):any{
    const usuario = this.authService.usuarioActual;
    if(usuario && !uid)
    {
      console.log('true');
      return this.firestore.collection('turnos', ref => ref.where('paciente.uid', '==', usuario.uid)).valueChanges();
    }
    else
    {
      console.log('false');
      return this.firestore.collection('turnos', ref => ref.where('paciente.uid', '==', uid)).valueChanges();
    }
  }

  traerTurnosEspecialista():any{
    const usuario = this.authService.usuarioActual;
    if(usuario)
    {
      return this.firestore.collection('turnos', ref => ref.where('especialista.uid', '==', usuario.uid)).valueChanges();
    }
  }

  traerTodosTurnos(){
    return this.firestore.collection('turnos').valueChanges();
  }

  //pacientes
  traerListaPacientes(listaUidPacientes:string[])
  {
    try{
      const ret = this.firestore.collection<any>('usuarios', ref => ref.where('uid', 'in', ['HRlo5PO8Yca4cJkNF8yaxjnwE0K2', '3HeBEcD9W4TFS4VwBdK84osWyfz1']));
      return ret.valueChanges();
    }catch(err){
      console.log(err);
      return null;
    }
  }
}
