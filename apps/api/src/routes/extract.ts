import express, { Request, Response } from "express";
import fetchPDFBuffer from "../utils/fetchPDFBuffer";
import Invoice from "../models/Invoice";
import dotenv from "dotenv";
import axios from "axios";
import pdfParse from "pdf-parse"; // for PDF text extraction
dotenv.config();

const router = express.Router();

// Gemini AI extraction function
const callGeminiAPI = async (pdfBuffer: Buffer) => {
  try {
    //  Extract text from PDF
    const pdfData = await pdfParse(pdfBuffer);
    const pdfText = pdfData.text;

    //  Call Gemini API
    const response = await axios.post(
      `${process.env.GEMINI_API_URL}?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                text: `
Extract the following fields from this invoice text and return them ONLY in JSON format (no explanation, no markdown):
{
  "vendor": {
    "name": "",
    "address": "",
    "taxId": ""
  },
  "invoice": {
    "number": "",
    "date": "",
    "currency": "",
    "subtotal": 0,
    "taxPercent": 0,
    "total": 0,
    "poNumber": "",
    "poDate": "",
    "lineItems": [
      { "description": "", "quantity": 0, "unitPrice": 0, "total": 0 }
    ]
  }
}

Invoice text:
${pdfText}
                `,
              },
            ],
          },
        ],
      },
      { headers: { "Content-Type": "application/json" } }
    );

    // Extract raw text
    const extractedText =
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    console.log("Gemini raw response text:", extractedText);

    // Parse JSON safely
    const cleanText = extractedText
      .replace(/```json/i, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(cleanText);
  } catch (err: any) {
    console.error("Gemini API error:", err.response?.data || err.message);
    throw new Error("Failed to extract data from Gemini AI");
  }
};

// POST /extract
router.post("/", async (req: Request, res: Response) => {
  try {
    const { fileId, fileName, model } = req.body;

    if (!fileId || !fileName || !model) {
      return res.status(400).json({
        error: "fileId, fileName, and model are required (send as JSON)",
      });
    }

    // Fetch PDF buffer from GridFS
    const pdfBuffer = await fetchPDFBuffer(fileId);

    // Call AI API
    let extractedData;
    if (model === "gemini") {
      extractedData = await callGeminiAPI(pdfBuffer);
    } else {
      return res.status(400).json({ error: "Invalid model selected" });
    }

    // Save extracted data to MongoDB
    const invoiceDoc = new Invoice({
      fileId,
      fileName,
      vendor: extractedData.vendor,
      invoice: extractedData.invoice,
    });

    await invoiceDoc.save();

    res.json(invoiceDoc);
  } catch (err: any) {
    console.error("Extract route error:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
