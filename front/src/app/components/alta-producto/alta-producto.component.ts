import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Globals } from '../../globals/globals';
import { RequestsService } from 'src/app/services/requests.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-alta-producto',
  templateUrl: './alta-producto.component.html',
  styleUrls: ['./alta-producto.component.css']
})
export class AltaProductoComponent implements OnInit {

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

  categorias: any;
  file: File;


  constructor(
    globals: Globals,
    private formBuilder: FormBuilder,
    private _requestService: RequestsService,
    private router: Router,
    private _auth: AuthService
  ) {
    this.globals = globals;
  }

  ngOnInit(): void {
    this._requestService.getCategorias().subscribe(
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

    this.formulario = this.formBuilder.group({
      nombre: ['', Validators.required],
      // num_serie: ['', Validators.required],
      // num_factura: ['', Validators.required],
      // proveedor: ['', Validators.required],
      // factura: ['', Validators.required],
      // fecha_compra: ['', Validators.required],
      // costo_producto: ['', Validators.required],
      categorias: this.formBuilder.array(['', Validators.required]),
      descripcion: ['', Validators.required],
      select_img: ['', Validators.required]
    });

    if (this.globals.producto === null) {
      this.router.navigate(['/']);
    }
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

  get f() { return this.formulario.controls; }

  isnull() {
    this.globals.producto = null;
    this.globals.altas = null;
  }

  fileChange(event) {
    this.file = event.target.files.item(0);
  }

  onCheckboxChange(e) {
    const checkArray: FormArray = this.formulario.get('categorias') as FormArray;

    if (e.target.checked) {
      checkArray.push(new FormControl(e.target.value));
    } else {
      let i: number = 0;
      checkArray.controls.forEach((item: FormControl) => {
        if (item.value == e.target.value) {
          checkArray.removeAt(i);
          return;
        }
        i++;
      });
    }
  }

  enviarFormulario() {
    this.submitted = true;
    if (this.formulario.invalid) {
      return;
    } else {
      let usrinfo = this._auth.getInfo();
      this._requestService.createProducto({
        'USUARIO_ID': usrinfo.id,
        'EMPRESA_ID': usrinfo.empresa_id,
        'NOMBRE': this.formulario.controls['nombre'].value,
        'DESCRIPCION': this.formulario.controls['descripcion'].value,
        'CATEGORIAS': this.formulario.get('categorias').value
      }, this.file).subscribe(
        (success: any) => {
          if (success.exito) {
            alert("Producto registrado exitosamente.");
            this.router.navigate(['/alta-producto/']);
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
