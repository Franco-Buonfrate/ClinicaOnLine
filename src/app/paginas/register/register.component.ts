import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/servicios/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  @Input() Admin: boolean = false;
  tipoFormulario: number = 0;

  formularioPaciente: FormGroup;
  formularioEspecialista: FormGroup;
  formularioAdministrador: FormGroup;

  formPacienteEnviado: boolean = false;
  formEspecialistaEnviado: boolean = false;
  formAdministradorEnviado: boolean = false;


  constructor(private formBuilder: FormBuilder, private auth:AuthService) {
    this.formularioPaciente = formBuilder.group({
      nombre:['',[Validators.required]],
      apellido:['',[Validators.required]],
      dni:['',[Validators.required]],
      edad:['',[Validators.required]],
      obraSocial:['',[Validators.required]],
      mail:['',[Validators.required,Validators.email]],
      contrasenia:['',[Validators.required]],
      foto1:['',[Validators.required]],
      foto2:['',[Validators.required]]
    });

    this.formularioEspecialista = formBuilder.group({
      nombre:['',[Validators.required]],
      apellido:['',[Validators.required]],
      dni:['',[Validators.required]],
      edad:['',[Validators.required]],
      especialidad:['',[Validators.required]],
      mail:['',[Validators.required,Validators.email]],
      contrasenia:['',[Validators.required]],
      foto:['',[Validators.required]]
    });

    this.formularioAdministrador = formBuilder.group({
      nombre:['',[Validators.required]],
      apellido:['',[Validators.required]],
      dni:['',[Validators.required]],
      edad:['',[Validators.required]],
      mail:['',[Validators.required,Validators.email]],
      contrasenia:['',[Validators.required]],
      foto:['',[Validators.required]]
    });
  }

  cambioFormulario(tipoFormulario:number){
    this.tipoFormulario = tipoFormulario;
  }
  
  onPacienteSubmit(){
    this.formPacienteEnviado = true;
    if(this.formularioPaciente.valid)
    {
      this.auth.register(this.formularioPaciente.value, 'pacientes');
      this.formPacienteEnviado = false;
      this.formularioPaciente.reset();
    }
  }

  onEspecialistaSubmit(){
    this.formEspecialistaEnviado = true;
    if(this.formularioEspecialista.valid)
    {
      this.auth.register(this.formularioEspecialista.value, 'especialistas');
      this.formEspecialistaEnviado = false;
      this.formularioEspecialista.reset();
    }
  }

  onAdministradorSubmit(){
    this.formAdministradorEnviado = true;
    if(this.formularioAdministrador.valid)
    {
      this.auth.register(this.formularioAdministrador.value, 'admins');
      this.formAdministradorEnviado = false;
      this.formularioAdministrador.reset();
    }
  }
}
