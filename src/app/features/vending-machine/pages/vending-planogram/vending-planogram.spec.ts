import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendingPlanogram } from './vending-planogram';

describe('VendingPlanogram', () => {
  let component: VendingPlanogram;
  let fixture: ComponentFixture<VendingPlanogram>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VendingPlanogram]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VendingPlanogram);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
