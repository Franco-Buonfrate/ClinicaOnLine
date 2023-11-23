import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public usuarioActual:any = null;
  private usuarioActualSubject: Subject<any> = new Subject<any>();
  
  constructor(
    private angularFireAuth:AngularFireAuth, 
    private firestore: AngularFirestore, 
    private router: Router
  ) { }

  async register(formulario:any, tipo:string)
  {
    try
    {
      this.angularFireAuth.createUserWithEmailAndPassword(formulario.mail, formulario.contrasenia).then((user) => {
        formulario = {
          ...formulario,
          uid : user.user?.uid,
          estado: 'pendiente-habilitacion',
          tipo: tipo,
          turnos: []
        }

        this.firestore.collection('usuarios').doc(user.user?.uid).set(formulario);

        if(this.usuarioActual != null)
        {
          this.angularFireAuth.signOut();
          //this.angularFireAuth.updateCurrentUser(this.usuarioActual);
          console.log('cambio de usuario');
        }
        else
        {
          this.usuarioActual = formulario; 
          this.usuarioActualSubject.next(this.usuarioActual);
        }
      });
    }
    catch(err){
      console.log(err);
    }
  }

  async login(mail:string, pass: string){
    await this.angularFireAuth.signInWithEmailAndPassword(mail, pass).then((user) => {
      this.angularFireAuth.currentUser.then((a)=> {
        const sub = this.firestore.collection('usuarios').doc(a?.uid).valueChanges().subscribe((b:any)=>{
          this.usuarioActual = b;
          this.usuarioActualSubject.next(this.usuarioActual); 
          sub.unsubscribe();
        });
      });
      this.router.navigate(['home']);
    });
  } 

  async logout(){
    this.usuarioActual = null;
    this.usuarioActualSubject.next(this.usuarioActual);
    this.angularFireAuth.signOut();
  }

  estaLogueado(): Observable<any> {
    return this.usuarioActualSubject.asObservable();
  }

  esAdmin():boolean{
  let uidUsuarioActual:any = null;
  let tipoUsuarioActual:any = null;

    new Promise((resolve) => {
    this.angularFireAuth.user.subscribe((user) => {
      console.log(user?.uid);
      resolve(user?.uid.toString());      
    });
  }).then((uid) => {
    console.log(uid);
    if(uid != null)
    {
      this.firestore.collection('admins').doc(uidUsuarioActual).valueChanges().subscribe((user: any) => {
        tipoUsuarioActual = user?.tipo;
      });
    }

  });    
  if(tipoUsuarioActual === 'admin'){
    return true;
  }
  else{
    return false;
  }


}

}
