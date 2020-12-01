import { Component, OnInit } from '@angular/core';
import { Globals } from '../../globals/globals';


@Component({
  selector: 'app-revisarproducto',
  templateUrl: './revisarproducto.component.html',
  styleUrls: ['./revisarproducto.component.css']
})
export class RevisarproductoComponent implements OnInit {
  globals: Globals;
  constructor(globals: Globals) { 
    this.globals = globals;
   }

  ngOnInit(): void {
    this.globals.altas = false;
    this.globals.bajas = false;
    this.globals.cambios = false;
    this.globals.consultas = false;
  }

  esAlta(){
    this.globals.altas = true;
  }

  esBaja(){
    this.globals.bajas = true;
  }

  esCambio(){
    this.globals.cambios = true;
  }

  esConsulta(){
    this.globals.consultas = true;
  }
}
