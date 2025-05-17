import { TestBed } from '@angular/core/testing';

import { DataProviderOrganisationServiceService } from './data-provider-organisation-service.service';

describe('DataProviderOrganisationServiceService', () => {
  let service: DataProviderOrganisationServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataProviderOrganisationServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
