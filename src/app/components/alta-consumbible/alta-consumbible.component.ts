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
  submitted=false;

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



  constructor(globals: Globals, 
    private formBuilder: FormBuilder,
    private _requestService: RequestsService,
    private router: Router) { 
    this.globals = globals;
   }

  ngOnInit(): void {

    this.formulario = this.formBuilder.group({
      nombre: ['',Validators.required],
      num_serie: ['',Validators.required],
      num_factura: ['',Validators.required],
      proveedor: ['',Validators.required],
      factura: ['',Validators.required],
      fecha_compra: ['',Validators.required],
      costo_producto: ['',Validators.required],
      descripcion: ['',Validators.required],
      select_img: ['',Validators.required]
    });


    if(this.globals.producto === null){
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

  get f(){ return this.formulario.controls;}

  isnull(){
    this.globals.producto = null;
    this.globals.altas = null;
  }

  enviarFormulario(){

    this.submitted=true;
    if(this.formulario.invalid){
      return;
    }else{
      alert("Funciono");
    }

    if(this.globals.producto === true){
      console.log(this.nombre+" "+this.numserie+" "+this.numfactura+" "+this.proveedor+" "+this.factura+" "+this.fecha+" "+this.costo+" "+this.descripcion);
    }else{
      console.log(this.nombre+" "+this.cantidad+" "+this.sku+" "+this.proveedor+" "+this.descripcion);
    }
    
  }

}
