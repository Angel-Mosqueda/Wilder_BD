import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EliminarConsumibleComponent } from './eliminar-consumible.component';

describe('EliminarConsumibleComponent', () => {
  let component: EliminarConsumibleComponent;
  let fixture: ComponentFixture<EliminarConsumibleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EliminarConsumibleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EliminarConsumibleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
