import { useEffect, useRef } from "react";
import type { Types } from "@cornerstonejs/core";
import {
  init as csInit,
  getRenderingEngine,
  RenderingEngine,
} from "@cornerstonejs/core";
import { init as loaderInit } from "@cornerstonejs/dicom-image-loader";
import { ViewportType } from "@cornerstonejs/core/enums";

const engineId = "myEngine";
const viewportId = "myView";

const DicomViewer = () => {
  const viewportRef = useRef<HTMLDivElement>(null);
  const isFirst = useRef(true);
  const rendering = useRef(false);

  useEffect(() => {
    if (isFirst.current) {
      csInit();
      loaderInit({
        maxWebWorkers: navigator.hardwareConcurrency || 1,
      });
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

        rendering.current = false;
      } else console.log("rendering");
    };

    initializeCornerstone();
  }, [viewportRef]);

  return <div ref={viewportRef} className="w-[500px] h-[500px]" />;
};

export default DicomViewer;
