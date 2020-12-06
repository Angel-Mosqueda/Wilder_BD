import { Component, OnInit } from '@angular/core';
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
  public prestamos: any;
  globals: Globals;
  filter: any = {};
  form: FormGroup;
  form2: FormGroup;
  submitted1 = false;
  submitted2 = false;
  usrinfo = null;
  _authService = new AuthService;
  date: Date;
  observaciones: string;
  indexVar: number;
  indexVarP: number;
  

  constructor(
    globals: Globals,
    private router: Router,
    private _requests: RequestsService,
    private _fb: FormBuilder
  ) {
    this.globals = globals;
  }

  ngOnInit(): void {
    this.form = this._fb.group({
      fechaEsperada: ['', Validators.required]
    });
    this.form2 = this._fb.group({
      observacionesTA: ['', Validators.required]
    });
    
    this.indexVar = null;
    this.indexVarP = null;
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

    this._requests.getPrestamos().subscribe(
      (response: any) => {
        this.prestamos = response.prestamos;
        console.log(this.prestamos);
      },
      (error) => {
        alert("Error pidiendo las empresas");
      }
    );
  }

  get f() {​​ return this.form.controls; }​​

  get g() {​​ return this.form2.controls; }​​

  index(idx: number){
    this.indexVar = idx;
    console.log(this.indexVar);
  }

  indexP(idxp: number){
    this.indexVarP = idxp;
    console.log(this.indexVarP);
  }

  aceptarSolicitud(){
    console.log("entro a funcion");
    this.submitted1 = true;
    if (this.form.invalid) {
      console.log("error");
      return;
    } else{
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
          window.location.href = '/';
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



  aceptarDevolucion(){
    console.log("entro a funcion");
    this.submitted2 = true;
    if (this.form2.invalid) {
      console.log("error");
      return;
    } else{
      console.log("prueba " + this.indexVarP);

      console.log(this.form2.get('observacionesTA').value);
      console.log(this.prestamos[this.indexVarP]['sol_id']);
      console.log(this.prestamos[this.indexVarP]['inv_id']);
      this._requests.createSolicitudP3(this.form2.get('observacionesTA').value, this.prestamos[this.indexVarP]['sol_id']).subscribe(
        (success: any) => {
          if (success.exito) {
            console.log("Exito");
          } else {
            alert('error en el registro, mensaje del server: ' + success.desc);
          }
        },
        (error) => {
          alert("Error en el servidor.")
        }
      );
  
  
      this._requests.updateInvEst(this.prestamos[this.indexVarP]['inv_id'], 0).subscribe(
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
  
  
      this._requests.updateInventario(this.prestamos[this.indexVarP]['prest_id']).subscribe(
        (success: any) => {
          if (success.exito) {
            alert("Solicitud registrada exitosamente.");
            window.location.href = '/';
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

}
