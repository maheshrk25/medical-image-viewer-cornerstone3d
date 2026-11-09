import { Routes } from '@angular/router';
import { DicomBrowser } from './dicom-browser/dicom-browser';

export const routes: Routes = [
    {
        path: 'home',
        component: DicomBrowser
    },
    {
        path: 'viewer',
        loadComponent: () =>
            import('./dicom-viewer/dicom-viewer')
                .then(m => m.DicomViewer)
    },
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
    },
    {
        path: '**',
        redirectTo: 'home'
    }

];
