import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrincipalOrdersComponent } from './principal-orders.component';

describe('PrincipalOrdersComponent', () => {
  let component: PrincipalOrdersComponent;
  let fixture: ComponentFixture<PrincipalOrdersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrincipalOrdersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrincipalOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
