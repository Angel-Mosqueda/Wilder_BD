import { Component, OnInit } from '@angular/core';
import { Globals } from '../../globals/globals';
import { Router } from '@angular/router';
import { Options } from '@angular-slider/ngx-slider';
import { RequestsService } from 'src/app/services/requests.service';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-reporte-consumible',
  templateUrl: './reporte-consumible.component.html',
  styleUrls: ['./reporte-consumible.component.css']
})
export class ReporteConsumibleComponent implements OnInit {

  globals: Globals;
  filter: any = {};
  public form: FormGroup
  public consumibles: any;

  constructor(
    globals: Globals,
    private router: Router,
    private _requests: RequestsService,
    private _fb: FormBuilder
  ) {
    this.globals = globals;
    this.form = this._fb.group({
      busqueda: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    if (this.globals.producto === null) {
      this.router.navigate(['/']);
    }
    this._requests.obtenerConsumibles(null).subscribe(
      (success: any) => {
        if (success.exito) {
          this.consumibles = success.consumibles;
        } else {
          this.consumibles = null;
          alert('Error en el servidor. Mensaje: ' + success.desc);
        }
      },
      (error) => {
        this.consumibles = null;
        alert('Error en el servicio, contacta con un administrador,');
      }
    );
  }

  public buscarQuery() {
    let nombre = this.form.controls["busqueda"].value;
    this._requests.obtenerConsumibles(nombre).subscribe(
      (success: any) => {
        if (success.exito) {
          this.consumibles = success.consumibles;
        } else {
          this.consumibles = null;
          alert('Error en el servidor. Mensaje: ' + success.desc);
        }
      },
      (error) => {
        this.consumibles = null;
        alert('Error en el servicio, contacta con un administrador,');
      }
    );
  }
}
