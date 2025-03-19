import { useEffect, useRef, useState } from "react";
import type { Types } from "@cornerstonejs/core";
import {
  init as csInit,
  getRenderingEngine,
  RenderingEngine,
} from "@cornerstonejs/core";
import { init as loaderInit } from "@cornerstonejs/dicom-image-loader";
import { Events, ViewportType } from "@cornerstonejs/core/enums";
import {
  init as toolsInit,
  addTool,
  ToolGroupManager,
  MagnifyTool,
  ZoomTool,
  PanTool,
  StackScrollTool,
} from "@cornerstonejs/tools";
import { MouseBindings } from "@cornerstonejs/tools/enums";

const engineId = "myEngine";
const viewportId = "myView";
const toolGroupId = "myToolGroup";
const toolNames = [MagnifyTool, ZoomTool, PanTool, StackScrollTool];

const DicomTools = () => {
  const viewportRef = useRef<HTMLDivElement>(null);
  const isFirst = useRef(true);
  const rendering = useRef(false);
  const [toolStack, setStackTool] = useState<string[]>([toolNames[0].toolName]);
  const [loading, setLoading] = useState(false);

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
      toolGroup!.setToolActive(StackScrollTool.toolName, {
        bindings: [
          {
            mouseButton: MouseBindings.Wheel,
          },
        ],
      });
      toolGroup!.addViewport(viewportId, engineId);
    }
  }, []);

  useEffect(() => {
    const render = async () => {
      const ctImageIds = new Array(120)
        .fill(0)
        .map(
          (_, index) =>
            `wadouri:https://ohif-assets-new.s3.us-east-1.amazonaws.com/ACRIN-Regular/CT+CT+IMAGES/CT${index.toString().padStart(6, "0")}.dcm`
        );

      if (!rendering.current) {
        rendering.current = true;

        const renderingEngine = getRenderingEngine(engineId);
        console.assert(renderingEngine);
        const viewport = renderingEngine!.getViewport(
          viewportId
        ) as Types.IStackViewport;
        viewportRef.current?.addEventListener(Events.STACK_NEW_IMAGE, (e) => {
          setLoading(false);
          console.log(e);
        });
        viewportRef.current?.addEventListener(
          Events.PRE_STACK_NEW_IMAGE,
          (e) => {
            setLoading(true);
            console.log(e);
          }
        );

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
      <div className="relative">
        <div ref={viewportRef} className="h-[500px] w-[500px]" />
        {loading && (
          <div className="absolute top-0 left-0 flex h-full w-full items-center justify-center border-2 border-amber-300">
            <span>loading</span>
          </div>
        )}
      </div>
      <div>{buttons}</div>
      <div>{toolStack.join(", ")}</div>
    </div>
  );
};

export default DicomTools;
