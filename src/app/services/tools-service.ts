import { Service } from '@angular/core';

import {
    init as cornerstoneToolsInit,
    ToolGroupManager,
    addTool,
    CrosshairsTool,
    ZoomTool,
    PanTool,
    WindowLevelTool,
    VolumeRotateTool,
    Enums as csToolsEnums,
} from '@cornerstonejs/tools';
import type { IToolGroup } from '@cornerstonejs/tools/types';

@Service()
export class ToolsService {
    toolGroup2DId = 'ToolGroup2D';
    toolGroup2D!: IToolGroup;
    toolGroup3DId = 'ToolGroup3D';
    toolGroup3D!: IToolGroup;
    toolsInitialized = false;

    constructor() {
        cornerstoneToolsInit();
        this.toolGroup2D = ToolGroupManager.createToolGroup(this.toolGroup2DId)!;
        this.toolGroup3D = ToolGroupManager.createToolGroup(this.toolGroup3DId)!;
    }

    async initializeToolGroups(): Promise<void> {
        try {

            addTool(CrosshairsTool);
            addTool(ZoomTool);
            addTool(PanTool);
            addTool(WindowLevelTool);
            addTool(VolumeRotateTool)

            this.toolGroup2D.addTool(CrosshairsTool.toolName);
            this.toolGroup2D.addTool(ZoomTool.toolName);
            this.toolGroup2D.addTool(PanTool.toolName);
            this.toolGroup2D.addTool(WindowLevelTool.toolName);

            this.toolGroup3D.addTool(VolumeRotateTool.toolName);

            this.toolsInitialized = true;
        } catch (error) {
            console.error('Tools initialization failed', error);
        }
    }

    activateTool(toolName: string) {

        const tools = [
            CrosshairsTool,
            ZoomTool,
            PanTool,
            WindowLevelTool
        ];

        tools.forEach(tool => {
            this.toolGroup2D.setToolPassive(tool.toolName);
            this.toolGroup2D.setToolDisabled(tool.toolName);
        });
        this.toolGroup2D.setToolActive(toolName, {
            bindings: [{
                mouseButton: csToolsEnums.MouseBindings.Primary
            }]
        });
    }
}
