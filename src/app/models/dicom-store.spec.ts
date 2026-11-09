import { TestBed } from '@angular/core/testing';
import { DicomStore } from './dicom-store';

describe('DicomStore', () => {
  let service: DicomStore;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DicomStore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
