import { Component, OnInit } from '@angular/core';
import { RequestsService } from 'src/app/services/requests.service';

@Component({
  selector: 'app-reporte-mantenimiento',
  templateUrl: './reporte-mantenimiento.component.html',
  styleUrls: ['./reporte-mantenimiento.component.css']
})
export class ReporteMantenimientoComponent implements OnInit {

  mantenimientos: any = [];

  constructor(
    private _requests: RequestsService,
    public window: Window
  ) { }

  ngOnInit(): void {
    this._requests.getRMantenimientos().subscribe(
      (success: any) => {
        if (success.exito)
          this.mantenimientos = success.mantenimientos;
        else
          alert("Quizá se deban generar mantenimientos para ver el reporte.");
      },
      (error) => {
        alert("Error del servidor, por favor contacta a un administrador.");
      }
    );
  }

}
