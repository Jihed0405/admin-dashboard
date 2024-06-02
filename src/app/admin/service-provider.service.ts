import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { BASE_URL } from './const/consts';
import { ServiceProvider } from './Models/serviceProvider';

@Injectable({
  providedIn: 'root'
})
export class ServiceProviderService {
  private apiUrl = `${BASE_URL}/api/service-providers`;

  constructor(private http: HttpClient) {}

  getAllServiceProviders(): Observable<ServiceProvider[]> {
    return this.http.get<ServiceProvider[]>(this.apiUrl);
  }

  createServiceProvider(serviceProvider: ServiceProvider): Observable<ServiceProvider> {
    return this.http.post<ServiceProvider>(`${this.apiUrl}/create`, serviceProvider).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  updateServiceProvider(id: number, serviceProvider: ServiceProvider): Observable<ServiceProvider> {
    return this.http.put<ServiceProvider>(`${this.apiUrl}/${id}`, serviceProvider).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  deleteServiceProvider(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred. Please try again.';

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      if (error.status === 0) {
        errorMessage = 'No connection. Verify application is running.';
      } else if (error.status >= 400 && error.status < 500) {
        if (typeof error.error === 'string') {
          console.log(error);
          try {
            const serverError = JSON.parse(error.error);
            if (serverError.message) {
              try {
                errorMessage = this.extractAndSortMessages(serverError.message);
              } catch (e) {
                errorMessage = serverError.message;
              }
            }
          } catch (e) {
            errorMessage = error.error;
          }
        } else if (error.error.message) {
          try {
            errorMessage = this.extractAndSortMessages(error.error.message);
          } catch (e) {
            errorMessage = error.error.message;
          }
        }
      } else if (error.status >= 500) {
        try {
          errorMessage = this.extractAndSortMessages(error.error.message);
        } catch (e) {
          errorMessage = error.error;
        }
      }
    }

    return throwError(errorMessage);
  }

  private extractAndSortMessages(messages: string): string {
    const messageArray = messages.split(', ');
    const sortedMessages = messageArray.sort();
    const cleanedMessages = sortedMessages.map(message => {
      const splitMessage = message.split(': ');
      return splitMessage.length > 1 ? splitMessage[1] : splitMessage[0];
    });
    return cleanedMessages.join(', ');
  }
}
