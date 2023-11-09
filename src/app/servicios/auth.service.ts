import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { collection } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private angularFireAuth:AngularFireAuth, private firestore: AngularFirestore, private router: Router) { }

  async register(formulario:any, coleccion:string)
  {
    try
    {
      let uidUsuarioActual:any = null;

      this.angularFireAuth.user.subscribe((user) => {
        uidUsuarioActual = user?.uid.toString();
      });
    
      await this.angularFireAuth.createUserWithEmailAndPassword(formulario.mail, formulario.contrasenia).then((user) => {
        formulario = {
          ...formulario,
          uid : user.user?.uid,
          estado: 'pendiente-habilitacion',
          tipo: coleccion
        }
        this.firestore.collection(coleccion).doc(user.user?.uid).set(formulario);


      });

      console.log(uidUsuarioActual);
      
      if(uidUsuarioActual != null)
      {
        this.angularFireAuth.signOut();
        this.firestore.collection('admins').doc(uidUsuarioActual).valueChanges().subscribe((user:any) => {
          this.angularFireAuth.signInWithEmailAndPassword(user?.mail, user?.contrasenia);
        });

      }
    }
    catch(err){
      console.log(err);
    }
  }

  async login(mail:string, pass: string){
    await this.angularFireAuth.signInWithEmailAndPassword(mail, pass).then((user) => {
      this.router.navigate(['home']);
    });
  } 

  esAdmin(): boolean{
    let uidUsuarioActual:any = null;
    let tipoUsuarioActual:any = null;
    this.angularFireAuth.user.subscribe((user) => {
      uidUsuarioActual = user?.uid.toString();
    });

    if(uidUsuarioActual != null)
    {
      this.firestore.collection('admins').doc(uidUsuarioActual).valueChanges().subscribe((user:any) => {
        tipoUsuarioActual = user?.tipo;
      });
    }

    if(tipoUsuarioActual === 'administrador'){
      return true;
    }
    else{
      return false;
    }
  }

}
