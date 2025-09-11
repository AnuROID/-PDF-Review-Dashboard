"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Button from "@/ui/button";
import { InvoiceFormData } from "@/components/InvoiceForm";
import api from "@/lib/api";

// Dynamic client-only components
const PDFViewer = dynamic(() => import("@/components/PdfViewer"), { ssr: false });
const InvoiceForm = dynamic(() => import("@/components/InvoiceForm"), { ssr: false });

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [invoiceData, setInvoiceData] = useState<InvoiceFormData | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (f: File | null) => {
    setFile(f);
    setInvoiceData(null);
  };

  const handleUploadAndExtract = async () => {
    if (!file) return alert("Select a PDF first");
    setUploading(true);

    try {
      const form = new FormData();
      form.append("file", file);

      const uploadRes = await api.post("/upload", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const { fileId, fileName } = uploadRes.data;

      const extractRes = await api.post("/extract", { fileId, fileName, model: "gemini" });

      const cleanData: InvoiceFormData = JSON.parse(JSON.stringify(extractRes.data));
      setInvoiceData(cleanData);
    } catch (err) {
      console.error(err);
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
      <section className="w-1/2 flex flex-col p-4 bg-gray-900 border-r border-gray-700 h-full">
        {/* Upload & Extract at the top */}
      {/* Upload & Extract at the top */}
{file && (
  <div className="flex gap-4 mb-4">
    <Button
      onClick={handleUploadAndExtract}
      disabled={uploading}
      className="w-1/2 py-6 text-xl font-bold bg-gradient-to-r from-green-500 to-green-700 hover:from-green-400 hover:to-green-600 rounded-2xl shadow-lg"
    >
      {uploading ? "Processing..." : "Upload & Extract"}
    </Button>
    <Button
      onClick={handleClear}
      disabled={uploading}
      className="w-1/2 py-6 text-xl font-bold bg-gradient-to-r from-red-500 to-red-700 hover:from-red-400 hover:to-red-600 rounded-2xl shadow-lg"
    >
      Clear
    </Button>
  </div>
)}

        {!file ? (
          <label className="flex-1 flex flex-col items-center justify-center cursor-pointer bg-gradient-to-r from-sky-600 to-indigo-600 text-white rounded-2xl p-14">
            <span>Select PDF</span>
            <input
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
            />
          </label>
        ) : (
          <div className="flex-1 rounded-lg overflow-auto bg-gray-800 p-2">
            <PDFViewer file={file} />
          </div>
        )}
      </section>

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
          <div>Upload a PDF and click Upload & Extract</div>
        )}
      </section>
    </main>
  );
}
