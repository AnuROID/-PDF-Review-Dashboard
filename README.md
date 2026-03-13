# 📄 PDF Review Dashboard

A full-stack **monorepo application** for uploading, viewing, extracting, editing, and managing invoice PDFs.

The system uses **AI to extract invoice data automatically** and stores files using **MongoDB GridFS**.

## 🚀 Tech Stack

**Frontend**

* Next.js
* TailwindCSS
* TypeScript

**Backend**

* Node.js
* Express.js
* MongoDB (GridFS)
* Gemini / Groq AI APIs

---

## 📁 Project Structure

```
apps/
 ├── web/   → Frontend (Next.js + TailwindCSS)
 └── api/   → Backend (Express.js + MongoDB + GridFS + AI extraction)
```

---

## 🔗 Deployed Links

Frontend:
https://your-web-url.vercel.app

Backend API:
https://your-api-url.vercel.app

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the Repository

```
git clone https://github.com/your-username/pdf-review-dashboard.git
cd pdf-review-dashboard
```

### 2️⃣ Install Dependencies

```
npm install
```

---

### 3️⃣ Environment Variables

Create `.env` files inside both **apps/api** and **apps/web**.

#### apps/api/.env

```
PORT=4000
MONGODB_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_gemini_api_key
# OR
GROQ_API_KEY=your_groq_api_key
```

#### apps/web/.env

```
NEXT_PUBLIC_API_URL=http://localhost:4000
```

---

### 4️⃣ Run the Application

#### Start Backend

```
cd apps/api
npm run dev
```

Backend runs at:

```
http://localhost:4000
```

---

#### Start Frontend

```
cd apps/web
npm run dev
```

Frontend runs at:

```
http://localhost:3000
```

---

## 📡 API Documentation

### POST /upload

Upload a PDF file.

**Request**

multipart/form-data with field `file`.

**Response**

```
{
 "message": "File uploaded and invoice created",
 "fileId": "<gridfs_id>",
 "fileName": "invoice.pdf",
 "invoiceId": "<mongo_id>"
}
```

---

### POST /extract/:id

Run AI extraction on the uploaded PDF.

**Params**

```
id → invoiceId
```

**Response**

```
{
 "vendor": {
   "name": "ABC Corp",
   "address": "123 Main St"
 },
 "invoiceNumber": "INV-001",
 "date": "2025-09-10",
 "items": [
   {
     "description": "Service",
     "amount": 100
   }
 ]
}
```

---

### GET /invoices

Fetch all invoices.

---

### GET /invoices/:id

Fetch a specific invoice.

---

### PUT /invoices/:id

Update invoice fields.

---

### DELETE /invoices/:id

Delete an invoice.

---

## ✨ Features

* Upload invoice PDFs
* AI-based invoice data extraction
* View and edit extracted data
* Store PDFs using MongoDB GridFS
* RESTful API for invoice management

---

## 👨‍💻 Author

**Anurag Sharma**

B.Tech CSE | Full Stack Developer
