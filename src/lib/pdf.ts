import { jsPDF } from "jspdf";
import { fitToBox } from "./util";

const build = (base64Image: string) => {
  const doc = new jsPDF({
    unit: "px",
    format: "a4",
    hotfixes: ["px_scaling"],
  });
  const { width, height } = doc.internal.pageSize;
  doc.text("pdf text", 10, 50);
  {
    const imagePath = "/logo.png";
    const prop = doc.getImageProperties(imagePath);
    const [fitW, fitH] = fitToBox(width - 10 * 2, 50, prop.width, prop.height);

    doc.addImage(imagePath, prop.fileType, 10, 100, fitW, fitH);
    doc.rect(10, 100, width - 10 * 2, 50);
    doc.rect(10, 100, fitW, fitH);
  }

  // input dicom image
  {
    const prop = doc.getImageProperties(base64Image);
    console.log("prop", prop);
    doc.addImage(base64Image, prop.fileType, 10, 200, prop.width, prop.height);
  }

  doc.save(`${Date.now()}.pdf`);
};

export { build };
