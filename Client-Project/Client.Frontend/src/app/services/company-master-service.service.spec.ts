import { TestBed } from '@angular/core/testing';

import { CompanyMasterServiceService } from './company-master-service.service';

describe('CompanyMasterServiceService', () => {
  let service: CompanyMasterServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CompanyMasterServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
