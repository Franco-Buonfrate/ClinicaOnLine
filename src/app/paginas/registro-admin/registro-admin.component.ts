import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/servicios/auth.service';

@Component({
  selector: 'app-registro-admin',
  templateUrl: './registro-admin.component.html',
  styleUrls: ['./registro-admin.component.css']
})
export class RegistroAdminComponent {
  
  tipoFormulario: boolean = true;
  formularioPaciente: FormGroup;
  formularioEspecialista: FormGroup;
  formPacienteEnviado: boolean = false;
  formEspecialistaEnviado: boolean = false;

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
  }

  cambioFormulario(tipoFormulario:boolean){
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

}
