import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendingMachineEdit } from './vending-machine-edit';

describe('VendingMachineEdit', () => {
  let component: VendingMachineEdit;
  let fixture: ComponentFixture<VendingMachineEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VendingMachineEdit],
    }).compileComponents();

    fixture = TestBed.createComponent(VendingMachineEdit);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
