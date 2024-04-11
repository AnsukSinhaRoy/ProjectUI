import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DashboardVerifyService {

  private bareURL: string ="https://localhost:7197/api/userControllerAPI/dashboardVerify";
  constructor(private http : HttpClient) { }

  signup(object:any)
  {
    const response= this.http.post<any>(`${this.bareURL}`, object)
    return response;
  }
}
