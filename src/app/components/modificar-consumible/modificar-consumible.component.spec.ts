import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModificarConsumibleComponent } from './modificar-consumible.component';

describe('ModificarConsumibleComponent', () => {
  let component: ModificarConsumibleComponent;
  let fixture: ComponentFixture<ModificarConsumibleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModificarConsumibleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModificarConsumibleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
