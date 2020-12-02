import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Globals } from '../../globals/globals';
import { RequestsService } from 'src/app/services/requests.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-alta-consumbible',
  templateUrl: './alta-consumbible.component.html',
  styleUrls: ['./alta-consumbible.component.css']
})
export class AltaConsumbibleComponent implements OnInit {
  globals: Globals;
  formulario: FormGroup;
  submitted = false;

  //variables compatibles
  nombre: string;
  descripcion: string;
  numfactura: string;
  proveedor: string;
  /*imagen: ImageData;*/

  //variables para inventario
  numserie: string;
  factura: string;
  fecha: Date;
  costo: Float32Array;

  //variables para consumible
  cantidad: Int16Array;
  sku: string;

  empresas: any;
  consumibles: any;
  editable: any;
  create: boolean = false;


  constructor(globals: Globals,
    private formBuilder: FormBuilder,
    private _requestService: RequestsService,
    private router: Router) {
    this.globals = globals;
  }

  ngOnInit(): void {

    this.formulario = this.formBuilder.group({
      nombre: ['', Validators.required],
      num_serie: ['', Validators.required],
      proveedor: ['', Validators.required],
      descripcion: ['', Validators.required],
      cantidad: ['', Validators.required]
    });


    if (this.globals.producto === null) {
      this.router.navigate(['/']);
    }

    this._requestService.getProveedores().subscribe(
      (success: any) => {
        if (success.exito) {
          this.empresas = success.proveedores;
        } else {
          this.empresas = null;
          alert('Error en el servidor. Mensaje: ' + success.desc);
        }
      },
      (error) => {
        this.empresas = null;
        alert('Error en el servicio, contacta con un administrador,');
      }
    )

    this._requestService.getConsumibles().subscribe(
      (success: any) => {
        if (success.exito) {
          this.consumibles = success.consumibles;
          this.editable = this.consumibles.map(a => false);
          console.log(this.editable);
        } else {
          this.consumibles = null;
          alert('Error en el servidor. Mensaje: ' + success.desc);
        }
      },
      (error) => {
        this.consumibles = null;
        alert('Error en el servicio, contacta con un administrador,');
      }
    )

    /*
    if(this.globals.producto === true){
      this.formulario = this.formBuilder.group({
        nombreCampo: ['', Validators.required],
        numserieCampo: ['', Validators.required],
        numfacturaCampo: ['', Validators.required],
        proveedorCampo1: ['', Validators.required],
        facturaCampo: ['', Validators.required],
        fechaCampo: ['', Validators.required],
        costoCampo: ['', Validators.required],
        descripcionCampo1: ['', Validators.required]
        
      });
    }else{
      this.formulario = this.formBuilder.group({
        nombreCampo: ['', Validators.required],
        skuCampo: ['', Validators.required],
        cantidadCampo: ['', Validators.required],
        proveedorCampo2: ['', Validators.required],
        descripcionCampo2: ['', Validators.required]
      });
    }*/



  }

  toggleEdicion(index: any) {
    if (this.editable[index]) {
      // Mandar update
      let nombre = (<HTMLInputElement>document.getElementById("nombre-" + index)).value;
      let id = (<HTMLInputElement>document.getElementById("id-" + index)).value;
      let sku = (<HTMLInputElement>document.getElementById("sku-" + index)).value;
      let cantidad = (<HTMLInputElement>document.getElementById("cantidad-" + index)).value;
      let descripcion = (<HTMLInputElement>document.getElementById("descripcion-" + index)).value;
      this._requestService.updateConsumible({
        NOMBRE: nombre,
        SKU: sku,
        CANTIDAD: cantidad,
        DESCRIPCION: descripcion,
        ID: id
      }).subscribe(
        (success: any) => {
          if (success.exito) {
            this.consumibles = success.consumibles;
          } else {
            this.consumibles = null;
            alert('Error en el servidor. Mensaje: ' + success.desc);
          }
        },
        (error) => {
          this.consumibles = null;
          alert('Error en el servicio, contacta con un administrador,');
        }
      );
    }
    this.editable[index] = !this.editable[index];
  }

  eliminarConsumible(index: any) {
    // Mandar update
    this._requestService.eliminarConsumible(index).subscribe(
      (success: any) => {
        this.consumibles = success.consumibles;
      },
      (error) => {
        this.consumibles = null;
        alert('Error en el servicio, contacta con un administrador,');
      }
    );
  }

  get f() { return this.formulario.controls; }

  isnull() {
    this.globals.producto = null;
    this.globals.altas = null;
  }

  enviarFormulario() {
    this.submitted = true;
    if (this.formulario.invalid) {
      return;
    } else {
      this._requestService.crearConsumible({
        'CANTIDAD': this.formulario.controls['cantidad'].value,
        'SKU': this.formulario.controls['num_serie'].value,
        'NOMBRE': this.formulario.controls['nombre'].value,
        'DESCRIPCION': this.formulario.controls['descripcion'].value,
        'PROVEEDOR': this.formulario.controls['proveedor'].value
      }).subscribe(
        (success: any) => {
          this.create = !this.create;
          if (success.exito) {
            alert("Consumible registrado exitosamente.");
            this._requestService.getConsumibles().subscribe(
              (success: any) => {
                if (success.exito) {
                  this.consumibles = success.consumibles;
                  this.editable = this.consumibles.map(a => false);
                  console.log(this.editable);
                } else {
                  this.consumibles = null;
                  alert('Error en el servidor. Mensaje: ' + success.desc);
                }
              },
              (error) => {
                this.consumibles = null;
                alert('Error en el servicio, contacta con un administrador,');
              }
            )
          } else {
            alert('error en el registro, mensaje del server: ' + success.desc);
          }
        },
        (error) => {
          alert("Error en el servidor.")
        }
      );
    }

    if (this.globals.producto === true) {
      console.log(this.nombre + " " + this.numserie + " " + this.numfactura + " " + this.proveedor + " " + this.factura + " " + this.fecha + " " + this.costo + " " + this.descripcion);
    } else {
      console.log(this.nombre + " " + this.cantidad + " " + this.sku + " " + this.proveedor + " " + this.descripcion);
    }

  }

}
