import { Component, OnInit } from '@angular/core';
import { Options } from '@angular-slider/ngx-slider';
import { Globals } from '../../globals/globals';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { RequestsService } from 'src/app/services/requests.service';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-prestamo-producto',
  templateUrl: './prestamo-producto.component.html',
  styleUrls: ['./prestamo-producto.component.css']
})
export class PrestamoProductoComponent implements OnInit {
  public solicitudes: any;



  globals: Globals;
  filter: any = {};
  public categorias: any;
  public form: FormGroup
  public form2: FormGroup
  submitted = false;
  public productos: any;
  inventario: any;

  idProducto: number; 
  idProductoInv: number;

  usrinfo = null;
  _authService = new AuthService;

  constructor(
    globals: Globals,
    private router: Router,
    private _requests: RequestsService,
    private _fb: FormBuilder
  ) {
    this.globals = globals;
  }

  ngOnInit(): void {

    this._requests.getSolicitud().subscribe(
      (response: any) => {
        this.solicitudes = response.solicitud;
        console.log(this.solicitudes);
      },
      (error) => {
        alert("Error pidiendo las empresas");
      }
    );

  }


  public obtenerID(id_producto: number){
      this.idProducto = id_producto;
      this._requests.getProductoInfo(this.idProducto).subscribe(
        (success: any) => {
          if (success.exito) {
            this.inventario = success.inventario;
            console.log(this.inventario);
            this.idProductoInv = this.inventario[0].id;
            console.log("id inv " + this.idProductoInv);
          } else {
            this.categorias = null;
            alert('Error en el servidor. Mensaje: ' + success.desc);
          }
        },
        (error) => {
          this.categorias = null;
          alert('Error en el servicio, contacta con un administrador.');
        }
      )
  }

 

}
