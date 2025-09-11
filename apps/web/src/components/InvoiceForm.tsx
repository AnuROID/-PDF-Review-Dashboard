"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";

// Types
export interface LineItem {
  description: string;
  unitPrice: string;
  quantity: string;
  total: string;
}

export interface Vendor {
  name: string;
  address: string;
  taxId: string;
}

export interface Invoice {
  number: string;
  date: string;
  currency: string;
  subtotal: string;
  taxPercent: string;
  total: string;
  poNumber: string;
  poDate: string;
  lineItems: LineItem[];
}

export interface InvoiceFormData {
  _id?: string;
  vendor: Vendor;
  invoice: Invoice;
}

interface InvoiceFormProps {
  data: InvoiceFormData;
  onChange: (data: InvoiceFormData) => void;
  onSaved: (data: InvoiceFormData) => void;
  onDeleted: () => void;
}

export default function InvoiceForm({ data, onChange, onSaved, onDeleted }: InvoiceFormProps) {
  const [form, setForm] = useState<InvoiceFormData>(data);

  useEffect(() => {
    setForm(data);
  }, [data]);

  // Sectioned change handler for Vendor & Invoice
  const handleChange = <K extends keyof Vendor | keyof Invoice>(
    section: "vendor" | "invoice",
    key: K,
    value: string
  ) => {
    setForm(prev => {
      const updated: InvoiceFormData = {
        ...prev,
        [section]: {
          ...prev[section],
          [key]: value,
        },
      };
      onChange(updated);
      return updated;
    });
  };

  // Line item change handler
  const handleLineItemChange = (index: number, field: keyof LineItem, value: string) => {
    setForm(prev => {
      const items = [...prev.invoice.lineItems];
      items[index] = { ...items[index], [field]: String(value) };
      const updated: InvoiceFormData = { ...prev, invoice: { ...prev.invoice, lineItems: items } };
      onChange?.(updated);
      return updated;
    });
  };

  // API actions
  const handleUpdate = async () => {
    if (!form._id) return alert("Invoice ID missing");
    try {
      const res = await api.put(`/invoices/${form._id}`, form);
      onSaved(res.data);
      alert("Invoice updated!");
    } catch (err) {
      console.error(err);
      alert("Update failed");
    }
  };

  const handleDelete = async () => {
    if (!form._id) return alert("Invoice ID missing");
    if (!confirm("Are you sure you want to delete this invoice?")) return;
    try {
      await api.delete(`/invoices/${form._id}`);
      onDeleted();
      alert("Invoice deleted!");
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  const inputClass =
    "border border-gray-600 rounded-xl p-5 text-xl focus:ring-2 focus:ring-sky-500 focus:outline-none bg-gray-800 text-gray-200 shadow-md";

  return (
    <div className="space-y-8 text-gray-200 font-sans">
      {/* Vendor */}
      <h3 className="font-bold text-3xl border-b border-gray-700 pb-3 mb-3">Vendor</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Object.entries(form.vendor).map(([key, value]) => (
          <input
            key={key}
            value={String(value)}
            onChange={e => handleChange("vendor", key as keyof Vendor, e.target.value)}
            className={inputClass}
            placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
          />
        ))}
      </div>

      {/* Invoice */}
      <h3 className="font-bold text-3xl border-b border-gray-700 pb-3 mb-3">Invoice</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Object.entries(form.invoice)
          .filter(([key]) => key !== "lineItems")
          .map(([key, value]) => (
            <input
              key={key}
              value={String(value)}
              onChange={e => handleChange("invoice", key as keyof Invoice, e.target.value)}
              className={inputClass}
              placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
            />
          ))}
      </div>

      {/* Line Items */}
      <h3 className="font-bold text-3xl border-b border-gray-700 pb-3 mb-3">Line Items</h3>
      {form.invoice.lineItems.map((item, idx) => (
        <div key={idx} className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-4">
          {Object.entries(item).map(([field, value]) => (
            <input
              key={field}
              value={String(value)}
              onChange={e => handleLineItemChange(idx, field as keyof LineItem, e.target.value)}
              className={inputClass}
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
            />
          ))}
        </div>
      ))}

      {/* Actions */}
      <div className="flex gap-6 mt-6">
        <button
          onClick={handleUpdate}
          className="flex-1 py-4 bg-gradient-to-r from-green-500 to-green-700 hover:from-green-400 hover:to-green-600 text-white font-bold rounded-2xl shadow-lg text-xl transition-transform active:scale-95"
        >
          Update
        </button>
        <button
          onClick={handleDelete}
          className="flex-1 py-4 bg-gradient-to-r from-red-500 to-red-700 hover:from-red-400 hover:to-red-600 text-white font-bold rounded-2xl shadow-lg text-xl transition-transform active:scale-95"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
