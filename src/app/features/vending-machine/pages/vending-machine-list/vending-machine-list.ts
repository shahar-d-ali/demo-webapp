import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterModule } from '@angular/router';
import { VendingMachineService } from '../../services/vending-machine.service';
import { VendingMachineResponseDto } from '../../interfaces/vending-machine-response';

type StatusFilter = 'all' | 'ACTIVE' | 'MAINTENANCE' | 'INACTIVE' | 'OUT_OF_SERVICE';

const PAGE_SIZE = 10;

const STATUS_TAG_CLASS: Record<string, string> = {
  ACTIVE: 'tag-neutral',
  MAINTENANCE: 'tag-accent',
  INACTIVE: 'tag-outline',
  OUT_OF_SERVICE: 'tag-outline',
};

const STATUS_LABEL: Record<string, string> = {
  ACTIVE: 'Active',
  MAINTENANCE: 'Maintenance',
  INACTIVE: 'Inactive',
  OUT_OF_SERVICE: 'Out of service',
};

@Component({
  selector: 'app-vending-machine-list',
  standalone: true,
  imports: [CommonModule, MatSnackBarModule, RouterModule],
  templateUrl: './vending-machine-list.html',
  styleUrl: './vending-machine-list.scss',
})
export class VendingMachineList implements OnInit {
  private vendingMachineService = inject(VendingMachineService);
  private snackBar = inject(MatSnackBar);

  machines = signal<VendingMachineResponseDto[]>([]);
  isLoading = signal(false);
  search = signal('');
  statusFilter = signal<StatusFilter>('all');
  page = signal(0);

  readonly pageSize = PAGE_SIZE;

  filtered = computed(() => {
    const term = this.search().trim().toLowerCase();
    const status = this.statusFilter();
    return this.machines().filter((m) => {
      const matchesStatus = status === 'all' || m.status === status;
      const matchesTerm = !term
        || m.machineCode.toLowerCase().includes(term)
        || m.model.toLowerCase().includes(term)
        || m.locationName.toLowerCase().includes(term);
      return matchesStatus && matchesTerm;
    });
  });

  pageCount = computed(() => Math.max(1, Math.ceil(this.filtered().length / this.pageSize)));

  paged = computed(() => {
    const rows = this.filtered();
    const start = this.page() * this.pageSize;
    return rows.slice(start, start + this.pageSize).map((m) => ({
      ...m,
      tagClass: STATUS_TAG_CLASS[m.status] ?? 'tag-outline',
      statusLabel: STATUS_LABEL[m.status] ?? m.status,
    }));
  });

  activeCount = computed(() => this.machines().filter((m) => m.status === 'ACTIVE').length);
  maintenanceCount = computed(() => this.machines().filter((m) => m.status === 'MAINTENANCE').length);

  rangeStart = computed(() => (this.filtered().length === 0 ? 0 : this.page() * this.pageSize + 1));
  rangeEnd = computed(() => Math.min(this.filtered().length, (this.page() + 1) * this.pageSize));

  ngOnInit(): void {
    this.loadVendingMachines();
  }

  loadVendingMachines(): void {
    this.isLoading.set(true);
    this.vendingMachineService.getAllVendingMachines().subscribe({
      next: (machines) => {
        this.machines.set(machines);
        this.isLoading.set(false);
      },
      error: (error) => {
        this.isLoading.set(false);
        console.error('Error loading vending machines:', error);
        this.snackBar.open('Failed to load vending machines. Please try again.', 'Close', { duration: 5000 });
      },
    });
  }

  onSearch(value: string): void {
    this.search.set(value);
    this.page.set(0);
  }

  setStatusFilter(status: StatusFilter): void {
    this.statusFilter.set(status);
    this.page.set(0);
  }

  prevPage(): void {
    this.page.update((p) => Math.max(0, p - 1));
  }

  nextPage(): void {
    this.page.update((p) => Math.min(this.pageCount() - 1, p + 1));
  }

  deleteVendingMachine(id: number): void {
    if (confirm('Are you sure you want to delete this vending machine?')) {
      this.vendingMachineService.deleteVendingMachine(id).subscribe({
        next: () => {
          this.snackBar.open('Vending machine deleted successfully!', 'Close', { duration: 3000 });
          this.loadVendingMachines();
        },
        error: (error) => {
          console.error('Error deleting vending machine:', error);
          this.snackBar.open('Failed to delete vending machine. Please try again.', 'Close', { duration: 5000 });
        },
      });
    }
  }
}
