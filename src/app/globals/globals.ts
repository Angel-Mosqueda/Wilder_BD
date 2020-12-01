import { Injectable } from '@angular/core';

@Injectable()
export class Globals {
  producto: boolean = null;
  altas: boolean = null;
  bajas: boolean = null;
  cambios: boolean = null;
  consultas: boolean = null;
  nuevaEmpresa: boolean = null;
  deshabilitar: boolean = false;
  passwordLogin: string = "Password";
  passwordNueva1: string = "Password";
  passwordNueva2: string = "Password";
  rol:string = ""; 
}