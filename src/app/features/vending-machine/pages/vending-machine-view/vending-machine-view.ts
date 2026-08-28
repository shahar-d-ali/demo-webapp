import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { VendingMachineService } from '../../services/vending-machine.service';
import { VendingMachineResponseDto } from '../../interfaces/vending-machine-response';

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
  selector: 'app-vending-machine-view',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatSnackBarModule
  ],
  templateUrl: './vending-machine-view.html',
  styleUrl: './vending-machine-view.scss',
})
export class VendingMachineView implements OnInit {
  machine = signal<VendingMachineResponseDto | null>(null);
  isLoading = signal(true);

  private vendingMachineService = inject(VendingMachineService);
  private activatedRoute = inject(ActivatedRoute);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);

  ngOnInit(): void {
    this.loadVendingMachine();
  }

  private loadVendingMachine(): void {
    this.activatedRoute.params.subscribe((params) => {
      const id = params['id'];
      if (id) {
        this.vendingMachineService.getVendingMachineById(id).subscribe({
          next: (machine) => {
            this.machine.set(machine);
            this.isLoading.set(false);
          },
          error: (error) => {
            this.isLoading.set(false);
            console.error('Error loading vending machine:', error);
            this.snackBar.open('Failed to load vending machine. Please try again.', 'Close', { duration: 5000 });
            this.router.navigate(['/vending-machines']);
          }
        });
      }
    });
  }

  onEdit(): void {
    const machine = this.machine();
    if (machine) {
      this.router.navigate(['/vending-machines', machine.id, 'edit']);
    }
  }

  onBack(): void {
    this.router.navigate(['/vending-machines']);
  }

  statusTagClass(status: string): string {
    return STATUS_TAG_CLASS[status] ?? 'tag-outline';
  }

  statusLabel(status: string): string {
    return STATUS_LABEL[status] ?? status;
  }
}
