import { TestBed } from '@angular/core/testing';

import { AuthGuard } from './auth.guard';

describe('AuthGuard', () => {
  let guard: AuthGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(AuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should not activate', () => {
    const localStorageSpy = spyOn(localStorage, 'getItem').and.returnValue(null);
    console.log("spy", localStorageSpy);
    const canActivate = guard.canActivate();
    expect(canActivate).toBeFalsy();
  })

  it('should allow activate', () => {
    const localStorageSpy = spyOn(localStorage, 'getItem').and.returnValue('user');
    console.log("spy", localStorageSpy)
    const canActivate = guard.canActivate();
    expect(canActivate).toBeTruthy();
  })
});
