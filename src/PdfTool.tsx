import DicomViewer from "./DicomViewer";
import PdfBuild from "./PdfBuild";

const PdfTool = () => {
  return (
    <div className="flex">
      <DicomViewer />
      <PdfBuild className="flex h-[500px] w-[500px] items-center justify-center" />
    </div>
  );
};

export default PdfTool;
