import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DataSetThemeRequest } from '../../models/DataSetThemeRequest';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DataSetThemeService {

  private apiUrl = `${environment.apiUrl}/themes`;

  constructor(private http: HttpClient) {}

  getThemes(): Observable<DataSetThemeRequest[]> {
    return this.http.get<DataSetThemeRequest[]>(`${this.apiUrl}/get/all`);
  }

  updateTheme(uuid: string, name: string, description: string, icon?: File): Observable<DataSetThemeRequest> {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    if (icon) {
      formData.append('icon', icon);
    }

    return this.http.put<DataSetThemeRequest>(`${this.apiUrl}/update/byId/${uuid}`, formData);
  }

  deleteTheme(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/byId/${id}`);
  }

  addTheme(name: string, description: string, iconFile: File | null) {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    if (iconFile) {
      formData.append('icon', iconFile);
    }
    return this.http.post<DataSetThemeRequest>(`${this.apiUrl}/save`, formData);
  }


}