import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarrerasRegister } from './carreras-register';

describe('CarrerasRegister', () => {
  let component: CarrerasRegister;
  let fixture: ComponentFixture<CarrerasRegister>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarrerasRegister]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarrerasRegister);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
