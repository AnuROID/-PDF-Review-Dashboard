"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Button from "@/ui/button";
import InvoiceForm, { InvoiceData } from "@/components/InvoiceForm";
import api from "@/lib/api";

const PDFViewer = dynamic(() => import("@/components/PdfViewer"), { ssr: false });

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [invoiceData, setInvoiceData] = useState<InvoiceData | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (f: File | null) => {
    setFile(f);
    setInvoiceData(null);
  };

  const handleUploadAndExtract = async () => {
    if (!file) {
      alert("Select a PDF first");
      return;
    }

    try {
      setUploading(true);
      const form = new FormData();
      form.append("file", file);

      const uploadRes = await api.post("/upload", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const { fileId, fileName } = uploadRes.data as { fileId: string; fileName: string };
      const extractRes = await api.post("/extract", { fileId, fileName, model: "gemini" });
      setInvoiceData(extractRes.data as InvoiceData);
    } catch (err) {
      console.error("Upload error:", err);
      alert("Upload or extract failed");
    } finally {
      setUploading(false);
    }
  };

  const handleClear = () => {
    setFile(null);
    setInvoiceData(null);
  };

  return (
    <main className="flex h-screen w-screen">
      {/* Left Panel: PDF + Upload */}
      <section className="w-1/2 flex flex-col p-4 bg-gray-900 border-r border-gray-700 h-full">
        {!file ? (
          <label
            className="flex flex-col items-center justify-center flex-1 cursor-pointer
            bg-gradient-to-r from-sky-600 to-indigo-600
            hover:from-sky-500 hover:to-indigo-500
            text-white font-bold
            rounded-2xl
            p-14 text-2xl md:text-3xl lg:text-4xl transition-all duration-300 shadow-lg"
          >
            <span className="text-center">Select PDF</span>
            <input
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
            />
          </label>
        ) : (
          <div className="flex flex-col h-full justify-between">
            {/* File name */}
            <div className="w-full text-center py-2 bg-gray-800 rounded-t-lg mb-2">
              <span className="text-gray-200 font-semibold text-lg truncate">{file.name}</span>
            </div>

            {/* PDF Viewer */}
            <div className="flex-1 rounded-lg overflow-auto bg-gray-850 p-2">
              {file && <PDFViewer file={file} />}
            </div>

            {/* Buttons */}
            <div className="flex gap-4 mt-4 w-full">
              <Button
                onClick={handleUploadAndExtract}
                disabled={uploading}
                className="flex-1 py-4 text-lg font-bold text-white 
                           bg-gradient-to-r from-sky-500 to-indigo-600 
                           hover:from-sky-400 hover:to-indigo-500 
                           rounded-2xl shadow-xl transition-transform duration-300 
                           active:scale-95"
              >
                {uploading ? "Processing..." : "Upload & Extract"}
              </Button>

              <Button
                onClick={handleClear}
                disabled={uploading}
                className="flex-1 py-4 text-lg font-bold text-white 
                           bg-gradient-to-r from-red-500 to-red-700 
                           hover:from-red-400 hover:to-red-600 
                           rounded-2xl shadow-xl transition-transform duration-300 
                           active:scale-95"
              >
                Clear
              </Button>
            </div>
          </div>
        )}
      </section>

      {/* Right Panel: Invoice Form */}
      <section className="w-1/2 flex flex-col p-4 bg-gray-900 overflow-auto">
        {invoiceData ? (
          <InvoiceForm
            data={invoiceData}
            onChange={setInvoiceData}
            onSaved={(saved) => {
              setInvoiceData(saved);
              alert("Saved");
            }}
            onDeleted={() => {
              setInvoiceData(null);
              alert("Deleted");
            }}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400 text-center px-4">
            Upload a PDF and click{" "}
            <strong className="px-2 text-sky-600">Upload & Extract</strong> to see invoice data.
          </div>
        )}
      </section>
    </main>
  );
}
