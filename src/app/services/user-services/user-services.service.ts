import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment.staging';

@Injectable({
  providedIn: 'root'
})
export class UserServicesService {

  private baseUrl = `${environment.apiUrl}`; // Adjust to your API endpoint

  constructor(private http: HttpClient) { }

  // getTransactions(page: number, size: number , token:any): Observable<any[]> {
  //   const headers = new HttpHeaders({
  //     'Authorization': token // Replace with your actual token
  //   });

  //   return this.http.get<any[]>(`${this.baseUrl}/user/wallet?page=${page}&sizePerPage=${size}`, { headers });
  // }

  getUserList(page: number, size: number, token: string, params: any): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', token);

    return this.http.get<any>(`${this.baseUrl}/admin/user/list`, { headers, params });
  }

  getReferralInfomation(referralCode: string, token: string): Observable<any> {
    const headers = new HttpHeaders({ Authorization: token });
    return this.http.get(`${this.baseUrl}/admin/user/details?referralCode=${referralCode}`, { headers });
  }
  getReferralList(token: any, id: any): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', token);
    return this.http.get(`${this.baseUrl}/admin/user/referral/tree?userId=${id}`, { headers });
  }

  getUserDataWithId(token: any, id: any): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', token);
    return this.http.get(`${this.baseUrl}/admin/user/${id}`, { headers });
  }

  // Method to sign up a user
  updateProfile(token: string, updatedData: any): Observable<any> {
    const headers = new HttpHeaders({ 'Authorization': token, 'Content-Type': 'application/json' });

  
    return this.http.put(`${this.baseUrl}/admin/user/update`, updatedData, { headers });
  }

  createTransactionPasswordData(body: any,  token: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', token);

    return this.http.post(`${this.baseUrl}/user/wallet/create/transaction/password`, body, { headers, observe: 'response' })
      .pipe(
        catchError(this.handleError) // Handle error gracefully
      );
  }
  changeTransactionPasswordData(body: any,  token: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', token);

    return this.http.put(`${this.baseUrl}/admin/auth/change/password`, body, { headers, observe: 'response' })
      .pipe(
        catchError(this.handleError) // Handle error gracefully
      );
  }


  private handleError(error: any): Observable<never> {
    console.error('An error occurred:', error);
    return throwError(error);
  }
}
