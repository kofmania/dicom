import {
  getEnabledElement,
  getEnabledElementByViewportId,
  getRenderingEngine,
  Types,
} from "@cornerstonejs/core";
import { build } from "./lib/pdf";
import { useState } from "react";
import PdfView from "./PdfView";

type Props = {
  className?: string;
};

const engineId = "myEngine";
const viewportId = "myView";

const PdfBuild = (props: Props) => {
  const [pdf, setPdf] = useState<URL>();

  return (
    <div className={props.className}>
      <div>
        <h2>pdf build</h2>
        <button
          type="button"
          onClick={() => {
            const engine = getRenderingEngine(engineId);

            if (engine) {
              const viewport = engine.getViewport(
                viewportId
              ) as Types.IStackViewport;
              const csImage = viewport.getCornerstoneImage();
              console.log(csImage);
              const pixelData = csImage.getPixelData();
              const oriCanvas = viewport.canvas;

              const offscreen = document.createElement("canvas");
              offscreen.width = csImage.width;
              offscreen.height = csImage.height;
              const ctx = offscreen.getContext("2d");
              const windowing = true;

              if (ctx) {
                if (windowing) {
                  ctx.drawImage(oriCanvas, 0, 0);
                  const base64 = offscreen.toDataURL("image/jpeg");
                  const pdf = build(base64);
                  console.log(pdf);
                  setPdf(pdf);
                } else {
                  const imageData = ctx.createImageData(
                    csImage.width,
                    csImage.height
                  );
                  for (let i = 0; i < pixelData.length; i++) {
                    // Grayscale to RGB (R=G=B)
                    const grayscaleValue = pixelData[i];
                    imageData.data[i * 4] = grayscaleValue; // Red
                    imageData.data[i * 4 + 1] = grayscaleValue; // Green
                    imageData.data[i * 4 + 2] = grayscaleValue; // Blue
                    imageData.data[i * 4 + 3] = 255; // Alpha
                  }
                  ctx.putImageData(imageData, 0, 0);
                  const base64 = offscreen.toDataURL("image/jpeg");
                  const pdf = build(base64);
                  console.log(pdf);
                  setPdf(pdf);
                }
              }
            }
          }}
        >
          build
        </button>
      </div>
      {pdf && <PdfView data={pdf} />}
    </div>
  );
};

export default PdfBuild;
