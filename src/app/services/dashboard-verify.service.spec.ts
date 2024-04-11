import { TestBed } from '@angular/core/testing';

import { DashboardVerifyService } from './dashboard-verify.service';

describe('DashboardVerifyService', () => {
  let service: DashboardVerifyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DashboardVerifyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
