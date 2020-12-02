import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsumibleInventarioComponent } from './consumible-inventario.component';

describe('ConsumibleInventarioComponent', () => {
  let component: ConsumibleInventarioComponent;
  let fixture: ComponentFixture<ConsumibleInventarioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsumibleInventarioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsumibleInventarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
