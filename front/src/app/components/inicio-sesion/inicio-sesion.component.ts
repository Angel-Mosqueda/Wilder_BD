import { Component, OnInit } from '@angular/core';
import { Globals } from '../../globals/globals';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RequestsService } from 'src/app/services/requests.service';
import { Router } from '@angular/router';
import * as Cookies from 'js-cookie';

@Component({
  selector: 'app-inicio-sesion',
  templateUrl: './inicio-sesion.component.html',
  styleUrls: ['./inicio-sesion.component.css']
})
export class InicioSesionComponent implements OnInit {
  globals: Globals;
  correo: string;
  password: string;

  formulario: FormGroup;
  submitted = false;

  constructor(globals: Globals,
    private formBuilder: FormBuilder,
    private _requestService: RequestsService,
    private _router: Router
  ) {
    this.globals = globals;
  }

  ngOnInit(): void {
    this.globals.passwordLogin = "Password";
    this.formulario = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      contrasena: ['', [Validators.required]]
    });
  }

  showPassword() {
    if (this.globals.passwordLogin === "Password") {
      this.globals.passwordLogin = "Text";
    } else {
      this.globals.passwordLogin = "Password";
    }
  }

  get f() { return this.formulario.controls; }

  login() {

    this.submitted = true;
    if (this.formulario.invalid) {
      return;
    } else {
      let payload = {
        EMAIL: this.correo,
        PASSWORD: this.password
      };
      this._requestService.login(payload).subscribe(
        (success: any) => {
          if (success.exito) {
            Cookies.set('usrinfo', JSON.stringify(success.usrinfo));
            alert(success.desc);
            window.location.href = '/';
          }
          else
            alert("hubo un error, mensaje del servidor: " + success.desc)
        },
        () => {
          alert("Error con tus credenciales.");
        }
      );
    }

    console.log(this.correo + " " + this.password);
  }

}
