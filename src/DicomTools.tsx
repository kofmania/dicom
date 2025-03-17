import { useEffect, useRef } from "react";
import type { Types } from "@cornerstonejs/core";
import {
  init as csInit,
  getRenderingEngine,
  RenderingEngine,
} from "@cornerstonejs/core";
import { init as loaderInit } from "@cornerstonejs/dicom-image-loader";
import { ViewportType } from "@cornerstonejs/core/enums";
import {
  init as toolsInit,
  addTool,
  ToolGroupManager,
  MagnifyTool,
} from "@cornerstonejs/tools";
import { MouseBindings } from "@cornerstonejs/tools/enums";

const engineId = "myEngine";
const viewportId = "myView";
const toolGroupId = "myToolGroup";

const DicomTools = () => {
  const viewportRef = useRef<HTMLDivElement>(null);
  const isFirst = useRef(true);
  const rendering = useRef(false);

  useEffect(() => {
    if (isFirst.current) {
      csInit();
      loaderInit({
        maxWebWorkers: navigator.hardwareConcurrency || 1,
      });
      toolsInit();
      const renderingEngine = new RenderingEngine(engineId);
      const viewportInput = {
        viewportId,
        type: ViewportType.STACK,
        element: viewportRef.current!,
        defaultOptions: {
          background: [0.2, 0, 0.2] as Types.Point3,
        },
      };

      renderingEngine.enableElement(viewportInput);

      // tools setup
      addTool(MagnifyTool);
      const toolGroup = ToolGroupManager.createToolGroup(toolGroupId);
      console.assert(toolGroup);
      toolGroup!.addViewport(viewportId, engineId);
      toolGroup!.addTool(MagnifyTool.toolName);

      isFirst.current = false;
    }
  }, []);

  useEffect(() => {
    const initializeCornerstone = async () => {
      const ctImageIds = [
        "wadouri:https://ohif-assets-new.s3.us-east-1.amazonaws.com/ACRIN-Regular/CT+CT+IMAGES/CT000000.dcm",
        "wadouri:https://ohif-assets-new.s3.us-east-1.amazonaws.com/ACRIN-Regular/CT+CT+IMAGES/CT000001.dcm",
        "wadouri:https://ohif-assets-new.s3.us-east-1.amazonaws.com/ACRIN-Regular/CT+CT+IMAGES/CT000002.dcm",
        "wadouri:https://ohif-assets-new.s3.us-east-1.amazonaws.com/ACRIN-Regular/CT+CT+IMAGES/CT000003.dcm",
        "wadouri:https://ohif-assets-new.s3.us-east-1.amazonaws.com/ACRIN-Regular/CT+CT+IMAGES/CT000004.dcm",
        "wadouri:https://ohif-assets-new.s3.us-east-1.amazonaws.com/ACRIN-Regular/CT+CT+IMAGES/CT000005.dcm",
        "wadouri:https://ohif-assets-new.s3.us-east-1.amazonaws.com/ACRIN-Regular/CT+CT+IMAGES/CT000006.dcm",
        "wadouri:https://ohif-assets-new.s3.us-east-1.amazonaws.com/ACRIN-Regular/CT+CT+IMAGES/CT000007.dcm",
        "wadouri:https://ohif-assets-new.s3.us-east-1.amazonaws.com/ACRIN-Regular/CT+CT+IMAGES/CT000008.dcm",
        "wadouri:https://ohif-assets-new.s3.us-east-1.amazonaws.com/ACRIN-Regular/CT+CT+IMAGES/CT000009.dcm",
      ];
      if (!rendering.current) {
        rendering.current = true;

        const renderingEngine = getRenderingEngine(engineId);
        console.assert(renderingEngine);
        const viewport = renderingEngine!.getViewport(
          viewportId
        ) as Types.IStackViewport;

        console.time("setStack");
        await viewport.setStack(ctImageIds);
        console.timeEnd("setStack");
        console.time("render");
        viewport.render();
        console.timeEnd("render");

        const toolGroup = ToolGroupManager.getToolGroup(toolGroupId);
        console.assert(toolGroup);
        toolGroup!.setToolActive(MagnifyTool.toolName, {
          bindings: [
            {
              mouseButton: MouseBindings.Primary, // Left Click
            },
          ],
        });

        rendering.current = false;
      } else console.log("rendering");
    };

    initializeCornerstone();
  }, [viewportRef]);

  return <div ref={viewportRef} className="w-[500px] h-[500px]" />;
};

export default DicomTools;
