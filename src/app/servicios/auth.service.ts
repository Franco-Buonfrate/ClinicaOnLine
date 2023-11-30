import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import Swal from 'sweetalert2';

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

  async register(formulario: any, tipo: string): Promise<boolean> {
    try {
      const user = await this.angularFireAuth.createUserWithEmailAndPassword(formulario.mail, formulario.contrasenia);
  
      user.user?.sendEmailVerification();
  
      switch (tipo) {
        case 'especialista':
          formulario = {
            ...formulario,
            uid: user.user?.uid,
            estado: 'pendiente-habilitacion',
            tipo: tipo,
            turnos: []
          };
          break;
        case 'admin':
          formulario = {
            ...formulario,
            uid: user.user?.uid,
            tipo: tipo,
          };
          break;
        case 'paciente':
          formulario = {
            ...formulario,
            uid: user.user?.uid,
            tipo: tipo,
            turnos: []
          };
          break;
      }
  
      await this.firestore.collection('usuarios').doc(user.user?.uid).set(formulario);
  
      if (this.usuarioActual != null) {
        this.angularFireAuth.signOut();
        //this.angularFireAuth.updateCurrentUser(this.usuarioActual);
        console.log('cambio de usuario');
      } else {
        this.usuarioActual = formulario;
        this.usuarioActualSubject.next(this.usuarioActual);
      }
  
      return true;
    } catch (err:any) {
      console.log(err);
      if (err.code == 'auth/email-already-in-use') {
        Swal.fire({
          title: 'Mail ya en uso',
          text: 'El mail ingresado pertenece a otro usuario!',
          icon: 'error'
        });
      } else {
        Swal.fire({
          title: err.code,
          text: err.message,
          icon: 'error'
        });
      }
      return false;
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
