import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RequestsService {

  constructor(
    private http: HttpClient
  ) { }

  cerrarSesion() {
    return this.http.get('/cerrar_sesion/');
  }

  getOKServer() {
    return this.http.get('/get_ok/');
  }

  createUser(payload: any, file?: File) {
    if (file) {
      let fd = new FormData();
      fd.append('file', file, file.name);
      fd.append('datos', JSON.stringify(payload));
      return this.http.post('/add_user/', fd);
    } else {
      return this.http.post('/add_user/', payload);
    }
  }

  ////////////////// CRUD Producto
  createProducto(payload: any, file: File) {
    let fd = new FormData();
    fd.append('file', file, file.name);
    fd.append('datos', JSON.stringify(payload));
    return this.http.post('/add_producto/', fd);
  }

  //Alta solicitud inventario
  createSolicitud(payload: any) {
    return this.http.post('/add_solicitud/', payload);
  }

  //Agregar campos restantes de solicitud parte 2
  createSolicitudP2(usr_id: any, sol_id: any) {
    return this.http.get('/add_solicitudP2/' + usr_id + '+' + sol_id);
  }

  createSolicitudP3(obs: any, sol_id: any) {
    return this.http.get('/add_solicitudP3/' + obs + '+' + sol_id);
  }


  //Obtener Solicitud Inventario
  getSolicitud(){
    return this.http.get('/get_solicitudes/');
  }

  //Obtener Inventario Disponible
  getInventarioDisponible(){
    return this.http.get('/get_prod_sin_sol/');
  }

  getProductoInfo(id_producto: any) {
    return this.http.get('/get_producto/' + id_producto);
  }

  updateInvEst(id_inventario: any, val_estado: any) {
    return this.http.get('/upp_estado/' + id_inventario + '+' + val_estado);
  }


  //Insertar prestamo
  createPrestamo(payload: any) {
    return this.http.post('/add_prestamo/', payload);
  }

  getPrestamos(){
    return this.http.get('/get_prestamos/');
  }


  ///////////// CRUD Categorias
  getCategorias() {
    return this.http.get('/get_categorias/');
  }

  updateCategoria(payload: any) {
    return this.http.post('/update_categoria/', payload);
  }

  crearCategoria(payload: any) {
    return this.http.post('/create_categoria/', payload)
  }

  eliminarCategoria(id: any) {
    return this.http.get('/delete_categoria/' + id);
  }

  ///////////// CRUD Proveedores
  getProveedores() {
    return this.http.get('/get_proveedores/');
  }

  updateProveedor(payload: any) {
    return this.http.post('/update_proveedor/', payload);
  }

  crearProveedor(payload: any) {
    return this.http.post('/create_proveedor/', payload)
  }

  eliminarProveedor(id: any) {
    return this.http.get('/delete_proveedor/' + id);
  }

  ///////////// CRUD Ubicaciones
  getUbicaciones() {
    return this.http.get('/get_ubicaciones/');
  }

  updateUbicacion(payload: any) {
    return this.http.post('/update_ubicacion/', payload);
  }

  crearUbicacion(payload: any) {
    return this.http.post('/create_ubicacion/', payload)
  }

  eliminarUbicacion(id: any) {
    return this.http.get('/delete_ubicacion/' + id);
  }

  ///////////// CRUD Usuarios
  getUsuarios() {
    return this.http.get('/get_usuarios/');
  }

  updateUsuario(payload: any) {
    return this.http.post('/update_usuario/', payload);
  }

  crearUsuario(payload: any) {
    return this.http.post('/create_usuario/', payload)
  }

  eliminarUsuario(id: any) {
    return this.http.get('/delete_usuario/' + id);
  }

  ///////////// CRUD Inventario
  createInventario(payload: any, file: File, id_producto: Number) {
    let fd = new FormData();
    fd.append('file', file, file.name);
    fd.append('datos', JSON.stringify(payload));
    return this.http.post('/add_inventario/' + id_producto, fd);
  }

  /////////// CRUD Mantenimiento
  getMantenimientos(id: Number) {
    return this.http.get('/get_mantenimientos/' + id);
  }

  updateMantenimiento(payload: any, id: Number) {
    return this.http.post('/update_mantenimiento/' + id, payload);
  }

  crearMantenimiento(payload: any, id: any) {
    return this.http.post('/create_mantenimiento/' + id, payload)
  }

  eliminarMantenimiento(id: any, id_prod: Number) {
    return this.http.get('/delete_mantenimiento/' + id + "/" + id_prod);
  }

  ///////////// CRUD Consumibles
  getConsumibles() {
    return this.http.get('/get_consumibles/');
  }

  updateConsumible(payload: any) {
    return this.http.post('/update_consumible/', payload);
  }

  crearConsumible(payload: any) {
    return this.http.post('/create_consumible/', payload)
  }

  eliminarConsumible(id: any) {
    return this.http.get('/delete_consumible/' + id);
  }

  ///////////// Filtro Inventario Proveedores
  obtenerProductos(checks: any, filtro: any) {
    console.log(checks);
    console.log(filtro);
    let url = "/filtro_productos";
    let unico = true;
    if (checks || filtro)
      url += '?';
    if (checks)
      if (checks.length > 0) {
        url += ("categorias=" + checks.toString());
        unico = false;
      }
    if (filtro)
      if (filtro.length > 0) {
        url += (!unico ? "&filtro=" + filtro : "filtro=" + filtro);
      }
    return this.http.get(url);
  }

  login(payload: any) {
    return this.http.post('/iniciar/', payload);
  }

  ////////////////// CRUD Empresa
  crearEmpresa(payload: any) {
    return this.http.post('/create_empresa/', payload);
  }

  getEmpresas() {
    return this.http.get('/get_empresas/');
  }

  ///////////////////// Reportes
  getConteos(tiempo: any) {
    return this.http.get('/reportes/' + tiempo);
  }
}
