import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteConsumibleComponent } from './reporte-consumible.component';

describe('ReporteConsumibleComponent', () => {
  let component: ReporteConsumibleComponent;
  let fixture: ComponentFixture<ReporteConsumibleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReporteConsumibleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReporteConsumibleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
