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
    this.form = this._fb.group({
      categorias: this._fb.array(['', Validators.required]),
      busqueda: ['', [Validators.required]]
    });
    this.addCheckboxes();
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
    this.idProducto = null;
    this.usrinfo = this._authService.getInfo();
    if (this.productos === null) {
      this.router.navigate(['/']);
    }
    
    this._requests.obtenerProductos(null, null).subscribe(
      (success: any) => {
        if (success.exito) {
          this.productos = success.productos;
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
  }

  get f() { return this.form2.controls; }

  public buscarQuery() {
    let nombre = this.form.controls["busqueda"].value;
    let checks = this.form.controls.categorias.value;
    checks.splice(0,2);
    this._requests.obtenerProductos(checks, nombre).subscribe(
      (success: any) => {
        if (success.exito) {
          this.productos = success.productos;
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
  }

  private addCheckboxes() {
    this._requests.getCategorias().subscribe(
      (success: any) => {
        if (success.exito) {
          this.categorias = success.categorias;
        } else {
          this.categorias = null;
          alert('Error en el servidor. Mensaje: ' + success.desc);
        }
      },
      (error) => {
        this.categorias = null;
        alert('Error en el servicio, contacta con un administrador,');
      }
    )
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

  public solicitudProducto(){
    this.submitted = true;
        this._requests.createSolicitud({
          'ESTADO_SOLICITUD': 4,
          'USUARIO_ID': this.usrinfo['id'],
          'INVENTARIO_ID': this.idProductoInv
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
   
      
  }
 
}
