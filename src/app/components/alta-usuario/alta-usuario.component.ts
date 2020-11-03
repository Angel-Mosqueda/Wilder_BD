import { Component, OnInit } from '@angular/core';
import { Globals } from '../../globals/globals';

@Component({
  selector: 'app-alta-usuario',
  templateUrl: './alta-usuario.component.html',
  styleUrls: ['./alta-usuario.component.css']
})
export class AltaUsuarioComponent implements OnInit {
  globals: Globals;

  constructor(globals: Globals) { 
    this.globals = globals;
   }

  ngOnInit(): void {
    this.globals.passwordNueva1 = "Password";
    this.globals.passwordNueva2 = "Password";
  }

  agregarEmpresa(){
    this.globals.nuevaEmpresa = true;
    this.globals.deshabilitar = true;
  }

  showPassword1(){
    if(this.globals.passwordNueva1 === "Password"){
      this.globals.passwordNueva1 = "Text";
    }else{
      this.globals.passwordNueva1 = "Password";
    }
  }

  showPassword2(){
    if(this.globals.passwordNueva2 === "Password"){
      this.globals.passwordNueva2 = "Text";
    }else{
      this.globals.passwordNueva2 = "Password";
    }
  }

}
