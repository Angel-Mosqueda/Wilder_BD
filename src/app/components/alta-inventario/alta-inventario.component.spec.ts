import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AltaInventarioComponent } from './alta-inventario.component';

describe('AltaInventarioComponent', () => {
  let component: AltaInventarioComponent;
  let fixture: ComponentFixture<AltaInventarioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AltaInventarioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AltaInventarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
