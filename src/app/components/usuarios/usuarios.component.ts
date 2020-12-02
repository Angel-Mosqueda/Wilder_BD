import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RequestsService } from 'src/app/services/requests.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {
  usuarios: any;
  editable: any;
  create: boolean = false;

  file: any;
  formulario: FormGroup;
  rol: any;
  activo: any;

  constructor(
    private _requests: RequestsService,
    private _fb: FormBuilder,
    private _router: Router
  ) { }

  ngOnInit(): void {
    this.formulario = this._fb.group({
      nombre: ['', Validators.required],
      apepat: ['', Validators.required],
      apemat: ['', Validators.required],
      rol: ['', Validators.required],
      correo: ['', Validators.required],
      password1: ['', Validators.required],
      password2: ['', Validators.required],
      select_img: ['', Validators.required]
    });

    this._requests.getUsuarios().subscribe(
      (success: any) => {
        if (success.exito) {
          this.usuarios = success.usuarios;
          this.editable = this.usuarios.map(a => false);
          this.rol = this.usuarios.map(a => a.rol);
          this.activo = this.usuarios.map(a => a.activo);
          console.log(this.activo);
          console.log(this.rol);
        } else {
          this.usuarios = null;
          alert('Error en el servidor. Mensaje: ' + success.desc);
        }
      },
      (error) => {
        this.usuarios = null;
        alert('Error en el servicio, contacta con un administrador,');
      }
    )
  }

  get f() { return this.formulario.controls; }

  fileChange(event) {
    this.file = event.target.files.item(0);
  }

  toggleEdicion(index: any) {
    if (this.editable[index]) {
      // Mandar update
      let nombre = (<HTMLInputElement>document.getElementById("nombre-" + index)).value;
      let apepat = (<HTMLInputElement>document.getElementById("apepat-" + index)).value;
      let apemat = (<HTMLInputElement>document.getElementById("apemat-" + index)).value;
      let rol = (<HTMLInputElement>document.getElementById("rol-" + index)).value;
      let activo = (<HTMLInputElement>document.getElementById("activo-" + index)).value;
      let correo = (<HTMLInputElement>document.getElementById("correo-" + index)).value;
      let id = (<HTMLInputElement>document.getElementById("id-" + index)).value;
      this._requests.updateUsuario({
        NOMBRE: nombre,
        APEPAT: apepat,
        APEMAT: apemat,
        ROL: rol,
        ACTIVO: activo,
        ID: id
      }).subscribe(
        (success: any) => {
          if (success.exito) {
            this.usuarios = success.usuarios;
            this.rol = this.usuarios.map(a => a.rol);
            this.activo = this.usuarios.map(a => a.activo);
          } else {
            this.usuarios = null;
            alert('Error en el servidor. Mensaje: ' + success.desc);
          }
        },
        (error) => {
          this.usuarios = null;
          alert('Error en el servicio, contacta con un administrador,');
        }
      );
    }
    this.editable[index] = !this.editable[index];
  }

  eliminarUsuario(index: any) {
    // Mandar update
    this._requests.eliminarUsuario(index).subscribe(
      (success: any) => {
        this.usuarios = success.usuarios;
        this.rol = this.usuarios.map(a => a.rol);
        this.activo = this.usuarios.map(a => a.activo);
      },
      (error) => {
        this.usuarios = null;
        alert('Error en el servicio, contacta con un administrador,');
      }
    );
  }

  enviarNuevoUsuario() {
    let nombre = this.formulario.controls['nombre'].value;
    let apepat = this.formulario.controls['apepat'].value;
    let apemat = this.formulario.controls['apemat'].value;
    let rol = this.formulario.controls['rol'].value;
    let correo = this.formulario.controls['correo'].value;
    let pass1 = this.formulario.controls['password1'].value;
    let pass2 = this.formulario.controls['password2'].value;

    if (this.formulario.valid && pass1 == pass2) {
      this._requests.createUser({
        'NOMBRE': nombre,
        'APEPAT': apepat,
        'APEMAT': apemat,
        'CORREO': correo,
        'ROL': rol,
        'ACTIVO': 1,
        'PASSWORD': pass1
      }, this.file).subscribe(
        (success: any) => {
          if (success.exito) {
            alert("Usuario creado con éxito");
            this._router.navigate(['/usuarios']);
            this.create = !this.create;
          } else {
            alert("Error al crear usuario. Error: " + success.desc);
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
