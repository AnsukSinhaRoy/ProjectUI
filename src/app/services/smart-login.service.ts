import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SmartLoginService {

  private api: string ="https://localhost:7197/api/userControllerAPI/smartLogin";
  constructor(private http : HttpClient) { }
  smartlogin()
  {
    return this.http.get<any>(`${this.api}`)
  }
}
