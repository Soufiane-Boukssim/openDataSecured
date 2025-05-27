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

  getBaseDownloadUrl(): string {
  return `${this.apiUrl}/download/byId`;
}

}
