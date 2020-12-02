import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModificarInventarioComponent } from './modificar-inventario.component';

describe('ModificarInventarioComponent', () => {
  let component: ModificarInventarioComponent;
  let fixture: ComponentFixture<ModificarInventarioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModificarInventarioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModificarInventarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
