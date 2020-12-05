import { Component, OnInit } from '@angular/core';
import { RequestsService } from 'src/app/services/requests.service';

@Component({
  selector: 'app-reporte-solicitudes',
  templateUrl: './reporte-solicitudes.component.html',
  styleUrls: ['./reporte-solicitudes.component.css']
})
export class ReporteSolicitudesComponent implements OnInit {

  solicitudes: any = [];

  constructor(
    private _requests: RequestsService,
    public window: Window
  ) { }

  ngOnInit(): void {
    this._requests.getRSolicitudes().subscribe(
      (success: any) => {
        if (success.exito)
          this.solicitudes = success.solicitudes;
        else
          alert("Quizá se deban generar solicitudes para ver el reporte.");
      },
      (error) => {
        alert("Error del servidor, por favor contacta a un administrador.");
      }
    );
  }

}
