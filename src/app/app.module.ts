import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HomeComponent } from './paginas/home/home.component';
import { LoginComponent } from './paginas/login/login.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideAuth,getAuth } from '@angular/fire/auth';
import { provideFirestore,getFirestore } from '@angular/fire/firestore';
import { provideStorage, getStorage } from '@angular/fire/storage';
import { FIREBASE_OPTIONS } from '@angular/fire/compat';
import { RegisterComponent } from './paginas/register/register.component';
import { SeccionUsuariosAdminComponent } from './paginas/seccion-usuarios-admin/seccion-usuarios-admin.component';
import { BotonesLoginComponent } from './componentes/botones-login/botones-login.component';
import { AuthService } from './servicios/auth.service';
import { MiPerfilComponent } from './paginas/mi-perfil/mi-perfil.component';
import { MisTurnosPacienteComponent } from './componentes/mis-turnos-paciente/mis-turnos-paciente.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SacarTurnosComponent } from './paginas/sacar-turnos/sacar-turnos.component';
import { MisTurnosComponent } from './paginas/mis-turnos/mis-turnos.component';

//angular Materials
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatExpansionModule} from '@angular/material/expansion';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatSelectModule} from '@angular/material/select';
import { MisTurnosEspecialistaComponent } from './componentes/mis-turnos-especialista/mis-turnos-especialista.component';
import { PacientesComponent } from './paginas/pacientes/pacientes.component';
import { TurnosComponent } from './paginas/turnos/turnos.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    SeccionUsuariosAdminComponent,
    BotonesLoginComponent,
    MisTurnosComponent,
    SacarTurnosComponent,
    MisTurnosPacienteComponent,
    MiPerfilComponent,
    MisTurnosEspecialistaComponent,
    PacientesComponent,
    TurnosComponent,
  ],
  imports: [
    BrowserModule,
    NgbModule,
    AppRoutingModule,
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatIconModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatInputModule,
    MatButtonToggleModule,
    MatSelectModule,
    BrowserModule,
    BrowserAnimationsModule
  ],
  providers: [ AuthService,   { provide: FIREBASE_OPTIONS, useValue: environment.firebaseConfig}],
  bootstrap: [AppComponent]
})
export class AppModule { }
