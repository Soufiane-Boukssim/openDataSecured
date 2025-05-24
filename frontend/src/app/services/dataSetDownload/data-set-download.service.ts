import { Injectable } from '@angular/core';
import { DataSetResponse } from '../../models/DataSetResponse';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DataSetDownloadService {
  private apiUrl = `${environment.apiUrl}/datasets`;
  
  constructor(private http: HttpClient) {}

  getAllDatasets(): Observable<DataSetResponse[]> {
    return this.http.get<DataSetResponse[]>(`${this.apiUrl}/get/all`);
  }

  deleteDataset(id: string): Observable<boolean> {
    return this.http.delete<boolean>(`${this.apiUrl}/delete/byId/${id}`);
  }

}
