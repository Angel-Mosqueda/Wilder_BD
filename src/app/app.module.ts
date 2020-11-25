import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgxSliderModule } from '@angular-slider/ngx-slider';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
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
    ConsumibleInventarioComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgxSliderModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule
  ],
  providers: [
    Globals,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
