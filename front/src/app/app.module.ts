import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgxSliderModule } from '@angular-slider/ngx-slider';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AgmCoreModule } from '@agm/core';
import { HomeComponent } from './components/home/home.component';
import { FooterComponent } from './components/footer/footer.component';
import { AltaProductoComponent } from './components/alta-producto/alta-producto.component';
import { EliminarProductoComponent } from './components/eliminar-producto/eliminar-producto.component';
import { ModificarProductoComponent } from './components/modificar-producto/modificar-producto.component';
import { ReporteProductoComponent } from './components/reporte-producto/reporte-producto.component';
import { PrestamoProductoComponent } from './components/prestamo-producto/prestamo-producto.component';
import { ContactoComponent } from './components/contacto/contacto.component';
import { AcercaDeComponent } from './components/acerca-de/acerca-de.component';
import { InicioSesionComponent } from './components/inicio-sesion/inicio-sesion.component';
import { SolicitudComponent } from './components/solicitud/solicitud.component';
import { MantenimientoComponent } from './components/mantenimiento/mantenimiento.component';
import { AltaUsuarioComponent } from './components/alta-usuario/alta-usuario.component';
import { BajaUsuarioComponent } from './components/baja-usuario/baja-usuario.component';
import { ConsultarUsuarioComponent } from './components/consultar-usuario/consultar-usuario.component';
import { ModificarUsuarioComponent } from './components/modificar-usuario/modificar-usuario.component';
import { RevisarproductoComponent } from './components/revisarproducto/revisarproducto.component';
import { ConsumibleInventarioComponent } from './components/consumible-inventario/consumible-inventario.component';
import { Globals } from './globals/globals';


import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
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
import { ReporteGraficasComponent } from './components/reporte-graficas/reporte-graficas.component';
import { MantenimientoProductoComponent } from './components/mantenimiento-producto/mantenimiento-producto.component';
import { IncidenciasComponent } from './components/incidencias/incidencias.component';
import { ReportePrestamosComponent } from './components/reporte-prestamos/reporte-prestamos.component';
import { ReporteSolicitudesComponent } from './components/reporte-solicitudes/reporte-solicitudes.component';
import { ReporteMantenimientoComponent } from './components/reporte-mantenimiento/reporte-mantenimiento.component';
import { AuthService } from './services/auth.service';
import { RequestsService } from './services/requests.service';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    FooterComponent,
    AltaProductoComponent,
    EliminarProductoComponent,
    ModificarProductoComponent,
    ReporteProductoComponent,
    PrestamoProductoComponent,
    ContactoComponent,
    AcercaDeComponent,
    InicioSesionComponent,
    SolicitudComponent,
    MantenimientoComponent,
    AltaUsuarioComponent,
    BajaUsuarioComponent,
    ConsultarUsuarioComponent,
    ModificarUsuarioComponent,
    RevisarproductoComponent,
    ConsumibleInventarioComponent,
    CategoriasComponent,
    ProveedoresComponent,
    DetalleProductoComponent,
    UbicacionComponent,
    AltaConsumbibleComponent,
    AltaInventarioComponent,
    EliminarConsumibleComponent,
    EliminarInventarioComponent,
    ModificarConsumibleComponent,
    ModificarInventarioComponent,
    ReporteConsumibleComponent,
    ReporteInventarioComponent,
    UsuariosComponent,
    MantenimientoProductoComponent,
    IncidenciasComponent,
    ReportePrestamosComponent,
    ReporteSolicitudesComponent,
    ReporteMantenimientoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgxSliderModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyA5XCX6GS2djp8PyY6XY8z7VeziV1DxyQU'
    })
  ],
  providers: [
    Globals,
    AuthService,
    RequestsService,
    { provide: Window, useValue: window }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
