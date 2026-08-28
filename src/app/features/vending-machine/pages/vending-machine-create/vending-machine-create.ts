import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { VendingMachineService } from '../../services/vending-machine.service';
import { LocationService } from '../../../locations/services/location.service';
import { LocationResponseDto } from '../../../locations/services/location.service';

@Component({
  selector: 'app-vending-machine-create',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatSnackBarModule
  ],
  templateUrl: './vending-machine-create.html',
  styleUrl: './vending-machine-create.scss',
})
export class VendingMachineCreate implements OnInit {
  form!: FormGroup;
  isSubmitting = signal(false);
  locations = signal<LocationResponseDto[]>([]);
  isLoadingLocations = false;

  private formBuilder = inject(FormBuilder);
  private vendingMachineService = inject(VendingMachineService);
  private locationService = inject(LocationService);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);

  readonly statuses = ['ACTIVE', 'INACTIVE', 'MAINTENANCE', 'OUT_OF_SERVICE'];

  ngOnInit(): void {
    this.initializeForm();
    this.loadLocations();
  }

  private initializeForm(): void {
    this.form = this.formBuilder.group({
      machineCode: ['', [Validators.required, Validators.minLength(3)]],
      model: ['', [Validators.required, Validators.minLength(2)]],
      status: ['ACTIVE', Validators.required],
      locationId: ['', Validators.required]
    });
  }

  private loadLocations(): void {
    this.isLoadingLocations = true;
    this.locationService.getAllLocations().subscribe({
      next: (locations) => {
        this.locations.set(locations);
        this.isLoadingLocations = false;
      },
      error: (error) => {
        this.isLoadingLocations = false;
        console.error('Error loading locations:', error);
        this.snackBar.open('Failed to load locations. Please try again.', 'Close', { duration: 5000 });
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.snackBar.open('Please fill all required fields correctly.', 'Close', { duration: 3000 });
      return;
    }

    this.isSubmitting.set(true);
    const formValue = this.form.value;

    this.vendingMachineService.createVendingMachine(
      {
        machineCode: formValue.machineCode,
        model: formValue.model,
        status: formValue.status
      },
      formValue.locationId
    ).subscribe({
      next: () => {
        this.snackBar.open('Vending machine created successfully!', 'Close', { duration: 3000 });
        this.router.navigate(['/vending-machines']);
      },
      error: (error) => {
        this.isSubmitting.set(false);
        console.error('Error creating vending machine:', error);
        this.snackBar.open('Failed to create vending machine. Please try again.', 'Close', { duration: 5000 });
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/vending-machines']);
  }

  get machineCodeError(): string {
    const control = this.form.get('machineCode');
    if (control?.hasError('required')) {
      return 'Machine code is required';
    }
    if (control?.hasError('minlength')) {
      return 'Machine code must be at least 3 characters';
    }
    return '';
  }

  get modelError(): string {
    const control = this.form.get('model');
    if (control?.hasError('required')) {
      return 'Model is required';
    }
    if (control?.hasError('minlength')) {
      return 'Model must be at least 2 characters';
    }
    return '';
  }
}
