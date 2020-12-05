import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteMantenimientoComponent } from './reporte-mantenimiento.component';

describe('ReporteMantenimientoComponent', () => {
  let component: ReporteMantenimientoComponent;
  let fixture: ComponentFixture<ReporteMantenimientoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReporteMantenimientoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReporteMantenimientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
