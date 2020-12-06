import { Component, OnInit } from '@angular/core';
import { RequestsService } from 'src/app/services/requests.service';

@Component({
  selector: 'app-reporte-prestamos',
  templateUrl: './reporte-prestamos.component.html',
  styleUrls: ['./reporte-prestamos.component.css']
})
export class ReportePrestamosComponent implements OnInit {
  prestamos: any = [];

  constructor(
    private _requests: RequestsService,
    public window: Window
  ) { }

  ngOnInit(): void {
    this._requests.getRPrestamos().subscribe(
      (success: any) => {
        if (success.exito)
          this.prestamos = success.prestamos;
        else
          alert("Quizá se deban generar préstamos para ver el reporte.");
      },
      (error) => {
        alert("Error del servidor, por favor contacta a un administrador.");
      }
    );
  }

}
