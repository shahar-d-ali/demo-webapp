import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { Router, RouterModule } from '@angular/router';
import { LocationService } from '../../services/location.service';

@Component({
  selector: 'app-location-create',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    RouterModule
  ],
  templateUrl: './location-create.html',
  styleUrl: './location-create.scss',
})
export class LocationCreate {
  locationForm!: FormGroup;
  isSubmitting = signal(false);

  private formBuilder = inject(FormBuilder);
  private locationService = inject(LocationService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  constructor() {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.locationForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      address: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(255)]]
    });
  }

  get name() {
    return this.locationForm.get('name');
  }

  get address() {
    return this.locationForm.get('address');
  }

  onSubmit(): void {
    if (this.locationForm.valid) {
      this.isSubmitting.set(true);
      const formData = this.locationForm.value;

      this.locationService.createLocation(formData).subscribe({
        next: (response) => {
          this.isSubmitting.set(false);
          this.snackBar.open('Location created successfully!', 'Close', { duration: 3000 });
          this.router.navigate(['/locations']);
        },
        error: (error) => {
          this.isSubmitting.set(false);
          console.error('Error creating location:', error);
          this.snackBar.open('Failed to create location. Please try again.', 'Close', { duration: 5000 });
        }
      });
    }
  }
}
