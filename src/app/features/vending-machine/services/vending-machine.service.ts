import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { VendingMachineRequestDto } from '../interfaces/vending-machine-request';
import { VendingMachineResponseDto } from '../interfaces/vending-machine-response';

@Injectable({
  providedIn: 'root',
})
export class VendingMachineService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl + '/assets/vending-machines';

  getAllVendingMachines(): Observable<VendingMachineResponseDto[]> {
    return this.http.get<VendingMachineResponseDto[]>(this.apiUrl);
  }

  getVendingMachinesByLocationId(locationId: number): Observable<VendingMachineResponseDto[]> {
    return this.http.get<VendingMachineResponseDto[]>(this.apiUrl, {
      params: { locationId: locationId }
    });
  }

  getVendingMachineById(id: number): Observable<VendingMachineResponseDto> {
    return this.http.get<VendingMachineResponseDto>(`${this.apiUrl}/${id}`);
  }

  createVendingMachine(requestDto: VendingMachineRequestDto, locationId: number): Observable<VendingMachineResponseDto> {
    return this.http.post<VendingMachineResponseDto>(`${this.apiUrl}?locationId=${locationId}`, requestDto);
  }

  updateVendingMachine(id: number, requestDto: VendingMachineRequestDto, locationId?: number): Observable<VendingMachineResponseDto> {
    const url = locationId
      ? `${this.apiUrl}/${id}?locationId=${locationId}`
      : `${this.apiUrl}/${id}`;
    return this.http.put<VendingMachineResponseDto>(url, requestDto);
  }

  deleteVendingMachine(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
