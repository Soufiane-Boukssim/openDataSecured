import { TestBed } from '@angular/core/testing';

import { DataSetThemeService } from './data-set-theme.service';

describe('DataSetThemeService', () => {
  let service: DataSetThemeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataSetThemeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
