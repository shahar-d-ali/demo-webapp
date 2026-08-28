import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { ProductService } from '../../services/product.service';
import { ProductResponseDto } from '../../interfaces/product-response';

@Component({
  selector: 'app-product-view',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatSnackBarModule
  ],
  templateUrl: './product-view.html',
  styleUrl: './product-view.scss',
})
export class ProductView implements OnInit {
  product = signal<ProductResponseDto | null>(null);
  isLoading = signal(true);

  private productService = inject(ProductService);
  private activatedRoute = inject(ActivatedRoute);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);

  ngOnInit(): void {
    this.loadProduct();
  }

  private loadProduct(): void {
    this.activatedRoute.params.subscribe((params) => {
      const id = params['id'];
      if (id) {
        this.productService.getProductById(id).subscribe({
          next: (product) => {
            this.product.set(product);
            this.isLoading.set(false);
          },
          error: (error) => {
            this.isLoading.set(false);
            console.error('Error loading product:', error);
            this.snackBar.open('Failed to load product. Please try again.', 'Close', { duration: 5000 });
            this.router.navigate(['/products']);
          }
        });
      }
    });
  }

  onEdit(): void {
    const product = this.product();
    if (product) {
      this.router.navigate(['/products', product.id, 'edit']);
    }
  }

  onBack(): void {
    this.router.navigate(['/products']);
  }
}
