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
  data_proveedores_mtto: any;
  data_proveedores_inv: any;
  chart_conteo_categorias: Chart;
  chart_reporte_conteos: Chart;
  chart_dinero: Chart;
  chart_proveedores_mtto: any;
  chart_proveedores_inv: any;
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

        this.data_proveedores_inv = exito.principales_prov_inv;
        let proveedores_inv = [];
        let dinero_inv = [];
        for (let atributo in this.data_proveedores_inv) {
          proveedores_inv.push(this.data_proveedores_inv[atributo]['proveedores']);
          dinero_inv.push(this.data_proveedores_inv[atributo]['cantidad']);
        }

        this.data_proveedores_mtto = exito.principales_prov_mtto;
        let proveedores_mtto = [];
        let dinero_mtto = [];
        for (let atributo in this.data_proveedores_mtto) {
          proveedores_mtto.push(this.data_proveedores_mtto[atributo]['proveedores']);
          dinero_mtto.push(this.data_proveedores_mtto[atributo]['cantidad']);
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

        this.chart_proveedores_inv = new Chart('dinero_inv', {
          type: 'bar',
          data: {
            labels: proveedores_inv,
            datasets: [
              {
                label: 'Dinero gastado en Inventario',
                fill: false,
                backgroundColor: ["#73EEDC", "#73C2BE", "#776885", "#04030F", "#49C6E5", "#00BD9D", "#BFD7EA", "#FEFFFE", "#E2EF70", "#F6E4F6"],
                data: dinero_inv
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

        this.chart_proveedores_mtto = new Chart('dinero_mtto', {
          type: 'bar',
          data: {
            labels: proveedores_mtto,
            datasets: [
              {
                label: 'Dinero gastado en Mantenimiento',
                fill: false,
                backgroundColor: ["#73EEDC", "#73C2BE", "#776885", "#04030F", "#49C6E5", "#00BD9D", "#BFD7EA", "#FEFFFE", "#E2EF70", "#F6E4F6"],
                data: dinero_mtto
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
