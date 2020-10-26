import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteProductoComponent } from './reporte-producto.component';

describe('ReporteProductoComponent', () => {
  let component: ReporteProductoComponent;
  let fixture: ComponentFixture<ReporteProductoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReporteProductoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReporteProductoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
