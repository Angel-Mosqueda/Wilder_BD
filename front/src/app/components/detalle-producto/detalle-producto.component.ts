import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RequestsService } from 'src/app/services/requests.service';
import { DomSanitizer } from "@angular/platform-browser"
import { Globals } from 'src/app/globals/globals';

// API Key: AIzaSyA5XCX6GS2djp8PyY6XY8z7VeziV1DxyQU

@Component({
  selector: 'app-detalle-producto',
  templateUrl: './detalle-producto.component.html',
  styleUrls: ['./detalle-producto.component.css']
})
export class DetalleProductoComponent implements OnInit {
  @ViewChild('embebidoFac', { static: true }) pdf: ElementRef;
  id: any;
  categorias: any;
  producto_info: any;
  inventario: any;
  modo_creacion: boolean = false;
  formulario: FormGroup;
  ubicaciones: any;
  proveedores: any;
  fecha: Date = new Date();
  submitted: boolean = false;
  file: File;
  globals: Globals;
  /*mantenimiento: any;
  formulario_2: FormGroup;*/

  constructor(
    globals: Globals,
    private route: ActivatedRoute,
    private _requests: RequestsService,
    private _fb: FormBuilder,
    public sanitizer: DomSanitizer,
    private _renderer: Renderer2,
    public window: Window
  ) {
    this.globals = globals;
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    console.log(this.id);

    this._requests.getUbicaciones().subscribe(
      (success: any) => {
        if (success.exito) {
          this.ubicaciones = success.ubicaciones;
        } else {
          this.ubicaciones = null;
          alert('Error en el servidor. Mensaje: ' + success.desc);
        }
      },
      (error) => {
        this.ubicaciones = null;
        alert('Error en el servicio, contacta con un administrador,');
      }
    )

    this._requests.getProveedores().subscribe(
      (success: any) => {
        if (success.exito) {
          this.proveedores = success.proveedores;
        } else {
          this.proveedores = null;
          alert('Error en el servidor. Mensaje: ' + success.desc);
        }
      },
      (error) => {
        this.proveedores = null;
        alert('Error en el servicio, contacta con un administrador,');
      }
    )

    this.formulario = this._fb.group({
      nserie: ['', [Validators.required]],
      nfactura: ['', [Validators.required]],
      ubicacion: ['', [Validators.required]],
      costo: ['', [Validators.required]],
      estado: ['', [Validators.required]],
      observaciones: ['', [Validators.required]],
      proveedor: ['', [Validators.required]],
      fecha_compra: ['', [Validators.required]],
      factura: ['', [Validators.required]],
    });

    /*this.formulario_2 = this._fb.group({
      nserie: ['', [Validators.required]],
      nfactura: ['', [Validators.required]],
      ubicacion: ['', [Validators.required]],
      costo: ['', [Validators.required]],
      estado: ['', [Validators.required]],
      observaciones: ['', [Validators.required]],
      proveedor: ['', [Validators.required]],
      fecha_compra: ['', [Validators.required]],
      factura: ['', [Validators.required]],
    });*/

    this._requests.getProductoInfo(this.id).subscribe(
      (success: any) => {
        if (success.exito) {
          this.categorias = success.categorias;
          this.producto_info = success.producto;
          this.inventario = success.inventario;
          console.log(this.inventario);
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

  get f() { return this.formulario.controls; }

  crearInventario() {
    this.submitted = true;
    if (this.formulario.invalid) {
      return;
    } else {
      let payload = {
        NSERIE: this.formulario.get('nserie').value,
        NFACTURA: this.formulario.get('nfactura').value,
        UBICACION_ID: this.formulario.get('ubicacion').value,
        COSTO: this.formulario.get('costo').value,
        ESTADO: this.formulario.get('estado').value,
        OBSERVACIONES: this.formulario.get('observaciones').value,
        PROVEEDOR: this.formulario.get('proveedor').value,
        FECHA_COMPRA: this.formulario.get('fecha_compra').value,
        FACTURA: this.formulario.get('factura').value
      };
      this._requests.createInventario(payload, this.file, this.id).subscribe(
        (success: any) => {
          if (success.exito) {
            this.inventario = success.inventario;
            console.log(this.inventario);
          } else {
            this.categorias = null;
            alert('Error en el servidor. Mensaje: ' + success.desc);
          }
        },
        (error) => {
          alert("Error en el servidor. Intente más tarde.");
        }
      );
    }
    this.modo_creacion = !this.modo_creacion;
  }

  /*crearMantenimiento(){
    let algo= {
      COSTO: this.formulario_2.get('costo').value,
    }
  }*/

  eliminarInventario(pid) {
    this._requests.eliminarInventario(pid).subscribe(
      (success: any) => {
        if (!success.exito) {
          alert('Error en el servidor. Mensaje: ' + success.desc);
        }
      },
      (error) => {
        alert('Error en el servicio, contacta con un administrador.');
      }
    );
    this._requests.getProductoInfo(this.id).subscribe(
      (success: any) => {
        if (success.exito) {
          this.categorias = success.categorias;
          this.producto_info = success.producto;
          this.inventario = success.inventario;
          console.log(this.inventario);
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


  fileChange(event) {
    this.file = event.target.files.item(0);
  }

  setpdf(recurso: any) {
    this._renderer.removeAttribute(this.pdf.nativeElement, "src");
    setTimeout(() => {
      this._renderer.setAttribute(this.pdf.nativeElement, "src", recurso)
    })
  }
}
