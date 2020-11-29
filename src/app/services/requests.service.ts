import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

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

  createProducto(payload: any) {
    return this.http.post('/add_producto/', payload);
  }

  getCategorias() {
    return this.http.get('/get_categorias/');
  }

  updateCategoria(payload: any) {
    return this.http.post('/update_categoria/', payload);
  }

  login(payload: any) {
    return this.http.post('/iniciar/', payload);
  }
}
