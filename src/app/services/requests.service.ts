import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RequestsService {

  constructor(
    private http: HttpClient
  ) { }

  getOKServer() {
    return this.http.get('/get_ok/');
  }

  getEmpresas() {
    return this.http.get('/get_empresas/');
  }

  createUser(payload: any) {
    return this.http.post('/add_user/', payload);
  }

  createEmpresa(payload: any) {
    return this.http.post('/add_empresa/', payload);
  }

  createProducto(payload: any, file: File) {
    let fd = new FormData();
    fd.append('file', file, file.name);
    fd.append('datos', JSON.stringify(payload));
    return this.http.post('/add_producto/', fd);
  }

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

  login(payload: any) {
    return this.http.post('/iniciar/', payload);
  }
}
