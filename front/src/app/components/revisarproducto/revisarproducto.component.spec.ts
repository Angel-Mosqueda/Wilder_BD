import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RevisarproductoComponent } from './revisarproducto.component';

describe('RevisarproductoComponent', () => {
  let component: RevisarproductoComponent;
  let fixture: ComponentFixture<RevisarproductoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RevisarproductoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RevisarproductoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
