import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DataSetUploadService {
  private apiUrl = `${environment.apiUrl}/datasets`;

  constructor(private http: HttpClient) {}

  uploadDataSet(name: string,description: string,themeUuid: string,memberUuid: string,file: File): Observable<any> {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('themeUuid', themeUuid);
    formData.append('dataProviderOrganisationMemberUuid', memberUuid);
    formData.append('file', file);
    return this.http.post(`${this.apiUrl}/save`, formData);
  }

}