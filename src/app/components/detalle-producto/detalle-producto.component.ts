import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RequestsService } from 'src/app/services/requests.service';

// API Key: AIzaSyA5XCX6GS2djp8PyY6XY8z7VeziV1DxyQU

@Component({
  selector: 'app-detalle-producto',
  templateUrl: './detalle-producto.component.html',
  styleUrls: ['./detalle-producto.component.css']
})
export class DetalleProductoComponent implements OnInit {
  id: any;
  categorias: any;
  producto_info: any;
  inventario: any;
  modo_creacion: boolean = false;
  formulario: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private _requests: RequestsService,
    private _fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    console.log(this.id);

    this.formulario = this._fb.group({
      nserie: ['', [Validators.required, Validators.email]],
      nfactura: ['', [Validators.required]],
      
    });

    this._requests.getProductoInfo(this.id).subscribe(
      (success: any) => {
        if (success.exito) {
          this.categorias = success.categorias;
          this.producto_info = success.producto;
          this.inventario = success.inventario;
        } else {
          this.categorias = null;
          alert('Error en el servidor. Mensaje: ' + success.desc);
        }
      },
      (error) => {
        this.categorias = null;
        alert('Error en el servicio, contacta con un administrador.');
      }
    )
  }
}
