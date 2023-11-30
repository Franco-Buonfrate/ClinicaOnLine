import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/servicios/auth.service';
import { FirestoreService } from 'src/app/servicios/firestore.service';
import Swal from 'sweetalert2';
import { Storage, ref, uploadBytes, getDownloadURL } from '@angular/fire/storage';
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


  captcha: string = '';
  captchaEscrito:string = '';
  captchaValido:boolean = false;

  constructor(
      private formBuilder: FormBuilder, 
      private auth:AuthService,
      private router: Router,
      private firestore:FirestoreService,
      private storage:Storage
    ) {
    this.formularioPaciente = formBuilder.group({
      nombre:['',[Validators.required, Validators.maxLength(15)]],
      apellido:['',[Validators.required, Validators.maxLength(15)]],
      dni:['',[Validators.required, Validators.min(999999), Validators.max(99999999)]],
      edad:['',[Validators.required, Validators.min(18)]],
      obraSocial:['',[Validators.required, Validators.maxLength(20)]],
      mail:['',[Validators.required,Validators.email]],
      contrasenia:['',[Validators.required, Validators.minLength(6), Validators.maxLength(15)]],
      foto1:['',[Validators.required]],
      foto2:['',[Validators.required]]
    });

    this.formularioEspecialista = formBuilder.group({
      nombre:['',[Validators.required, Validators.maxLength(15)]],
      apellido:['',[Validators.required, Validators.maxLength(15)]],
      dni:['',[Validators.required, Validators.min(999999), Validators.max(99999999)]],
      edad:['',[Validators.required, Validators.min(18)]],
      especialidades:['',[Validators.required]],
      mail:['',[Validators.required,Validators.email]],
      contrasenia:['',[Validators.required, Validators.minLength(6), Validators.maxLength(15)]],
      foto:['',[Validators.required]]
    });

    this.formularioAdministrador = formBuilder.group({
      nombre:['',[Validators.required, Validators.maxLength(15)]],
      apellido:['',[Validators.required, Validators.maxLength(15)]],
      dni:['',[Validators.required, Validators.min(999999), Validators.max(99999999)]],
      edad:['',[Validators.required, Validators.min(18)]],
      mail:['',[Validators.required,Validators.email]],
      contrasenia:['',[Validators.required , Validators.minLength(6), Validators.maxLength(15)]],
      foto:['',[Validators.required]]
    });
  }

  ngOnInit(): void {
    this.firestore.traerEspecialidades()?.subscribe((esps) => {
      this.especialidades = [];
      esps.forEach((e:any) => {
        this.especialidades.push(e.especialidad);
      });
    });

    this.captcha = this.generarStringRandom();
  }

  cambioFormulario(tipoFormulario:number){
    this.tipoFormulario = tipoFormulario;
  }
  
  async onPacienteSubmit(){
    this.formPacienteEnviado = true;
    this.validarCaptcha();
    if(this.formularioPaciente.valid && this.captchaValido)
    {
      this.subirImagen('fotoPaciente1','pacientes').then((a) =>
      {
        this.formularioPaciente.value.foto1 = a;
        this.subirImagen('fotoPaciente2','pacientes').then(async (b) => {
          this.formularioPaciente.value.foto2 = b;
          if(await this.auth.register(this.formularioPaciente.value, 'paciente'))
          {
            this.formPacienteEnviado = false;
            this.formularioPaciente.reset();
            this.alertaFormularioEnviado();
          }
        });
      });
    }
    else{
      this.alertaFormularioInvalido();
    }
  }

  async onEspecialistaSubmit(){
    this.formEspecialistaEnviado = true;
    let espObj:any = [];
    this.formularioEspecialista.value.especialidades.forEach((e:any) => {
      espObj.push({tipo:e, dias:[]}) //agrega array donde se setean los dias
    });
    this.formularioEspecialista.value.especialidades = espObj;
    if(this.formularioEspecialista.valid && this.captchaValido)
    {
      await this.subirImagen('fotoEspecialista', 'especialistas').then(async (a) => {
        this.formularioEspecialista.value.foto = a;
        if(await this.auth.register(this.formularioEspecialista.value, 'especialista'))
        {
          this.formEspecialistaEnviado = false;
          this.formularioEspecialista.reset();
          this.alertaFormularioEnviado();
        }
      });
    }else{
      this.alertaFormularioInvalido();
    }
  }

  async onAdministradorSubmit(){
    this.formAdministradorEnviado = true;
    if(this.formularioAdministrador.valid)
    { 
      await this.subirImagen('fotoAdmin', 'admins').then(async (a) => {
        this.formularioAdministrador.value.foto = a;
        if(await this.auth.register(this.formularioAdministrador.value, 'admin'))
        {
          this.formAdministradorEnviado = false;
          this.formularioAdministrador.reset();
          this.alertaFormularioEnviado();
        }
      });
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

  async subirImagen(idElementoHtml:string, dni:string)
  {
    const fileInput = document.getElementById(idElementoHtml) as HTMLInputElement
    const file = fileInput.files ? fileInput.files[0] : null;
    if(file)
    {
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
      const day = currentDate.getDate().toString().padStart(2, '0');
      const hours = currentDate.getHours().toString().padStart(2, '0');
      const minutes = currentDate.getMinutes().toString().padStart(2, '0');
      const seconds = currentDate.getSeconds().toString().padStart(2, '0');

      const fileName = `img${idElementoHtml}_${year}${month}${day}_${hours}${minutes}${seconds}`;
      const imgRef = ref(this.storage, `usuarios/${dni}/${fileName}`);
      await uploadBytes(imgRef, file);

      const url = await getDownloadURL(imgRef);
      return url;
    }
    else{
      return null;
    }
  }

  generarStringRandom()
  {
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz';
    let result1 = '';
    const charactersLength = characters.length;
    for (let i = 0; i < 6; i++) {
      result1 += characters.charAt(
        Math.floor(Math.random() * charactersLength)
      );
    }
    return result1;
  }

  validarCaptcha() {
    if (this.captchaEscrito == this.captcha) {
      this.captchaValido = true;
    } else {
      this.captchaValido = false;
    }
  }


}
