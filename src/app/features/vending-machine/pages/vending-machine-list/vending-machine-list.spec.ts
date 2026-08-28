import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendingMachineList } from './vending-machine-list';

describe('VendingMachineList', () => {
  let component: VendingMachineList;
  let fixture: ComponentFixture<VendingMachineList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VendingMachineList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VendingMachineList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
