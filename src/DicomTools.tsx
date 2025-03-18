import { useEffect, useRef, useState } from "react";
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
  ZoomTool,
  PanTool,
} from "@cornerstonejs/tools";
import { MouseBindings } from "@cornerstonejs/tools/enums";

const engineId = "myEngine";
const viewportId = "myView";
const toolGroupId = "myToolGroup";
const toolNames = [MagnifyTool, ZoomTool, PanTool];

const DicomTools = () => {
  const viewportRef = useRef<HTMLDivElement>(null);
  const isFirst = useRef(true);
  const rendering = useRef(false);
  const [toolStack, setStackTool] = useState<string[]>([toolNames[0].toolName]);

  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false;
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
      const toolGroup = ToolGroupManager.createToolGroup(toolGroupId);
      console.assert(toolGroup);
      toolNames.forEach((tool) => {
        addTool(tool);
        toolGroup!.addTool(tool.toolName);
      });
      toolGroup!.addViewport(viewportId, engineId);
    }
  }, []);

  useEffect(() => {
    const render = async () => {
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

        rendering.current = false;
      } else console.log("rendering");
    };

    render();
  }, [viewportRef]);

  useEffect(() => {
    if (!isFirst.current) {
      const [curr, prev] = toolStack;
      const toolGroup = ToolGroupManager.getToolGroup(toolGroupId);

      if (prev) {
        toolGroup!.setToolPassive(prev);
      }

      toolGroup!.setToolActive(curr, {
        bindings: [
          {
            mouseButton: MouseBindings.Primary,
          },
        ],
      });
    }
  }, [isFirst, toolStack]);

  const buttons = toolNames.map((tool, index) => (
    <button
      type="button"
      key={index}
      data-tool={tool.toolName}
      onClick={(e) => {
        const tool = e.currentTarget.dataset.tool;
        const [curr] = toolStack;
        setStackTool([tool!, curr]);
      }}
    >
      {tool.toolName}
    </button>
  ));

  return (
    <div className="flex-col">
      <div ref={viewportRef} className="h-[500px] w-[500px]" />
      <div>{buttons}</div>
      <div>{toolStack.join(", ")}</div>
    </div>
  );
};

export default DicomTools;
