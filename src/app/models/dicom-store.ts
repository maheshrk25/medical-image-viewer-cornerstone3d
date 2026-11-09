import { Service, signal } from '@angular/core';
import { ImageVolume } from '@cornerstonejs/core';
import { IStreamingImageVolume } from '@cornerstonejs/core/types';

@Service()
export class DicomStore {
    fileCount: number = 0;
    imageIds: string[] = [];
    volumeId: string = 'cornerstoneStreamingImageVolume:LOCAL_DICOM_VOLUME';
    volume!: ImageVolume | IStreamingImageVolume; 

}
