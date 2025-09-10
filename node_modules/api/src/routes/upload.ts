import express, { Request, Response } from "express";
import multer from "multer";
import { getGFS } from "../config/db";

const router = express.Router();

// Use memory storage for Multer
const storage = multer.memoryStorage();
const upload = multer({ storage });

// POST /upload
router.post("/", upload.single("file"), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      console.log("No file uploaded");
      return res.status(400).json({ error: "No file uploaded" });
    }

    const gfs = getGFS();

    // Open upload stream to GridFS
    const uploadStream = gfs.openUploadStream(req.file.originalname, {
      contentType: req.file.mimetype,
    });

    // Write file buffer
    uploadStream.end(req.file.buffer);

    // When done, return id + filename
    uploadStream.on("finish", () => {
      console.log(
        "File uploaded successfully:",
        uploadStream.filename,
        uploadStream.id
      );
      res.json({ fileId: uploadStream.id, fileName: uploadStream.filename });
    });

    uploadStream.on("error", (err) => {
      console.error("GridFS upload error:", err);
      res.status(500).json({ error: "Error uploading file" });
    });
  } catch (err: any) {
    console.error("Upload route error:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
