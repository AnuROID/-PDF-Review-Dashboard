"use client";

import { useState } from "react";
import api from "@/lib/api";

export default function InvoiceForm({ data, onChange, onSaved, onDeleted }) {
  const [form, setForm] = useState({
    _id: data?._id || "",
    vendor: {
      name: data?.vendor?.name || "",
      address: data?.vendor?.address || "",
      taxId: data?.vendor?.taxId || "",
    },
    invoice: {
      number: data?.invoice?.number || "",
      date: data?.invoice?.date || "",
      currency: data?.invoice?.currency || "",
      subtotal: data?.invoice?.subtotal || "",
      taxPercent: data?.invoice?.taxPercent || "",
      total: data?.invoice?.total || "",
      poNumber: data?.invoice?.poNumber || "",
      poDate: data?.invoice?.poDate || "",
      lineItems: data?.invoice?.lineItems || [],
    },
  });

  const handleChange = (path: string, value: any) => {
    const keys = path.split(".");
    setForm((prev: any) => {
      let updated = { ...prev, _id: prev._id };
      let obj = updated;
      for (let i = 0; i < keys.length - 1; i++) {
        obj[keys[i]] = { ...obj[keys[i]] };
        obj = obj[keys[i]];
      }
      obj[keys[keys.length - 1]] = value;
      onChange(updated);
      return updated;
    });
  };

  const handleLineItemChange = (index: number, field: string, value: string) => {
    const items = [...form.invoice.lineItems];
    items[index] = { ...items[index], [field]: value };
    setForm((prev) => {
      const updated = {
        ...prev,
        invoice: { ...prev.invoice, lineItems: items },
      };
      onChange(updated);
      return updated;
    });
  };

  const handleUpdate = async () => {
    if (!data?._id) return alert("Invoice ID missing");
    try {
      const res = await api.put(`/invoices/${data._id}`, form);
      onSaved(res.data);
      alert("Invoice updated successfully!");
    } catch (err: any) {
      console.error("Update error:", err);
      alert("Failed to update invoice");
    }
  };

  const handleDelete = async () => {
    if (!data?._id) return alert("Invoice ID missing");
    if (!confirm("Are you sure you want to delete this invoice?")) return;

    try {
      await api.delete(`/invoices/${data._id}`);
      onDeleted();
      alert("Invoice deleted successfully!");
    } catch (err: any) {
      console.error("Delete error:", err);
      alert("Failed to delete invoice");
    }
  };

  const inputClass =
    "border border-gray-600 rounded-xl p-5 text-xl focus:ring-2 focus:ring-sky-500 focus:outline-none bg-gray-800 text-gray-200 shadow-md";

  return (
    <div className="space-y-8 text-gray-200 font-sans">
      {/* Vendor Section */}
      <h3 className="font-bold text-3xl border-b border-gray-700 pb-3 mb-3">Vendor</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <input
          value={form.vendor.name}
          onChange={(e) => handleChange("vendor.name", e.target.value)}
          className={inputClass}
          placeholder="Vendor Name"
        />
        <input
          value={form.vendor.address}
          onChange={(e) => handleChange("vendor.address", e.target.value)}
          className={inputClass}
          placeholder="Vendor Address"
        />
        <input
          value={form.vendor.taxId}
          onChange={(e) => handleChange("vendor.taxId", e.target.value)}
          className={inputClass}
          placeholder="Vendor Tax ID"
        />
      </div>

      {/* Invoice Section */}
      <h3 className="font-bold text-3xl border-b border-gray-700 pb-3 mb-3">Invoice</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <input
          value={form.invoice.number}
          onChange={(e) => handleChange("invoice.number", e.target.value)}
          className={inputClass}
          placeholder="Invoice Number"
        />
        <input
          value={form.invoice.date}
          onChange={(e) => handleChange("invoice.date", e.target.value)}
          className={inputClass}
          placeholder="Invoice Date"
        />
        <input
          value={form.invoice.currency}
          onChange={(e) => handleChange("invoice.currency", e.target.value)}
          className={inputClass}
          placeholder="Currency"
        />
        <input
          value={form.invoice.subtotal}
          onChange={(e) => handleChange("invoice.subtotal", e.target.value)}
          className={inputClass}
          placeholder="Subtotal"
        />
        <input
          value={form.invoice.taxPercent}
          onChange={(e) => handleChange("invoice.taxPercent", e.target.value)}
          className={inputClass}
          placeholder="Tax Percent"
        />
        <input
          value={form.invoice.total}
          onChange={(e) => handleChange("invoice.total", e.target.value)}
          className={inputClass}
          placeholder="Total"
        />
        <input
          value={form.invoice.poNumber}
          onChange={(e) => handleChange("invoice.poNumber", e.target.value)}
          className={inputClass}
          placeholder="PO Number"
        />
        <input
          value={form.invoice.poDate}
          onChange={(e) => handleChange("invoice.poDate", e.target.value)}
          className={inputClass}
          placeholder="PO Date"
        />
      </div>

      {/* Line Items Section */}
      <h3 className="font-bold text-3xl border-b border-gray-700 pb-3 mb-3">Line Items</h3>
      {form.invoice.lineItems.map((item: any, idx: number) => (
        <div key={idx} className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-4">
          <input
            value={item.description}
            onChange={(e) => handleLineItemChange(idx, "description", e.target.value)}
            className={inputClass}
            placeholder="Description"
          />
          <input
            value={item.unitPrice}
            onChange={(e) => handleLineItemChange(idx, "unitPrice", e.target.value)}
            className={inputClass}
            placeholder="Unit Price"
          />
          <input
            value={item.quantity}
            onChange={(e) => handleLineItemChange(idx, "quantity", e.target.value)}
            className={inputClass}
            placeholder="Quantity"
          />
          <input
            value={item.total}
            onChange={(e) => handleLineItemChange(idx, "total", e.target.value)}
            className={inputClass}
            placeholder="Total"
          />
        </div>
      ))}

      {/* Action Buttons */}
      <div className="flex gap-6 mt-6">
        <button
          onClick={handleUpdate}
          className="flex-1 py-4 bg-gradient-to-r from-green-500 to-green-700 hover:from-green-400 hover:to-green-600 text-white font-bold rounded-2xl shadow-lg text-xl transition-transform active:scale-95"
        >
          Update Invoice
        </button>
        <button
          onClick={handleDelete}
          className="flex-1 py-4 bg-gradient-to-r from-red-500 to-red-700 hover:from-red-400 hover:to-red-600 text-white font-bold rounded-2xl shadow-lg text-xl transition-transform active:scale-95"
        >
          Delete Invoice
        </button>
      </div>
    </div>
  );
}
