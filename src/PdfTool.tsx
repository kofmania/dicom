import DicomViewer from "./DicomViewer";
import PdfBuild from "./PdfBuild";

const PdfTool = () => {
  return (
    <div className="flex">
      <DicomViewer />
      <PdfBuild className="flex items-start justify-center" />
    </div>
  );
};

export default PdfTool;
