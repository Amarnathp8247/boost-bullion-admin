// src/app/services/transaction-services.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.staging';

@Injectable({
  providedIn: 'root'
})
export class TransactionServicesService {
  private baseUrl = `${environment.apiUrl}`; // Adjust to your API endpoint

  constructor(private http: HttpClient) {}

  // getTransactions(page: number, size: number , token:any): Observable<any[]> {
  //   const headers = new HttpHeaders({
  //     'Authorization': token // Replace with your actual token
  //   });

  //   return this.http.get<any[]>(`${this.baseUrl}/user/wallet?page=${page}&sizePerPage=${size}`, { headers });
  // }

  getTransactions(page: number, size: number, token: string, params: any): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', token);

    return this.http.get<any>(`${this.baseUrl}/user/wallet`, { headers, params });
}
}