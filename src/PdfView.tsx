import { useState } from "react";
import { pdfjs, Document, Page } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

type Props = {
  data: any;
};

const PdfView = ({ data }: Props) => {
  const [pageCount, setPageCount] = useState(0);

  return (
    <div className="flex space-x-4">
      <div>
        {!data && <h2>pdf view</h2>}
        {data && (
          <>
            <h2>pdf view</h2>
            <div>
              <Document
                file={data}
                className="flex-col space-y-2"
                onLoadSuccess={(doc) => {
                  setPageCount(doc.numPages);
                }}
              >
                {pageCount > 0 &&
                  new Array(pageCount)
                    .fill(0)
                    .map((_, index) => (
                      <Page
                        className="border border-amber-300"
                        key={index}
                        pageNumber={index + 1}
                        width={300}
                      />
                    ))}
              </Document>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PdfView;
