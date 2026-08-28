import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendingMachineCreate } from './vending-machine-create';

describe('VendingMachineCreate', () => {
  let component: VendingMachineCreate;
  let fixture: ComponentFixture<VendingMachineCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VendingMachineCreate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VendingMachineCreate);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
