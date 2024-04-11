import { TestBed } from '@angular/core/testing';

import { LinkVerifyService } from './link-verify.service';

describe('LinkVerifyService', () => {
  let service: LinkVerifyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LinkVerifyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
