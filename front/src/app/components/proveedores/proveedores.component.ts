import { Component, OnInit } from '@angular/core';
import { RequestsService } from 'src/app/services/requests.service';

@Component({
  selector: 'app-proveedores',
  templateUrl: './proveedores.component.html',
  styleUrls: ['./proveedores.component.css']
})
export class ProveedoresComponent implements OnInit {
  public proveedores;
  public editable = [];
  public create = false;

  constructor(
    private _requests: RequestsService
  ) { }

  ngOnInit(): void {
    this._requests.getProveedores().subscribe(
      (success: any) => {
        if (success.exito) {
          this.proveedores = success.proveedores;
          this.editable = this.proveedores.map(a => false);
          console.log(this.editable);
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
  }

  toggleEdicion(index: any) {
    if (this.editable[index]) {
      // Mandar update
      let nombre = (<HTMLInputElement>document.getElementById("nombre-" + index)).value;
      let razsoc = (<HTMLInputElement>document.getElementById("razsoc-" + index)).value;
      let id = (<HTMLInputElement>document.getElementById("id-" + index)).value;
      this._requests.updateProveedor({
        NOMBRE: nombre,
        ID: id,
        RAZSOC: razsoc
      }).subscribe(
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
      );
    }
    this.editable[index] = !this.editable[index];
  }

  eliminarProveedor(index: any) {
    // Mandar update
    this._requests.eliminarProveedor(index).subscribe(
      (success: any) => {
        this.proveedores = success.proveedores;
      },
      (error) => {
        this.proveedores = null;
        alert('Error en el servicio, contacta con un administrador,');
      }
    );
  }

  enviarNuevoProveedor() {
    let nombre = (<HTMLInputElement>document.getElementById("new-nombre")).value;
    let razsoc = (<HTMLInputElement>document.getElementById("new-razsoc")).value;
    this._requests.crearProveedor({
      NOMBRE: nombre,
      RAZSOC: razsoc
    }).subscribe(
      (success: any) => {
        if (success.exito) {
          this.proveedores = success.proveedores;
          this.create = false;
        } else {
          this.proveedores = null;
          alert('Error en el servidor. Mensaje: ' + success.desc);
        }
      },
      (error) => {
        this.proveedores = null;
        alert('Error en el servicio, contacta con un administrador,');
      }
    );
  }

}
