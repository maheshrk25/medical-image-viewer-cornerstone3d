import { Service } from '@angular/core';

import {
    init as cornerstoneToolsInit,
    ToolGroupManager,
    addTool,
    Enums as csToolsEnums,
    CrosshairsTool,
    ZoomTool,
    PanTool,
    WindowLevelTool,
    TrackballRotateTool,
} from '@cornerstonejs/tools';
import type { IToolGroup } from '@cornerstonejs/tools/types';

@Service()
export class ToolsService {
    toolGroup2DId = 'ToolGroup2D';
    toolGroup2D!: IToolGroup;
    tools2D = [
        CrosshairsTool,
        ZoomTool,
        PanTool,
        WindowLevelTool
    ];

    toolGroup3DId = 'ToolGroup3D';
    toolGroup3D!: IToolGroup;
    tools3D = [
        ZoomTool,
        PanTool,
        WindowLevelTool,
        TrackballRotateTool
    ];

    toolsInitialized = false;

    constructor() {
        cornerstoneToolsInit();
        this.toolGroup2D = ToolGroupManager.createToolGroup(this.toolGroup2DId)!;
        this.toolGroup3D = ToolGroupManager.createToolGroup(this.toolGroup3DId)!;
    }

    async initializeToolGroups(): Promise<void> {
        try {
            this.tools2D.forEach(tool => {
                addTool(tool);
                this.toolGroup2D.addTool(tool.toolName);
            });
            this.tools3D.forEach(tool => {
                addTool(tool);
                this.toolGroup3D.addTool(tool.toolName);
                console.log("Tool name : ", tool.toolName);
            });
            this.toolsInitialized = true;
        } catch (error) {
            console.error('Tools initialization failed', error);
        }
    }

    activateTool(toolName: string) {
        var isTool2D = false, isTool3D = false;
        this.tools2D.forEach(tool => {
            this.toolGroup2D.setToolPassive(tool.toolName);
            this.toolGroup2D.setToolDisabled(tool.toolName);
            if (toolName === tool.toolName) { isTool2D = true }
        });

        this.tools3D.forEach(tool => {
            this.toolGroup3D.setToolPassive(tool.toolName);
            this.toolGroup3D.setToolDisabled(tool.toolName);
            if (toolName === tool.toolName) { isTool3D = true }
        });

        if (isTool2D) {
            this.toolGroup2D.setToolActive(toolName, {
                bindings: [{
                    mouseButton: csToolsEnums.MouseBindings.Primary
                }]
            });
        }
        if (isTool3D) {
            this.toolGroup3D.setToolActive(toolName, {
                bindings: [{
                    mouseButton: csToolsEnums.MouseBindings.Primary
                }]
            });
        }
    }
}
