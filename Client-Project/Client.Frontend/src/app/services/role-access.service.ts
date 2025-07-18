import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { apiUrl } from '../../constant';
import { RoleAccessDto } from '../components/role/role-dtos';

@Injectable({
  providedIn: 'root'
})
export class RoleAccessService {
  constructor(
    private http: HttpClient
  ) { }

  getUserAccess(username: string): Observable<RoleAccessDto[]> {
    return this.http.get<RoleAccessDto[]>(`${apiUrl}/RoleAccess?username=${username}`)
  }
}
