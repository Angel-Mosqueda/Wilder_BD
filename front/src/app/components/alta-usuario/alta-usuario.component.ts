import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
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
  empresa: String;
  empresas: any;
  file: any;

  formulario: FormGroup;

  constructor(
    globals: Globals,
    private formBuilder: FormBuilder,
    private _requestService: RequestsService,
    private _router: Router
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
        alert("Error pidiendo las emrpesas");
      }
    );
    this.formulario = this.formBuilder.group({
      nombre: ['', Validators.required],
      appat: ['', Validators.required],
      apmat: ['', Validators.required],
      correo: ['', Validators.required],
      cont1: ['', Validators.required],
      cont2: ['', Validators.required],
      company: ['', Validators.required],
      select_img: ['', Validators.required]
    });
  }

  get f() { return this.formulario.controls; }

  fileChange(event) {
    this.file = event.target.files.item(0);
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
    console.log(this.empresa);
    if (this.formulario.valid && this.pwd1 == this.pwd2) {
      this._requestService.createUser({
        NOMBRE: this.name,
        APEPAT: this.apepat,
        APEMAT: this.apemat,
        ROL: 0,
        FOTO: '',
        ACTIVO: '',
        EMPRESA_ID: this.empresa,
        CORREO: this.email,
        PASSWORD: this.pwd1
      }, this.file).subscribe(
        (success: any) => {
          if (success.exito) {
            alert("Usuario creado con éxito");
            this._router.navigate(['/']);
          }
        },
        (error) => {
          alert("Error al crear usuario.");
        }
      );
    } else {
      alert("Termina el formulario primero.");
    }

  }

}
