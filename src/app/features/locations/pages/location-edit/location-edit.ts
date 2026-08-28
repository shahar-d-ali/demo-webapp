import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { LocationService, LocationResponseDto } from '../../services/location.service';

@Component({
  selector: 'app-location-edit',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    RouterModule
  ],
  templateUrl: './location-edit.html',
  styleUrls: ['./location-edit.scss']
})
export class LocationEditComponent implements OnInit {
  locationForm!: FormGroup;
  isSubmitting = signal(false);
  location = signal<LocationResponseDto | null>(null);
  locationId: number | null = null;
  isLoading = false;

  private formBuilder = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private locationService = inject(LocationService);
  private snackBar = inject(MatSnackBar);

  constructor() {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.locationId = params['id'];
      if (this.locationId) {
        this.loadLocation(this.locationId);
      }
    });
  }

  private initializeForm(): void {
    this.locationForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      address: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(255)]],
      city: [''],
      state: [''],
      zipCode: [''],
      country: ['']
    });
  }

  get name() {
    return this.locationForm.get('name');
  }

  get address() {
    return this.locationForm.get('address');
  }

  private loadLocation(id: number): void {
    this.isLoading = true;
    this.locationService.getLocationById(id).subscribe({
      next: (location) => {
        this.location.set(location);
        this.locationForm.patchValue({
          name: location.name,
          address: location.address,
          city: location.city,
          state: location.state,
          zipCode: location.zipCode,
          country: location.country
        });
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error loading location:', error);
        this.snackBar.open('Failed to load location. Please try again.', 'Close', { duration: 5000 });
        this.router.navigate(['/locations']);
      }
    });
  }

  onSubmit(): void {
    if (this.locationForm.valid && this.locationId) {
      this.isSubmitting.set(true);
      const formData = this.locationForm.value;

      this.locationService.updateLocation(this.locationId, formData).subscribe({
        next: (response) => {
          this.isSubmitting.set(false);
          this.snackBar.open('Location updated successfully!', 'Close', { duration: 3000 });
          this.router.navigate(['/locations']);
        },
        error: (error) => {
          this.isSubmitting.set(false);
          console.error('Error updating location:', error);
          this.snackBar.open('Failed to update location. Please try again.', 'Close', { duration: 5000 });
        }
      });
    }
  }
}
