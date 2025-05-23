import { TestBed } from '@angular/core/testing';

import { DataSetUploadService } from './data-set-upload.service';

describe('DataSetUploadService', () => {
  let service: DataSetUploadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataSetUploadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
