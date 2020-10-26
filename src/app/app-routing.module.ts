import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AcercaDeComponent } from './components/acerca-de/acerca-de.component';
import { AltaProductoComponent } from './components/alta-producto/alta-producto.component';
import { BajaUsuarioComponent } from './components/baja-usuario/baja-usuario.component';
import { ConsultarUsuarioComponent } from './components/consultar-usuario/consultar-usuario.component';
import { ContactoComponent } from './components/contacto/contacto.component';
import { EliminarProductoComponent } from './components/eliminar-producto/eliminar-producto.component';
import { HomeComponent } from './components/home/home.component';
import { InicioSesionComponent } from './components/inicio-sesion/inicio-sesion.component';
import { MantenimientoComponent } from './components/mantenimiento/mantenimiento.component';
import { ModificarProductoComponent } from './components/modificar-producto/modificar-producto.component';
import { ModificarUsuarioComponent } from './components/modificar-usuario/modificar-usuario.component';
import { PrestamoProductoComponent } from './components/prestamo-producto/prestamo-producto.component';
import { ReporteProductoComponent } from './components/reporte-producto/reporte-producto.component';
import { SolicitudComponent } from './components/solicitud/solicitud.component';

const routes: Routes = [
  { path: '',component:HomeComponent},
  { path:'acerca-de',component:AcercaDeComponent},
  { path: 'alta-producto',component:AltaProductoComponent},
  { path: 'baja-usuario',component:BajaUsuarioComponent},
  { path: 'consultar-usuario',component:ConsultarUsuarioComponent},
  { path: 'contacto',component:ContactoComponent},
  { path: 'eliminar-producto',component:EliminarProductoComponent},
  { path: 'inicio-sesion',component:InicioSesionComponent},
  { path: 'mantenimiento',component:MantenimientoComponent},
  { path: 'modificar-producto',component:ModificarProductoComponent},
  { path: 'modificar-usuario',component:ModificarUsuarioComponent},
  { path: 'prestamo-producto',component:PrestamoProductoComponent},
  { path: 'reporte-producto',component:ReporteProductoComponent},
  { path: 'solicitud',component:SolicitudComponent},
  { path: '**', redirectTo:'',pathMatch:'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
