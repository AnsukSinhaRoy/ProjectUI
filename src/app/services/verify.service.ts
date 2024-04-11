import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class Verify 
{
  private api: string ="https://localhost:7197/api/userControllerAPI/ConfirmEmail";
  constructor(private http : HttpClient) { }

  verify(object:any)
  {
    return this.http.post<any>(`${this.api}`, object)
  }
}
