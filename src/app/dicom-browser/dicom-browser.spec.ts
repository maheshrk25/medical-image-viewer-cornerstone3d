import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DicomBrowser } from './dicom-browser';

describe('DicomBrowser', () => {
  let component: DicomBrowser;
  let fixture: ComponentFixture<DicomBrowser>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DicomBrowser],
    }).compileComponents();

    fixture = TestBed.createComponent(DicomBrowser);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
