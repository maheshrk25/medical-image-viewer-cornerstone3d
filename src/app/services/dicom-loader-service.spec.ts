import { TestBed } from '@angular/core/testing';
import { DicomLoaderService } from './dicom-loader-service';

describe('DicomLoaderService', () => {
  let service: DicomLoaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DicomLoaderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
