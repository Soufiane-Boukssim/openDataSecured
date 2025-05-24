import { TestBed } from '@angular/core/testing';

import { DataSetDownloadService } from './data-set-download.service';

describe('DataSetDownloadService', () => {
  let service: DataSetDownloadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataSetDownloadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
