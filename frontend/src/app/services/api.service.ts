import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Station } from '../models/station.model';

export interface HealthResponse {
  status: string;
  service: string;
  uptimeSeconds: number;
  timestamp: string;
}

export interface AppInfoResponse {
  name: string;
  version: string;
  description: string;
  technology: Record<string, string>;
  demonstrationStationsCount: number;
  endpoints: Array<{ method: string; path: string; description: string }>;
  persistenceNote: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly baseUrl = 'http://localhost:3000/api';

  private isBackendOnlineSubject = new BehaviorSubject<boolean>(false);
  public isBackendOnline$: Observable<boolean> = this.isBackendOnlineSubject.asObservable();

  constructor(private http: HttpClient) {
    this.checkHealth();
  }

  /**
   * Checks the health endpoint of the Node.js Express server
   */
  public checkHealth(): Observable<HealthResponse | null> {
    return this.http.get<HealthResponse>(`${this.baseUrl}/health`).pipe(
      tap(() => this.isBackendOnlineSubject.next(true)),
      catchError(err => {
        // Backend offline or unreachable
        this.isBackendOnlineSubject.next(false);
        return of(null);
      })
    );
  }

  /**
   * Fetches application metadata from backend
   */
  public getInfo(): Observable<AppInfoResponse | null> {
    return this.http.get<AppInfoResponse>(`${this.baseUrl}/info`).pipe(
      catchError(() => of(null))
    );
  }

  /**
   * Fetches demonstration stations from backend
   */
  public getDemonstrationStations(): Observable<Station[]> {
    return this.http.get<Station[]>(`${this.baseUrl}/stations`).pipe(
      catchError(err => {
        console.warn('Backend /api/stations unavailable:', err);
        return of([]);
      })
    );
  }

  /**
   * Fetches a single demonstration station by id from backend
   */
  public getStationById(id: string): Observable<Station | null> {
    return this.http.get<Station>(`${this.baseUrl}/stations/${id}`).pipe(
      catchError(err => {
        console.warn(`Backend /api/stations/${id} unavailable:`, err);
        return of(null);
      })
    );
  }
}
