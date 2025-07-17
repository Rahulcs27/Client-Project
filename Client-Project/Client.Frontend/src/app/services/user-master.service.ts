import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserCreateDto, UserGetDto, UserUpdateDto } from '../components/user-master/user-dtos';
import { apiUrl } from '../../constant';

@Injectable({
  providedIn: 'root'
})
export class UserMasterService {
  constructor(private http: HttpClient) { }

  getAllUserGetDto(companyId: number): Observable<UserGetDto[]> {
    return this.http.get<UserGetDto[]>(`${apiUrl}/User?companyId=${companyId}`);
  }

  getUserGetDto(companyId: number, userId: number): Observable<UserGetDto[]> {
    return this.http.get<UserGetDto[]>(`${apiUrl}/User?companyId=${companyId}&id=${userId}`);
  }

  editUserUpdateDto(formData: UserUpdateDto): Observable<UserGetDto[]> {
    return this.http.put<UserGetDto[]>(`${apiUrl}/User`, formData);
  }

  addUserGetDto(formData: UserCreateDto): Observable<UserGetDto[]> {
    return this.http.post<UserGetDto[]>(`${apiUrl}/User`, formData);
  }

  deleteUserGetDto(id: number, userId: number, companyId: number): Observable<UserGetDto[]> {
    return this.http.delete<UserGetDto[]>(`${apiUrl}/User?Id=${id}?updatedBy=${userId}&companyId=${companyId}`);
  }
}
