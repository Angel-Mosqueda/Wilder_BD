import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteGraficasComponent } from './reporte-graficas.component';

describe('ReporteGraficasComponent', () => {
  let component: ReporteGraficasComponent;
  let fixture: ComponentFixture<ReporteGraficasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReporteGraficasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReporteGraficasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
