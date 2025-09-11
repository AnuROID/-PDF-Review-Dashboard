📄 PDF Review Dashboard

A full-stack monorepo project for uploading, viewing, extracting, editing, and managing invoice PDFs. Built with Next.js, Express.js, MongoDB (GridFS), and Gemini/Groq AI API.

🚀 Project Structure
apps/
  web/   → Frontend (Next.js + TailwindCSS)
  api/   → Backend (Express + MongoDB + GridFS + AI extraction)

🔗 Deployed Links

Frontend (Web): https://<project>-web.vercel.app

Backend (API): https://<project>-api.vercel.app

⚙️ Setup Instructions
1️⃣ Clone the repo
git clone https://github.com/<your-username>/<repo-name>.git
cd <repo-name>

2️⃣ Install dependencies
npm install

3️⃣ Environment variables

Create .env files in both apps/web and apps/api.

apps/api/.env
PORT=4000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/pdf-dashboard
GEMINI_API_KEY=your_gemini_api_key_here
# OR
GROQ_API_KEY=your_groq_api_key_here

apps/web/.env
NEXT_PUBLIC_API_URL=https://<project>-api.vercel.app

4️⃣ Run locally
Backend
cd apps/api
npm run dev


API runs at: http://localhost:4000

Frontend
cd apps/web
npm run dev


Frontend runs at: http://localhost:3000

📡 API Documentation
POST /upload

Upload a PDF file.

Request: multipart/form-data with file field.

Response:

{
  "message": "File uploaded and invoice created",
  "fileId": "<gridfs_id>",
  "fileName": "invoice.pdf",
  "invoiceId": "<mongo_id>"
}

POST /extract/:id

Run AI extraction on uploaded PDF.

Params: id (invoiceId)

Response:

{
  "vendor": { "name": "ABC Corp", "address": "123 Main St" },
  "invoiceNumber": "INV-001",
  "date": "2025-09-10",
  "items": [{ "description": "Service", "amount": 100 }]
}

GET /invoices

Fetch all invoices.

GET /invoices/:id

Fetch a single invoice.

PUT /invoices/:id

Update invoice fields.

DELETE /invoices/:id

Delete invoice.
