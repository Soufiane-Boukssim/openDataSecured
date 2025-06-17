import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { DataSetDownload } from '../../models/DataSetDownload';

@Injectable({
  providedIn: 'root'
})
export class DataSetDownloadService {
  private apiUrl = `${environment.apiUrl}/datasets`;
  
  constructor(private http: HttpClient) {}

  getAllDatasets(): Observable<DataSetDownload[]> {
    return this.http.get<DataSetDownload[]>(`${this.apiUrl}/get/all`);
  }

  deleteDataset(id: string): Observable<boolean> {
    return this.http.delete<boolean>(`${this.apiUrl}/delete/byId/${id}`);
  }

  downloadTemplate(id: number) {
    return this.http.get(`${this.apiUrl}/${id}/download-template`, {
      responseType: 'blob', 
      observe: 'response' 
    });
  }

  updateDataset(
    uuid: string, 
    name?: string, 
    description?: string, 
    themeUuid?: string, 
    dataProviderOrganisationMemberUuid?: string, 
    file?: File
  ): Observable<DataSetDownload> {
    const formData = new FormData();
    
    if (name) formData.append('name', name);
    if (description) formData.append('description', description);
    if (themeUuid) formData.append('themeUuid', themeUuid);
    if (dataProviderOrganisationMemberUuid) formData.append('dataProviderOrganisationMemberUuid', dataProviderOrganisationMemberUuid);
    if (file) formData.append('file', file);

    return this.http.put<DataSetDownload>(`${this.apiUrl}/update/byId/${uuid}`, formData);
  }

  getDataSetCount(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/count`);
  }

}
