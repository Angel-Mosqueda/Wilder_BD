import { Component, OnInit } from '@angular/core';
import { RequestsService } from 'src/app/services/requests.service';

@Component({
  selector: 'app-categorias',
  templateUrl: './categorias.component.html',
  styleUrls: ['./categorias.component.css']
})
export class CategoriasComponent implements OnInit {
  public categorias;
  public editable = [];

  constructor(
    private _requests: RequestsService
  ) {

  }

  ngOnInit(): void {
    this._requests.getCategorias().subscribe(
      (success: any) => {
        if (success.exito) {
          this.categorias = success.categorias;
          this.editable = this.categorias.map(a => false);
          console.log(this.editable);
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

  toggleEdicion(index: any) {
    if (this.editable[index]) {
      // Mandar update
      let nombre = (<HTMLInputElement>document.getElementById("nombre-" + index)).value;
      let id = (<HTMLInputElement>document.getElementById("id-" + index)).value;
      this._requests.updateCategoria({
        NOMBRE: nombre,
        ID: id
      }).subscribe(
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
      );
    }
    this.editable[index] = !this.editable[index];
  }
}
