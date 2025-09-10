import mongoose from "mongoose";
import { getGFS } from "../config/db";

 const fetchPDFBuffer = async (fileId: string): Promise<Buffer> => {
  const gfs = getGFS();
  const _id = new mongoose.Types.ObjectId(fileId);

  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    const downloadStream = gfs.openDownloadStream(_id);

    downloadStream.on("data", (chunk) => chunks.push(chunk));
    downloadStream.on("error", (err) => reject(err));
    downloadStream.on("end", () => resolve(Buffer.concat(chunks)));
  });
};

export default fetchPDFBuffer;
