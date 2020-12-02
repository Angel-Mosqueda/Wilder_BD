import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AcercaDeComponent } from './components/acerca-de/acerca-de.component';
import { AltaProductoComponent } from './components/alta-producto/alta-producto.component';
import { AltaUsuarioComponent } from './components/alta-usuario/alta-usuario.component';
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
import { RevisarproductoComponent } from './components/revisarproducto/revisarproducto.component';
import { ConsumibleInventarioComponent } from './components/consumible-inventario/consumible-inventario.component';
import { AuthGuardService } from './services/auth-guard.service'
import { CategoriasComponent } from './components/categorias/categorias.component';
import { ProveedoresComponent } from './components/proveedores/proveedores.component';
import { DetalleProductoComponent } from './components/detalle-producto/detalle-producto.component';
import { UbicacionComponent } from './components/ubicacion/ubicacion.component';
import { AltaConsumbibleComponent } from './components/alta-consumbible/alta-consumbible.component';
import { AltaInventarioComponent } from './components/alta-inventario/alta-inventario.component';
import { EliminarConsumibleComponent } from './components/eliminar-consumible/eliminar-consumible.component';
import { EliminarInventarioComponent } from './components/eliminar-inventario/eliminar-inventario.component';
import { ModificarConsumibleComponent } from './components/modificar-consumible/modificar-consumible.component';
import { ModificarInventarioComponent } from './components/modificar-inventario/modificar-inventario.component';
import { ReporteConsumibleComponent } from './components/reporte-consumible/reporte-consumible.component';
import { ReporteInventarioComponent } from './components/reporte-inventario/reporte-inventario.component';
import { UsuariosComponent } from './components/usuarios/usuarios.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'acerca-de', component: AcercaDeComponent },
  { path: 'usuarios', component: UsuariosComponent },
  { path: 'alta-producto', component: AltaProductoComponent },
  { path: 'alta-usuario', component: AltaUsuarioComponent },
  { path: 'baja-usuario', component: BajaUsuarioComponent },
  { path: 'consultar-usuario', component: ConsultarUsuarioComponent },
  { path: 'contacto', component: ContactoComponent },
  { path: 'eliminar-producto', component: EliminarProductoComponent },
  { path: 'inicio-sesion', component: InicioSesionComponent },
  { path: 'mantenimiento', component: MantenimientoComponent },
  { path: 'modificar-producto', component: ModificarProductoComponent },
  { path: 'modificar-usuario', component: ModificarUsuarioComponent },
  { path: 'prestamo-producto', component: PrestamoProductoComponent },
  { path: 'detalle-producto/:id', component: DetalleProductoComponent },
  { path: 'reporte-producto', component: ReporteProductoComponent },
  { path: 'solicitud', component: SolicitudComponent },
  { path: 'ubicaciones', component: UbicacionComponent },
  { path: 'revisar-producto', component: RevisarproductoComponent },
  { path: 'categorias', component: CategoriasComponent },
  { path: 'proveedores', component: ProveedoresComponent },
  { path: 'consumible-inventario', component: ConsumibleInventarioComponent, canActivate: [AuthGuardService] },
  { path: 'alta-consumible', component: AltaConsumbibleComponent },
  { path: 'alta-inventario', component: AltaInventarioComponent },
  { path: 'eliminar-consumible', component: EliminarConsumibleComponent },
  { path: 'eliminar-inventario', component: EliminarInventarioComponent },
  { path: 'modificar-consumible', component: ModificarConsumibleComponent },
  { path: 'modificar-inventario', component: ModificarInventarioComponent },
  { path: 'reporte-consumible', component: ReporteConsumibleComponent },
  { path: 'reporte-inventario', component: ReporteInventarioComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
