"use client";

import React, { useState, useEffect } from "react";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

interface PDFViewerProps {
  file: File | string | null;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ file }) => {
  const [objectUrl, setObjectUrl] = useState<string | null>(null);
  const [scale, setScale] = useState<number>(1);

  // ✅ Initialize plugin once
  const pluginInstance = defaultLayoutPlugin();

  useEffect(() => {
    if (!file) {
      setObjectUrl(null);
      return;
    }

    if (file instanceof File) {
      const url = URL.createObjectURL(file);
      setObjectUrl(url);

      return () => URL.revokeObjectURL(url);
    } else {
      setObjectUrl(file);
    }
  }, [file]);

  if (!objectUrl) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-900 text-white">
        No PDF selected
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-900 text-white border border-gray-700 rounded-lg overflow-hidden shadow-md">
      {/* Header with zoom controls */}
      <div className="flex items-center justify-between p-2 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <button
            className="px-3 py-1 rounded-md bg-sky-600 text-white hover:bg-sky-700"
            onClick={() => setScale((s) => Math.max(0.5, s - 0.25))}
          >
            -
          </button>
          <span className="font-medium">{Math.round(scale * 100)}%</span>
          <button
            className="px-3 py-1 rounded-md bg-sky-600 text-white hover:bg-sky-700"
            onClick={() => setScale((s) => Math.min(3, s + 0.25))}
          >
            +
          </button>
        </div>
        <div className="text-gray-400 text-lg">PDF Viewer</div>
      </div>

      {/* PDF viewer */}
      <div className="flex-1 p-2 overflow-auto bg-gray-900">
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.16.105/build/pdf.worker.min.js">
          <Viewer
            fileUrl={objectUrl}
            plugins={[pluginInstance]}
            defaultScale={scale}
          />
        </Worker>
      </div>
    </div>
  );
};

export default PDFViewer;
