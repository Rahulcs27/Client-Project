import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { apiUrl } from '../../constant';
import { RoleAccessDto } from '../components/role-access/role-access-dto';

@Injectable({
  providedIn: 'root'
})
export class RoleAccessService {
  constructor(
    private http: HttpClient
  ) { }

  private accessList: RoleAccessDto[] = []

  getUserAccess(username: string): Observable<RoleAccessDto[]> {
    return this.http.get<RoleAccessDto[]>(`${apiUrl}/RoleAccess?username=${username}`)
  }

  setAccessList(username: string) {
    this.http.get<RoleAccessDto[]>(`${apiUrl}/RoleAccess?username=${username}`).subscribe({
      next: (response: RoleAccessDto[]) => {
        this.accessList = response;
      },
      error: (error) => {
        console.log(error);
      }
    })
  }

  roleGuardSetAccessList(accessListThroughRoleGuard: RoleAccessDto[]) {
    this.accessList = accessListThroughRoleGuard;
  }

  getAccessList(): RoleAccessDto[] {
    return this.accessList
  }
}
