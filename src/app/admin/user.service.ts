import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from './Models/user.model';
import { BASE_URL } from './const/consts';


@Injectable({
  providedIn: 'root'
})
export class UserService {
 
  private apiUrl = `${BASE_URL}/api/users`;
  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<User[]> {
    // Assuming you have a method for fetching all users
    return this.http.get<User[]>(this.apiUrl);
  }

  createUser(user: User): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/create`, user);
  }

  updateUser(id: number, user: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, user);
  }

  deleteUser(id: number): Observable<void> {
    // Assuming there's a delete method for users
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
