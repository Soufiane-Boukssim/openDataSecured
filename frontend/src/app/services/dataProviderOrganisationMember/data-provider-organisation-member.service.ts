import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { DataProviderOrganisationMemberRequest } from '../../models/DataProviderOrganisationMemberRequest';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { DataProviderOrganisationServiceService } from '../dataProviderOrganisation/data-provider-organisation-service.service';
import { DataProviderOrganisationRequest } from '../../models/DataProviderOrganisationRequest';

@Injectable({
  providedIn: 'root'
})
export class DataProviderOrganisationMemberService {

  private apiUrl = `${environment.apiUrl}/data-provider/organisation-members`;

  constructor(
    private http: HttpClient,
    private organisationService: DataProviderOrganisationServiceService
  ) {}

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
  const params = new HttpParams()
    .set('firstname', firstName)
    .set('lastname', lastName)
    .set('email', email);

  return this.http.post<DataProviderOrganisationMemberRequest>(`${this.apiUrl}/save`, null, { params });
}







assignUserToOrganisation(organisationId: string, userId: string): Observable<string> {
  return this.organisationService.assignUserToOrganisation(organisationId, userId);
}


getAllOrganisations(): Observable<DataProviderOrganisationRequest[]> {
  return this.organisationService.getProviderOrganisations();
}

}