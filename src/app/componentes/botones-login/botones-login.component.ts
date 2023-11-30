import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-botones-login',
  templateUrl: './botones-login.component.html',
  styleUrls: ['./botones-login.component.css']
})
export class BotonesLoginComponent {
  @Output() botonUsuarios = new EventEmitter<any>();
  arrayDePacientes: any = [
  {mail:'paciente@paciente.com', contrasenia:'123456', nombre:'Paciente', fotos:'../../../assets/paciente.png'},
  {mail:'p@p.com', contrasenia:'123456', nombre:'Paciente', fotos:'../../../assets/paciente.png'},
  {mail:'francobuon@gmail.com', contrasenia:'123456', nombre:'Paciente', fotos:'../../../assets/paciente.png'}

];

arrayDeEspecialista:any = [
  {mail:'especialista@especialista.com', contrasenia:'123456', nombre:'Especialista', fotos:'../../../assets/medico.png'},
  {mail:'e@e.com', contrasenia:'123456', nombre:'Especialista', fotos:'../../../assets/medico.png'}
];

arrayDeAdmins:any = [
  {mail:'admin@admin.com', contrasenia:'123456', nombre:'Administrador', fotos:'../../../assets/admin.png'}
];
  clickListado(usuario:any)
  {
    this.botonUsuarios.emit(usuario);
  }
}
