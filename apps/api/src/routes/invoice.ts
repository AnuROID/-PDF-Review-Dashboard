import express, { Request, Response } from "express";
import Invoice from "../models/Invoice";

const router = express.Router();

// GET /invoices
// List invoices, optional search with ?q=term
router.get("/", async (req: Request, res: Response) => {
  try {
    const search = req.query.q?.toString() || "";
    const regex = new RegExp(search, "i"); 
    const invoices = await Invoice.find({
      $or: [
        { "vendor.name": regex },
        { "invoice.number": regex },
      ],
    }).sort({ createdAt: -1 });
    res.json(invoices);
  } catch (err: any) {
    console.error("GET /invoices error:", err);
    res.status(500).json({ error: err.message });
  }
});


// GET /invoices/:id
// Get a single invoice by ID

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) return res.status(404).json({ error: "Invoice not found" });
    res.json(invoice);
  } catch (err: any) {
    console.error("GET /invoices/:id error:", err);
    res.status(500).json({ error: err.message });
  }
});


// PUT /invoices/:id
// Update an invoice

router.put("/:id", async (req: Request, res: Response) => {
  try {
    const updateData = req.body;
    const invoice = await Invoice.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
    if (!invoice) return res.status(404).json({ error: "Invoice not found" });
    res.json(invoice);
  } catch (err: any) {
    console.error("PUT /invoices/:id error:", err);
    res.status(500).json({ error: err.message });
  }
});


// DELETE /invoices/:id
// Delete an invoice

router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const invoice = await Invoice.findByIdAndDelete(req.params.id);
    if (!invoice) return res.status(404).json({ error: "Invoice not found" });
    res.json({ message: "Invoice deleted successfully" });
  } catch (err: any) {
    console.error("DELETE /invoices/:id error:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
