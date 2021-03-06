import { Component, OnInit } from '@angular/core';
import { Globals } from '../../globals/globals';
import { Router } from '@angular/router';

@Component({
  selector: 'app-consumible-inventario',
  templateUrl: './consumible-inventario.component.html',
  styleUrls: ['./consumible-inventario.component.css']
})
export class ConsumibleInventarioComponent implements OnInit {

  globals: Globals;

  constructor(globals: Globals, private router: Router) { 
    this.globals = globals;
   }

  ngOnInit(): void {
  }

  istrue(){
    this.globals.producto = true;
    if(this.globals.altas === true){
      this.router.navigate(['/alta-producto']);
    }
    if(this.globals.bajas === true){
      this.router.navigate(['/eliminar-inventario']);
    }
    if(this.globals.cambios === true){
      this.router.navigate(['/modificar-inventario']);
    }
    if(this.globals.consultas === true){
      this.router.navigate(['/reporte-inventario']);
    }
  }

  isfalse(){
    this.globals.producto = false;
    if(this.globals.altas === true){
      this.router.navigate(['/alta-consumible']);
    }
    if(this.globals.bajas === true){
      this.router.navigate(['/eliminar-consumible']);
    }
    if(this.globals.cambios === true){
      this.router.navigate(['/modificar-consumible']);
    }
    if(this.globals.consultas === true){
      this.router.navigate(['/reporte-consumible']);
    }
  }

  isnull(){
    this.globals.altas = null;
    this.globals.bajas = null;
    this.globals.cambios = null;
    this.globals.consultas = null;
    this.globals.producto = null;
  }

}
