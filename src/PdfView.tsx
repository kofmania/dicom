import { useState } from "react";
import { pdfjs, Document, Page } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

const PdfView = () => {
  const [pageCount, setPageCount] = useState(0);
  return (
    <div className="flex space-x-4">
      <div>
        <h2>pdf view 1</h2>
        <div>
          <Document file={"./sample.pdf"} className="mb-1">
            <Page key={1} pageNumber={1} width={400} />
            <Page key={2} pageNumber={2} width={400} />
            <Page key={3} pageNumber={3} width={400} />
            <Page key={4} pageNumber={4} width={400} />
          </Document>
        </div>
      </div>
      <div>
        <h2>pdf view 2</h2>
        <div>
          <Document
            file={"./sample.pdf"}
            className="flex-col space-y-2"
            onLoadSuccess={(doc) => {
              setPageCount(doc.numPages);
            }}
          >
            {pageCount > 0 &&
              new Array(pageCount)
                .fill(0)
                .map((_, index) => <Page key={index} pageNumber={index + 1} />)}
          </Document>
        </div>
      </div>
    </div>
  );
};

export default PdfView;
