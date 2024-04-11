import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private api: string ="https://localhost:7197/api/userControllerAPI/Dashboard";
  constructor(private http : HttpClient) { }

  access(object:any)
  {
    return this.http.post<any>(`${this.api}`, object)
  }
  getTicket(object:any)
  {
    return this.http.post<any[]>(`https://localhost:7197/api/TMS/TicketDetailEmployee`, object)
  }
  close(id: string, otp:string) {
    const params = new HttpParams()
      .set('id', id)
      .set('otp', otp);
    return this.http.get<any>(`https://localhost:7197/api/TMS/CloseTicket`, { params });
  }
}
