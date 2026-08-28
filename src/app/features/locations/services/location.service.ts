import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface LocationRequestDto {
  name?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
}

export interface LocationResponseDto {
  id: number;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl + '/assets/locations';

  getAllLocations(): Observable<LocationResponseDto[]> {
    return this.http.get<LocationResponseDto[]>(this.apiUrl);
  }

  getLocationById(id: number): Observable<LocationResponseDto> {
    return this.http.get<LocationResponseDto>(`${this.apiUrl}/${id}`);
  }

  createLocation(requestDto: LocationRequestDto): Observable<LocationResponseDto> {
    return this.http.post<LocationResponseDto>(this.apiUrl, requestDto);
  }

  updateLocation(id: number, requestDto: LocationRequestDto): Observable<LocationResponseDto> {
    return this.http.put<LocationResponseDto>(`${this.apiUrl}/${id}`, requestDto);
  }

  deleteLocation(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
