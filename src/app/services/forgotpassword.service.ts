import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ForgotpasswordService {

  private bareURL: string ="https://localhost:7197/api/userControllerAPI/forgotPassword";
  constructor(private http : HttpClient) { }

  forgotpass(object:any)
  {
    const response= this.http.post<any>(`${this.bareURL}`, object)
    return response;
  }
}
