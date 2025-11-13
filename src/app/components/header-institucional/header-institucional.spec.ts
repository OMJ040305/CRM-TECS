import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderInstitucional } from './header-institucional';

describe('HeaderInstitucional', () => {
  let component: HeaderInstitucional;
  let fixture: ComponentFixture<HeaderInstitucional>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderInstitucional]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderInstitucional);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
