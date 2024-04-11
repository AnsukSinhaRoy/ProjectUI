import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UservirifyComponent } from './uservirify.component';

describe('UservirifyComponent', () => {
  let component: UservirifyComponent;
  let fixture: ComponentFixture<UservirifyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UservirifyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UservirifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
