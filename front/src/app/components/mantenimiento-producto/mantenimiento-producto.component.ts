import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RequestsService } from 'src/app/services/requests.service';
import { DomSanitizer } from "@angular/platform-browser"

@Component({
  selector: 'app-mantenimiento-producto',
  templateUrl: './mantenimiento-producto.component.html',
  styleUrls: ['./mantenimiento-producto.component.css']
})
export class MantenimientoProductoComponent implements OnInit {
  mantenimientos: any;
  editable: any;
  id: any;
  producto_info: any;
  create: boolean = false;
  formulario: FormGroup;
  fecha: Date = new Date();
  submitted: boolean = false;
  proveedores: any;

  constructor(
    private route: ActivatedRoute,
    private _requests: RequestsService,
    private _fb: FormBuilder,
    public sanitizer: DomSanitizer,
  ) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    console.log(this.id);

    this._requests.getMantenimientos(this.id).subscribe(
      (success: any) => {
        if (success.exito) {
          this.mantenimientos = success.mantenimientos;
          this.editable = this.mantenimientos.map(a => false);
        } else {
          alert('Error en el servidor. Mensaje: ' + success.desc);
        }
      },
      (error) => {
        alert('Error en el servicio, contacta con un administrador,');
      }
    )

    this._requests.getProveedores().subscribe(
      (success: any) => {
        if (success.exito) {
          this.proveedores = success.proveedores;
        } else {
          this.proveedores = null;
          alert('Error en el servidor. Mensaje: ' + success.desc);
        }
      },
      (error) => {
        this.proveedores = null;
        alert('Error en el servicio, contacta con un administrador,');
      }
    )

    this.formulario = this._fb.group({
      costo: ['', [Validators.required]],
      descripcion: ['', [Validators.required]],
      proveedor: ['', [Validators.required]],
      f_inicial: ['', [Validators.required]],
      f_final: ['', []]
    });
  }

  get f() { return this.formulario.controls; }

  toggleEdicion(index: any) {
    if (this.editable[index]) {
      // Mandar update
      let costo = (<HTMLInputElement>document.getElementById("costo-" + index)).value;
      let descripcion = (<HTMLInputElement>document.getElementById("descripcion-" + index)).value;
      let f_inicio = (<HTMLInputElement>document.getElementById("f_inicial-" + index)).value;
      let f_final = (<HTMLInputElement>document.getElementById("f_final-" + index)).value;
      let id = (<HTMLInputElement>document.getElementById("id-" + index)).value;
      this._requests.updateMantenimiento({
        COSTO: costo,
        DESCRIPCION: descripcion,
        F_INICIO: f_inicio,
        F_FINAL: f_final,
        ID: id
      }, this.id).subscribe(
        (success: any) => {
          if (success.exito) {
            this.mantenimientos = success.mantenimientos;
            this.editable = this.mantenimientos.map(a => false);
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

  eliminarMantenimiento(index: any) {
    this._requests.eliminarMantenimiento(index, this.id).subscribe(
      (success: any) => {
        this.mantenimientos = success.mantenimientos;
        this.editable = this.mantenimientos.map(a => false);
      },
      (error) => {
        this.mantenimientos = null;
        alert('Error en el servicio, contacta con un administrador,');
      }
    );
  }

  crearMantenimiento() {
    this.submitted = true;
    if (this.formulario.invalid) {
      return;
    } else {
      let payload = {
        DESCRIPCION: this.formulario.get('descripcion').value,
        PROVEEDOR: this.formulario.get('proveedor').value,
        F_INICIO: this.formulario.get('f_inicial').value,
        F_FINAL: this.formulario.get('f_final').value,
        COSTO: this.formulario.get('costo').value
      };
      this._requests.crearMantenimiento(payload, this.id).subscribe(
        (success: any) => {
          if (success.exito) {
            this.mantenimientos = success.mantenimientos;
            console.log(this.mantenimientos);
          } else {
            this.mantenimientos = null;
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
