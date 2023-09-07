import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ParametersCone, Triangulation } from './types.model';
import { BehaviorSubject, Observable, catchError, of, retry, take } from 'rxjs';
import { environment } from 'src/environments/environment';

const serverUrl = environment.apiUrl;
const apiServerUrl = `${serverUrl}/calc-cone`;

@Injectable({
  providedIn: 'root',
})
export class ConeService {
  private parameters: ParametersCone = {
    height: 0,
    radius: 0,
    segments: 0,
  };

  private triangulations$$ = new BehaviorSubject<Triangulation[]>([]);
  public triangulations$ = this.triangulations$$.asObservable();

  public get parametersCone(): ParametersCone {
    return this.parameters;
  }

  public set parametersCone(parameters: ParametersCone) {
    this.parameters = parameters;
  }

  public get triangulations(): Triangulation[] {
    return this.triangulations$$.value;
  }

  constructor(private http: HttpClient) {}

  public updateTriangulations(newTriangulations: Triangulation[]): void {
    this.triangulations$$.next(newTriangulations);
  }

  public getTriangulationsFromServer = (): Observable<Triangulation[]> => {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http
      .post<Triangulation[]>(apiServerUrl, this.parameters, { headers })
      .pipe(
        retry(3),
        catchError(this.handleError<Triangulation[]>('getTriangulations'))
      );
  };

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: HttpErrorResponse): Observable<T> => {
      console.error(error);
      console.log(`${operation} failed: ${error.message}`);

      return of(result as T);
    };
  }
}
