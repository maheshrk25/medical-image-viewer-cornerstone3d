import { Service, inject } from '@angular/core';

import {
    init as dicomImageLoaderInit,
    wadouri
} from '@cornerstonejs/dicom-image-loader';

import {
    init as cornerstoneInit,
    getWebWorkerManager,
    imageLoader,
    metaData,
    volumeLoader
} from '@cornerstonejs/core';

import { DicomStore } from '../models/dicom-store';

@Service()
export class DicomLoaderService {
    private dicomStore = inject(DicomStore);
    loaderInitialized = false;

    async initialize(): Promise<void> {
        try {
            await cornerstoneInit();

            // The codec binaries are copied into public/ by scripts/copy-codec-wasm.js.
            // Resolving against baseURI keeps this working under a non-root base href.
            const base = document.baseURI || window.location.origin + '/';
            const wasmBasePath = new URL('cs-dicom-loader/codecs/', base).href;
            dicomImageLoaderInit({ maxWebWorkers: 1, wasmBasePath });

            // Register our worker first so init() does not register the broken @fs/... worker (dev)
            const workerUrl = new URL(
                'cs-dicom-loader/decodeImageFrameWorker.js',
                document.baseURI || window.location.origin + '/'
            ).href;
            getWebWorkerManager().registerWorker(
                'dicomImageLoader',
                () => new Worker(workerUrl, { type: 'module' }),
                { maxWorkerInstances: 1, overwrite: true }
            );
            //await dicomImageLoaderInit({
            //    maxWebWorkers: navigator.hardwareConcurrency || 1
            //});
            this.loaderInitialized = true;
        } catch (error) {
            this.loaderInitialized = false;
            console.error('Loader initialization failed', error);
        }
    }

    async load(filesList: FileList): Promise<boolean> {

        try {
            if (!this.loaderInitialized) {
                await this.initialize();
            }
            const files = Array.from(filesList);
            var imageIds: string[] = [];
            imageIds = files.map(file =>
                wadouri.fileManager.add(file)
            );

            const imagesLoaded = await this.loadImages(imageIds);
            if (!imagesLoaded) {
                return false;
            }
            const volumeLoaded = await this.loadVolume();
            return volumeLoaded;
        } catch (error) {
            console.error('DICOM loading error:', error);
            return false;
        }
    }

    private async loadImages(imageIds: string[]): Promise<boolean> {
        
        const validImageIds: string[] = [];
        for (const imageId of imageIds) {
            try {
                await imageLoader.loadAndCacheImage(imageId);
                
                const pixelModule = metaData.get(
                    'imagePixelModule',
                    imageId);

                if (!pixelModule || pixelModule.pixelRepresentation === undefined) {
                    console.warn('Missing pixel metadata:', imageId);
                    continue;
                }
                validImageIds.push(imageId);
            } catch (error) {
                console.warn('Invalid DICOM image:', imageId, error);
            }
        }

        if (validImageIds.length === 0) {
            return false;
        }

        this.dicomStore.imageIds = validImageIds;
        this.dicomStore.fileCount = validImageIds.length;

        return true;
    }

    private async loadVolume(): Promise<boolean> {
        const volume = await volumeLoader.createAndCacheVolume(
            this.dicomStore.volumeId,
            {
                imageIds: this.dicomStore.imageIds
            }
        );
        await volume.load();
        return true;
    }
}
