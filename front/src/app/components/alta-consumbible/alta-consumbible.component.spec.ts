import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AltaConsumbibleComponent } from './alta-consumbible.component';

describe('AltaConsumbibleComponent', () => {
  let component: AltaConsumbibleComponent;
  let fixture: ComponentFixture<AltaConsumbibleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AltaConsumbibleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AltaConsumbibleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
