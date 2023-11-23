import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './paginas/home/home.component';
import { LoginComponent } from './paginas/login/login.component';
import { RegisterComponent } from './paginas/register/register.component';
import { SeccionUsuariosAdminComponent } from './paginas/seccion-usuarios-admin/seccion-usuarios-admin.component';
import { AdminGuard } from './guards/admin.guard';
import { MisTurnosComponent } from './paginas/mis-turnos/mis-turnos.component';
import { SacarTurnosComponent } from './paginas/sacar-turnos/sacar-turnos.component';
import { MiPerfilComponent } from './paginas/mi-perfil/mi-perfil.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'usuarios', component: SeccionUsuariosAdminComponent },
  { path: 'misTurnos', component: MisTurnosComponent },
  { path: 'solicitarTurno', component: SacarTurnosComponent },
  { path: 'miPerfil', component: MiPerfilComponent },




];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }