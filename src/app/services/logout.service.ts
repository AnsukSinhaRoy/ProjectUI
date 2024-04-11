import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LogoutService {

  private api: string ="https://localhost:7197/api/userControllerAPI/Logout";
  constructor(private http : HttpClient) { }

  logout(object:any)
  {
    return this.http.post<any>(`${this.api}`, object)
  }

}
