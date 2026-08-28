import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterModule } from '@angular/router';
import { LocationService, LocationResponseDto } from '../../services/location.service';

const PAGE_SIZE = 10;

@Component({
  selector: 'app-location-list',
  standalone: true,
  imports: [CommonModule, MatSnackBarModule, RouterModule],
  templateUrl: './location-list.html',
  styleUrl: './location-list.scss',
})
export class LocationList implements OnInit {
  private locationService = inject(LocationService);
  private snackBar = inject(MatSnackBar);

  locations = signal<LocationResponseDto[]>([]);
  isLoading = signal(false);
  search = signal('');
  page = signal(0);

  readonly pageSize = PAGE_SIZE;

  filtered = computed(() => {
    const term = this.search().trim().toLowerCase();
    if (!term) {
      return this.locations();
    }
    return this.locations().filter((l) =>
      l.name?.toLowerCase().includes(term)
      || l.address?.toLowerCase().includes(term)
      || l.city?.toLowerCase().includes(term)
      || l.state?.toLowerCase().includes(term)
    );
  });

  pageCount = computed(() => Math.max(1, Math.ceil(this.filtered().length / this.pageSize)));

  paged = computed(() => {
    const rows = this.filtered();
    const start = this.page() * this.pageSize;
    return rows.slice(start, start + this.pageSize);
  });

  rangeStart = computed(() => (this.filtered().length === 0 ? 0 : this.page() * this.pageSize + 1));
  rangeEnd = computed(() => Math.min(this.filtered().length, (this.page() + 1) * this.pageSize));

  ngOnInit(): void {
    this.loadLocations();
  }

  loadLocations(): void {
    this.isLoading.set(true);
    this.locationService.getAllLocations().subscribe({
      next: (locations) => {
        this.locations.set(locations);
        this.isLoading.set(false);
      },
      error: (error) => {
        this.isLoading.set(false);
        console.error('Error loading locations:', error);
        this.snackBar.open('Failed to load locations. Please try again.', 'Close', { duration: 5000 });
      },
    });
  }

  onSearch(value: string): void {
    this.search.set(value);
    this.page.set(0);
  }

  prevPage(): void {
    this.page.update((p) => Math.max(0, p - 1));
  }

  nextPage(): void {
    this.page.update((p) => Math.min(this.pageCount() - 1, p + 1));
  }

  deleteLocation(id: number): void {
    if (confirm('Are you sure you want to delete this location?')) {
      this.locationService.deleteLocation(id).subscribe({
        next: () => {
          this.snackBar.open('Location deleted successfully!', 'Close', { duration: 3000 });
          this.loadLocations();
        },
        error: (error) => {
          console.error('Error deleting location:', error);
          this.snackBar.open('Failed to delete location. Please try again.', 'Close', { duration: 5000 });
        },
      });
    }
  }
}
