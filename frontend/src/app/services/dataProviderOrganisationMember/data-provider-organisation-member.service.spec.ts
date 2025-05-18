import { TestBed } from '@angular/core/testing';

import { DataProviderOrganisationMemberService } from './data-provider-organisation-member.service';

describe('DataProviderOrganisationMemberService', () => {
  let service: DataProviderOrganisationMemberService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataProviderOrganisationMemberService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
