import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { VendingProductRequestDto } from '../interfaces/vending-product-request';
import { VendingProductResponseDto } from '../interfaces/vending-product-response';

@Injectable({
  providedIn: 'root',
})
export class VendingProductService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl + '/planogram/vending-products';

  getByVendingMachine(vendingMachineId: number): Observable<VendingProductResponseDto[]> {
    return this.http.get<VendingProductResponseDto[]>(this.apiUrl, {
      params: { vendingMachineId },
    });
  }

  createVendingProduct(requestDto: VendingProductRequestDto): Observable<VendingProductResponseDto> {
    return this.http.post<VendingProductResponseDto>(this.apiUrl, requestDto);
  }

  updateVendingProduct(id: number, requestDto: VendingProductRequestDto): Observable<VendingProductResponseDto> {
    return this.http.put<VendingProductResponseDto>(`${this.apiUrl}/${id}`, requestDto);
  }

  deleteVendingProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
