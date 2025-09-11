"use client";

import { useState, useEffect } from "react";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

interface PDFViewerProps {
  file: File | string | null;
}

export default function PDFViewer({ file }: PDFViewerProps) {
  const [objectUrl, setObjectUrl] = useState<string | null>(null);
  const [scale, setScale] = useState(1);

  const pluginInstance = defaultLayoutPlugin();

  useEffect(() => {
    if (!file) return setObjectUrl(null);

    if (file instanceof File) {
      const url = URL.createObjectURL(file);
      setObjectUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setObjectUrl(file);
    }
  }, [file]);

  if (typeof window === "undefined") return null; // Prevent server rendering

  if (!objectUrl) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-900 text-white">
        No PDF selected
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-900 text-white border border-gray-700 rounded-lg overflow-hidden shadow-md">
      <div className="flex items-center justify-between p-2 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <button onClick={() => setScale((s) => Math.max(0.5, s - 0.25))}>-</button>
          <span>{Math.round(scale * 100)}%</span>
          <button onClick={() => setScale((s) => Math.min(3, s + 0.25))}>+</button>
        </div>
      </div>

      <div className="h-full w-full">
       <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.16.105/build/pdf.worker.min.js">
  <Viewer fileUrl={objectUrl} plugins={[pluginInstance]} />
</Worker>
      </div>
    </div>
  );
}
