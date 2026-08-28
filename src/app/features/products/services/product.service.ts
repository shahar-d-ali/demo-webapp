import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ProductRequestDto } from '../interfaces/product-request';
import { ProductResponseDto } from '../interfaces/product-response';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl + '/planogram/products';

  getAllProducts(): Observable<ProductResponseDto[]> {
    return this.http.get<ProductResponseDto[]>(this.apiUrl);
  }

  getProductById(id: number): Observable<ProductResponseDto> {
    return this.http.get<ProductResponseDto>(`${this.apiUrl}/${id}`);
  }

  createProduct(requestDto: ProductRequestDto): Observable<ProductResponseDto> {
    return this.http.post<ProductResponseDto>(this.apiUrl, requestDto);
  }

  updateProduct(id: number, requestDto: ProductRequestDto): Observable<ProductResponseDto> {
    return this.http.put<ProductResponseDto>(`${this.apiUrl}/${id}`, requestDto);
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
