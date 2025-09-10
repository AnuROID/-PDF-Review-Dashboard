import mongoose from "mongoose";

// Schema for each line item
const LineItemSchema = new mongoose.Schema({
  description: { type: String, required: true },
  unitPrice: { type: Number, required: true },
  quantity: { type: Number, required: true },
  total: { type: Number, required: true },
});

// Main Invoice schema
const InvoiceSchema = new mongoose.Schema(
  {
    fileId: { type: String, required: true },
    fileName: { type: String, required: true },
    vendor: {
      name: { type: String, required: true },
      address: { type: String },   // optional
      taxId: { type: String },     // optional
    },
    invoice: {
      number: { type: String, required: true },
      date: { type: String, required: true },
      currency: { type: String },          // optional
      subtotal: { type: Number },          // optional
      taxPercent: { type: Number },        // optional
      total: { type: Number },             // optional
      poNumber: { type: String },          // optional
      poDate: { type: String },            // optional
      lineItems: { type: [LineItemSchema], required: true },
    },
  },
  { timestamps: true } // automatically adds createdAt & updatedAt
);

export default mongoose.model("Invoice", InvoiceSchema);
