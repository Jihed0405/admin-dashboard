import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ServiceEntity } from './Models/service-entity.model';
import { BASE_URL } from './const/consts';


@Injectable({
  providedIn: 'root'
})
export class ServiceEntityService {
  private apiUrl = `${BASE_URL}/api/services`;
  constructor(private http: HttpClient) {}

  getAllServices(): Observable<ServiceEntity[]> {
    return this.http.get<ServiceEntity[]>(this.apiUrl);
  }

  createService(service: ServiceEntity): Observable<ServiceEntity> {
    return this.http.post<ServiceEntity>(`${this.apiUrl}/create`, service);
  }

  updateService(id: number, service: ServiceEntity): Observable<ServiceEntity> {
    return this.http.put<ServiceEntity>(`${this.apiUrl}/${id}`, service);
  }

  deleteService(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
