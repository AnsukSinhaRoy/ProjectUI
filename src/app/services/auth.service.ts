import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService 
{
  
  private bareURL: string ="https://localhost:7197/api/userControllerAPI/registration";
  constructor(private http : HttpClient) { }

  signup(object:any)
  {
    const httpOptions = {
      headers: new HttpHeaders({
        'ngrok-skip-browser-warning': '69420',
        // Add any other headers as needed
      }),
    };
    const response= this.http.post<any>(`${this.bareURL}`, object, httpOptions)
    return response;
  }
}
