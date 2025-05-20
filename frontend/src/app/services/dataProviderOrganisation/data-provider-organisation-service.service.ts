import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DataProviderOrganisationRequest } from '../../models/DataProviderOrganisationRequest';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DataProviderOrganisationServiceService {

  private apiUrl = `${environment.apiUrl}/data-provider/organisations`; // à adapter selon ton backend

  constructor(private http: HttpClient) {}

  getProviderOrganisations(): Observable<DataProviderOrganisationRequest[]> {
    return this.http.get<DataProviderOrganisationRequest[]>(`${this.apiUrl}/get/all`);
  }

  deleteProviderOrganisation(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/byId/${id}`);
  }

  updateProviderOrganisation(uuid: string, name: string, description: string, icon?: File): Observable<DataProviderOrganisationRequest> {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    if (icon) {
      formData.append('icon', icon);
    }
    return this.http.put<DataProviderOrganisationRequest>(`${this.apiUrl}/update/byId/${uuid}`, formData);
  }

  addProviderOrganisation(name: string, description: string, iconFile: File | null) {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    if (iconFile) {
      formData.append('icon', iconFile);
    }
    return this.http.post<DataProviderOrganisationRequest>(`${this.apiUrl}/save`, formData);
  }



assignUserToOrganisation(organisationId: string, userId: string): Observable<string> {
  const url = `${this.apiUrl}/${organisationId}/assign-user/${userId}`;
  // Spécifier responseType: 'text' pour recevoir une réponse texte
  return this.http.post(url, null, { responseType: 'text' });
}


getOrganisationCount(): Observable<number> {
  return this.http.get<number>(`${this.apiUrl}/count`);
}


}