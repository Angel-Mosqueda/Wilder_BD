import { Component, OnInit } from '@angular/core';
import { Globals } from '../../globals/globals';

@Component({
  selector: 'app-inicio-sesion',
  templateUrl: './inicio-sesion.component.html',
  styleUrls: ['./inicio-sesion.component.css']
})
export class InicioSesionComponent implements OnInit {
  globals: Globals;

  constructor(globals: Globals) {
    this.globals = globals;
  }

  ngOnInit(): void {
    this.globals.passwordLogin = "Password";
  }
  
  showPassword(){
    if(this.globals.passwordLogin === "Password"){
      this.globals.passwordLogin = "Text";
    }else{
      this.globals.passwordLogin = "Password";
    }
  }

}
