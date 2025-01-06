import { TestBed } from '@angular/core/testing';

import { TypeUsersService } from './type-users.service';

describe('TypeUsersService', () => {
  let service: TypeUsersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TypeUsersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
