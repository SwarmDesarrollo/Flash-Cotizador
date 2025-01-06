import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ForDeliveryComponent } from './for-delivery.component';

describe('ForDeliveryComponent', () => {
  let component: ForDeliveryComponent;
  let fixture: ComponentFixture<ForDeliveryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ForDeliveryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForDeliveryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
