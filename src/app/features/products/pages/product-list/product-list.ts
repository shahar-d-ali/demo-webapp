import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterModule } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { ProductResponseDto } from '../../interfaces/product-response';

const PAGE_SIZE = 10;

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, MatSnackBarModule, RouterModule],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss',
})
export class ProductList implements OnInit {
  private productService = inject(ProductService);
  private snackBar = inject(MatSnackBar);

  products = signal<ProductResponseDto[]>([]);
  isLoading = signal(false);
  search = signal('');
  page = signal(0);

  readonly pageSize = PAGE_SIZE;

  filtered = computed(() => {
    const term = this.search().trim().toLowerCase();
    if (!term) {
      return this.products();
    }
    return this.products().filter((p) =>
      p.name?.toLowerCase().includes(term)
      || p.sku?.toLowerCase().includes(term)
      || p.brand?.toLowerCase().includes(term)
      || p.category?.toLowerCase().includes(term)
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
    this.loadProducts();
  }

  loadProducts(): void {
    this.isLoading.set(true);
    this.productService.getAllProducts().subscribe({
      next: (products) => {
        this.products.set(products);
        this.isLoading.set(false);
      },
      error: (error) => {
        this.isLoading.set(false);
        console.error('Error loading products:', error);
        this.snackBar.open('Failed to load products. Please try again.', 'Close', { duration: 5000 });
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

  deleteProduct(id: number): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(id).subscribe({
        next: () => {
          this.snackBar.open('Product deleted successfully!', 'Close', { duration: 3000 });
          this.loadProducts();
        },
        error: (error) => {
          console.error('Error deleting product:', error);
          this.snackBar.open('Failed to delete product. Please try again.', 'Close', { duration: 5000 });
        },
      });
    }
  }
}
