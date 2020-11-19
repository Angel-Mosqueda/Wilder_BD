import { Component, OnInit } from '@angular/core';
import { Options } from '@angular-slider/ngx-slider';

@Component({
  selector: 'app-solicitud',
  templateUrl: './solicitud.component.html',
  styleUrls: ['./solicitud.component.css']
})
export class SolicitudComponent implements OnInit {
  minValue: number = 0;
  maxValue: number = 500;
  options: Options = {
    floor: 0,
    ceil: 500,
    translate: (value: number): string => {
      return '$' + value;
    }
  };

  constructor() { }

  ngOnInit(): void {
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

  sliderCosto(){
    this.sliderCostoMin = this.minValue;
    this.sliderCostoMax = this.maxValue;
    this.concatenacionInventario();
    

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
}
