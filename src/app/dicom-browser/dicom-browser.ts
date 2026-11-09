import { Component, AfterViewInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { DicomLoaderService } from '../services/dicom-loader-service';

@Component({
    imports: [],
    selector: 'app-dicom-browser',
    styleUrl: './dicom-browser.css',
    templateUrl: './dicom-browser.html',
})
export class DicomBrowser implements AfterViewInit {

    private dicomLoaderService = inject(DicomLoaderService);
    router: Router = inject(Router);
    status = signal('');
    loading = signal(false);
    isDragging = false;

    async ngAfterViewInit(): Promise<void> {
        await this.dicomLoaderService.initialize();
    }

    async onFilesSelected(event: Event): Promise<void> {
        const input = event.target as HTMLInputElement;
        await this.loadFiles(input.files!);
    }

    onDragOver(event: DragEvent) {
        event.preventDefault();
        this.isDragging = true;
    }

    onDragLeave(event: DragEvent) {
        event.preventDefault();
        this.isDragging = false;
    }

    async onDrop(event: DragEvent) {
        event.preventDefault();
        this.isDragging = false;
        const files = event.dataTransfer?.files;
        await this.loadFiles(files!);
    }

    private async loadFiles(files: FileList) {
        if (!files?.length) {
            this.status.set('No DICOM files selected');
            return;
        }

        if (!this.dicomLoaderService.loaderInitialized) {
            this.status.set('Refresh page to continue');
            return;
        }

        this.loading.set(true);
        this.status.set('Loading DICOM files...');
        const dicomLoaded = await this.dicomLoaderService.load(files);
        if (!dicomLoaded) {
            this.status.set('Could not load DICOM files');
            return
        }
        this.status.set('DICOM files loaded successfully');
        this.loading.set(false);

        this.router.navigate(['/viewer']);
    }

}
