import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import { RequestsService } from 'src/app/services/requests.service';

@Component({
  selector: 'app-reporte-graficas',
  templateUrl: './reporte-graficas.component.html',
  styleUrls: ['./reporte-graficas.component.css']
})
export class ReporteGraficasComponent implements OnInit {
  chart_conteo_categorias: Chart;
  chart_reporte_conteos: Chart;
  chart_dinero: Chart;
  selector: Number = 1;

  constructor(
    private _request: RequestsService
  ) { }

  ngOnInit(): void {
    this._request.getConteos(this.selector).subscribe(
      (exito: any) => {
        this.chart_conteo_categorias = exito.categorias;
        this.chart_reporte_conteos = exito.reportes;
        this.chart_dinero = exito.dinero;
      },
      (error) => {
        alert("Ocurrio un error con el servicio, intenta más tarde.");
      }
    );
  }

}
