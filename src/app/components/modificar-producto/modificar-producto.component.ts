import { Component, OnInit } from '@angular/core';
import { Globals } from '../../globals/globals';
import { Router } from '@angular/router';
import { Options } from '@angular-slider/ngx-slider';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-modificar-producto',
  templateUrl: './modificar-producto.component.html',
  styleUrls: ['./modificar-producto.component.css']
})
export class ModificarProductoComponent implements OnInit {
  array = []; //Arreglo para almacenar info de base de datos
  minValue: number = 0;
  maxValue: number = 500;
  options: Options = {
    floor: 0,
    ceil: 500,
    translate: (value: number): string => {
      return '$' + value;
    }
  };
  

  globals: Globals;

  formulario: FormGroup;
  submitted=false;

  constructor(globals: Globals, private router: Router, private formBuilder: FormBuilder) { 
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

    this.prestamoInventario = false;
    this.mantenimientoInventario = false;
    this.almacenInventario = false;
    this.computacionInventario = false;
    this.herramientasInventario = false;
    this.maquinariaInventario = false;
    this.muebleriaInventario = false;
    this.vehiculosInventario = false;
    this.disponibleConsumible = false;
    this.agotadoConsumible = false;
    this.automotrizConsumible = false;
    this.herramientasConsumible = false;
    this.limpiezaConsumible = false;
    this.maquinariaConsumible = false;
    this.papeleriaConsumible = false;
    this.sliderCostoMin = 0;
    this.sliderCostoMax = 0;
    this.stringConsumible = "";
    this.stringInventario = "";

  }

  get f(){ return this.formulario.controls;}

  isnull(){
    this.globals.producto = null;
    this.globals.consultas = null;
  }
  
  prestamoInventario: boolean = null;
  mantenimientoInventario: boolean = null;
  almacenInventario: boolean = null;
  computacionInventario: boolean = null;
  herramientasInventario: boolean = null;
  maquinariaInventario: boolean = null;
  muebleriaInventario: boolean = null;
  vehiculosInventario: boolean = null;
  disponibleConsumible: boolean = null;
  agotadoConsumible: boolean = null;
  automotrizConsumible: boolean = null;
  herramientasConsumible: boolean = null;
  limpiezaConsumible: boolean = null;
  maquinariaConsumible: boolean = null;
  papeleriaConsumible: boolean = null;
  sliderCostoMin:  number = 0;
  sliderCostoMax: number = 0;
  stringConsumible: string;
  stringInventario: string;

  checkPrestamoInventarioFunction(){
    if(this.prestamoInventario == false){
      this.prestamoInventario = true;
      this.concatenacionInventario();
    }else{
      this.prestamoInventario = false;
      this.concatenacionInventario();
    }
  }

  checkMantenimientoInventarioFunction(){
    if(this.mantenimientoInventario == false){
      this.mantenimientoInventario = true;
      this.concatenacionInventario();
    }else{
      this.mantenimientoInventario = false;
      this.concatenacionInventario();
    }
  }

  checkAlmacenInventarioFunction(){
    if(this.almacenInventario == false){
      this.almacenInventario = true;
      this.concatenacionInventario();
    }else{
      this.almacenInventario = false;
      this.concatenacionInventario();
    }
  }

  checkComputacionInventarioFunction(){
    if(this.computacionInventario == false){
      this.computacionInventario = true;
      this.concatenacionInventario();
    }else{
      this.computacionInventario = false;
      this.concatenacionInventario();
    }
  }

  checkHerramientasInventarioFuntion(){
    if(this.herramientasInventario == false){
      this.herramientasInventario = true;
      this.concatenacionInventario();
    }else{
      this.herramientasInventario = false;
      this.concatenacionInventario();
    }
  }

  checkMaquinariaInventarioFunction(){
    if(this.maquinariaInventario == false){
      this.maquinariaInventario = true;
      this.concatenacionInventario();
    }else{
      this.maquinariaInventario = false;
      this.concatenacionInventario();
    }
  }

  checkMuebleriaInventarioFunction(){
    if(this.muebleriaInventario == false){
      this.muebleriaInventario = true;
      this.concatenacionInventario();
    }else{
      this.muebleriaInventario = false;
      this.concatenacionInventario();
    }
  }

  checkVehiculosInventarioFunction(){
    if(this.vehiculosInventario == false){
      this.vehiculosInventario = true;
      this.concatenacionInventario();
    }else{
      this.vehiculosInventario = false;
      this.concatenacionInventario();
    }
  }

  checkDisponibleConsumibleFunction(){
    if(this.disponibleConsumible == false){
      this.disponibleConsumible = true;
      this.concatenacionConsumible();
    }else{
      this.disponibleConsumible = false;
      this.concatenacionConsumible();
    }
  }

  checkAgotadoConsumibleFunction(){
    if(this.agotadoConsumible == false){
      this.agotadoConsumible = true;
      this.concatenacionConsumible();
    }else{
      this.agotadoConsumible = false;
      this.concatenacionConsumible();
    }
  }

  checkAutomotrizConsumibleFunction(){
    if(this.automotrizConsumible == false){
      this.automotrizConsumible = true;
      this.concatenacionConsumible();
    }else{
      this.automotrizConsumible = false;
      this.concatenacionConsumible();
    }
  }

  checkHerramientasConsumibleFunction(){
    if(this.herramientasConsumible == false){
      this.herramientasConsumible = true;
      this.concatenacionConsumible();
    }else{
      this.herramientasConsumible = false;
      this.concatenacionConsumible();
    }
  }

  checkLimpiezaConsumibleFunction(){
    if(this.limpiezaConsumible == false){
      this.limpiezaConsumible = true;
      this.concatenacionConsumible();
    }else{
      this.limpiezaConsumible = false;
      this.concatenacionConsumible();
    }
  }

  checkMaquinariaConsumibleFunction(){
    if(this.maquinariaConsumible == false){
      this.maquinariaConsumible = true;
      this.concatenacionConsumible();
    }else{
      this.maquinariaConsumible = false;
      this.concatenacionConsumible();
    }
  }
  checkPapeleriaConsumibleFunction(){
    if(this.papeleriaConsumible == false){
      this.papeleriaConsumible = true;
      this.concatenacionConsumible();
    }else{
      this.papeleriaConsumible = false;
      this.concatenacionConsumible();
    }
  }

  sliderCosto(){
    this.sliderCostoMin = this.minValue;
    this.sliderCostoMax = this.maxValue;
    if(this.globals.producto){
      this.concatenacionInventario();
    }else{
      this.concatenacionConsumible();
    }
    

  }

  concatenacionInventario(){
    this.stringInventario = "";
    if(this.prestamoInventario == true){
      this.stringInventario += "prestInv=true&";
    }
    if(this.mantenimientoInventario == true){
      this.stringInventario += "mantInv=true&";
    }
    if(this.almacenInventario == true){
      this.stringInventario += "almInv=true&";
    }
    
    if(this.computacionInventario == true){
      this.stringInventario += "compInv=true&";
    }
    if(this.herramientasInventario == true){
      this.stringInventario += "herInv=true&";
    }
    if(this.maquinariaInventario == true){
      this.stringInventario += "maqInv=true&";
    }
    if(this.muebleriaInventario == true){
      this.stringInventario += "muebInv=true&";
    }
    if(this.vehiculosInventario == true){
      this.stringInventario += "vehiInv=true&";
    }
    
    this.stringInventario += "min=" + this.sliderCostoMin + "&";
    this.stringInventario += "max=" + this.sliderCostoMax;
    console.log(this.stringInventario);
  }

  concatenacionConsumible(){ 
    this.stringInventario = "";
    if(this.disponibleConsumible == true){
      this.stringInventario += "dispCons=true&";
    }
    if(this.agotadoConsumible == true){
      this.stringInventario += "agotCons=true&";
    }
    if(this.automotrizConsumible == true){
      this.stringInventario += "autoCons=true&";
    }
    
    if(this.herramientasConsumible == true){
      this.stringInventario += "herCons=true&";
    }
    if(this.limpiezaConsumible == true){
      this.stringInventario += "limpCons=true&";
    }
    if(this.maquinariaConsumible == true){
      this.stringInventario += "maqCons=true&";
    }
    if(this.papeleriaConsumible == true){
      this.stringInventario += "papCons=true&";
    }
    
    this.stringInventario += "min=" + this.sliderCostoMin + "&";
    this.stringInventario += "max=" + this.sliderCostoMax;
    console.log(this.stringInventario);
  }

  enviarFormulario(){
    this.submitted=true;
    if(this.formulario.invalid){
      return;
    }else{
      alert("Funciono");
    }
  }

}
