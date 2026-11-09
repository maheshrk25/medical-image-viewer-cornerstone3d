import {
    AfterViewInit,
    Component,
    ElementRef,
    OnDestroy,
    ViewChild,
    inject,
    signal
} from '@angular/core';
import { Router } from '@angular/router';

import {
    RenderingEngine,
    setVolumesForViewports,
    Enums as csEnums
} from '@cornerstonejs/core';

import { DicomStore } from '../models/dicom-store';

import { ToolsService } from '../services/tools-service';

@Component({
    imports: [],
    selector: 'app-dicom-viewer',
    styleUrl: './dicom-viewer.css',
    templateUrl: './dicom-viewer.html',
})
export class DicomViewer implements AfterViewInit, OnDestroy {
    @ViewChild('axial', { static: true })
    axial!: ElementRef<HTMLDivElement>;

    @ViewChild('coronal', { static: true })
    coronal!: ElementRef<HTMLDivElement>;

    @ViewChild('sagittal', { static: true })
    sagittal!: ElementRef<HTMLDivElement>;

    @ViewChild('volume3d', { static: true })
    volume3d!: ElementRef<HTMLDivElement>;

    private router = inject(Router);
    private dicomStore = inject(DicomStore);
    private toolsService = inject(ToolsService);
    private renderingEngine!: RenderingEngine;
    private renderingEngineID = 'DICOM_RENDERING_ENGINE';
    private viewport2DIds = [
        'AXIAL',
        'CORONAL',
        'SAGITTAL'
    ];
    private viewport3DIds = [
        'VOLUME_3D'
    ];

    activeTool = signal('Crosshairs');

    async ngAfterViewInit(): Promise<void> {
        try {

            if (!this.dicomStore.imageIds?.length) {
                await this.router.navigate(['/home']);
                return;
            }

            this.renderingEngine = new RenderingEngine(this.renderingEngineID);

            this.renderingEngine.setViewports([
                {
                    viewportId: this.viewport2DIds[0],
                    type: csEnums.ViewportType.ORTHOGRAPHIC,
                    element: this.axial.nativeElement,
                    defaultOptions: {
                        orientation: csEnums.OrientationAxis.AXIAL
                    }
                },
                {
                    viewportId: this.viewport3DIds[0],
                    type: csEnums.ViewportType.VOLUME_3D,
                    element: this.volume3d.nativeElement
                },
                {
                    viewportId: this.viewport2DIds[1],
                    type: csEnums.ViewportType.ORTHOGRAPHIC,
                    element: this.coronal.nativeElement,
                    defaultOptions: {
                        orientation: csEnums.OrientationAxis.CORONAL
                    }
                },
                {
                    viewportId: this.viewport2DIds[2],
                    type: csEnums.ViewportType.ORTHOGRAPHIC,
                    element: this.sagittal.nativeElement,
                    defaultOptions: {
                        orientation: csEnums.OrientationAxis.SAGITTAL
                    }
                }
            ]);

            await setVolumesForViewports(
                this.renderingEngine,
                [{ volumeId: this.dicomStore.volumeId }],
                [this.viewport2DIds[0], this.viewport3DIds[0],
                this.viewport2DIds[1], this.viewport2DIds[2]]
            );

            this.renderingEngine.renderViewports([
                this.viewport2DIds[0],
                this.viewport3DIds[0],
                this.viewport2DIds[1],
                this.viewport2DIds[2]]);

            this.toolsService.initializeToolGroups();
            this.toolsService.toolGroup2D.addViewport(this.viewport2DIds[0], this.renderingEngine.id);
            this.toolsService.toolGroup2D.addViewport(this.viewport2DIds[1], this.renderingEngine.id);
            this.toolsService.toolGroup2D.addViewport(this.viewport2DIds[2], this.renderingEngine.id);
            this.toolsService.toolGroup2D.addViewport(this.viewport3DIds[0], this.renderingEngine.id);

            //this.toolsService.toolGroup3D.addViewport(this.viewport3DIds[0], this.renderingEngineID);
            this.activateTool('Crosshairs');

        } catch (error) {
            console.error('Cornerstone initialization failed', error);
            this.router.navigate(['/home']);
        }
    }

    activateTool(toolName: string) {
        this.toolsService.activateTool(toolName);
        this.activeTool.set(toolName);
    }

    ngOnDestroy(): void {
        if (this.renderingEngine) {
            this.renderingEngine.destroy();
        }
    }
}
