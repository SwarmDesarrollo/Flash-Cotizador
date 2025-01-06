import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuoteAssignmentComponent } from './quote-assignment.component';

describe('QuoteAssignmentComponent', () => {
  let component: QuoteAssignmentComponent;
  let fixture: ComponentFixture<QuoteAssignmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuoteAssignmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuoteAssignmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
