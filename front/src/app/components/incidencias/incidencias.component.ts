import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Globals } from 'src/app/globals/globals';
import { AuthService } from 'src/app/services/auth.service';
import { RequestsService } from 'src/app/services/requests.service';


@Component({
  selector: 'app-incidencias',
  templateUrl: './incidencias.component.html',
  styleUrls: ['./incidencias.component.css']
})

export class IncidenciasComponent implements OnInit {
  incidencias: any;
  editable: any;
  id: any;
  producto_info: any;
  create: boolean = false;
  formulario: FormGroup;
  fecha: Date = new Date();
  submitted: boolean = false;
  globals: Globals;
  usrinfo: any;

  constructor(
    private route: ActivatedRoute,
    private _requests: RequestsService,
    private _fb: FormBuilder,
    globals: Globals,
    private _as: AuthService,
    public window: Window
  ) {
    this.globals = globals;
    this.usrinfo = this._as.getInfo();
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    console.log(this.id);
    var peticion;
    if (this.id)
      peticion = this._requests.getIncidencias(this.id);
    else
      peticion = this._requests.getIncidencias();


    peticion.subscribe(
      (success: any) => {
        if (success.exito) {
          this.incidencias = success.incidencias;
          this.editable = this.incidencias.map(a => false);
        } else {
          alert('Error en el servidor. Mensaje: ' + success.desc);
        }
      },
      (error) => {
        alert('Error en el servicio, contacta con un administrador,');
      }
    )

    this.formulario = this._fb.group({
      descripcion: ['', [Validators.required]],
      fecha: ['', [Validators.required]]
    });
  }

  get f() { return this.formulario.controls; }


  imprimirVentana() {
    this.window.print();
  }

  toggleEdicion(index: any) {
    if (this.editable[index]) {
      // Mandar update
      let fecha = (<HTMLInputElement>document.getElementById("fecha-" + index)).value;
      let descripcion = (<HTMLInputElement>document.getElementById("descripcion-" + index)).value;
      let id = (<HTMLInputElement>document.getElementById("id-" + index)).value;
      this._requests.updateIncidencia({
        DESCRIPCION: descripcion,
        FECHA: fecha,
        ID: id
      }, this.id).subscribe(
        (success: any) => {
          if (success.exito) {
            this.incidencias = success.incidencias;
            this.editable = this.incidencias.map(a => false);
          } else {
            alert('Error en el servidor. Mensaje: ' + success.desc);
          }
        },
        (error) => {
          alert('Error en el servicio, contacta con un administrador,');
        }
      );
    }
    this.editable[index] = !this.editable[index];
  }

  eliminarIncidencia(index: any) {
    this._requests.eliminarIncidencia(index).subscribe(
      (success: any) => {
        this.incidencias = success.incidencias;
        this.editable = this.incidencias.map(a => false);
      },
      (error) => {
        this.incidencias = null;
        alert('Error en el servicio, contacta con un administrador,');
      }
    );
  }

  crearIncidencia() {
    this.submitted = true;
    if (this.formulario.invalid) {
      return;
    } else {
      let payload = {
        DESCRIPCION: this.formulario.get('descripcion').value,
        FECHA: this.formulario.get('fecha').value
      };
      this._requests.crearIncidencia(payload, this.id).subscribe(
        (success: any) => {
          if (success.exito) {
            this.incidencias = success.incidencias;
            console.log(this.incidencias);
          } else {
            this.incidencias = null;
            alert('Error en el servidor. Mensaje: ' + success.desc);
          }
        },
        (error) => {
          alert("Error en el servidor. Intente más tarde.");
        }
      );
    }
    this.create = !this.create;
  }
}
