import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendingMachineView } from './vending-machine-view';

describe('VendingMachineView', () => {
  let component: VendingMachineView;
  let fixture: ComponentFixture<VendingMachineView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VendingMachineView]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VendingMachineView);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
