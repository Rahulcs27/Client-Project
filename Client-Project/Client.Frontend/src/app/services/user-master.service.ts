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

  getAllUserGetDto(): Observable<UserGetDto[]> {
    return this.http.get<UserGetDto[]>(`${apiUrl}/User`);
  }

  editUserUpdateDto(formData: UserUpdateDto): Observable<UserGetDto[]> {
    return this.http.put<UserGetDto[]>(`${apiUrl}/User/${formData.id}`, formData);
  }

  addUserGetDto(formData: UserCreateDto): Observable<UserGetDto[]> {
    return this.http.post<UserGetDto[]>(`${apiUrl}/User`, formData);
  }
}
