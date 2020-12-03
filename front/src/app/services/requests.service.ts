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

  getProductoInfo(id_producto: any) {
    return this.http.get('/get_producto/' + id_producto);
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
  createMantenimiento(playload: any, id_producto:Number){
    return this.http.post('/add_mantenimiento/' + id_producto);
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
}
