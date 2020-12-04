import { Component, OnInit } from '@angular/core';
import { Options } from '@angular-slider/ngx-slider';
import { Globals } from '../../globals/globals';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { RequestsService } from 'src/app/services/requests.service';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-solicitud',
  templateUrl: './solicitud.component.html',
  styleUrls: ['./solicitud.component.css']
})
export class SolicitudComponent implements OnInit {
  public solicitudes: any;

  globals: Globals;
  filter: any = {};
  public categorias: any;
  public form: FormGroup
  public form2: FormGroup
  submitted = false;
  public productos: any;
  public productosSinSolicitud: any;
  public inventario: any;
  public inventarioFiltrado: any;

  idProducto: number; 
  idProductoInv: number;
  idInv: number;
  valEstado: number;

  usrinfo = null;
  _authService = new AuthService;

  constructor(
    globals: Globals,
    private router: Router,
    private _requests: RequestsService,
    private _fb: FormBuilder
  ) {
    this.globals = globals;
    this.form = this._fb.group({
      categorias: this._fb.array(['', Validators.required]),
      busqueda: ['', [Validators.required]]
    });
  }

  onCheckboxChange(e) {
    const checkArray: FormArray = this.form.get('categorias') as FormArray;

    if (e.target.checked) {
      checkArray.push(new FormControl(e.target.value));
    } else {
      let i: number = 0;
      checkArray.controls.forEach((item: FormControl) => {
        if (item.value == e.target.value) {
          checkArray.removeAt(i);
          return;
        }
        i++;
      });
    }
  }

  ngOnInit(): void {
    this.valEstado = 4;
    this.idProducto = null;
    this.usrinfo = this._authService.getInfo();
    if (this.productos === null) {
      this.router.navigate(['/']);
    }

    this._requests.obtenerProductos(null, null).subscribe(
      (success: any) => {
        if (success.exito) {
          this.productos = success.productos;
          console.log(this.productos);
        } else {
          this.productos = null;
          alert('Error en el servidor. Mensaje: ' + success.desc);
        }
      },
      (error) => {
        this.productos = null;
        alert('Error en el servicio, contacta con un administrador,');
      }
    );
    
    this._requests.getInventarioDisponible().subscribe(
      (response: any) => {
        this.inventarioFiltrado = response.productos;
        console.log(this.inventarioFiltrado);
      },
      (error) => {
        alert("Error pidiendo las empresas");
      }
    );

  }


  public obtenerID(id_producto: number, index:number){
      this.idProducto = id_producto;
      this._requests.getProductoInfo(this.idProducto).subscribe(
        (success: any) => {
          if (success.exito) {
            this.inventario = success.inventario;
            this.idProductoInv = this.inventario[0].id;
            this.idInv = this.inventarioFiltrado[index]['inv_id'];
            console.log(this.idInv);
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

  public solicitudProducto(){
    this.submitted = true;
        this._requests.createSolicitud({
          'ESTADO_SOLICITUD': 4,
          'USUARIO_ID': this.usrinfo['id'],
          'INVENTARIO_ID': this.idInv
        }).subscribe(
          (success: any) => {
            if (success.exito) {
              alert("Solicitud registrada exitosamente.");
              this.router.navigate(['/']);
            } else {
              alert('error en el registro, mensaje del server: ' + success.desc);
            }
          },
          (error) => {
            alert("Error en el servidor.")
          }
        );


        this._requests.updateInvEst(this.idInv, this.valEstado).subscribe(
          (success: any) => {
            if (success.exito) {
              console.log(this.idProductoInv + "  " + this.valEstado )
              this.router.navigate(['/']);
            } else {
              alert('error en el registro, mensaje del server: ' + success.desc);
            }
          },
          (error) => {
            alert("Error en el servidor.")
          }
        );



        
   
      
  }
 
}
