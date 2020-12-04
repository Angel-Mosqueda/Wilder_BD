import { Component, OnInit } from '@angular/core';
import { Options } from '@angular-slider/ngx-slider';
import { Globals } from '../../globals/globals';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { RequestsService } from 'src/app/services/requests.service';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-prestamo-producto',
  templateUrl: './prestamo-producto.component.html',
  styleUrls: ['./prestamo-producto.component.css']
})
export class PrestamoProductoComponent implements OnInit {
  public solicitudes: any;
  globals: Globals;
  filter: any = {};
  public form: FormGroup
  submitted = false;
  usrinfo = null;
  _authService = new AuthService;
  date: Date;
  indexVar: number;
  

  constructor(
    globals: Globals,
    private router: Router,
    private _requests: RequestsService,
    private _fb: FormBuilder
  ) {
    this.globals = globals;
    this.form = this._fb.group({
      fechaEsperada: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.usrinfo = this._authService.getInfo();
    this._requests.getSolicitud().subscribe(
      (response: any) => {
        this.solicitudes = response.solicitud;
        console.log(this.solicitudes);
      },
      (error) => {
        alert("Error pidiendo las empresas");
      }
    );

  }

  index(idx: number){
    this.indexVar = idx;
    console.log(this.indexVar);

  }

  aceptarSolicitud(){
    console.log(this.form.get('fechaEsperada').value);
    console.log(this.usrinfo['id'] + "  " + this.solicitudes[this.indexVar]['sol_id'] );
    console.log(this.solicitudes[this.indexVar]);
    this._requests.createSolicitudP2(this.usrinfo['id'], this.solicitudes[this.indexVar]['sol_id']).subscribe(
      (success: any) => {
        if (success.exito) {
          console.log(this.usrinfo['id'] + "  " + this.solicitudes[this.indexVar]['sol_id']);
        } else {
          alert('error en el registro, mensaje del server: ' + success.desc);
        }
      },
      (error) => {
        alert("Error en el servidor.")
      }
    );

    this._requests.updateInvEst(this.solicitudes[this.indexVar]['inv_id'], 1).subscribe(
      (success: any) => {
        if (success.exito) {
          console.log("exito")
        } else {
          alert('error en el registro, mensaje del server: ' + success.desc);
        }
      },
      (error) => {
        alert("Error en el servidor.")
      }
    );


    this._requests.createPrestamo({
      'ESTADO': 1,
      'SOLICITANTE': this.solicitudes[this.indexVar]['sol_solicitante'],
      'PRESTADOR': this.usrinfo['id'],
      'FECHA_ESTIMADA': this.form.get('fechaEsperada').value,
      'INVENTARIO_ID': this.solicitudes[this.indexVar]['inv_id']
    }).subscribe(
      (success: any) => {
        if (success.exito) {
          console.log("prestamo con exito")
          alert("Solicitud registrada exitosamente.");
          this.router.navigate(['/']);
        } else {
          alert('error en el registro, mensaje del server: ' + success.desc);
        }
      },
      (error) => {
        alert("Error en el servidor.")
      }
    );






    
  }

}
