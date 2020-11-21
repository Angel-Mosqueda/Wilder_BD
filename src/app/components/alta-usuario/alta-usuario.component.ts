import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RequestsService } from 'src/app/services/requests.service';
import { Globals } from '../../globals/globals';

@Component({
  selector: 'app-alta-usuario',
  templateUrl: './alta-usuario.component.html',
  styleUrls: ['./alta-usuario.component.css']
})
export class AltaUsuarioComponent implements OnInit {
  globals: Globals;
  name: String;
  apepat: String;
  apemat: String;
  email: String;
  pwd1: String;
  pwd2: String;
  empresas: any;

  formulario: FormGroup;

  constructor(
    globals: Globals,
    private formBuilder: FormBuilder,
    private _requestService: RequestsService
  ) {
    this.globals = globals;
  }

  ngOnInit(): void {
    this.globals.passwordNueva1 = "Password";
    this.globals.passwordNueva2 = "Password";
    this._requestService.getEmpresas().subscribe(
      (response: any) => {
        this.empresas = response.empresas;
      },
      (error) => {

      }
    );
    this.formulario = this.formBuilder.group({
      nombre: ['', Validators.required],
      appat: ['', Validators.required],
      apmat: ['', Validators.required],
      correo: ['', Validators.required],
      cont1: ['', Validators.required],
      cont2: ['', Validators.required]
    });
  }

  agregarEmpresa() {
    this.globals.nuevaEmpresa = true;
    this.globals.deshabilitar = true;
  }

  showPassword1() {
    if (this.globals.passwordNueva1 === "Password") {
      this.globals.passwordNueva1 = "Text";
    } else {
      this.globals.passwordNueva1 = "Password";
    }
  }

  showPassword2() {
    if (this.globals.passwordNueva2 === "Password") {
      this.globals.passwordNueva2 = "Text";
    } else {
      this.globals.passwordNueva2 = "Password";
    }
  }

  enviarFormulario() {
    this._requestService.createUser({

    });
  }

}
