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
  }

  istrue(){
    this.globals.producto = true;
  }

  isfalse(){
    this.globals.producto = false;
  }

}
