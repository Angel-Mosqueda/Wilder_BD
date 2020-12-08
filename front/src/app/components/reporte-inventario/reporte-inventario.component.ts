import { Component, OnInit } from '@angular/core';
import { Globals } from '../../globals/globals';
import { Router } from '@angular/router';
import { Options } from '@angular-slider/ngx-slider';
import { RequestsService } from 'src/app/services/requests.service';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-reporte-inventario',
  templateUrl: './reporte-inventario.component.html',
  styleUrls: ['./reporte-inventario.component.css']
})
export class ReporteInventarioComponent implements OnInit {

  globals: Globals;
  filter: any = {};
  public categorias: any;
  public form: FormGroup
  public productos: any;

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
    if (this.globals.producto === null) {
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

  eliminarProducto(pid) {
    this._requests.eliminarProducto(pid).subscribe(
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

}
