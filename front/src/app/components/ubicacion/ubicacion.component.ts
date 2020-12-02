import { Component, OnInit } from '@angular/core';
import { RequestsService } from 'src/app/services/requests.service';

@Component({
  selector: 'app-ubicacion',
  templateUrl: './ubicacion.component.html',
  styleUrls: ['./ubicacion.component.css']
})
export class UbicacionComponent implements OnInit {
  public ubicaciones;
  public editable = [];
  public create = false;
  public new_lat = 21.9634761;
  public new_lon = -102.3457835;

  constructor(
    private _requests: RequestsService
  ) { }

  ngOnInit(): void {
    this._requests.getUbicaciones().subscribe(
      (success: any) => {
        if (success.exito) {
          this.ubicaciones = success.ubicaciones;
          this.editable = this.ubicaciones.map(a => false);
          console.log(this.editable);
        } else {
          this.ubicaciones = null;
          alert('Error en el servidor. Mensaje: ' + success.desc);
        }
      },
      (error) => {
        this.ubicaciones = null;
        alert('Error en el servicio, contacta con un administrador,');
      }
    )
  }

  toggleEdicion(index: any) {
    if (this.editable[index]) {
      // Mandar update
      let nombre = (<HTMLInputElement>document.getElementById("nombre-" + index)).value;
      let lat = (<HTMLInputElement>document.getElementById("lat-" + index)).value;
      let lon = (<HTMLInputElement>document.getElementById("lon-" + index)).value;
      let id = (<HTMLInputElement>document.getElementById("id-" + index)).value;
      this._requests.updateUbicacion({
        NOMBRE: nombre,
        ID: id,
        LATITUD: lat,
        LONGITUD: lon
      }).subscribe(
        (success: any) => {
          if (success.exito) {
            this.ubicaciones = success.ubicaciones;
          } else {
            this.ubicaciones = null;
            alert('Error en el servidor. Mensaje: ' + success.desc);
          }
        },
        (error) => {
          this.ubicaciones = null;
          alert('Error en el servicio, contacta con un administrador,');
        }
      );
    }
    this.editable[index] = !this.editable[index];
  }

  eliminarUbicacion(index: any) {
    // Mandar update
    this._requests.eliminarUbicacion(index).subscribe(
      (success: any) => {
        this.ubicaciones = success.ubicaciones;
      },
      (error) => {
        this.ubicaciones = null;
        alert('Error en el servicio, contacta con un administrador,');
      }
    );
  }

  enviarNuevoUbicacion() {
    let nombre = (<HTMLInputElement>document.getElementById("new-nombre")).value;
    let lat = (<HTMLInputElement>document.getElementById("new-lat")).value;
    let lon = (<HTMLInputElement>document.getElementById("new-lon")).value;
    this._requests.crearUbicacion({
      NOMBRE: nombre,
      LATITUD: lat,
      LONGITUD: lon
    }).subscribe(
      (success: any) => {
        if (success.exito) {
          this.ubicaciones = success.ubicaciones;
          this.create = false;
        } else {
          this.ubicaciones = null;
          alert('Error en el servidor. Mensaje: ' + success.desc);
        }
      },
      (error) => {
        this.ubicaciones = null;
        alert('Error en el servicio, contacta con un administrador,');
      }
    );
  }

  changeLatLon() {
    this.new_lat = parseFloat((<HTMLInputElement>document.getElementById("new-lat")).value);
    this.new_lon = parseFloat((<HTMLInputElement>document.getElementById("new-lon")).value);
  }
}
