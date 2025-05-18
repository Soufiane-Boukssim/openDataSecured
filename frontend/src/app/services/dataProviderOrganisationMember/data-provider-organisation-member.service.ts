import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DataProviderOrganisationMemberRequest } from '../../models/DataProviderOrganisationMemberRequest';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DataProviderOrganisationMemberService {

  private apiUrl = `${environment.apiUrl}/data-provider/organisation-members`;

  constructor(private http: HttpClient) {}

  getAllDataProviderOrganisationMembers(): Observable<DataProviderOrganisationMemberRequest[]> {
    return this.http.get<DataProviderOrganisationMemberRequest[]>(`${this.apiUrl}/get/all`);
  }

  updateDataProviderOrganisationMember(uuid: string, firstName: string, lastName: string, email: string): Observable<DataProviderOrganisationMemberRequest> {
    const formData = new FormData();
    formData.append('firstname', firstName);
    formData.append('lastname', lastName);
    formData.append('email', email);
    return this.http.put<DataProviderOrganisationMemberRequest>(`${this.apiUrl}/update/byId/${uuid}`, formData);
  }

  deleteDataProviderOrganisationMember(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/byId/${id}`);
  }

  addDataProviderOrganisationMember(firstName: string, lastName: string, email: string) {
    const formData = new FormData();
    formData.append('firstName', firstName);
    formData.append('lastName', lastName);
    formData.append('email', email);
    return this.http.post<DataProviderOrganisationMemberRequest>(`${this.apiUrl}/save`, formData);
  }


}