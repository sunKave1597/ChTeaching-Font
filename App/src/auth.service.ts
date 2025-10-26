import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from './env';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from './app/models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient) {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this.userSubject.next(JSON.parse(storedUser));
    }
  }

  login(email: string, password: string): Observable<User> {
    return this.http.post<User>(`${environment.apiUrl}/auth/login`, { email, password });
  }

  setUser(user: User) {
    this.userSubject.next(user);
    localStorage.setItem('user', JSON.stringify(user));
  }

  getUser(): User | null {
    return this.userSubject.value;
  }

  logout() {
    this.userSubject.next(null);
    localStorage.removeItem('user');
  }
}