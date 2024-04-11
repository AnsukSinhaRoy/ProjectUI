import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoginServiceService {

  private api: string ="https://localhost:7197/api/userControllerAPI/login";
  constructor(private http : HttpClient) { }

  verify(object:any)
  {
    return this.http.post<any>(`${this.api}`, object)
  }

}
