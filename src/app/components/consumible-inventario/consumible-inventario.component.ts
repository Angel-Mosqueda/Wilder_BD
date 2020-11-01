import { Component, OnInit } from '@angular/core';
import { Globals } from '../../globals/globals';

@Component({
  selector: 'app-consumible-inventario',
  templateUrl: './consumible-inventario.component.html',
  styleUrls: ['./consumible-inventario.component.css']
})
export class ConsumibleInventarioComponent implements OnInit {

  globals: Globals;

  constructor(globals: Globals) { 
    this.globals = globals;
   }

  ngOnInit(): void {
  }

  istrue(){
    this.globals.producto = true;
  }

  isfalse(){
    this.globals.producto = false;
  }

}
