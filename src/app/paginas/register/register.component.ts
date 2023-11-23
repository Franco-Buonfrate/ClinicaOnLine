import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/servicios/auth.service';
import { FirestoreService } from 'src/app/servicios/firestore.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit{
  @Input() Admin: boolean = false;
  tipoFormulario: number = -1;

  formularioPaciente: FormGroup;
  formularioEspecialista: FormGroup;
  formularioAdministrador: FormGroup;

  formPacienteEnviado: boolean = false;
  formEspecialistaEnviado: boolean = false;
  formAdministradorEnviado: boolean = false;

  especialidades:string[] = ['Cardiologia','Neurologia','Dermatologia',' ','Analisis Clinico'];
  espSubir:string = 'hola';

  constructor(
      private formBuilder: FormBuilder, 
      private auth:AuthService,
      private router: Router,
      private firestore:FirestoreService
    ) {
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
      especialidades:['',[Validators.required]],
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

  ngOnInit(): void {
    this.firestore.traerEspecialidades()?.subscribe((esps) => {
      this.especialidades = [];
      esps.forEach((e:any) => {
        this.especialidades.push(e.especialidad);
      });
      console.log(this.especialidades);
    });
  }

  cambioFormulario(tipoFormulario:number){
    this.tipoFormulario = tipoFormulario;
  }
  
  onPacienteSubmit(){
    this.formPacienteEnviado = true;
    if(this.formularioPaciente.valid)
    {
      this.auth.register(this.formularioPaciente.value, 'paciente');
      this.formPacienteEnviado = false;
      this.formularioPaciente.reset();
      this.alertaFormularioEnviado();
    }
    else{
      this.alertaFormularioInvalido();
    }
  }

  onEspecialistaSubmit(){
    this.formEspecialistaEnviado = true;
    let espObj:any = [];
    this.formularioEspecialista.value.especialidades.forEach((e:any) => {
      espObj.push({tipo:e, dias:[]}) //agrega array donde se setean los dias
    });
    this.formularioEspecialista.value.especialidades = espObj;
    console.log(this.formularioEspecialista.value.especialidades );
    if(this.formularioEspecialista.valid)
    {
      this.auth.register(this.formularioEspecialista.value, 'especialista');
      this.formEspecialistaEnviado = false;
      this.formularioEspecialista.reset();
      this.alertaFormularioEnviado();
    }else{
      this.alertaFormularioInvalido();
    }
  }

  onAdministradorSubmit(){
    this.formAdministradorEnviado = true;
    if(this.formularioAdministrador.valid)
    {
      this.auth.register(this.formularioAdministrador.value, 'admin');
      this.formAdministradorEnviado = false;
      this.formularioAdministrador.reset();
      this.alertaFormularioEnviado();
    }else{
      this.alertaFormularioInvalido();
    }
  }

  alertaFormularioInvalido(){
    const Toast = Swal.mixin({
      toast: true,
      position: "top",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      }
    });
    Toast.fire({
      icon: "error",
      title: "Campos invalidos"
    });
  }

  alertaFormularioEnviado(){
    Swal.fire({
      title: "Registro completado",
      text: "Nuevo usuario registrado con exito!",
      icon: "success"
    });

    if(!this.Admin)
    {
      this.router.navigate(['home']);
    }
  }

  agregarEspecialidad(valorInput: string) {
    if(valorInput)
    {
      this.firestore.agregarEspecialidad(valorInput);
      const Toast = Swal.mixin({
        toast: true,
        position: "top",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        }
      });
      Toast.fire({
        icon: "success",
        title: `Se agrego la especialidad: ${valorInput}`
      });

    }
  }
}
