import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrestamoProductoComponent } from './prestamo-producto.component';

describe('PrestamoProductoComponent', () => {
  let component: PrestamoProductoComponent;
  let fixture: ComponentFixture<PrestamoProductoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrestamoProductoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrestamoProductoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
