import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReffralTreeComponent } from './reffral-tree.component';

describe('ReffralTreeComponent', () => {
  let component: ReffralTreeComponent;
  let fixture: ComponentFixture<ReffralTreeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReffralTreeComponent]
    });
    fixture = TestBed.createComponent(ReffralTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
