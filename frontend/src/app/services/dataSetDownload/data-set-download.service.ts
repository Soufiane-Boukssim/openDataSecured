import { Injectable } from '@angular/core';
import { DataSetResponse } from '../../models/DataSetResponse';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataSetDownloadService {
  private apiUrl = 'http://localhost:8080/api/datasets/get/all';

  constructor(private http: HttpClient) {}

  getAllDatasets(): Observable<DataSetResponse[]> {
    return this.http.get<DataSetResponse[]>(this.apiUrl);
  }
}
