import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Licitaciones } from './licitaciones';

describe('Licitaciones', () => {
  let component: Licitaciones;
  let fixture: ComponentFixture<Licitaciones>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Licitaciones],
    }).compileComponents();

    fixture = TestBed.createComponent(Licitaciones);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
