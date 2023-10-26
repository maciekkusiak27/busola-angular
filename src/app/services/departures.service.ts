import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DeparturesData } from '../models/departure.model';

@Injectable({
  providedIn: 'root',
})
export class DeparturesService {
  private apiUrl =
    'https://raw.githubusercontent.com/maciekkusiak27/busola-json/main/departures.json';

  constructor(private http: HttpClient) {}

  getDeparturesData(): Observable<DeparturesData> {
    return this.http.get<DeparturesData>(this.apiUrl);
  }
}
