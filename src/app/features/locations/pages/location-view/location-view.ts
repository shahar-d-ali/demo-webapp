import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Location } from '@angular/common';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { LocationService, LocationResponseDto } from '../../services/location.service';

@Component({
  selector: 'app-location-view',
  standalone: true,
  imports: [
    CommonModule,
    MatSnackBarModule,
    RouterModule
  ],
  templateUrl: './location-view.html',
  styleUrl: './location-view.scss',
})
export class LocationView implements OnInit {
  location = signal<LocationResponseDto | null>(null);
  locationId: number | null = null;
  isLoading = false;

  private route = inject(ActivatedRoute);
  private angularLocation = inject(Location);
  private locationService = inject(LocationService);
  private snackBar = inject(MatSnackBar);

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.locationId = params['id'];
      if (this.locationId) {
        this.loadLocation(this.locationId);
      }
    });
  }

  private loadLocation(id: number): void {
    this.isLoading = true;
    this.locationService.getLocationById(id).subscribe({
      next: (location) => {
        this.location.set(location);
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error loading location:', error);
        this.snackBar.open('Failed to load location. Please try again.', 'Close', { duration: 5000 });
        this.goBack();
      }
    });
  }

  goBack(): void {
    this.angularLocation.back();
  }
}
