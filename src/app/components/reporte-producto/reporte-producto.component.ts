import { Component, OnInit } from '@angular/core';
import { Globals } from '../../globals/globals';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reporte-producto',
  templateUrl: './reporte-producto.component.html',
  styleUrls: ['./reporte-producto.component.css']
})
export class ReporteProductoComponent implements OnInit {

  globals: Globals;

  constructor(globals: Globals, private router: Router) { 
    this.globals = globals;
   }

  ngOnInit(): void {
    if(this.globals.producto === null){
      this.router.navigate(['/']);
    }

  }

  isnull(){
    this.globals.producto = null;
    this.globals.consultas = null;
  }
}
