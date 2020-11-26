import { Component, OnInit } from '@angular/core';
import { Globals } from '../../globals/globals';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RequestsService } from 'src/app/services/requests.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inicio-sesion',
  templateUrl: './inicio-sesion.component.html',
  styleUrls: ['./inicio-sesion.component.css']
})
export class InicioSesionComponent implements OnInit {
  globals: Globals;
  email: string;
  password: string;

  formulario: FormGroup;

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
      correo: ['', Validators.required],
      contrasena: ['', Validators.required]
    });
  }

  showPassword() {
    if (this.globals.passwordLogin === "Password") {
      this.globals.passwordLogin = "Text";
    } else {
      this.globals.passwordLogin = "Password";
    }
  }

  login() {
    console.log(this.email + " " + this.password);
    let payload = {
      EMAIL: this.email,
      PASSWORD: this.password
    };
    this._requestService.login(payload).subscribe(
      (success: any) => {
        if (success.exito) {
          alert(success.desc);
          this._router.navigate(['/']);
        }
        else
          alert("hubo un error, mensaje del servidor: " + success.desc)
      },
      () => {
        alert("Error con tus credenciales.");
      }
    );
  }

}
