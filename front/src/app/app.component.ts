import { Component } from '@angular/core';
import * as $ from 'jquery';
import { AuthService } from './services/auth.service';
import { Globals } from './globals/globals';
import { RequestsService } from './services/requests.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  globals: Globals;
  title = 'angularbootstrap';
  _authService = new AuthService;
  logged = false;
  usrinfo = null;


  constructor(
    globals: Globals,
    private _requests: RequestsService
  ) {
    this.globals = globals;
  }

  ngOnInit() {
    //Toggle Click Function
    this.logged = this._authService.isAuthenticated();
    console.log(this.logged + "el logged");

    if (this.logged === true) {

      this.usrinfo = this._authService.getInfo();
      if (this.usrinfo['rol'] == 0) {
        this.globals.rol = "admin";
      }
      if (this.usrinfo['rol'] == 1) {
        this.globals.rol = "encargado";
      }
      if (this.usrinfo['rol'] == 2) {
        this.globals.rol = "normal";
      }
      console.log(this.globals.rol);
    }

    $("#menu-toggle").click(function (e) {
      e.preventDefault();
      $("#wrapper").toggleClass("toggled");
    });
  }

  cerrarSesion() {
    this._requests.cerrarSesion().subscribe(
      (success) => {
        window.location.href = '/';
      },
      (error) => {
        alert("Error en el servidor.");
      }
    );
  }

}