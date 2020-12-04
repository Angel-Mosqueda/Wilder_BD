import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import { RequestsService } from 'src/app/services/requests.service';

@Component({
  selector: 'app-reporte-graficas',
  templateUrl: './reporte-graficas.component.html',
  styleUrls: ['./reporte-graficas.component.css']
})
export class ReporteGraficasComponent implements OnInit {
  data_chart_conteo_categorias: any;
  data_chart_reporte_conteos: any;
  data_chart_dinero: any;
  chart_conteo_categorias: Chart;
  chart_reporte_conteos: Chart;
  chart_dinero: Chart;
  selector: Number = 1;

  constructor(
    private _request: RequestsService
  ) { }

  ngOnInit(): void {
    this.callGrficas(this.selector);
  }

  callGrficas(tipo) {
    this._request.getConteos(tipo).subscribe(
      (exito: any) => {
        this.data_chart_conteo_categorias = exito.categorias;
        let array_categ = this.data_chart_conteo_categorias.map(
          a => a.categ
        );
        let conteo_categ = this.data_chart_conteo_categorias.map(
          a => a.n
        );

        this.data_chart_reporte_conteos = exito.reportes;
        let array_reporte_conteos = [];
        let reporte_conteos = [];
        for (let atributo in this.data_chart_reporte_conteos) {
          array_reporte_conteos.push(atributo);
          reporte_conteos.push(this.data_chart_reporte_conteos[atributo]);
        }

        this.data_chart_dinero = exito.dinero;
        let array_reporte_dinero = [];
        let dinero = [];
        for (let atributo in this.data_chart_dinero) {
          array_reporte_dinero.push(atributo);
          dinero.push(this.data_chart_dinero[atributo]);
        }

        this.chart_conteo_categorias = new Chart('categorias', {
          type: 'bar',
          data: {
            labels: array_categ,
            datasets: [
              {
                label: 'Existencias',
                fill: false,
                data: conteo_categ
              }
            ]
          },
          options: {
            scales: {
              yAxes: [{
                ticks: {
                  beginAtZero: true
                }
              }]
            }
          }
        });

        this.chart_reporte_conteos = new Chart('sucesos', {
          type: 'pie',
          data: {
            labels: array_reporte_conteos,
            datasets: [{
              label: "Cantidad de sucesos",
              backgroundColor: ["#3e95cd", "#8e5ea2", "#3cba9f", "#e8c3b9"],
              data: reporte_conteos
            }]
          }
        });

        this.data_chart_dinero = new Chart('dinero', {
          type: 'pie',
          data: {
            labels: array_reporte_dinero,
            datasets: [{
              label: "Dinero empleado",
              backgroundColor: ["#3e95cd", "#e8c3b9"],
              data: dinero
            }]
          }
        });
      },
      (error) => {
        alert("Ocurrio un error con el servicio, intenta más tarde.");
      }
    );
  }

  cambiarTiempo() {
    let tiempo = (<HTMLInputElement>document.getElementById("selectorFecha")).value;
    this.callGrficas(tiempo);
  }

}
