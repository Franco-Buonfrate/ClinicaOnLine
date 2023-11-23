import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-botones-login',
  templateUrl: './botones-login.component.html',
  styleUrls: ['./botones-login.component.css']
})
export class BotonesLoginComponent {
  @Output() botonUsuarios = new EventEmitter<any>();
  arrayDePacientes: any = [
  {mail:'paciente@paciente.com', contrasenia:'123456', nombre:'Paciente', fotos:'https://img.freepik.com/vector-premium/icono-circulo-usuario-anonimo-ilustracion-vector-estilo-plano-sombra_520826-1931.jpg'},
  {mail:'p@p.com', contrasenia:'123456', nombre:'Paciente', fotos:'https://img.freepik.com/vector-premium/icono-circulo-usuario-anonimo-ilustracion-vector-estilo-plano-sombra_520826-1931.jpg'},
  {mail:'francobuon@gmail.com', contrasenia:'123456', nombre:'Paciente', fotos:'https://img.freepik.com/vector-premium/icono-circulo-usuario-anonimo-ilustracion-vector-estilo-plano-sombra_520826-1931.jpg'}

];

arrayDeEspecialista:any = [
  {mail:'especialista@especialista.com', contrasenia:'123456', nombre:'Especialista', fotos:'https://w7.pngwing.com/pngs/857/213/png-transparent-man-avatar-user-business-avatar-icon.png'},
  {mail:'admin@admin.com', contrasenia:'123456', nombre:'Especialista', fotos:'https://w7.pngwing.com/pngs/857/213/png-transparent-man-avatar-user-business-avatar-icon.png'}
];

arrayDeAdmins:any = [
  {mail:'admin@admin.com', contrasenia:'123456', nombre:'Administrador', fotos:'https://w7.pngwing.com/pngs/857/213/png-transparent-man-avatar-user-business-avatar-icon.png'}
];
  clickListado(usuario:any)
  {
    this.botonUsuarios.emit(usuario);
  }
}
